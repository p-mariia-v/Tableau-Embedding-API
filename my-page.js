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
    const input = document.getElementById('yearInput');
    const errorMsg = document.getElementById('error-msg');
    const val = input.value;

    // Validation: Is it between 2000 and 2020?
    if (val >= 2000 && val <= 2020 && val !== "") {
        errorMsg.style.display = 'none';
        changeYear(val); 
    } else {
        errorMsg.style.display = 'block';
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
window.onload = initViz;
