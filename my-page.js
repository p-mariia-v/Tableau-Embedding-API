  var viz;

  function initViz() {
    var containerDiv = document.getElementById("vizContainer"),
    url = "https://public.tableau.com/views/MARKETCOMPARISONOFLEADINGCARBRANDS/Overview";
    var options = {
        hideTabs: true,
        onFirstInteractive: function () {
            console.log("Run this code when the viz has finished loading.");
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
function exportPDF() {
    if (viz) {
        viz.showExportPDFDialog();
    } else {
        alert("The dashboard hasn't loaded yet!");
    }
}
function resetViz() {
    viz.revertAllAsync();
}

let activeBrands = ["BMW", "Mercedes", "Audi", "Porsche", "Volkswagen"];

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
            "Brand", 
            activeBrands, 
            tableau.FilterUpdateType.REPLACE
        );
    }
}
window.onload = initViz;
