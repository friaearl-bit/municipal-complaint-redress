import { prisma } from "../config/prisma.js";

export async function myDashboard(req, res) {
  const [pending, assigned, inProgress, resolved, rejected] = await Promise.all(
    [
      prisma.complaint.count({
        where: {
          createdById: req.user.id,
          status: "PENDING",
        },
      }),

      prisma.complaint.count({
        where: {
          createdById: req.user.id,
          status: "ASSIGNED",
        },
      }),

      prisma.complaint.count({
        where: {
          createdById: req.user.id,
          status: "IN_PROGRESS",
        },
      }),

      prisma.complaint.count({
        where: {
          createdById: req.user.id,
          status: "RESOLVED",
        },
      }),

      prisma.complaint.count({
        where: {
          createdById: req.user.id,
          status: "REJECTED",
        },
      }),
    ],
  );

  const recentComplaints = await prisma.complaint.findMany({
    where: {
      createdById: req.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  res.render("dashboard/citizen", {
    pending,
    assigned,
    inProgress,
    resolved,
    rejected,
    recentComplaints,
  });
}
