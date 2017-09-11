
/**
   Mongo DB Data Base Manager. 
   
   Variable "dataBaseUrlWithProxy"  should be set with correct value: "http://DB_URL_TO_DEFINE:DB_PORT"
   For instance : dataBaseUrlWithProxy = "http://nuxcmcwkit.com:8899"
*/

var DataBaseManager = (function() {
	var that = {}, dataTable, dataBaseUrlWithProxy = "http://DB_URL_TO_DEFINE:DB_PORT", dataBaseUrl = "http://" + location.hostname + ":" + location.port, useProxyForReq = false, debug = true,
	
	// Global variables:
	saveTable, isLoaded = false, tests = {}, Devices = {}, nbEltToDelete = 0, nbEltDeleted = 0,
	// Functions:
	log, getDatabaseData, displayButtons, displayDatabase, processData, getTestsAndDevices, startLoading, endLoading;

	log = function(msg) {
		if (debug) {
			console.log(msg);
		}
	};

	startLoading = function() {
		document.getElementById("loader").style.display = "block";
	};

	endLoading = function() {
		document.getElementById("loader").style.display = "none";
	};

	getDatabaseData = function(req, callback) {
		if (useProxyForReq) {
			$.ajax({
				url : './proxy.php?req=' + encodeURIComponent(dataBaseUrlWithProxy + req),
				dataType : 'json'
			}).done(callback);
		} else {
			$.ajax({
				url : '' + dataBaseUrl + req,
				dataType : 'json'
			}).done(callback);
		}
	};

	getTestsAndDevices = function() {
		startLoading();
		getDatabaseData("/getTableContent?target=Device", function(response) {
			var i;
			log("Device: ");
			log(response);
			for ( i = 0; i < response.content.length; i++) {
				Devices[response.content[i]._id] = response.content[i];
			}
			getDatabaseData("/getTableContent?target=Test", function(response) {
				var i;
				log("Test: ");
				log(response);
				for ( i = 0; i < response.content.length; i++) {
					tests[response.content[i]._id] = response.content[i];
				}
				isLoaded = true;
				endLoading();
			});
		});
	};

	createTableTemplate = function(keys) {
		var i, prev = document.getElementById("tab"), table = document.createElement("table"), thead = document.createElement("thead"), tfoot = document.createElement("tfoot"), trh, trf, th, value, delButton;
		table.id = "tableRes";
		table.className = "display";
		table.style.width = "100%";
		table.style.cellspacing = 0;
		trh = document.createElement('tr');
		trf = document.createElement('tr');
		for ( i = 0; i < keys.length; i++) {
			th = document.createElement('th');
			value = document.createTextNode(keys[i]);
			th.appendChild(value);
			trh.appendChild(th);
			th = document.createElement('th');
			value = document.createTextNode(keys[i]);
			th.appendChild(value);
			trf.appendChild(th);
		}
		thead.appendChild(trh);
		tfoot.appendChild(trf);
		table.appendChild(thead);
		table.appendChild(tfoot);
		if (prev) {
			while (prev.hasChildNodes()) {
				prev.removeChild(prev.lastChild);
			}
		}
		delButton = document.createElement("input");
		delButton.id = "delRows";
		delButton.type = "button";
		delButton.value = "Delete selected row(s)";
		prev.appendChild(delButton);
		prev.appendChild(table);
	};

	processData = function(datas, type) {
		var i, j, res = [], sortInd = 0;
		if (!isLoaded) {
			setTimeout(function() {
				processData(datas, type);
			}, 100, false);
			return;
		}

		createTableTemplate(datas.keys);

		if (type !== "Result") {
			sortInd = (type === "Device") ? 0 : 0;
			for ( i = 0; i < datas.content.length; i++) {
				if (res[i] === undefined) {
					res[i] = [];
				}
				for ( j = 0; j < datas.keys.length; j++) {
					res[i][j] = ( typeof datas.content[i][datas.keys[j]] === "object") ? JSON.stringify(datas.content[i][datas.keys[j]]) : datas.content[i][datas.keys[j]];
				}
			}
		} else {
			sortInd = datas.keys.length - 2;
			for ( i = 0; i < datas.content.length; i++) {
				if (res[i] === undefined) {
					res[i] = [];
				}
				for ( j = 0; j < datas.keys.length; j++) {
					if (datas.keys[j] === "device") {
						if (Devices[datas.content[i][datas.keys[j]]] !== undefined) {
							res[i][j] = Devices[datas.content[i][datas.keys[j]]].middleware + " " + Devices[datas.content[i][datas.keys[j]]].middlewareVersion + " " + Devices[datas.content[i][datas.keys[j]]].model;
						} else {
							res[i][j] = datas.content[i][datas.keys[j]];
						}
					} else if (datas.keys[j] === "test") {
						if (tests[datas.content[i][datas.keys[j]]] !== undefined) {
							res[i][j] = tests[datas.content[i][datas.keys[j]]].name;
						} else {
							res[i][j] = datas.content[i][datas.keys[j]];
						}
					} else {
						res[i][j] = ( typeof datas.content[i][datas.keys[j]] === "object") ? JSON.stringify(datas.content[i][datas.keys[j]]) : datas.content[i][datas.keys[j]];
					}
				}
			}
		}

		if (dataTable) {
			dataTable.destroy();
		}

		dataTable = $('#tableRes').DataTable({
			data : res,
			"bProcessing" : true,
			"iDisplayLength" : 50,
			"order" : [[sortInd, "desc"]],
			"columnDefs" : [{
				"targets" : [datas.keys.length - 2],
				"visible" : false,
			}, {
				"targets" : [datas.keys.length - 1],
				"visible" : false
			}, {
				"width" : "40%",
				"targets" : 0
			}]
		});
		$('#tableRes tbody').on("click", "tr", function() {
			$(this).toggleClass('selected');
		});

		$('#delRows').click((function(type_) {
			// For closure purpose
			return function() {
				var rows = dataTable.rows('.selected').data(), i, testIdsToDelete = [];
				startLoading();
				nbEltToDelete = rows.length;
				nbEltDeleted = 0;
				for ( i = 0; i < rows.length; i++) {
					testIdsToDelete[i] = rows[i][rows[i].length - 2];
				}

				if (testIdsToDelete.length === 0) {
					alert("There isn't any item selected!");
					return;
				}

				if (confirm("Are you sure you want to delete seleced item" + ((testIdsToDelete.length > 1) ? "s" : "") + "?")) {
					for ( i = 0; i < testIdsToDelete.length; i++) {
						getDatabaseData("/remove?target=" + type_ + "&id=" + rows[i][rows[i].length - 2], function(response) {
							nbEltDeleted++;
							if (nbEltDeleted === nbEltToDelete) {
								dataTable.row('.selected').remove().draw(false);
							}
							endLoading();
						});
					}
				} else {
					endLoading();
				}
			};
		})(type));

		endLoading();
	};

	displayDatabase = function(type) {
		startLoading();
		getDatabaseData("/getTableContent?target=" + type, (function(type_) {
			// For closure purpose
			return function(response) {
				processData(response, type_);
			};
		})(type));
	};

	displayButtons = function(resp) {
		var i, button, contenair = document.getElementById("buttons");
		for ( i = 0; i < resp.length; i++) {
			button = document.createElement("input");
			button.id = "show_" + resp[i];
			button.type = "button";
			button.value = resp[i];
			button.style.backgroundColor = "rgb(255,255,204)";
			button.style.color = "blue";
			button.style.fontSize = "18px";
			button.addEventListener("click", (function(type_) {
				// For closure purpose
				return function(event) {
					displayDatabase(type_);
				};
			})(resp[i]));
			contenair.appendChild(button);
		}
	};

	that.init = function() {
		log("Init...");
		getDatabaseData("/getTables", function(response) {
			displayButtons(response);
			getTestsAndDevices();
			log("Init is finished!");
		});
	};

	return that;
})();

window.addEventListener("load", DataBaseManager.init, true);
