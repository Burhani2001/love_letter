sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, ODataModel) {
        "use strict";

        return Controller.extend("de.ososoft.llresults.resultsbyweekfreestyle.controller.Main", {
            onInit: function () {
                
                var oPlayerModel = new JSONModel("../model/player.json");
                this.getView().setModel(oPlayerModel, "player");   
            },

            onPress: function(evt) {

                var oPlayerModel = new JSONModel("../model/player.json");

                // // get the view
                // var oView = this.getView();

                // // get the data model
                // var oData = oView.getModel("data");
                // console.log(oData); 

                // // get the current month
                // var currentDate = new Date();
                // var currentMonth = currentDate.getMonth() + 1; // Note: getMonth() returns 0-indexed month

                // var currentYear = currentDate.getFullYear();

                // // construct the filter string to retrieve the results for the current month
                // var firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
                // var lastDayOfMonth = new Date(currentYear, currentMonth, 0);
                // var firstWeekOfMonth = Math.ceil((firstDayOfMonth.getDay() + 1 + firstDayOfMonth.getDate()) / 7);
                // var lastWeekOfMonth = Math.ceil((lastDayOfMonth.getDay() + 1 + lastDayOfMonth.getDate()) / 7);
                // var filterString = "Week ge " + firstWeekOfMonth + " and Week le " + (firstWeekOfMonth + 3);
                
                // // get the current date
                // var currentDate = new Date();

                // // get the current calendar week of the year
                // var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "ww"});
                // var currentWeek = oDateFormat.format(currentDate);

                // // log the current calendar week of the year
                // console.log(currentWeek);

                // // get the start date of the current week
                // var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
                // var currentDate = new Date();
                // var currentWeek = oDateFormat.format(currentDate);
                // var currentWeekStartDate = new Date(currentWeek);
                // currentWeekStartDate.setDate(currentWeekStartDate.getDate() - currentWeekStartDate.getDay() + 1); // adjust to Monday

                // // get the month of the start date
                // var currentMonth = currentWeekStartDate.getMonth() + 1;

                // console.log(currentMonth);


                
                // get the view
                var oView = this.getView();

                // get the data model
                var oData = oView.getModel("data");
                console.log(oData); 

                // get the current month
                var currentDate = new Date();
                var currentMonth = currentDate.getMonth() + 1; // Note: getMonth() returns 0-indexed month

                var currentYear = currentDate.getFullYear();

                // construct the filter string to retrieve the results for the current month
                var firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
                var lastDayOfMonth = new Date(currentYear, currentMonth, 0);
                var firstWeekOfMonth = Math.ceil((firstDayOfMonth.getDay() + 1 + firstDayOfMonth.getDate()) / 7);
                var lastWeekOfMonth = Math.ceil((lastDayOfMonth.getDay() + 1 + lastDayOfMonth.getDate()) / 7);

                // get the start date of the current month
                var currentMonthStartDate = new Date(currentYear, currentMonth - 1, 1);

                // get the start date of the first week of the month
                var firstWeekStartDate = new Date(currentYear, currentMonth - 1, 1);
                firstWeekStartDate.setDate(firstWeekStartDate.getDate() + (1 - firstWeekStartDate.getDay()));

                // initialize an array to hold the calendar weeks of the current month
                var weeksInMonth = [];

                // loop through each week of the month
                for (var i = 0; i < lastWeekOfMonth - firstWeekOfMonth + 1; i++) {
                    // get the start date of the current week
                    var currentWeekStartDate = new Date(firstWeekStartDate.getFullYear(), firstWeekStartDate.getMonth(), firstWeekStartDate.getDate() + (7 * i));
                    
                    // get the calendar week of the current week
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "ww"});
                    var currentWeek = oDateFormat.format(currentWeekStartDate);
                    
                    // add the current week to the array if it falls within the current month
                    if (currentWeekStartDate.getMonth() === currentMonthStartDate.getMonth()) {
                        weeksInMonth.push(currentWeek);
                    }
                }

                console.log("Calendar weeks in current month:", weeksInMonth);


                // load service data 
                oData.read("/Results", { 
                    //read the data from the OData service
                    // urlParameters: {
                    //     "$select": "CurrentWeek",
                    //     "$filter": filterString // filter the results by current month
                    // },
                    
                    success: function(oData) {
                        oPlayerModel.setData(oData); //set the data to the JSONModel
                      sap.ui.getCore().setModel(oPlayerModel, "playerData"); //set the JSONModel to the core with a custom name

                      var currentWeeks = oData.results.map(function(result) {
                        return result.CurrentWeek;
                      });
                        console.log("Current Week: " + currentWeeks);
                    },
                    error: function(oError) {
                      //handle error
                    }
                  });
            }
        });

    });
