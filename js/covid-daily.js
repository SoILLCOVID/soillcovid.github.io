Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
function drawChart() {
    var dateControl = document.querySelector('input[type="date"]');
    var startdate = dateControl.value;
    
    fetch(
         "/resources/covid_data.json"
      ).then((response) => {
          return response.json();
        }).then((data) => {
            var soillcounties = [
                "Alexander",
                "Edwards",
                "Franklin",
                "Gallatin",
                "Hamilton",
                "Hardin",
                "Jackson",
                "Jefferson",
                "Johnson",
                "Marion",
                "Massac",
                "Union",
                "Perry",
                "Pope",
                "Pulaski",
                "Saline",
                "Wabash",
                "Wayne",
                "White",
                "Williamson",
            ];
            var countyData = [];
            var historicalData = data.historical_county.values.reverse();
            var newCaseData = [];
            var cumCaseData = [];
            var newDeathData = [];
            var newDailyData = [];
            var cumDeathDataArr = [];
            var labelData = [];
            var dailytested = [];
            for (var i = 0; i < historicalData.length; i++) {
                var totalSOILLCountForDate = 0;
                var cumdeathdata = 0;
                var caseCount = 0;
                var totalCaseCount = 0;
                var dailytesteddata = 0;
                for (var j = 0; j < historicalData[i].values.length; j++) {
                    if (soillcounties.includes(historicalData[i].values[j].County)) {
                        if (i > 0) {
                            historicalData[i].values[j].dailydeaths =
                                historicalData[i].values[j].deaths -
                                findCountByCountyName(
                                historicalData[i].values[j].County,
                                historicalData[i - 1].values
                            );
                            historicalData[i].values[j].dailycases =
                                historicalData[i].values[j].confirmed_cases -
                                findCountByCountyNameCases(
                                historicalData[i].values[j].County,
                                historicalData[i - 1].values
                            );
                            historicalData[i].values[j].dailytests =
                                historicalData[i].values[j].total_tested -
                                findCountByCountyNameTested(
                                historicalData[i].values[j].County,
                                historicalData[i - 1].values
                            );
                        } else {
                            historicalData[i].values[j].dailydeaths =
                                historicalData[i].values[j].deaths;
                            historicalData[i].values[j].dailycases =
                                historicalData[i].values[j].confirmed_cases;
                            historicalData[i].values[j].dailytests =
                                historicalData[i].values[j].total_tested;
                        }
                        if (startdate == undefined || startdate == '') {
                            datetypestartdate = new Date();
                            var currentYear = datetypestartdate.getFullYear();
                            var currentMonth = datetypestartdate.getMonth() + 1;
                            var currentDate = datetypestartdate.getDate();
                            dateControl.value = currentYear + '-' + currentMonth.toString().padStart(2,0) + '-' + currentDate.toString().padStart(2,0);
                            
                        } else {
                            datetypestartdate = new Date(startdate);
                            
                        }
                        datetypestartdate.setHours(0,0,0,0);
                        datetypestartdate = datetypestartdate.addDays(1);
                        
                        var testDate = new Date(historicalData[i].testDate).getTime();
                        var currentDate = datetypestartdate.getTime();
                        if (testDate == currentDate) {
                            var countyObject = {};
                            countyObject["Test Date"] = historicalData[i].testDate;
                            countyObject["County Name"] = historicalData[i].values[j].County;
                            countyObject["Daily Tests"] = historicalData[i].values[j].dailytests;
                            countyObject["Daily Cases"] = historicalData[i].values[j].dailycases;
                            countyObject["Daily Deaths"] = historicalData[i].values[j].dailydeaths;
                            countyObject["     "] = "     ";
                            countyObject["Total Tests"] = historicalData[i].values[j].total_tested;
                            countyObject["Total Cases"] = historicalData[i].values[j].confirmed_cases;
                            countyObject["Total Deaths"] = historicalData[i].values[j].deaths;
                            countyData.push(countyObject);
                        }
                        
                    }
                }

                
            }
            drawTable(countyData);
        })
}

findCountByCountyName = function (name, arr) {
    for (var i = 0; arr.length; i++) {
      if (arr[i].County == name) {
        return arr[i].deaths;
      }
    }
  };
  
  findCountByCountyNameCases = function (name, arr) {
    for (var i = 0; arr.length; i++) {
      if (arr[i].County == name) {
        return arr[i].confirmed_cases;
      }
    }
  };
  findCountByCountyNameTested = function (name, arr) {
    for (var i = 0; arr.length; i++) {
      if (arr[i].County == name) {
        return arr[i].total_tested;
      }
    }
  };


  function drawTable(countyData) {
      document.getElementById('tableGoesHere').innerHTML = 'No Data Available for Date';
      if (countyData.length > 0) {
        document.getElementById('tableGoesHere').innerHTML = json2table(countyData, 'table table-striped');
      }
      
  }
  drawChart();
  


/* The function */

function json2table(json, classes) {
  var cols = Object.keys(json[0]);
  
  var headerRow = '';
  var bodyRows = '';
  
  classes = classes || '';

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  cols.map(function(col) {
    headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
  });

  json.map(function(row) {
    bodyRows += '<tr>';

    cols.map(function(colName) {
      bodyRows += '<td>' + row[colName] + '</td>';
    })

    bodyRows += '</tr>';
  });

  return '<table class="' +
         classes +
         '"><thead><tr>' +
         headerRow +
         '</tr></thead><tbody>' +
         bodyRows +
         '</tbody></table>';
}






