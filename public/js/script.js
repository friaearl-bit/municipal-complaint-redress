import {
  initModal,
  confirm,
  success,
  error,
  form,
  profileEdit,
} from "./modal.js";
import { loadNotifications, loadUnreadCount } from "./notifications.js";

document.addEventListener("DOMContentLoaded", () => {
  initModal();
  loadUnreadCount();
  if (window.lucide) {
    lucide.createIcons();
  }
});

document.addEventListener("click", async (e) => {
  const link = e.target.closest(".action-btn.delete");
  if (!link) return;

  e.preventDefault();

  const url = link.getAttribute("href");

  const name =
    link.dataset.name ||
    link.closest("tr")?.querySelector("td")?.innerText ||
    "this item";

  const ok = await confirm(
    `Are you sure you want to <strong><i>soft-delete</i></strong> complaint <strong>#${name}</strong>?`,
  );

  if (!ok) return;

  await success("Item deleted successfully");
  window.location.href = link.href;
});

// Client-side
document.addEventListener("click", async (e) => {
  const editBtn = e.target.closest(".edit-profile");

  if (!editBtn) return;

  e.preventDefault();

  const currentUser = JSON.parse(editBtn.dataset.user);

  const formData = await profileEdit(currentUser);

  if (!formData) return;

  const userId = currentUser.id;

  const response = await fetch(`/user/edit/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    await success("Profile updated.");
    location.reload();
  } else {
    await error("Update failed.");
  }
});

const sidebar = document.querySelector("#sidebarRight");

document
  .querySelector("#openNotifSidebar ")
  .addEventListener("click", async () => {
    sidebar.classList.add("open");

    await loadNotifications();
  });

// USAGE
// await success("Item deleted successfully");
// window.location.reload();

//
// HEADER PROFILE DROPDOWN
//

// Profile Dropdown Toggle
const profileDropdown = document.getElementById("profileDropdown");
const profileBtn = profileDropdown.querySelector(".profile-btn");

profileBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  profileDropdown.classList.toggle("open");
});

// Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  if (!profileDropdown.contains(e.target)) {
    profileDropdown.classList.remove("open");
  }
});

//
// MODAL
//

// Close dropdown when pressing Escape
// document.addEventListener("keydown", function (e) {
//   if (e.key === "Escape") {
//     profileDropdown.classList.remove("open");
//   }
// });
