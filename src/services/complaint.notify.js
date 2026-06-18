import { notify } from "./notification.service.js";

/**
 * ASSIGNMENT NOTIFICATIONS
 */
export async function notifyComplaintAssignment({
  complainantId,
  actorId,
  complaint,
  departmentName = null,
  deptUsers = [],
  staffId = null,
}) {
  const link = `/complaints/${complaint.id}`;

  // 1. Notify complainant
  if (complainantId) {
    await notify({
      userId: complainantId,
      actorId,
      title: "Complaint updated",
      message: `Your complaint #${complaint.referenceNo} was updated`,
      type: "COMPLAINT",
      complaintId: complaint.id,
      link,
    });
  }

  // 2. Notify department users
  if (departmentName && deptUsers.length > 0) {
    for (const u of deptUsers) {
      await notify({
        userId: u.id,
        actorId,
        title: "New complaint assigned",
        message: `Complaint #${complaint.referenceNo} assigned to ${departmentName}`,
        type: "COMPLAINT",
        complaintId: complaint.id,
        link,
      });
    }
  }

  // 3. Notify assigned staff
  if (staffId) {
    await notify({
      userId: staffId,
      actorId,
      title: "New task assigned",
      message: `You were assigned complaint #${complaint.referenceNo}`,
      type: "TASK",
      complaintId: complaint.id,
      link,
    });
  }
}

/**
 * STATUS CHANGE NOTIFICATIONS
 */
export async function notifyComplaintStatusChange({
  complainantId,
  actorId,
  complaint,
  newStatus,
  staffId = null,
}) {
  const link = `/complaints/${complaint.id}`;

  // 1. Citizen
  if (complainantId) {
    await notify({
      userId: complainantId,
      actorId,
      title: "Complaint status updated",
      message: `Your complaint is now: ${newStatus}`,
      type: "COMPLAINT",
      complaintId: complaint.id,
      link,
    });
  }

  // 2. Staff (optional)
  if (staffId) {
    await notify({
      userId: staffId,
      actorId,
      title: "Complaint status changed",
      message: `Status updated to ${newStatus}`,
      type: "TASK",
      complaintId: complaint.id,
      link,
    });
  }
}
