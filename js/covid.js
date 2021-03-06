
function selectAllCounties() {
  var elements = document.querySelectorAll('.counties input');
  for (var i=0; i<elements.length;i++) {
    elements[i].checked = true;
  }
  draw();
}

function unselectAllCounties() {
  var elements = document.querySelectorAll('.counties input');
  for (var i=0; i<elements.length;i++) {
    elements[i].checked = false;
  }
  draw();
}
function draw() {
  
  var dateControl = document.querySelector('input[type="date"]');
  var startdate = dateControl.value;
  var scrollpos = window.scrollY;
  document.getElementById('canvas-parent').innerHTML ='';
  document.getElementById('canvas-parent').innerHTML ='<canvas id="chartJSContainer"></canvas>';
  
  //let canvas = document.getElementById('chartJSContainer');
  //const context = canvas.getContext('2d');
  //context.clearRect(0, 0, canvas.width, canvas.height);
  fetch(
    //"http://localhost:8080/http://dph.illinois.gov/sitefiles/COVIDHistoricalTestResults.json?nocache=1"
     //"https://cors-anywhere.herokuapp.com/http://dph.illinois.gov/sitefiles/COVIDHistoricalTestResults.json?nocache=1"
     "/resources/covid_data.json"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
    
      var soillcounties = [
        //"Franklin",
        //"Hamilton",
        //"Union",
        //"Johnson",
        //"Pulaski",
        //"Williamson",
        //"Saline",
        //"Hardin",
        //"Pope",
        //"White",
        //"Perry",
        //"Massac",
        //"Gallatin",
        //"Randolph",
        //"Jefferson",
        //"Jackson",
        //"Alexander"
        //"St. Clair",
        //"Monroe",
        //"Washington",
        //"Madison",
        // "Bond",
        // "Clinton",
        //"Marion",
        //"Wayne",
        //"Edwards",
        //"Wabash"
      ];

      var elements = document.querySelectorAll(".counties input:checked");
      var population = 0;
      for (var i=0; i<elements.length;i++) {
        soillcounties.push(elements[i].id);
        population += Number(elements[i].getAttribute('data-pop'));
      }
      
    
    
      /*single County Use */
      //soillcounties = ["Jackson"];
      /*  single county use */
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
            totalSOILLCountForDate += historicalData[i].values[j].dailydeaths;
            cumdeathdata += historicalData[i].values[j].deaths;
            totalCaseCount += historicalData[i].values[j].confirmed_cases;
            caseCount += historicalData[i].values[j].dailycases;
            dailytesteddata += historicalData[i].values[j].dailytests;
          }
        }
        if (startdate == undefined || startdate == '') {
            datetypestartdate = new Date('6/1/2020');
            dateControl.value = '2020-06-01';
        } else {
          datetypestartdate = new Date(startdate);
        }
		/*if (i > 289) {
			var dataDate = new Date(historicalData[i].testDate);
			dataDate.setFullYear(dataDate.getFullYear() + 1);
			var dataDateTime = dataDate.getTime()
		} else {
			var dataDateTime = new Date(historicalData[i].testDate).getTime()
    }*/
    var dataDateTime = new Date(historicalData[i].testDate).getTime()
        if (dataDateTime > datetypestartdate.getTime()) {
          newDeathData.push(totalSOILLCountForDate);
          cumDeathDataArr.push(cumdeathdata);
          newCaseData.push(caseCount);
          cumCaseData.push(totalCaseCount);
          dailytested.push(dailytesteddata);
          labelData.push(historicalData[i].testDate);
        }
      }

      var newDeathDataSet = {
        label: "# of Deaths Per Day",
        data: newDeathData,
        backgroundColor:'red'
      };

      var cumDeathDataSet = {
        label: "# of Total Deaths",
        data: cumDeathDataArr,
        backgroundColor:'pink'
      };

      var cumCaseDataSet = {
        label: "# of Total Cases",
        data: cumCaseData,
        backgroundColor:'blue'
      };
      var dailyCaseDataSet = {
        label: "# of Daily Cases",
        data: newCaseData,
        backgroundColor:'green'
      };
    
      
    
      var dailyTestDataSet = {
        label: "# of Daily Tests",
        data: dailytested,
        backgroundColor:'yellow'
      };
    
    
      var dailytpr = [];

      for (var i = 0; i < newCaseData.length; i++) {
        

        var last7daysofcases = newCaseData[i] + newCaseData[i-1] + newCaseData[i - 2] + newCaseData[i - 3] + newCaseData[i - 4] + newCaseData[i - 5] + newCaseData[i - 6];
        var last7daysoftests = dailytested[i] + dailytested[i-1] + dailytested[i - 2] + dailytested[i - 3] + dailytested[i - 4] + dailytested[i - 5] + dailytested[i - 6];
        var dailytprdata = ((last7daysofcases/7) / (last7daysoftests/7)) * 100            
       
        //alert(dailytprdata)
        dailytprfixed = dailytprdata.toFixed(2);
        dailytpr.push(dailytprfixed);
      }
      //alert(dailytprfixed)
      
      var dailyTPRDataSet = {
        label: "Average 7 day Daily Test Positivity Rate",
        data: dailytpr,
        backgroundColor:'orange'
      };



      var dailycaseperthousand = [];

      for (var i = 0; i < newCaseData.length; i++) {
        var dailycpt = (newCaseData[i]  / population) * 100000 ;
        
        dailycptfixed = dailycpt.toFixed(2);
        dailycaseperthousand.push(dailycptfixed);
      }
      
      var dailyCPTDataSet = {
        label: "Daily Cases per 100,000 population",
        data: dailycaseperthousand,
        backgroundColor:'green'
      };


      var dailydeathsperthousand = [];

      for (var i = 0; i < newDeathData.length; i++) {
        var dailydpt = (newDeathData[i] / population) * 100000 ;
        
        dailydptfixed = dailydpt.toFixed(2);
        dailydeathsperthousand.push(dailydptfixed);
      }
      
      var dailyDPTDataSet = {
        label: "Daily Deaths per 100,000 population",
        data: dailydeathsperthousand,
        backgroundColor:'purple'
      };      

    var sevendaytestdata = [];
    for (var i = 0; i < dailytested.length; i++) {
       
          var sevendaytested =
            (dailytested[i] +
              (dailytested[i - 1])  +
              (dailytested[i - 2])  +
              (dailytested[i - 3])  +
              (dailytested[i - 4])  +
              (dailytested[i - 5])  +
              (dailytested[i - 6]) ) /  7;
        
        //alert(dailytprdata)
        sevendaytestedfixed = sevendaytested.toFixed(2);
        sevendaytestdata.push(sevendaytestedfixed);
      }
    
      var sevendaydailyTestDataSet = {
        label: "# of 7 Day averaged Daily Tests",
        data: sevendaytestdata,
        backgroundColor:'grey'
      };
    
    var population = 56000;
    var testedperpopulationData = [];
    for (var i = 0; i < dailytested.length; i++) {
       
          var testedperpopulation = 
           ((((dailytested[i]   +
              dailytested[i - 1]   +
              dailytested[i - 2]    +
              dailytested[i - 3]    +
              dailytested[i - 4]   +
              dailytested[i - 5]    +
              dailytested[i - 6]) / 7) / population) * 800) ;
          
      
        //alert(dailytprdata)
        testedperpopulationfixed = testedperpopulation.toFixed(2);
        testedperpopulationData.push(testedperpopulationfixed);
      }
        
      var testedperpopulationDataSet = {
        label: "Tested Per Population 7 Day averaged Daily Tests",
        data: testedperpopulationData,
        backgroundColor:'black'
      };
    
    
    var sevendaycasedata = [];
    for (var i = 0; i < newCaseData.length; i++) {
        
          var sevendaycases =
            (newCaseData[i] +
              (newCaseData[i - 1])  +
              (newCaseData[i - 2])  +
              (newCaseData[i - 3])  +
              (newCaseData[i - 4])  +
              (newCaseData[i - 5])  +
              (newCaseData[i - 6]) ) /  7;
        
        //alert(dailytprdata)
        sevendaycasesfixed = sevendaycases.toFixed(2);
        sevendaycasedata.push(sevendaycasesfixed);
      }
    
      var sevendaydailyCaseDataSet = {
        label: "# of 7 Day averaged Daily Cases",
        data: sevendaycasedata
      };


      var sevendaydeathdata = [];
      for (var i = 0; i < newDeathData.length; i++) {
          
            var sevendaydeaths =
              (newDeathData[i] +
                (newDeathData[i - 1])  +
                (newDeathData[i - 2])  +
                (newDeathData[i - 3])  +
                (newDeathData[i - 4])  +
                (newDeathData[i - 5])  +
                (newDeathData[i - 6]) ) /  7;
          
          //alert(dailytprdata)
          sevendaydeathsfixed = sevendaydeaths.toFixed(2);
          sevendaydeathdata.push(sevendaydeathsfixed);
        }
      
        var sevendaydailyDeathsDataSet = {
          label: "# of 7 Day averaged Daily Deaths",
          data: sevendaydeathdata
        };      
      var datasets = [];

      if (document.getElementById('sevendaydailyDeathDataSet').checked) {
        datasets.push(sevendaydailyDeathsDataSet);
      }

      if (document.getElementById('cumDeathDataSet').checked) {
        datasets.push(cumDeathDataSet);
      }
      if (document.getElementById('newDeathDataSet').checked) {
        datasets.push(newDeathDataSet)
      }
      if (document.getElementById('cumCaseDataSet').checked) {
        datasets.push(cumCaseDataSet)
      }
      if (document.getElementById('dailyCaseDataSet').checked) {
        datasets.push(dailyCaseDataSet)
      }
      if (document.getElementById('sevendaydailyCaseDataSet').checked) {
        datasets.push(sevendaydailyCaseDataSet);
      }
      //if (document.getElementById('dailyTestDataSet').checked) {
       // datasets.push(dailyTestDataSet);
      //}
      if (document.getElementById('dailyTPRDataSet').checked) {
        datasets.push(dailyTPRDataSet);
      }
      if (document.getElementById('sevendaydailyTestDataSet').checked) {
        datasets.push(sevendaydailyTestDataSet);
      }    
      
      if (document.getElementById('dailyCPTDataSet').checked) {
        datasets.push(dailyCPTDataSet);
      }    
      if (document.getElementById('dailyDPTDataSet').checked) {
        datasets.push(dailyDPTDataSet);
      }   
      
      
      
      
      //datasets.push(testedperpopulationDataSet);
      var options = {
        type: "line",
        data: {
          labels: labelData,
          datasets: datasets
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  reverse: false
                }
              }
            ]
          }
        }
      };

      var ctx = document.getElementById("chartJSContainer").getContext("2d");
      new Chart(ctx, options); 
      window.scrollTo(0, scrollpos);    
    
    });

}
draw();

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
