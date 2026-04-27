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
window.onload = initViz;
