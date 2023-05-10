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

                // modify the weeksInMonth array to have the format "2023xx"
                var formattedWeeks = weeksInMonth.map(function(week) {
                    // pad the week number with a leading zero if it is a single digit
                    var paddedWeek = week.padStart(2, '0');
                    // construct the formatted week string by concatenating the current year and the padded week number
                    var formattedWeek = currentYear.toString() + paddedWeek;
                    return formattedWeek;
                });
  
                console.log("Formatted weeks in current month:", formattedWeeks);

                // set the calendar weeks in the JSON model
                /* var oPlayerModel = this.getView().getModel("player");
                oPlayerModel.setProperty("/weeksInMonth", weeksInMonth);
                console.log("Json Werte (neu): ", oPlayerModel.getProperty("/weeksInMonth")); */


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

                        // compare the values in currentWeeks and formattedWeeks and store the matching values in a new array
                        var matchingWeeks = currentWeeks.filter(function (week) {
                            return formattedWeeks.includes(week);
                        });

                    console.log("Matching Weeks:", matchingWeeks);

                    // get right playername and sumofhearts from service
                     // store PlayerName and SumOfHearts for matching weeks
                    var matchingData = [];
                    for (var i = 0; i < oData.results.length; i++) {
                        var result = oData.results[i];
                        if (matchingWeeks.includes(result.CurrentWeek)) {
                            matchingData.push({
                                PlayerName: result.PlayerName,
                                Hearts: result.Hearts
                            });
                        }
                    }

                    console.log("Matching Players:", matchingData);

                    },
                    error: function(oError) {
                      //handle error
                    }
                  });
            }
        });

    });