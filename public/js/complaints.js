import { initModal, confirm, success, error } from "./modal.js";

document.addEventListener("DOMContentLoaded", () => {
  initModal();
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

const goToStep1 = document.getElementById("goToStep1");
const goToStep2 = document.getElementById("goToStep2");
const goToStep3 = document.getElementById("goToStep3");
const goToStep2P3 = document.getElementById("goToStep2P3");

goToStep1.addEventListener("click", () => goToStep(1));
goToStep2.addEventListener("click", () => goToStep(2));
goToStep3.addEventListener("click", () => goToStep(3));
goToStep2P3.addEventListener("click", () => goToStep(2));

const form = document.getElementById("complaintForm");

let errors = [];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("complaintForm");

  // --- ELEMENT DEFINITIONS ---
  // Step 1 Fields
  const category = document.getElementById("complaintCategory");
  const subject = document.getElementById("complaintSubject");
  const description = document.getElementById("complaintDescription");
  const addressSummary = document.getElementById("address-summary");
  const priority = document.getElementById("complaintPriority");

  // Step 2 Fields
  const fullName = document.getElementById("fullName");
  const emailAddress = document.getElementById("emailAddress");
  const contactNo = document.getElementById("contactNo");

  // Navigation Buttons
  const goToStep2Btn = document.getElementById("goToStep2");
  const goToStep3Btn = document.getElementById("goToStep3");

  // --- VALIDATION FUNCTIONS ---

  // Helper to toggle error style
  function toggleError(element, isValid) {
    if (isValid) {
      element.classList.remove("input-error");
    } else {
      element.classList.add("input-error");
    }
    return isValid;
  }

  // Step 1 Validation Logic
  function validateStep1() {
    let isValid = true;

    // 1. Category (Dropdown)
    if (!toggleError(category, category.value !== "")) isValid = false;

    // 2. Subject (Dropdown)
    if (!toggleError(subject, subject.value !== "")) isValid = false;

    // 3. Description (Textarea)
    if (!toggleError(description, description.value.trim().length >= 10))
      isValid = false;

    // 4. Address Summary (Generated text)
    if (!toggleError(addressSummary, addressSummary.value.trim() !== ""))
      isValid = false;

    // 5. Priority (Hidden Input changed via priority buttons)
    // Since it's hidden, we visually flag the container parent wrapper if empty
    const priorityContainer = document.querySelector(".priority-container");
    if (!toggleError(priorityContainer, priority.value !== "")) isValid = false;

    return isValid;
  }

  // Step 2 Validation Logic
  function validateStep2() {
    let isValid = true;

    // 1. Full Name (Generated text)
    if (!toggleError(fullName, fullName.value.trim() !== "")) isValid = false;

    // 2. Email Address regex pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!toggleError(emailAddress, emailRegex.test(emailAddress.value.trim())))
      isValid = false;

    // 3. Contact Number (Ensures length beyond just the pre-filled "+63 ")
    const contactNoHelp = document.getElementById("contactNoHelp");
    const cleanContact = contactNo.value.replace(/\s+/g, ""); // strip spaces
    const isContactValid = cleanContact.length >= 11; // Basic constraint check

    if (!toggleError(contactNo, isContactValid)) {
      isValid = false;
      if (contactNoHelp)
        contactNoHelp.textContent = "Please enter a valid phone number.";
    } else {
      if (contactNoHelp) contactNoHelp.textContent = "";
    }

    return isValid;
  }

  // --- LIVE VALIDATION LISTENERS (Real-time feedback) ---
  const step1Inputs = [category, subject, description, addressSummary];
  step1Inputs.forEach((input) => {
    input.addEventListener("input", () =>
      toggleError(input, input.value.trim() !== ""),
    );
    input.addEventListener("change", () =>
      toggleError(input, input.value.trim() !== ""),
    );
  });

  emailAddress.addEventListener("input", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    toggleError(emailAddress, emailRegex.test(emailAddress.value.trim()));
  });

  contactNo.addEventListener("input", () => {
    const cleanContact = contactNo.value.replace(/\s+/g, "");
    toggleError(contactNo, cleanContact.length >= 11);
  });

  // Handle priority selections live feedback
  const priorityButtons = document.querySelectorAll(".prio-btn");
  priorityButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      priority.value = btn.getAttribute("data-value");
      toggleError(document.querySelector(".priority-container"), true);
    });
  });

  // Watchers for hidden text blocks (Name blocks / Address blocks updates)
  document.getElementById("closeAddressBtn").addEventListener("click", () => {
    setTimeout(
      () => toggleError(addressSummary, addressSummary.value.trim() !== ""),
      50,
    );
  });
  document.getElementById("closeNameBtn").addEventListener("click", () => {
    setTimeout(() => toggleError(fullName, fullName.value.trim() !== ""), 50);
  });

  // --- NAVIGATION GUARD INTERCEPTORS ---

  // Intercept Step 1 -> Step 2
  document.addEventListener(
    "click",
    async (e) => {
      const link = e.target.closest(".continue-btn");
      if (!link) return;

      if (!validateStep1()) {
        e.preventDefault();
        e.stopPropagation();

        error(
          "Please fill up all required fields in Step 1 correctly before proceeding.",
        );

        return false;
      }
    },
    true,
  ); // Using capture phase to block moving panel scripts

  // Intercept Step 2 -> Step 3
  goToStep3Btn.addEventListener(
    "click",
    async (e) => {
      if (!validateStep2()) {
        e.preventDefault();
        e.stopPropagation();
        error(
          "Please complete your contact info correctly before going to the Review stage.",
        );
        return false;
      }
    },
    true,
  );

  // Final Form Submission Guard
  form.addEventListener("submit", async (e) => {
    if (!validateStep1() || !validateStep2()) {
      e.preventDefault();
      error("The form contains invalid fields. Please review steps 1 and 2.");
    }
  });
});

