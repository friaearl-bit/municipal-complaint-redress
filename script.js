//array for subject
const subSubject = {
  "Waste Management":["Missed garbage collections", "Illegal dumping", "Unmaintained dumpsters"],
  "Infrastructure & Roads" :["Potholes", "Damaged sidewalks", "Broken or unlit streetlights"],
  "Utilities": ["Unannounced water interruptions", "Power outages", "Clogged or overflowing drainage systems"],
  "Public Order & Zoning" : ["Noise complaints", "Stray animals", "Illegal parking", "Unauthorized construction"],
  "Bureaucratic Delays" : ["Permits", "Business licenses", "Tax clearances"]
};

// makes the subject depedent on the category
const categoryDropdown = document.getElementById("complaintCategory");
const subjectDropdown = document.getElementById("complaintSubject");

categoryDropdown.addEventListener("change", function(){
    const selectedCategory = this.value;
    subjectDropdown.innerHTML = '<option value="">Select complaint Subject</option>';

    if (selectedCategory && subSubject[selectedCategory]) {
        subjectDropdown.disabled = false;
        subSubject[selectedCategory].forEach(function(item){
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
const descriptionTextArea = document.getElementById("complaintDescription");
const liveCharCounter = document.getElementById("live-char-count");
if(descriptionTextArea && liveCharCounter) {
    descriptionTextArea.addEventListener("input", function() {
        liveCharCounter.textContent = `${this.value.length} Char`;
    });
}

// Subdivision or village dropdown that depedent on the the barangay option
const subSubdivision_Village = {
  "Acacia":["Bellevue Subdivision", "Fabie Subdivision"],
  "Flores":["Forbes Park", "Ayala Alabang Village"],
  "Hulo":["McKinley Hill Village", "Urdaneta Village"]
};

//summarizes the address to address summarize area
const addressSummary = document.getElementById("address-summary");
const addressFormBlock = document.getElementById("address-form-block");
const barangayDropdown = document.getElementById("barangay");
const Subdivision_VillageDropdown = document.getElementById("Subdivision_Village");
const streetNameInput = document.getElementById("streetName");
const buildingFloorInput = document.getElementById("buildingFloor");
const closeAddressBtn = document.getElementById("closeAddressBtn");

if(addressSummary) {
    addressSummary.addEventListener("click", function() {
        addressFormBlock.style.display = "block";
    });
}

if(closeAddressBtn) {
    closeAddressBtn.addEventListener("click", function() {
        addressFormBlock.style.display = "none";
    });
}

function updateAddressSummary() {
    const brgy = barangayDropdown.value;
    const subid = Subdivision_VillageDropdown.options[Subdivision_VillageDropdown.selectedIndex]?.text || "";
    const street = streetNameInput.value.trim();
    const building = buildingFloorInput.value.trim();
    
    let addressParts = [];
    if (building) addressParts.push(building);
    if (street) addressParts.push(street);
    if (Subdivision_VillageDropdown.value && subid) addressParts.push(subid);
    if (brgy) addressParts.push(`Brgy. ${brgy}`);

    addressSummary.value = addressParts.join(", ");
}


if(barangayDropdown) {
    barangayDropdown.addEventListener("change", function(){
        const selectedBarangay = this.value;
        Subdivision_VillageDropdown.innerHTML = '<option value="">Select Subdivision or Village</option>';

        if (selectedBarangay && subSubdivision_Village[selectedBarangay]) {
            Subdivision_VillageDropdown.disabled = false;
            subSubdivision_Village[selectedBarangay].forEach(function(item){
                const option = document.createElement("option");
                option.value = item.toLowerCase().replace(/\s+/g, '-');
                option.textContent = item;
                Subdivision_VillageDropdown.appendChild(option); 
            });
        } else {
            Subdivision_VillageDropdown.disabled = true;
        }
        updateAddressSummary(); 
    });
}

if(Subdivision_VillageDropdown) Subdivision_VillageDropdown.addEventListener("change", updateAddressSummary);
if(streetNameInput) streetNameInput.addEventListener("input", updateAddressSummary);
if(buildingFloorInput) buildingFloorInput.addEventListener("input", updateAddressSummary);

// Interactive Selection State Processor for Priority Button System
const priorityButtons = document.querySelectorAll('.prio-btn');
const hiddenPriorityInput = document.getElementById('complaintPriority');

priorityButtons.forEach(button => {
    button.addEventListener('click', function() {
        priorityButtons.forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
        if(hiddenPriorityInput) {
            hiddenPriorityInput.value = this.getAttribute('data-value');
        }
    });
});

function goToStep(stepNumber) {
    // 1. Hide all functional sub panels
    document.querySelectorAll('.step-panel').forEach(panel => panel.classList.remove('show-view'));
    
    // 2. Reset structural state on visual step indicators and lines
    document.querySelectorAll('.step').forEach(indicator => indicator.classList.remove('active'));
    document.querySelectorAll('.line').forEach(line => line.style.backgroundColor = '#405c5f');

    // 3. Make target step panel visible
    const targetPanel = document.getElementById(`panel-step-${stepNumber}`);
    if (targetPanel) {
        targetPanel.classList.add('show-view');
    }

    // 4. Make target step indicator active (Fixed ID string template)
    const targetIndicator = document.getElementById(`step${stepNumber}-indicator`);
    if (targetIndicator) {
        targetIndicator.classList.add('active');
    }

    // 5. Control colored pipeline fill accents across progress points dynamically
    if (stepNumber >= 2) {
        document.getElementById('step1-indicator').classList.add('active');
        document.getElementById('line1-indicator').style.backgroundColor = '#0091ff';
    } else {
        document.getElementById('line1-indicator').style.backgroundColor = '#405c5f';
    }
    
    if (stepNumber >= 3) {
        document.getElementById('step2-indicator').classList.add('active');
        document.getElementById('line2-indicator').style.backgroundColor = '#0091ff';
        
        // Dynamically compile Review Checklist Text (Step 3)
        document.getElementById('review-category').textContent = categoryDropdown.value || "Not Specified";
        document.getElementById('review-subject').textContent = subjectDropdown.value || "Not Specified";
        document.getElementById('review-location').textContent = addressSummary.value || "Not Specified";
        document.getElementById('review-priority').textContent = (hiddenPriorityInput && hiddenPriorityInput.value) ? hiddenPriorityInput.value : "Normal";
        document.getElementById('review-description').textContent = descriptionTextArea.value || "No description provided";
        document.getElementById('review-contact').textContent = document.getElementById('contactNo').value || "No contact provided";
    } else {
        document.getElementById('line2-indicator').style.backgroundColor = '#405c5f';
    }
}