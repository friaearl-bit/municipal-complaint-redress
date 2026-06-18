import express from "express";
import { Parser } from "json2csv";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
} from "@prisma/client";
import { myComplaints } from "../controllers/complaint.controller.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const { user } = req;

    const { search, status, priority, department, category } = req.query;

    let template;
    let data;

    const where = {
      deletedAt: null,
    };

    const totalAttachments = await prisma.complaint.count({
      where: { deletedAt: null },
    });

    // GLOBAL FILTERS
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          referenceNo: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          subject: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;

    // ONLY ADMIN/SUPERADMIN CAN FILTER BY DEPARTMENT
    if (department && (user.role === "ADMIN" || user.role === "SUPERADMIN")) {
      where.assignedDepartmentId = Number(department);
    }

    // ROLE-BASED ACCESS CONTROL
    switch (user.role) {
      case "SUPERADMIN":
        template = "dashboard/superadmin";
        break;

      case "ADMIN":
        template = "dashboard/admin";
        break;

      case "STAFF":
        template = "dashboard/staff";
        where.assignedToId = user.id;
        break;

      default:
        template = "dashboard/citizen";
        where.complainantId = user.id;
        break;
    }

    // SINGLE SAFE QUERY
    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        complainant: true,
        assignedTo: true,
        assignedDepartment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // STATIC DATA
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    const dashboardFilters = {
      query: req.query || {},
      statuses: Object.values(ComplaintStatus),
      priorities: Object.values(ComplaintPriority),
      categories: Object.values(ComplaintCategory),
    };

    // SUPERADMIN
    if (user.role === "SUPERADMIN") {
      const [
        totalUsers,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.complaint.count({ where: { deletedAt: null } }),
        prisma.complaint.count({
          where: { status: "PENDING", deletedAt: null },
        }),
        prisma.complaint.count({
          where: { status: "RESOLVED", deletedAt: null },
        }),
      ]);

      data = {
        user,
        complaints,
        departments,
        totalUsers,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        ...dashboardFilters,
      };
    } else {
      data = {
        user,
        complaints,
        departments,
        totalAttachments,
        ...dashboardFilters,
      };
    }

    return res.render(template, data);
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).render("error", {
      toast: {
        type: "error",
        title: "Server Error",
        message: "Failed to load dashboard",
      },
    });
  }
});

router.get("/admin/export", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN" && req.user.role !== "SUPERADMIN") {
      return res.status(403).send("Unauthorized");
    }

    const complaints = await prisma.complaint.findMany({
      where: {
        deletedAt: null,
      },

      include: {
        complainant: true,
        assignedTo: true,
        assignedDepartment: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const rows = complaints.map((c) => ({
      ID: c.id,
      ReferenceNo: c.referenceNo,
      Title: c.title,
      Category: c.category,
      Priority: c.priority,
      Status: c.status,
      Complainant: c.complainant?.fullname || c.complainant?.name || "",

      Department: c.assignedDepartment?.name || "",

      AssignedTo: c.assignedTo?.fullname || c.assignedTo?.name || "",

      CreatedAt: c.createdAt,
      ResolvedAt: c.resolvedAt,
    }));

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment(`complaints-${new Date().toISOString().split("T")[0]}.csv`);

    return res.send(csv);
  } catch (error) {
    console.error(error);

    return res.status(500).send("Export failed");
  }
});

export default router;