// DEBUG: GET ALL KEY VALUE PAIRS

// form.addEventListener('submit', async e => {
//   e.preventDefault();
//   const fd = new FormData(e.target);
//   const result = {};

//   for (const [key, value] of fd.entries()) {
//     if (value instanceof File) {
//       result[key] = {
//         filename: value.name,
//         type: value.type,
//         size: value.size
//       };
//     } else {
//       if (result.hasOwnProperty(key)) {
//         if (!Array.isArray(result[key])) result[key] = [result[key]];
//         result[key].push(value);
//       } else {
//         result[key] = value;
//       }
//     }
//   }

//   document.getElementById('out').textContent = JSON.stringify(result, null, 2);
//   console.log(result);
// });

// ELEMENTS
// const form      = document.querySelector('form');
const email = document.getElementById("emailAddress");
const emailHelp = document.getElementById("emailAddressHelp");

const contact = document.getElementById("contactNo");
const contactHelp = document.getElementById("contactNoHelp");

const surname = document.getElementById("surname");
const surnameHelp = document.getElementById("surnameHelp");
const givenName = document.getElementById("givenName");
const givenNameHelp = document.getElementById("givenNameHelp");
const middleName = document.getElementById("middleName");
const middleNameHelp = document.getElementById("middleNameHelp");
const suffix = document.getElementById("suffix");
const suffixHelp = document.getElementById("suffixHelp");

