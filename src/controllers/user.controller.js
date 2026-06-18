// src/controllers/user.controller.js

import { prisma } from "../config/prisma.js";
import { logger } from "../utils/logger.js";
import { SYSTEM_MESSAGES } from "../config/messages.js";
import { addToast, addFlash } from "../utils/toast.js";

export async function updateProfile(req, res) {
  console.log("PARAMS:", req.params);
  console.log("BODY:", req.body);
  console.log("USER:", req.user);

  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return res.status(400).render("error", {
        toast: SYSTEM_MESSAGES.USER.INVALID_ID,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).render("error", {
        toast: SYSTEM_MESSAGES.USER.NOT_FOUND,
      });
    }

    const currentUser = req.user;

    // Ownership check
    if (user.id !== currentUser.id && currentUser.role !== "ADMIN") {
      return res.status(403).render("error", {
        toast: SYSTEM_MESSAGES.AUTH.UNAUTHORIZED_ACTION,
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: req.body,
    });

    addToast(req, res, {
      type: "success",
      title: "Success",
      message: "Profile updated successfully.",
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
    });
    // } catch (err) {
    //   console.error(err);

    //   return res.status(500).json({
    //     success: false,
    //     message: "Update failed",
    //   });
    // }
  } catch (error) {
    console.error("updateProfile:", error);

    addToast(req, res, {
      type: "error",
      title: "Error",
      message: "Failed to update profile. Please try again.",
    });

    return res.status(500).render("error", {
      message: "Failed to update profile",
    });
  }
}

export async function showProfileEditForm(req, res) {
  logger.debug({ userId: req.user?.id }, "Showing complaint form");
  res.render("complaints/new", { user: req.user });
}
