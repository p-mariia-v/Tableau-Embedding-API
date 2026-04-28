var viz;
let  activeBrands = ["BMW", "Mercedes-Benz", "Audi", "Porsche", "VW"];
  function initViz() {
    var containerDiv = document.getElementById("vizContainer"),
    url = "https://public.tableau.com/views/MARKETCOMPARISONOFLEADINGCARBRANDS/Overview";
    var options = {
        hideTabs: true,
        onFirstInteractive: function () {
            console.log("Viz loaded with default year 2020");
        }
    };
    viz = new tableau.Viz(containerDiv, url, options);
  }

function changeYear(yearValue) {
    var workbook = viz.getWorkbook();
    workbook.changeParameterValueAsync('Year Parameter', yearValue)
        .then(function() {
            console.log("Year changed to " + yearValue);
        });
} 
function handleYearInput() {
    // 1. Get the element
    const inputElement = document.getElementById('yearInput');
    
    // 2. Get the value and clean it (remove any accidental spaces)
    const rawValue = inputElement.value;
    const cleanValue = rawValue.toString().trim();

    const errorMsg = document.getElementById('error-msg');

    // 3. Validation Logic
    if (cleanValue >= 2000 && cleanValue <= 2020 && cleanValue !== "") {
        // Hide error if it was showing
        if (errorMsg) errorMsg.style.display = 'none';
        
        console.log("Input valid. Calling changeYear with:", cleanValue);
        
        // 4. Call the function that we KNOW works
        changeYear(cleanValue); 
    } else {
        // Show error
        if (errorMsg) errorMsg.style.display = 'block';
        console.log("Input invalid or out of range.");
    }
}
function exportPDF() {
    if (viz) {
        viz.showExportPDFDialog();
    } else {
        alert("The dashboard hasn't loaded yet!");
    }
}


function resetViz() {
    viz.revertAllAsync();
    const yearInput = document.getElementById('yearInput');
    if (yearInput) {
        yearInput.value = "2020";
    }
    activeBrands = ["BMW", "Mercedes-Benz", "Audi", "Porsche", "VW"];
    var buttons = document.querySelectorAll('.btn-brand');
        buttons.forEach(function(btn) {
           btn.classList.remove('inactive');
           btn.classList.add('active');
    });

    console.log("Dashboard and buttons reset!");
}



function toggleBrand(buttonElement, brandName) {
    // 1. Update our tracking array
    if (activeBrands.includes(brandName)) {
        // If it's there, remove it (Exclude)
        activeBrands = activeBrands.filter(item => item !== brandName);
        buttonElement.classList.replace('active', 'inactive');
    } else {
        // If it's not there, add it back (Include)
        activeBrands.push(brandName);
        buttonElement.classList.replace('inactive', 'active');
    }
    applyBrandFilter();
}

function applyBrandFilter() {
    var workbook = viz.getWorkbook();
    var activeSheet = workbook.getActiveSheet();
    var worksheets = activeSheet.getWorksheets();

    for (var i = 0; i < worksheets.length; i++) {
        // We tell Tableau: "Only show brands that are in my activeBrands list"
        worksheets[i].applyFilterAsync(
            "Maker/Brand (filter)", 
            activeBrands, 
            tableau.FilterUpdateType.REPLACE
        );
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const yearInputField = document.getElementById('yearInput');

    if (yearInputField) {
        yearInputField.addEventListener("keypress", function(event) {
            // Check if the key pressed was 'Enter'
            if (event.key === "Enter") {
                // Prevent the default behavior (like refreshing the page)
                event.preventDefault();
                
                // Trigger the logic you already built!
                handleYearInput();
                
                console.log("Enter key detected, applying year...");
            }
        });
    }
});
window.onload = initViz;
