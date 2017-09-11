/**
 Display results of populated devices + tests 
 Variable dataBaseUrlWithProxy should be correcly configured: "http://DB_URL_TO_DEFINE:DB_PORT"
 For instance: dataBaseUrlWithProxy = "http://nuxcmcwkit.com:8899"
 
*/

var TestsResults = (function() {
	var that = {}, colors = ['blue', 'red', 'green', 'yellow', 'gray', 'orange', 'black', 'purple', 'pink'], indColor = 0, deviceColors = {}, 
	dataBaseUrlWithProxy = "http://DB_URL_TO_DEFINE:DB_PORT", dataBaseUrl = "http://" + location.hostname + ":" + location.port, useProxyForReq = false, collectingResult = false, debug = true,
	// Global variables:
	results, nbResultsExpected = 0, nbResultsFinished = 0, deviceSelected, chartObjects = {}, tables = {}, datasObj = {}, viewObj = {},
	// Functions:
	log, getDatabaseData, addItem, deleteSelectedItemsFromList, populateList, getDeviceList, getTestList, updateDeviceList, resetDrawAndTable, populateTestResults, createResDiv, cleanArray, sortTestResultByDeviceName,
	getChartDefaultOptions, getTableDefaultOptions, keepResultsFromInterval, drawChartAndTable, joinMultipleResults, updateChart, launchPrint, testIfArrayContainsTheKey, testIfTheKeyMatchAnArrayElt;

	log = function(msg) {
		if (debug) {
			console.log(msg);
		}
	};
	
	cleanArray = function(array, deleteValue) {
		var i;
	  	for (i = 0; i < array.length; i++) {
	    	if (array[i] === deleteValue) {         
	      		array.splice(i, 1);
	      		i--;
	    	}
	  	}
	  	return array;
	};

	testIfArrayContainsTheKey = function(elt) {
		return this.toUpperCase().indexOf(elt.toUpperCase()) !== -1;
	};

	testIfTheKeyMatchAnArrayElt = function(elt) {
		return elt.toUpperCase().indexOf(this.toUpperCase()) !== -1;
	};
	
	getDatabaseData = function(req, callback) {
		if (useProxyForReq) {
			$.ajax({
				url : './proxy.php?req=' + dataBaseUrlWithProxy + req,
				dataType : 'json'
			}).done(callback);
		} else {
			$.ajax({
				url : '' + dataBaseUrl + req,
				dataType : 'json'
			}).done(callback);
		}
	};

	// Add an option to the list
	addItem = function(list, sel) {
		var i, o, value;
		for ( i = 0; i < sel.length; i++) {
			if (sel.options[i].selected === true) {
				o = document.createElement('option');
				value = sel.options[i].value;
				o.text = sel.options[i].text;
				o.value = value;
				list.appendChild(o);
			}
		}
	};

	deleteSelectedItemsFromList = function(list) {
		var i = 0;
		if (list.options.selectedIndex >= 0) {
			for ( i = list.length - 1; i > -1; i--) {
				if (list.options[i].selected === true) {
					list.removeChild(list.options[i]);
				}
			}
		} else {
			log("deleteSelectedItemsFromList: nothing is selected !");
		}
	};

	// Get the device list, the tests list and create them
	populateList = function(listName, selectorName, addButtonName, removeButtonName, jsonData, isForTest) {
		var i, content = jsonData.content, keys = jsonData.keys, selector = document.getElementById(selectorName), option, values = [], list;

		selector.size = content.length;
		if (isForTest) {
			for ( i = 0; i < content.length; i++) {
				values[i] = {
					name : content[i].name,
					description : content[i].description,
					id : content[i]._id,
					localisation : content[i].localisation,
					url : content[i].url,
					displayName : content[i].name,
					fullName : "[" + content[i].localisation + "] " + content[i].description + "  @" + content[i].url
				};
			}
		} else {
			for ( i = 0; i < content.length; i++) {
				values[i] = {
					middleware : content[i].middleware,
					middlewareVersion : content[i].middlewareVersion,
					id : content[i]._id,
					model : content[i].model,
					macAddress : content[i].macAddress,
					displayName : content[i].middleware + " " + content[i].middlewareVersion + " " + content[i].model,
					fullName : "MAC @: " + content[i].macAddress
				};
			}
		}

		values.sort(function(o1, o2) {
			return (o1.displayName > o2.displayName) ? 1 : ((o2.displayName > o1.displayName) ? -1 : 0);
		});

		for ( i = 0; i < values.length; i++) {
			option = document.createElement('option');
			option.text = values[i].displayName;
			option.value = values[i].id;
			option.id = values[i].id;
			option.title = values[i].fullName;
			selector.appendChild(option);
		}

		list = document.getElementById(listName);
		list.size = content.length;

		document.getElementById(addButtonName).addEventListener("click", function() {
			addItem(list, selector);
		}, true);

		document.getElementById(removeButtonName).addEventListener("click", function() {
			deleteSelectedItemsFromList(list);
		}, true);
	};

	getDeviceList = function() {
		log("getDeviceList...");
		getDatabaseData('/getTableContent?target=Device', function(response) {
			populateList("deviceList", "deviceSelector", "AddButton", "DeleteButton", response, false);
			log("getDeviceList is finished!");
		});
	};

	getTestList = function() {
		log("getTestList...");
		getDatabaseData('/getTableContent?target=Test', function(response) {
			populateList("selectTestList", "testSelector", "AddButtonTest", "DeleteButtonTest", response, true);
			document.getElementById("testSelector").selectedIndex = 0;
			log("getTestList is finished!");
		});
	};

	updateList = function(listName, filterName) {
		var i, j, selector = document.getElementById(listName), searchPatterns = document.getElementById(filterName).value.split(" "), mustBeHide;
		cleanArray(searchPatterns, "");
		for ( i = 0; i < selector.length; i++) {
			mustBeHide = false;
			if ((selector[i] !== undefined)) {
				for ( j = 0; j < searchPatterns.length; j++) {
					if(!selector[i].text.split(" ").some(testIfTheKeyMatchAnArrayElt, searchPatterns[j].toUpperCase())) {
						mustBeHide = true;
					}
				}
			}

			if(mustBeHide) {
				document.getElementById(selector[i].value).style.display = "none";
			} else {
				document.getElementById(selector[i].value).style.display = "block";
			}
		}
	};

	resetDrawAndTable = function() {
		var key;
		for (key in chartObjects) {
			if (chartObjects[key]) {
				log("Reset: " + key);
				chartObjects[key].clearChart();
			}
		}

		for (key in tables) {
			if (tables[key]) {
				log("Reset: " + key);
				tables[key].clearChart();
			}
		}

		for (key in datasObj) {
			datasObj[key] = {};
		}

		for (key in viewObj) {
			viewObj[key] = {};
		}

		document.getElementById("resChartsAndTables").innerHTML = "";
	};

	// Get and save the results for the selected tests & devices
	populateTestResults = function() {
		var res = false, i, j, k, found, l, addIfNotPresent, device, deviceName, pdfTtitle = "Performance results for ", deviceTitle = "<ul class='ulTitle'>", selectedDevice = document.getElementById("deviceList").options, selectedTests = document.getElementById("selectTestList").options;
		results = {};
		deviceSelected = [];
		collectingResult = true;

		// Function to manage duplications tests results
		addIfNotPresent = function(elt, array) {
			// Elt: {device1:obj, test1: obj, value1bis: obj}
			// Array: [{device1:obj, test1: obj, value1: obj}, {device2:obj, test1: obj, value2: obj}]
			found = false;
			for ( l = 0; l < array.length; l++) {
				if (elt.device.fullName === array[l].device.fullName && elt.test.name === array[l].test.name) {
					found = true;
				}
			}
			if (!found) {
				array.push(elt);
			}
		};

		if (selectedDevice.length === 0) {
			alert("You have to add at least one Device!");
		} else if (selectedTests.length === 0) {
			alert("You have to add at least one Test!");
		} else {
			// Get the selected Device list
			res = true;
			for ( i = 0; i < selectedDevice.length; i++) {
				deviceSelected[i] = {
					"id" : selectedDevice[i].value,
					"text" : selectedDevice[i].text
				};
				deviceTitle += "<li class='liTitle'>" + selectedDevice[i].text + "</li>";
			}

			// Add a div for the print step, not visible by default
			document.getElementById("title").innerHTML = "<div id='title' class='test'><table vertical-align='middle' align='center' cellspacing='0' cellpadding='0' style='height:100%; width:60%; text-align:center;'>" + "<tr align='center'>" + "	<td align='center'>" + pdfTtitle + deviceTitle + "</ul>" + "</td></tr></table></div>";

			nbResultsExpected = selectedTests.length;
			nbResultsFinished = 0;

			// For each selected test, get results and keep only them where the Devices is in the devices selected list
			for ( i = 0; i < selectedTests.length; i++) {
				getDatabaseData('/getResults?target=' + selectedTests[i].value, function(response) {
					for ( j = 0; j < response.length; j++) {
						device = response[j]["device"];
						if (device && device !== null) {
							deviceName = device["middleware"] + " " + device["model"] + " " + device["middlewareVersion"].split("-").join(" ").split(".").join(" ");
							response[j]["device"]["displayName"] = deviceName;
							deviceName = device["middleware"] + " " + device["middlewareVersion"] + " " + device["model"];
							deviceName = deviceName.replace(/\s+/g, " ");
							response[j]["device"]["fullName"] = deviceName;
							for ( k = 0; k < deviceSelected.length; k++) {
								if (deviceName === deviceSelected[k]["text"]) {
									if (deviceColors[deviceName] === undefined) {
										deviceColors[deviceName] = colors[indColor];
										indColor = (indColor + 1) % colors.length;
									}
									// {"OrangeMark": [resDevice1, resDevice2], "OtherTest" : [resDevice1, resDevice2]}
									if (results[response[j].test.name] === undefined) {
										results[response[j].test.name] = [];
									}
									addIfNotPresent(response[j], results[response[j].test.name]);
									//results[response[j].test.name][results[response[j].test.name].length] = response[j];
								}
							}
						}
					}
					nbResultsFinished++;
				});
			}
		}
		return res;
	};

	// Return the HTML "template" where test result will be added into
	createResDiv = function(baseId) {
		var res = document.createElement('div'), tab, tr, td, div;
		res.id = baseId;
		res.className = "test";
		tab = document.createElement('table');
		tab["vertical-align"] = "middle";
		tab["align"] = "center";
		tab["cellspacing"] = "0";
		tab["cellpadding"] = "0";
		tab.style.height = "auto";
		tab.style.width = "100%";
		tab.style["text-align"] = "center";
		tr = document.createElement('tr');
		tr["align"] = "center";
		td = document.createElement('td');
		td["align"] = "center";
		div = document.createElement('div');
		div.id = "chart_div_" + baseId;
		div.className = "testLeft";
		td.appendChild(div);
		tr.appendChild(td);
		td = document.createElement('td');
		td["align"] = "center";
		div = document.createElement('div');
		div.id = "table_sort_div_" + baseId;
		div.className = "testRight";
		td.appendChild(div);
		tr.appendChild(td);
		tab.appendChild(tr);
		res.appendChild(tab);
		return res;
	};

	// This function return options for all charts visualizations
	getChartDefaultOptions = function(mainTitle, horizontalTitle, verticalTitle, colorsArray) {
		return {
			title : mainTitle,
			width : 900,
			height : 800,
			hAxis : {
				title : horizontalTitle,
			},
			vAxis : {
				title : verticalTitle
			},
			legend : {
				position : 'top',
				alignment: 'start',
				maxLines: 50,
				textStyle: {fontSize: 10},
			},
			chartArea : {
				left : "15%",
				width : "75%"
			},
			colors : colorsArray
		};
	};

	// This function return options for all tables visualizations
	getTableDefaultOptions = function() {
		return {
			//height : 800,
			allowHtml : true,
			sort : 'enable'
			//page: "enable",
			// pageSize: 10,
		};
	};

	// We separate tests results where there are too many inputs in several charts/tables, to keep only a part of the results we use this function
	keepResultsFromInterval = function(begin, end, datas) {
		var i, j = 1, res = [], value = [];
		// Datas format: [ ["xOriginName", "DeviceName1", "DeviceName2", "deviceNameN"] ["Test1Name", Res1Device1, Res1Device2, Res1DeviceN] ["Test2Name", Res2Device1, Res2Device2, Res2DeviceN] ["TestNName", ResNDevice1, ResNdevice2, ResNDeviceN] ]
		// Res format: [ ["xOriginName", "DeviceName1", "DeviceName2", "DeviceNameN"] ["TestBeginName", ResBeginDevice1, ResBeginDevice2, ResBeginDeviceN] ["TestEndName", ResEndDevice1, ResEndDevice2, ResEndDeviceN] ]
		res[0] = datas[0];
		for ( i = begin; i <= end; i++) {
			res[j] = datas[i];
			j++;
		}
		return res;
	};

	drawChartAndTable = function(resultArray, baseTestName, title, hTitle, vTitle) {
		var i, j, colorsArray = [], chartTitle, key, datas = [], curDatas = [], maxItemsByPage = 10, nbResults = 0, nbPages = 0, curPage = 0, beginInd = 0, endInd, nbResultsByPage;
		// Split result display if there are too many results/tests.

		// Input resultArray: [ {device1:obj, test: "Score tests", value: obj}, {device2:obj, test: "Score tests", value: obj}, {device3:obj, test: "Score tests", value: obj}]
		// Datas for visualization should follow this template:
		// [ ["xOriginName", "DeviceName1", "DeviceName2", "DeviceNameN"] ["Test1Name", Res1Device1, Res1Device2, Res1DeviceN] ["TestNName", ResNDevice1, ResNDevice2, ResNDeviceN] ]

		datas[0] = [];
		datas[0][0] = "Test";
		// For each Device
		for ( i = 0; i < resultArray.length; i++) {
			datas[0][i + 1] = resultArray[i].device.displayName;
			colorsArray[i] = deviceColors[resultArray[i].device.fullName];
			j = 1;
			// For each test result
			for (key in resultArray[i].value) {
				if (!datas[j]) {
					datas[j] = [];
				}
				datas[j][0] = key.split("/").join(" ");
				datas[j][i + 1] = parseFloat(parseFloat(resultArray[i].value[key]).toPrecision(3));
				j++;
			}
		}

		nbResults = datas.length - 1;
		nbPages = Math.ceil(nbResults / maxItemsByPage);
		nbPages = (nbPages < 1) ? 1 : nbPages;
		// We distribute results into pages with homogeneity
		nbResultsByPage = Math.ceil(nbResults / nbPages);

		while (curPage !== nbPages) {
			// Bug: https://groups.google.com/forum/#!searchin/google-visualization-api/table$20sort$20problem/google-visualization-api/Lcw9usBxXGQ/WVAH9B3zThwJ don't use innerHTML
			document.getElementById("resChartsAndTables").appendChild(createResDiv(baseTestName + curPage));
			curDatas = datas;
			endInd = ((beginInd + nbResultsByPage) > nbResults) ? nbResults : beginInd + nbResultsByPage;
			if (nbPages > 1) {
				curDatas = keepResultsFromInterval(beginInd + 1, endInd, datas);
			}
			// Draw chart
			datasObj[baseTestName + curPage] = google.visualization.arrayToDataTable(curDatas);
			chartTitle = title + ((nbPages > 1) ? " " + (curPage + 1) + "/" + nbPages : "");
			chartObjects["chartObject_" + baseTestName + curPage] = new google.visualization.ColumnChart(document.getElementById("chart_div_" + baseTestName + curPage));
			chartObjects["chartObject_" + baseTestName + curPage].draw(datasObj[baseTestName + curPage], getChartDefaultOptions(chartTitle, hTitle, vTitle, colorsArray));

			// Draw table
			datasObj[baseTestName + curPage].setProperty(0, 0, 'style', 'width:400px');
			for(i = 1; i < datasObj[baseTestName + curPage].getNumberOfColumns(); i++) {
				datasObj[baseTestName + curPage].setProperty(0, i, 'style', 'width:10px');
			}
			viewObj[baseTestName + curPage] = new google.visualization.DataView(datasObj[baseTestName + curPage]);
			tables["myTable_" + baseTestName + curPage] = new google.visualization.Table(document.getElementById("table_sort_div_" + baseTestName + curPage));
			tables["myTable_" + baseTestName + curPage].draw(viewObj[baseTestName + curPage], getTableDefaultOptions());

			google.visualization.events.addListener(tables["myTable_" + baseTestName + curPage], "sort", (function(baseTestName_, curPage_, chartTitle_, hTitle_, vTitle_, colorsArray_) {
				// For closure purpose
				return function(event) {
					datasObj[baseTestName_ + curPage_].sort([{
						column : event.column,
						desc : !event.ascending
					}]);
					chartObjects["chartObject_" + baseTestName_ + curPage_].draw(datasObj[baseTestName_ + curPage_], getChartDefaultOptions(chartTitle_, hTitle_, vTitle_, colorsArray_));
				};
			})(baseTestName, curPage, chartTitle, hTitle, vTitle, colorsArray));

			curPage++;
			beginInd = endInd;
		}
	};
	
	// Results aren't necesseraly in the same order, i.e:
	// 	[
	//		{device: 39, test: speedo, v: 10.2},
	//		{device: 38, test: speedo, v: 10.1}
	//	] 
	//	[
	//		{device: 38, test: svg, v: 17.2},
	//		{device: 39, test: svg, v: 11.1}
	//	]
	sortTestResultByDeviceName = function (res1, res2) {
		if (res1.device.fullName < res2.device.fullName) {
 			return -1;
 		}
		if (res1.device.fullName > res2.device.fullName) {
			return 1;
		}
		return 0;
	};

	joinMultipleResults = function(item) {
		// Input: [ [{device1:obj, test1: obj, value1-1: obj}, {device2:obj, test1: obj, value1-2: obj}] [{device1:obj, test2: obj, value2-1: obj}, {device2:obj, test2: obj, value2-2: obj}, {device3:obj, test2: obj, value2-3: obj}] ]
		// Output: [ {device1:obj, test: "Score tests", value1-1+2-1: obj}, {device2:obj, test: "Score tests", value1-2+2-2: obj}, {device3:obj, test: "Score tests", valuefakeValue+2-3: obj}]
		var res = [], i, j, k, l, tmp = {}, value = {}, key, maxInd = 0, baseValue = {}, nbDevice = 0, devices = [], initValueObject, transformObjToValue, obj, stubbTests;

		initValueObject = function(base) {
			var obj = {};
			for (key in base) {
				obj[key] = base[key];
			}
			return obj;
		};

		transformObjToValue = function(obj, prefix, array, isInit) {
			for (k in obj) {
				if ( typeof obj[k] !== "object") {
					array[prefix + " - " + k] = (isInit) ? 0 : obj[k];
				} else {
					transformObjToValue(obj[k], prefix + " - " + k, array, isInit);
				}
			}
		};

		stubbTests = function(ind) {
			var found = false, indF = -1;
			k = item[ind].length;
			// For each available Device
			for ( l = 0; l < nbDevice; l++) {
				// For each Device of this test
				for ( j = 0; j < item[ind].length; j++) {
					if (item[ind][j].device.fullName === devices[l].fullName) {
						found = true;
						break;
					}
				}
				// This Device is missing
				if (!found) {
					tmp = {};
					log("Can't find result for: " + devices[l].fullName + " and test: " + item[ind][0].test.name);
					tmp.device = devices[l];
					tmp.test = item[ind][0].test;
					tmp.value = {};
					item[ind].splice(l, 0, tmp);
				}
				found = false;
			}
		};

		// Look at the input example, sometimes there isn't results for a specific Device, in that cas we need to know how many Device have results
		// For each test
		for ( i = 0; i < item.length; i++) {
			if (item[i].length > nbDevice) {
				maxInd = i;
				nbDevice = item[i].length;
			}
			// Get a stubbed representation of values for Device that haven't result
			for (key in item[i][0].value) {
				if ( typeof item[i][0].value[key] !== "object") {
					baseValue["[" + item[i][0].test.name + "]" + key] = 0;
				} else {
					transformObjToValue(item[i][0].value[key], "[" + item[i][0].test.name + "] - " + key, baseValue, true);
				}
			}
		}

		// Save all devices
		for ( i = 0; i < item[maxInd].length; i++) {
			devices[i] = item[maxInd][i].device;
		}
		// Stub test where there isn't all test results
		// For each test
		for ( i = 0; i < item.length; i++) {
			stubbTests(i);
		}

		//For each device
		for ( i = 0; i < nbDevice; i++) {
			res[i] = {
				device : item[maxInd][i].device,
				test : item[maxInd][i].test
			};

			value = initValueObject(baseValue);
			// For each test
			for ( j = 0; j < item.length; j++) {
				if (item[j][i]) {
					for (key in item[j][i].value) {
						if ( typeof item[j][i].value[key] !== "object") {
							value["[" + item[j][i].test.name + "]" + key] = item[j][i].value[key];
						} else {
							transformObjToValue(item[j][i].value[key], "[" + item[j][i].test.name + "] - " + key, value);
						}
					}
				}
			}
			res[i].value = initValueObject(value);
		}
		return res;
	};

	updateChart = function() {
		// These arrays are used to detect tests which should be in a specific results part (scores, durations, passed)
		var scoreTestsNames = ["score", "mark", "octane", "ecma", "speedo"], timeTestsNames = ["duration", "sunspider", "kraken"], passedTestsNames = ["video", "storage", "web socket"], j, key, scoreTests = [], timeTests = [], passedTests = [], fpsTests = [];

		// Display the loader div in front of the page during the processing
		document.getElementById("loader").style.display = "block";
		if (!collectingResult) {
			resetDrawAndTable();
			document.getElementById("printToPDF").style.display = "none";
			if (!populateTestResults()) {
				collectingResult = false;
				document.getElementById("loader").style.display = "none";
				return;
			}
		}

		// Requests for results are async, thus waiting until all data have been received.
		if (nbResultsExpected !== nbResultsFinished) {
			setTimeout(updateChart, 100, false);
			return;
		} else {
			collectingResult = false;
			log("All results received: ");
			log(results);
		}

		for (key in results) {
			if (key.toUpperCase().indexOf("ORANGE") !== -1) {
				log("Draw orange score!");
				drawChartAndTable(results[key].sort(sortTestResultByDeviceName), "score_orange_", "Orange SCORE test results", "Test", "Score per Device");
			} else if (key.toUpperCase().indexOf("JET") !== -1) {
				log("Draw JetStream score!");
				drawChartAndTable(results[key].sort(sortTestResultByDeviceName), "score_jetstream_", "JetStream SCORE test results", "Test", "Score per device");
			} else if (key.toUpperCase().indexOf("LAYOUT") !== -1) {
				log("Draw layout passed!");
				drawChartAndTable(results[key].sort(sortTestResultByDeviceName), "score_layout_", "Video layout SCORE test results", "Test", "Passed per Device");
			} else if (timeTestsNames.some(testIfArrayContainsTheKey, key.toUpperCase())) {
				log("Add a timed test: " + key.toUpperCase());
				timeTests.push(results[key].sort(sortTestResultByDeviceName));
			} else if (scoreTestsNames.some(testIfArrayContainsTheKey, key.toUpperCase())) {
				log("Add a scored test: " + key.toUpperCase());
				scoreTests.push(results[key].sort(sortTestResultBydeviceName));
			} else if (passedTestsNames.some(testIfArrayContainsTheKey, key.toUpperCase())) {
				log("Add a passed test: " + key.toUpperCase());
				passedTests.push(results[key].sort(sortTestResultByDeviceName));
			} else {
				log("Add a fps test: " + key.toUpperCase());
				fpsTests.push(results[key].sort(sortTestResultByDeviceName));
			}
		}

		if (scoreTests.length > 0) {
			log("Draw scored tests!");
			drawChartAndTable(joinMultipleResults(scoreTests), "score_tests_", "Scored tests results", "Test", "Score per Device");
		}

		if (timeTests.length > 0) {
			log("Draw timed tests!");
			drawChartAndTable(joinMultipleResults(timeTests), "time_tests_", "Timed tests results", "Test", "Time in ms per Device");
		}
		if (passedTests.length > 0) {
			log("Draw passed tests!");
			drawChartAndTable(joinMultipleResults(passedTests), "passed_tests_", "Passed tests results", "Test", "Nb passed per device");
		}
		if (fpsTests.length > 0) {
			log("Draw FPS tests!");
			drawChartAndTable(joinMultipleResults(fpsTests), "fps_tests_", "FPS tests results", "Test", "FPS per Device");
		}
		// Hide the loader div and display the print to pdf button
		document.getElementById("loader").style.display = "none";
		document.getElementById("printToPDF").style.display = "block";
	};

	launchPrint = function() {
		window.print();
	};

	that.init = function() {
		log("Init...");

		google.load('visualization', '1.0', {
			'packages' : ['table', 'corechart'],
			'callback' : function() {
				getDeviceList();
				getTestList();
				document.getElementById("showButton").addEventListener("click", updateChart, true);
				document.getElementById("printToPDF").addEventListener("click", launchPrint, true);
				document.getElementById("filterDevice").addEventListener("keyup", function() {updateList("deviceSelector", "filterDevice");}, true);
				document.getElementById("filterTest").addEventListener("keyup", function() {updateList("testSelector", "filterTest");}, true);
				$(function() {
					$("[title]").tooltip();
				});
				log("Init is finished!");
			}
		});

	};

	return that;
})();

window.addEventListener("load", TestsResults.init, true);

