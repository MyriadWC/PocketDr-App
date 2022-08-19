$(function() {
      App.init();
});
var App = {
      init: function() {
            this.datetime(), this.side.nav(), this.quickCall(), this.help(), this.charts.init(), setInterval("App.datetime();", 1e3)
      },
      datetime: function() {
            var e = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"),
                  t = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"),
                  a = new Date,
                  i = a.getYear();
            1e3 > i && (i += 1900);
            var s = a.getDay(),
                  n = a.getMonth(),
                  r = a.getDate();
            10 > r && (r = "0" + r);
            $(".welcome .datetime .day").text(e[s]), $(".welcome .datetime .date").text(t[n] + " " + r + ", " + i)
      },
      title: function(e) {
            return $(".header>.title").text(e)
      },
      side: {
            nav: function() {
                  this.toggle(), this.navigation()
            },
            toggle: function() {
                  $(".nav-button").on("touchstart click", function(e) {
                        e.preventDefault(), $(".sidebar").toggleClass("active"), $(".nav").removeClass("active"), $(".sidebar .sidebar-overlay").removeClass("fadeOut animated").addClass("fadeIn animated")
                  }), $(".sidebar .sidebar-overlay").on("touchstart click", function(e) {
                        e.preventDefault(), $(".nav-button").click(), $(this).removeClass("fadeIn").addClass("fadeOut")
                  })
            },
            navigation: function() {
                  $(".nav-left a").on("touchstart click", function(e) {
                        e.preventDefault();
                        var t = $(this).attr("href").replace("#", "");
                        $(".sidebar").toggleClass("active"), $(".html").removeClass("visible"), "home" == t || "" == t || null == t ? $(".html.welcome").addClass("visible") : $(".html." + t).addClass("visible");
                        $(this).text() == "Panel" ? App.title("PocketDr.") : App.title($(this).text());
                  })
            }
      },
      quickCall: function() {
            var isPlaying = false;
            var ringing = new Audio('./files/ringing.mp3');
            $(".nav .mask").on("touchstart click", function(e) {
                  e.preventDefault(), $(this).parent().toggleClass("active")
                  if (!isPlaying){
                        ringing.play();
                        isPlaying = true;
                  } else {
                        ringing.pause();
                        isPlaying = false;
                  }
                  $(".nav-item > span").toggleClass("invisible");
                  $(".nav-item").toggleClass("fadeInUp animated");
            });

      },
      help: function() {
            $(".help").on("touchstart click", function(e) {
                  e.preventDefault();
                  var t = $(this).attr("href").replace("#", "");
                  $(".html").removeClass("visible"), $(".html.credits").addClass("visible");
                  App.title("Help");
            })
      },
      charts: {
            init: function() {
                  this.makeCharts(), this.navigation();
            },
            makeCharts: function () {

                  //updating the config so each chart has a different dataset. This is a quick way to prevent all variables pointing
                  //to the same data
                  var stringified = JSON.stringify(this.config.general);

                  this.config.HR = JSON.parse(stringified);
                  this.config.BP = JSON.parse(stringified);
                  this.config.BO = JSON.parse(stringified);
                  this.config.BS = JSON.parse(stringified);

                  this.config.HR.data.datasets[0].data = [67, 62, 71, 64, 66, 65, 70, 62, 71, 58];
                  
                  //blood pressure will be in red and will have systolic and diastolic lines
                  this.config.BP.data.datasets[0].data = [143, 157, 142, 150, 151, 146, 148, 143, 149, 152];
                  //need to push extra array value to datasets, as blood pressure is an exception
                  this.config.BP.data.datasets.push({
                        data:[80, 75, 77, 76, 82, 81, 81, 78, 81, 76],
                        borderColor: '#800000',
                        borderWidth: 3,
                        pointBackgroundColor: '#800000',
                        pointBorderWidth: 4
                  });
                  
                  this.config.BO.data.datasets[0].data = [95, 93, 97, 95, 94, 96, 96, 94, 92, 93];
                  this.config.BS.data.datasets[0].data = [62, 68, 51, 44, 66, 55, 70, 44, 55, 64];

                  this.panelChartHR = new Chart(this.ctx.HR, this.config.HR);
                  this.panelChartBP = new Chart(this.ctx.BP, this.config.BP);
                  this.pane
                  lChartBO = new Chart(this.ctx.BO, this.config.BO);
                  this.panelChartBS = new Chart(this.ctx.BS, this.config.BS);

                  //initiating the full chart with blank data to be updated later
                  this.fullChart = new Chart(this.ctx.full, this.config.full);
            },
            populateDataPage: function(s) {
                  console.log(s);
                  //defining an associative array to assign locations based on string data passed to the function
                  var locations = { 
                        "HR": [this.config.HR, this.pageData.HR],
                        "BP": [this.config.BP, this.pageData.BP],
                        "BO": [this.config.BO, this.pageData.BO],
                        "BS": [this.config.BS, this.pageData.BS]
                  }; 
                  //updating full chart points and colour
                  var data = this.fullChart.data.datasets;

                  //updating the chart
                  data[0].data = locations[s][0].data.datasets[0].data;
                  data[0].borderColor  = locations[s][0].data.datasets[0].borderColor;
                  data[0].pointBackgroundColor  = locations[s][0].data.datasets[0].pointBackgroundColor;

                  //adding a second line for blood pressure, or if it is currently 2 and needs to be 1, remove the last array value in the fullChart
                  if(locations[s][0].data.datasets.length > 1) {
                        data.push(locations[s][0].data.datasets[1]);
                  } else if (locations[s][0].data.datasets.length < data.length){
                        data.pop();
                  }
                  
                  this.fullChart.update();
                  //updating the information below the chart
                  for(n=0; n < locations[s][1].length; n++){
                        $(".data-page .ol .li:nth-child(" + (n+1) + ")").text(locations[s][1][n]);
                  };
            },
            navigation: function() {
                  //so this can be accessed inside the click activity function
                  var that = this;
                  $(".panel a").on("touchstart click", function(e) {
                        e.preventDefault();
                        var t = $(this).attr("href").replace("#", "");
                        $(".html").removeClass("visible"), $(".html." + t).addClass("visible");
                        $(this).text() == "Panel" ? App.title("PocketDr.") : App.title($(this).text());
                        //accessing the relevant data and populating the data page
                        var sensorType = $(this).attr('data-value');
                        that.populateDataPage(sensorType);
                  });
                  $(".data-page .back-button").on("touchstart click", function(e) {
                        e.preventDefault();
                        var t = $(this).attr("href").replace("#", "");
                        $(".html").removeClass("visible"), $(".html.welcome").addClass("visible");
                        App.title("PocketDr.")
                  });
            },
            //chart objects will be stored here on initialisation
            panelChartHR: 0, panelChartBP: 0, panelChartBO: 0, panelChartBS: 0, fullChart: 0,
            ctx: {
                  HR:   document.getElementById('panel-chart-hr').getContext('2d'),
                  BP:   document.getElementById('panel-chart-bp').getContext('2d'),
                  BO:   document.getElementById('panel-chart-bo').getContext('2d'),
                  BS:   document.getElementById('panel-chart-bs').getContext('2d'),
                  full: document.getElementById('full-chart').getContext('2d')
            },
            config: {
                  HR:{}, BP:{}, BO:{}, BS:{},
                  general: {
                        type: 'line',
                        data: {
                              fill: false,
                              labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W'],
                              datasets: [{
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                    borderColor: '#17E9E0',
                                    borderWidth: 3,
                                    //fill:true,
                                    pointBackgroundColor: '#17E9E0',
                                    pointBorderWidth: 4
                              }]
                        },
                        options: {
                              responsive: false,
                              legend: {display:false},
                              scales: {
                                    yAxes: [{
                                        display: false,
                                        gridLines : {
                                          display : false,
                                        },
                                    }],
                                    xAxes: [{
                                        display: false,
                                        gridLines : {display : false},
                                    }]
                              },
                              layout: {
                                    padding: {
                                          left: 10,
                                          right: 10,
                                          top: 10,
                                          bottom: 20
                                    }
                              },
                              elements: {
                                    line: { fill: false}
                              }
                        }
                  },
                  full: {
                        type: 'line',
                        data: {
                              labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W'],
                              datasets: [{
                                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                    borderColor: '#17E9E0',
                                    borderWidth: 3,
                                    //fill:true,
                                    pointBackgroundColor: '#17E9E0',
                                    pointBorderWidth: 4,
                                    fill:true
                              }]
                        },
                        scales: {
                              yAxes: [{
                                    display: true,
                                    gridLines : {color:'#ffffff'},
                                    scaleLabel: {
                                          display: true,
                                          labelString: 'X axe name',
                                          fontColor:'#ffffff',
                                          fontSize:10
                                    },
                                    ticks: {
                                          fontColor: "black",
                                          fontSize: 14
                                    }
                              }],
                              xAxes: [{
                                  display: true,
                                  gridLines : {color:'#ffffff'}
                              }]
                        },
                        options: {
                              legend: {display:false},
                              elements: {
                                    line: { fill: false}
                              }
                        }
                  }
            },
            //contains information about the user's statistics
            pageData: {
                  HR: [
                        "Avg. 10-day heart rate: 67 BPM",
                        "Your target healthy heart rate: 65 BPM",
                        "Range high: 71 BPM",
                        "Range low: 58 BPM"
                  ],
                  BP: [
                        "Avg. 10-day blood pressure: 132/81",
                        "Your target healthy heart rate: 121/79",
                        "Range high: Sys: 157 Dia: 82",
                        "Range low: Sys: 142 Dia: 75"
                  ],
                  BO: [
                        "Avg. 10-day blood oxygen: 95%",
                        "Your target healthy blood oxygen: 95%",
                        "Range high: 97%",
                        "Range low: 92%"
                  ],
                  BS: [
                        "Avg. 10-day blood sugar(9am): 90 mg/dL",
                        "Your target healthy blood sugar: 78 mg/dL",
                        "Range high: 98 mg/dL",
                        "Range low: 79 mg/dL"
                  ]
            }
      }
}