// REGEX
const emailRe = /^((?!\.)[\w\-\._]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/u;
const nameRe = /^[a-zA-ZÀ-ÿЁёА-я0-9 '\-]{1,32}$/u;
const contactRe = /^\+63\s9\d{2}-\d{3}-\d{4}$/;

// FIELD CONFIG (forEach)
const fields = [
  {
    field: email,
    help: emailHelp,
    regex: emailRe,
    optional: false,
    minLength: 3,
  },
  {
    field: contact,
    help: contactHelp,
    regex: contactRe,
    optional: false,
    minLength: 1,
  },
  {
    field: surname,
    help: surnameHelp,
    regex: nameRe,
    optional: false,
    minLength: 1,
  },
  {
    field: givenName,
    help: givenNameHelp,
    regex: nameRe,
    optional: false,
    minLength: 1,
  },
  {
    field: middleName,
    help: middleNameHelp,
    regex: nameRe,
    optional: true,
    minLength: 0,
  },
  {
    field: suffix,
    help: suffixHelp,
    regex: nameRe,
    optional: true,
    minLength: 0,
  },
];

// VALIDATE FUNCTION
function validate(field, help, regex, isOptional = false) {
  const value = field.value.trim();

  if (!value) {
    if (isOptional) {
      help.textContent = "";
      field.removeAttribute("aria-invalid");
      field.classList.remove("invalid");
      return true;
    } else {
      help.textContent = "Required";
      field.setAttribute("aria-invalid", "true");
      field.classList.add("invalid");
      return false;
    }
  }

  const isValid = regex.test(value);
  help.textContent = isValid ? "" : "Invalid format";
  field.setAttribute("aria-invalid", isValid ? "" : "true");
  field.classList.toggle("invalid", !isValid);
  return isValid;
}

// ADD EVENT LISTENERS (USING forEach)
fields.forEach(({ field, help, regex, optional, minLength }) => {
  field.addEventListener("input", () => {
    if (field.value.length > minLength) validate(field, help, regex, optional);
  });
  field.addEventListener("blur", () => validate(field, help, regex, optional));
});

// FORM SUBMIT (prevent if invalid)
if (form) {
  // form.addEventListener('submit', (e) => {
  form.addEventListener("submit", async (e) => {
    let isValid = true;
    fields.forEach(({ field, help, regex, optional }) => {
      if (!validate(field, help, regex, optional)) {
        isValid = false;
        if (!optional) field.focus();
      }
    });
    // if (!isValid) {
    //     e.preventDefault();
    //     error("Missing Required Fields");
    //     console.log("Missing Required Fields");
    // } else {
    //     confirm("Missing Fields, do you want to submit?");
    //     console.log("Missing Fields, do you want to submit?");
    // }
  });
}

// //array for subject

// const subSubject = {
//   "Waste Management":["Missed garbage collections", "Illegal dumping", "Unmaintained dumpsters"],
//   "Infrastructure & Roads" :["Potholes", "Damaged sidewalks", "Broken or unlit streetlights"],
//   "Utilities": ["Unannounced water interruptions", "Power outages", "Clogged or overflowing drainage systems"],
//   "Public Order & Zoning" : ["Noise complaints", "Stray animals", "Illegal parking", "Unauthorized construction"],
//   "Bureaucratic Delays" : ["Permits", "Business licenses", "Tax clearances"]
// };

//array for subject
const subSubject = {
  WASTE_MANAGEMENT: [
    "Missed garbage collections",
    "Illegal dumping",
    "Unmaintained dumpsters",
  ],
  INFRASTRUCTURE_ROADS: [
    "Potholes",
    "Damaged sidewalks",
    "Broken or unlit streetlights",
  ],
  UTILITIES: [
    "Unannounced water interruptions",
    "Power outages",
    "Clogged or overflowing drainage systems",
  ],
  PUBLIC_ORDER_ZONING: [
    "Noise complaints",
    "Stray animals",
    "Illegal parking",
    "Unauthorized construction",
  ],
  BUREAUCRATIC_DELAYS: ["Permits", "Business licenses", "Tax clearances"],
};

// makes the subject depedent on the category
const categoryDropdown = document.getElementById("complaintCategory");
const subjectDropdown = document.getElementById("complaintSubject");

categoryDropdown.addEventListener("change", function () {
  const selectedCategory = this.value;
  subjectDropdown.innerHTML =
    '<option value="">Select complaint Subject</option>';

  if (selectedCategory && subSubject[selectedCategory]) {
    subjectDropdown.disabled = false;
    subSubject[selectedCategory].forEach(function (item) {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      subjectDropdown.appendChild(option);
    });
  } else {
    subjectDropdown.disabled = true;
  }
});

// Live Context Character Tracker Counter for the complaint description section
const CHARACTER_LIMIT = 2000;
const descriptionTextArea = document.getElementById("complaintDescription");
const liveCharCounter = document.getElementById("live-char-count");
if (descriptionTextArea && liveCharCounter) {
  descriptionTextArea.addEventListener("input", function () {
    const limitReached = this.value.length > CHARACTER_LIMIT;

    // descriptionTextArea.setCustomValidity(limitReached ? "Too long" : "");
    // descriptionTextArea.reportValidity();

    this.value = this.value.slice(0, CHARACTER_LIMIT);
    liveCharCounter.textContent = limitReached
      ? `${this.value.length} Char (Limit Reached)`
      : `${this.value.length} Char`;
    // Track invalid state for the textarea via aria-invalid and CSS.
    this.setAttribute("aria-invalid", limitReached ? "true" : "false");
    this.classList.toggle("invalid", limitReached);
  });
}

// Subdivision or village dropdown that depedent on the the barangay option
const subSubdivision_Village = {
  Acacia: ["Bellevue Subdivision", "Fabie Subdivision"],
  Flores: ["Forbes Park", "Ayala Alabang Village"],
  Hulo: ["McKinley Hill Village", "Urdaneta Village"],
};

//summarizes the address to address summarize area
const addressSummary = document.getElementById("address-summary");
const addressFormBlock = document.getElementById("address-form-block");
const barangayDropdown = document.getElementById("barangay");
const Subdivision_VillageDropdown = document.getElementById(
  "Subdivision_Village",
);
const streetNameInput = document.getElementById("streetName");
const buildingFloorInput = document.getElementById("buildingFloor");
const closeAddressBtn = document.getElementById("closeAddressBtn");

if (addressSummary) {
  addressSummary.addEventListener("focus", function () {
    addressFormBlock.style.display = "block";
  });
}

if (closeAddressBtn) {
  closeAddressBtn.addEventListener("click", function () {
    addressFormBlock.style.display = "none";
  });
}

function updateAddressSummary() {
  const brgy = barangayDropdown.value;
  const subid =
    Subdivision_VillageDropdown.options[
      Subdivision_VillageDropdown.selectedIndex
    ]?.text || "";
  const street = streetNameInput.value.trim();
  const building = buildingFloorInput.value.trim();

  let addressParts = [];
  if (building) addressParts.push(building);
  if (street) addressParts.push(street);
  if (Subdivision_VillageDropdown.value && subid) addressParts.push(subid);
  if (brgy) addressParts.push(`Brgy. ${brgy}`);

  addressSummary.value = addressParts.join(", ");
}

if (barangayDropdown) {
  barangayDropdown.addEventListener("change", function () {
    const selectedBarangay = this.value;
    Subdivision_VillageDropdown.innerHTML =
      '<option value="">Select Subdivision or Village</option>';

    if (selectedBarangay && subSubdivision_Village[selectedBarangay]) {
      Subdivision_VillageDropdown.disabled = false;
      subSubdivision_Village[selectedBarangay].forEach(function (item) {
        const option = document.createElement("option");
        option.value = item.toLowerCase().replace(/\s+/g, "-");
        option.textContent = item;
        Subdivision_VillageDropdown.appendChild(option);
      });
    } else {
      Subdivision_VillageDropdown.disabled = true;
    }
    updateAddressSummary();
  });
}

if (Subdivision_VillageDropdown)
  Subdivision_VillageDropdown.addEventListener("change", updateAddressSummary);
if (streetNameInput)
  streetNameInput.addEventListener("input", updateAddressSummary);
if (buildingFloorInput)
  buildingFloorInput.addEventListener("input", updateAddressSummary);

// Interactive Selection State Processor for Priority Button System
const priorityButtons = document.querySelectorAll(".prio-btn");
const hiddenPriorityInput = document.getElementById("complaintPriority");

priorityButtons.forEach((button) => {
  button.addEventListener("click", function () {
    priorityButtons.forEach((btn) => btn.classList.remove("selected"));
    this.classList.add("selected");
    if (hiddenPriorityInput) {
      hiddenPriorityInput.value = this.getAttribute("data-value");
    }
  });
});

function goToStep(stepNumber) {
  // 1. Hide all functional sub panels
  document
    .querySelectorAll(".step-panel")
    .forEach((panel) => panel.classList.remove("show-view"));

  // 2. Reset structural state on visual step indicators and lines
  document
    .querySelectorAll(".step")
    .forEach((indicator) => indicator.classList.remove("active"));
  document
    .querySelectorAll(".line")
    .forEach((line) => (line.style.backgroundColor = "#405c5f"));

  // 3. Make target step panel visible
  const targetPanel = document.getElementById(`panel-step-${stepNumber}`);
  if (targetPanel) {
    targetPanel.classList.add("show-view");
  }

  // 4. Make target step indicator active (Fixed ID string template)
  const targetIndicator = document.getElementById(
    `step${stepNumber}-indicator`,
  );
  if (targetIndicator) {
    targetIndicator.classList.add("active");
  }

  // 5. Control colored pipeline fill accents across progress points dynamically
  if (stepNumber >= 2) {
    document.getElementById("step1-indicator").classList.add("active");
    document.getElementById("line1-indicator").style.backgroundColor =
      "#0091ff";
  } else {
    document.getElementById("line1-indicator").style.backgroundColor =
      "#405c5f";
  }

  if (stepNumber >= 3) {
    document.getElementById("step2-indicator").classList.add("active");
    document.getElementById("line2-indicator").style.backgroundColor =
      "#0091ff";

    // Dynamically compile Review Checklist Text (Step 3)
    document.getElementById("review-category").textContent =
      categoryDropdown.value || "Not Specified";
    document.getElementById("review-subject").textContent =
      subjectDropdown.value || "Not Specified";
    document.getElementById("review-location").textContent =
      addressSummary.value || "Not Specified";
    document.getElementById("review-priority").textContent =
      hiddenPriorityInput && hiddenPriorityInput.value
        ? hiddenPriorityInput.value
        : "Normal";
    document.getElementById("review-description").textContent =
      descriptionTextArea.value || "No description provided";
    document.getElementById("review-contact").textContent =
      document.getElementById("contactNo").value || "No contact provided";
  } else {
    document.getElementById("line2-indicator").style.backgroundColor =
      "#405c5f";
  }
}

//street name and building floor validation (Can't input negative number)
const streetInput = document.getElementById("streetName");
const floorInput = document.getElementById("buildingFloor");

// 1. Define the reusable validation handler
function allowOnlyPositiveAlphanumeric(e) {
  e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
}

// 2. Attach it to each element individually
streetInput.addEventListener("input", allowOnlyPositiveAlphanumeric);
floorInput.addEventListener("input", allowOnlyPositiveAlphanumeric);

const fullNameSummary = document.getElementById("fullName");
const nameFormBlock = document.getElementById("name-form-block");
const surnameInput = document.getElementById("surname");
const givenNameInput = document.getElementById("givenName");
const middleNameInput = document.getElementById("middleName");
const suffixInput = document.getElementById("suffix");
const closeNameBtn = document.getElementById("closeNameBtn");

// Show sub-category name block on click
if (fullNameSummary) {
  fullNameSummary.addEventListener("focus", function () {
    nameFormBlock.style.display = "block";
  });
}

// Hide sub-category name block on clicking "Done"
if (closeNameBtn) {
  closeNameBtn.addEventListener("click", function () {
    nameFormBlock.style.display = "none";
  });
}

// Function to compile the sub-fields into the summary text area
function updateNameSummary() {
  const surname = surnameInput.value.trim();
  const given = givenNameInput.value.trim();
  const middle = middleNameInput.value.trim();
  const suffix = suffixInput.value.trim();

  let nameParts = [];

  // Formatting as: Given Name Middle Name Surname, Suffix
  // Example: Juan Santos Dela Cruz, Jr.
  if (given) nameParts.push(given);
  if (middle) nameParts.push(middle);
  if (surname) nameParts.push(surname);

  let baseName = nameParts.join(" ");

  if (suffix && baseName) {
    baseName += `, ${suffix}`;
  } else if (suffix) {
    baseName = suffix;
  }

  fullNameSummary.value = baseName;
}

// Add event listeners for instant compiling updates
if (surnameInput) surnameInput.addEventListener("input", updateNameSummary);
if (givenNameInput) givenNameInput.addEventListener("input", updateNameSummary);
if (middleNameInput)
  middleNameInput.addEventListener("input", updateNameSummary);
if (suffixInput) suffixInput.addEventListener("input", updateNameSummary);

// --- NAME VALIDATION (LETTERS AND SPACES ONLY) ---
const surnameField = document.getElementById("surname");
const givenNameField = document.getElementById("givenName");
const middleNameField = document.getElementById("middleName");
const suffixField = document.getElementById("suffix");

// Reusable handler to strip away numbers and special characters
function allowOnlyLettersAndSpaces(e) {
  e.target.value = e.target.value.replace(/[^a-zA-Z\s.-]/g, "");
}

// Attach validation to all four name fields
if (surnameField)
  surnameField.addEventListener("input", allowOnlyLettersAndSpaces);
if (givenNameField)
  givenNameField.addEventListener("input", allowOnlyLettersAndSpaces);
if (middleNameField)
  middleNameField.addEventListener("input", allowOnlyLettersAndSpaces);
if (suffixField)
  suffixField.addEventListener("input", allowOnlyLettersAndSpaces);

//Contanct Number validation
const contactInput = document.getElementById("contactNo");

if (contactInput) {
  contactInput.addEventListener("input", function (e) {
    let value = e.target.value;

    //Force the input to always start with '+63 '
    if (!value.startsWith("+63 ")) {
      value = "+63 ";
    }

    //Isolate the user's typed digits after the '+63 ' prefix
    let digits = value.slice(4).replace(/\D/g, "");

    //Limit total mobile number input to 10 digits (e.g., 9171234567)
    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }

    //Build the auto-formatted string dynamically (+63 9XX-XXX-XXXX)
    let formattedValue = "+63 ";

    if (digits.length > 0) {
      if (digits.length <= 3) {
        formattedValue += digits; // +63 917
      } else if (digits.length <= 6) {
        formattedValue += digits.slice(0, 3) + "-" + digits.slice(3); // +63 917-123
      } else {
        formattedValue +=
          digits.slice(0, 3) + "-" + digits.slice(3, 6) + "-" + digits.slice(6); // +63 917-123-4567
      }
    }

    e.target.value = formattedValue;
  });

  // Prevent the user from moving their cursor before the prefix via arrow keys or clicks
  contactInput.addEventListener("keydown", function (e) {
    if (
      e.target.selectionStart < 4 &&
      (e.key === "Backspace" || e.key === "Delete")
    ) {
      e.preventDefault();
    }
  });
}

//Generates unique case id
// function generateCaseID() {
//   const prefix = "CRS-2026-";

//   // Generates a random number between 1000000 and 9999999 to guarantee 7 digits
//   const random7Digits = Math.floor(1000000 + Math.random() * 9000000);

//   const finalCaseID = prefix + random7Digits;

//   //Inject it into the Step 3 review table display element
//   const reviewCaseIdElem = document.getElementById("review-case-id");
//   if (reviewCaseIdElem) {
//     reviewCaseIdElem.textContent = finalCaseID;
//   }

//   //OPTIONAL: If you want to submit this ID with your form,
//   // you can create or append it to a hidden form field dynamically
//   let hiddenInput = document.getElementById("hiddenCaseID");
//   if (!hiddenInput) {
//     hiddenInput = document.createElement("input");
//     hiddenInput.type = "hidden";
//     hiddenInput.id = "hiddenCaseID";
//     hiddenInput.name = "caseId";
//     document.getElementById("complaintForm").appendChild(hiddenInput);
//   }
//   hiddenInput.value = finalCaseID;
// }

// Execute the generator immediately when the DOM DOM structure finishes loading
// document.addEventListener("DOMContentLoaded", generateCaseID);

//
//
//
//
//
//

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("attachment");
  const fileList = document.getElementById("file-list");
  const fileListReview = document.getElementById("file-list-review");
  const fileCounter = document.getElementById("file-counter");
  const dropzone = document.querySelector(".dropzone-label");

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
  ];

  function updateUI(files) {
    fileList.innerHTML = "";

    Array.from(files).forEach((file) => {
      const li = document.createElement("li");

      li.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;

      fileList.appendChild(li);
    });

    fileListReview.innerHTML = "";

    Array.from(files).forEach((file) => {
      const li = document.createElement("li");

      li.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;

      fileListReview.appendChild(li);
    });

    fileCounter.textContent = `${files.length} file(s) selected`;
  }

  function validateFiles(files) {
    const validFiles = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        error(`${file.name} is not a supported file type.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        error(`${file.name} exceeds 10MB limit.`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  }

  fileInput.addEventListener("change", () => {
    const validFiles = validateFiles(fileInput.files);

    const dt = new DataTransfer();

    validFiles.forEach((f) => dt.items.add(f));

    fileInput.files = dt.files;

    updateUI(fileInput.files);
  });

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragging");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragging");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();

    dropzone.classList.remove("dragging");

    const validFiles = validateFiles(e.dataTransfer.files);

    const dt = new DataTransfer();

    validFiles.forEach((f) => dt.items.add(f));

    fileInput.files = dt.files;

    updateUI(fileInput.files);
  });
});
