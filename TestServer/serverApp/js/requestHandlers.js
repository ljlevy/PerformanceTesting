

var DB_ENTRIES = '../DBEntries';
var mongoose = require('mongoose'),
device = require(DB_ENTRIES+'/Device'),
test = require(DB_ENTRIES+'/Test'),
fs = require('fs');

var ERROR_UNKNOWN = 'ERROR_UNKNOWN';
var NOT_FOUND = 'NOT_FOUND';
var DB_UNREACHABLE = 'DB_UNREACHABLE';
var DIR_UNREACHABLE = 'DIR_UNREACHABLE';

/*
Return the list of Device defined in the data base
 */
function getDevice(response) 
{
   device.model.find(null, function (err, result) 
   {
     if (err) 
     {
	console.log('[getDevice]\tError : ', err);
	queryResult(response, NOT_FOUND);
     } 
     else 
     {
	sendJSON(response, result);
     }
  });
}


var directory = '../apache/DIR_TO_DEFINE';
var increment = 0;
var htmlResult;

function getAppPortal(response, request, query) 
{
   console.log('[getAppPortal]\tEnterring');
   increment = 0;
   htmlResult =
     '<html>' +
     '<head>' +
     '<style>' +
     'a:focus { color: red; }' +
     '</style>' +
     '<script>' +
     'window.onload = function() {' +
     'var allLinks = document.querySelectorAll("a");' +
     'allLinks[0].focus();' +
     'selected = 0;' +
     'window.onkeydown = function(event) {' +
     'switch(event.keyCode) {'+
	  'case 38:' +
	       'if (selected > 0) {' +
	          'selected--;' +
	       '} else {' +
	          'selected = allLinks.length - 1;' +
	       '}' +
	       'allLinks[selected].focus();' +
	       'break;' +
	   'case 40:' +
		'if (selected < allLinks.length - 1) {' +
		    'selected++;' +
		 '} else {' +
		    'selected = 0;' +
		 '}' +
		 'document.querySelectorAll("a")[selected].focus();' +
		 'break;' +
	    '}' +
	   '};'+
	  '}' +
	 '</script>' +
	 '</head>' +
	 '<body>';
		  
	fs.readdir(directory, function(err, files) 
	{
	   if (err) 
	   {
		console.log(err);
		response.writeHead(500, {'Content-Type': 'text/plain'});
		response.write(err + '\n');
		response.end();
		 return;
	   }
	   var allFiles = files;
	   totalFiles = files.length;
	   for (var i = 0; i < files.length; i++) 
	   {
		createLinkToFile(i, files, response);
	   }
	  
	});
}


function createLinkToFile(i, folders, response) 
{
   fs.readdir(directory + '/' + folders[i], function(err, subFiles) 
   {
      for (var j = 0; j < subFiles.length; j++) 
      {
	 if (subFiles[j].indexOf('.html') > 0) 
	 {
	     htmlResult += '<a href="HTTP_SERVER_URL/DIR_TO_DEFINE/' + (folders[i] + '/' + subFiles[j])  + '">' + folders[i] + '/' + subFiles[j] + '</br>' + '</a>';
	 }
      }
	   
      increment++;
      console.log('increment = ', increment);
      
      if (increment == folders.length) 
      {
	  htmlResult +=
		 '</body>' +
		 '</html>';
		 response.writeHead(200, {'Content-Type': 'text/html'});
		 response.write(htmlResult);
		 response.end();
       }
   })
}


/*
Sleep simulation
TODO replace with library function
 */
function sleep(milliSeconds) 
{
   var startTime = new Date().getTime();
   while (new Date().getTime() < startTime + milliSeconds);
}


/*
 */
function charting(response, request, query) 
{
   routeToHTMLFile(response, 'html/Charting.html');
}


/*
Extract the results for a specific test
 */
function getTest(response, request, query) 
{
   test.model.find({identifier: query.target}, function (err, result) 
   {
      if (err) 
      {
	 console.log('[getTest]\tError : ', err);
	 queryResult(response, NOT_FOUND);
      } 
      else 
      {
	 sendJSON(response, result);
      }
  });
}


/*
 Get the test record from the test table with the requested identifier if it exists
 */
function getTestEntry(response, request, query) 
{
    console.log('[getTestEntry]\tid = ', query.target);
    test.model.find({_id: query.target}, function (err, result) 
    {
        if (err) 
        {
            console.log('[getTestEntry]\tError : ', err);
	    queryResult(response, NOT_FOUND);
        } 
        else 
        {
	   console.log('[getTestEntry]\t', result);
	   sendJSON(response, result);
	}
    });
}



/*
 Get the test record from the test table with the requested identifier if it exists
 */
function getDeviceEntry(response, request, query) 
{
   console.log('[getDeviceEntry]\tid = ', query.target);
   device.model.find({_id: query.target}, function (err, result) 
   {
      if (err) 
      {
	  console.log('[getTestEntry]\tError : ', err);
	  queryResult(response, NOT_FOUND);
      } 
      else 
      {
	  console.log('[getDeviceEntry]\t', result);
	  sendJSON(response, result);
      }
   });
}

/*
Extract all the results from the database
TODO use directly the schema result
 */
function getResults(response, request, query) 
{
    var id = query.target;
    var deviceId = query.targetDevice;
    getResultsForTest(response, id, deviceId, sendJSON);
}


function getSpecificResult(response, request, query) 
{
   var fieldValue = query.field;
   var testId = query.target;
   var deviceId = query.targetDevice;
   var operator = query.operator;
   var threshold = query.threshold;
	
   var innerFunction = function(response, dbResult) 
   {
	var finalResult;
	switch (operator) 
	{
	   case 'max':
		finalResult = max(dbResult, fieldValue);
	   break;
	   
	   case 'min':
		finalResult = min(dbResult, fieldValue);
	   break;
	   
	   case 'superior':
		finalResult = superior(dbResult, fieldValue, threshold);
	   break;
			
	   case 'inferior':
		finalResult = inferior(dbResult, fieldValue, threshold);
	   break;
	 }

	 sendJSON(response, finalResult);
	 
     };

     getResultsForTest(response, testId, deviceId, innerFunction);
}



function max(entries, field) 
{
   var result = [];
   var currentValue = undefined;
   var entry;
   for (index in entries) 
   {
	entry = entries[index];
	if (entry && entry.value) 
	{
	   if (currentValue == undefined || entry.value[field] > currentValue) 
	   {
		result = [];
		currentValue = entry.value[field];
		result.push(entry);
	   } 
	   else if (entry.value[field] == currentValue) 
	   {
	     result.push(entry);
	   }
	}
   }
   return result;
}


function min(entries, field) 
{
   var result = [];
   var currentValue = undefined;
   var entry;
   for (index in entries) 
   {
	entry = entries[index];
	if (entry && entry.value) 
	{
	   if (currentValue == undefined || entry.value[field] < currentValue) 
	   {
		result = [];
		currentValue = entry.value[field];
		result.push(entry);
	   } 
	   else if (entry.value[field] == currentValue) 
	   {
	      result.push(entry);
	   }
	}
   }
   return result;
}


function superior(entries, field, threshold) 
{
   var result =[];
   var entry;
   for (index in entries) 
   {
	entry = entries[index];
	if (entry && entry.value && entry.value[field] > threshold) 
	{
	   result.push(entry);
	}
   }
   return result;
}

function inferior(entries, field, threshold) 
{
   var result =[];
   var entry;
   for (index in entries) 
   {
      entry = entries[index];
      if (entry && entry.value && entry.value[field] < threshold) 
      {
	 result.push(entry);
      }
   }
   return result;
}


/**
 * errorCallback: takes response and err as an argument
 * callback: takes response and dbResults as arguments
 */
function getResultsForTest(response, testId, deviceId, callback) 
{
    try 
    {
	var searched = {};
		
	if (testId != undefined) 
	{
	   searched.test = testId;
	}
	if (deviceId != undefined) 
	{
	   searched.device = deviceId;
	}
		
	console.log('[getResultsForTest] Searching: ', searched);

        var dbQuery = require(DB_ENTRIES + '/Result').model.find(searched).populate('device').populate('test');
		
	dbQuery.lean().exec(function(err, dbResults) 
	{
	   dbResults = dbResults.filter(function(result) 
	   {
		return (result.test !== null);
	   });

	   if (err) 
	   {
		throw err;
	   } 
	   else 
	   {
	      for (var i = 0; i < dbResults.length; i++) 
	      {
		  delete dbResults[i]._id;
		  delete dbResults[i].__v;
		  
		  if (dbResults[i].device) 
		  {
		     delete dbResults[i].device._id;
		     delete dbResults[i].device.__v;
		  }
		  
		  if (dbResults[i].test) 
		  {
			delete dbResults[i].test._id;
			delete dbResults[i].test.__v;
		  }
	      }
	      console.log('[getResults]\tResults treated: ', dbResults);
	      callback(response, dbResults);
	    }		
       });
   } 
   catch (err) 
   {
	console.log(err);
	queryResult(response, ERROR_UNKNOWN);
   }
}


/*
 Allow to save a test result.
 This result shall concern an already registered device platform (model and software informations) 
 and this device is identified with its unique identifier
 The result are always stored in the same table "result".
 */
function registerResult(response, request, query) 
{
	
   executeWhenRequestEnded(request, function(datas) 
   {
      console.log('[registerResult] datas: ', datas);
      var jsonDatas = JSON.parse(datas);
      var searchedDevice = jsonDatas.device; // Device identifier
      var concernedTest = jsonDatas.test;
      delete jsonDatas.test;
      delete jsonDatas.device;
        
      var errorCallback = function() 
      {
	 queryResult(response, ERROR_UNKNOWN);
      };
		
      var testCallback = function() 
      {
         var testQuery = test.model.find(concernedTest);
			
	 testQuery.exec(function (err, testEntries) 
	 {
	    console.log(jsonDatas);
	    var testId = testEntries[0]._id;
	    var deviceCallback = function() 
	    {
	       var addCallback = function(err, deviceEntries) 
	       {
	          try 
	          {
		     console.log('[registerResult] deviceEntries: ', deviceEntries);
		     var newModel = new require(DB_ENTRIES + '/Result').model(jsonDatas); // TODO : why the require is done here?
		     newModel.test = testId;
		     newModel.device = deviceEntries[0]._id;
		     newModel.save(function (err) 
		     {
		        if (err) 
		        {
			   throw err;
		        }
		        console.log('[registerResult]\tSaved ! (in Result collection)');
		     });
		  
		     queryResult(response);
	          } 
	          catch (err) 
	          {
		     console.log('[registerResult] ', err);
		     queryResult(response, DB_UNREACHABLE);
	          }
	        };
	
	        if (typeof searchedDevice._id !== 'undefined') 
	        {
		    console.log('[registerResult] Searching from an id: ', searchedDevice._id);
		    device.model.find({_id: searchedDevice._id}, addCallback);					
	        } 
	        else 
	        {
		   var deviceQuery = device.model.find(searchedDevice);
		   deviceQuery.exec(addCallback);
	        }
	     };
	     registerIfNotExists(JSON.stringify(searchedDevice), device.model, deviceCallback, errorCallback);
	   });
        };
		
        registerIfNotExists(JSON.stringify(concernedTest), test.model, testCallback, errorCallback);
    });
}


/*
 Add a Device entry in the database if not yet defined
*/
function registerDevice(response, request) 
{
    var callback = function (datas)
    {
	queryResult(response);
    };
    
    var errorCallback = function() 
    {
	queryResult(response, ERROR_UNKNOWN);
    };
    
    executeWhenRequestEnded(request, function() {
        registerIfNotExists(datas, device.model, callback, errorCallback);
      });
}

/*
 Add a test entry in the database if not yet defined
 */
function registerTest(response, request, query) 
{
    var callback = function(datas) 
    {
	queryResult(response);
    };
    
    var errorCallback = function() 
    {
	queryResult(response, ERROR_UNKNOWN);
    };
    
    executeWhenRequestEnded(request, function() {
         registerIfNotExists(datas, test.model);
	});
}



/*
  Get description of a device from data base:
   - middlewareVersion
   - middleware
   - macAddress
   - model
   
*/
function whoAmI(response, request, query) 
{
   var wantedDevice = {};
   if (typeof query.middlewareVersion !== 'undefined') 
   {
      wantedDevice.middlewareVersion = query.middlewareVersion;
   }

   if (typeof query.middleware !== 'undefined') 
   {
      wantedDevice.middleware = query.middleware;
   }

   if (typeof query.macAddress !== 'undefined') 
   {
      wantedDevice.macAddress = query.macAddress;
   }

   if (typeof query.macAddress !== 'undefined') 
   {
      wantedDevice.model = query.model;
   }
   
   var query = device.model.find(wantedDevice);
	
   query.exec(function(err, testEntries) 
   {
      if (err) 
      {
         console.log(err);
         queryResult(response, ERROR_UNKNOWN);	
      } 
      else 
      {
         sendJSON(response, testEntries);
      }
   });
}


/*
Allow to add a record in a table
 */
function add(response, request, query) 
{
  console.log('[add]\tProcessing ADD, query = ', query);
  var callback = function() 
  {
     queryResult(response);
  };
  var errorCallback = function() 
  {
     queryResult(response, ERROR_UNKNOWN);
  };
  
  executeWhenRequestEnded(request, function(datas) {
    var datatable = require(DB_ENTRIES+'/' + query.target);
    registerIfNotExists(datas, datatable.model, callback, errorCallback);
  });
}


/*
Allow to remove one table record or to clear the table.
The related record is removed when an identifier is specified
 */
 
function remove(response, request, query) 
{
  var callback = function(datas) 
  {
    var errorCode = undefined;
    console.log(query.target);
    var database = require(DB_ENTRIES+'/' + query.target);
    
    if (query.id) 
    {
        database.model.remove({_id: query.id}, function(err) {
        logResult(err,query.id,query.target);
      });
    } 
    else 
    {
       database.model.find().exec(function(err, result) {
       if (err) 
       {
          console.log(err);
	  errorCode = DB_UNREACHABLE;
       } 
       else        	
       {
          for (var i = 0; i < result.length; i++) 
          {
              database.model.remove(result[i], function(err) 
              {
                 logResult(err,result[i],query.target);
              });
          }
        }
      });
    }
    queryResult(response, errorCode); // TODO : best routing after a removal (+ see what happens in case of an error)
  };
  executeWhenRequestEnded(request, callback);
}


/*
Debug trace
 */
function logResult(err,id,target) 
{
    if (err) 
    {
       console.log('\t\tRemoval error: ', err, ' for ', id, ' in ', target);
    } 
    else 
    {
       console.log('\t\tRemoval succeeded for ', id, ' in ', target);
    }
}


/*
Allow to retrieve all the defined schemas
 */
function getTables(response) 
{
  fs.readdir('serverApp/DBEntries', function(err, result) 
  {
    if (err) 
    {
	console.log('[getTables]\t ', err);
	queryResult(response, DIR_UNREACHABLE);
    } 
    else 
    {
	for (var i = 0; i < result.length; i++) 
	{
	   result[i] = result[i].split('.')[0];
	}
        sendJSON(response, result);
    }
  });
}


/*
Allow to retrieve the whole content of a specific database table
The returned table content contains the following structure :
- keys : array of the field names defined in target schema
- content : array of the table records
 */
 
function getTableContent(response, request, query) 
{
  var target = require(DB_ENTRIES+'/' + query.target);
  var model = target.model;
  var schema = target.schema;
  var query = model.find();
  var tableContent = {keys: []};
  
  console.log(" ### DB_ENTRIES: "+DB_ENTRIES+", query.target: "+query.target+" ");
  for (var key in schema.paths) 
  {
     tableContent.keys.push(key);
  }
  query.exec(function(err, results) 
  {
     if (err) 
     {
        console.log('[getTableContent]\t ', err);
        queryResult(response, DB_UNREACHABLE);
     } 
     else 
     {
        tableContent.content = results;
        sendJSON(response, tableContent);
        console.log(" #### ljl response:"+response+", tableContent: "+tableContent+" ");
     }
  });
}



/*
Allow to answer the request with a JSON content
 */
function sendJSON(response, toStringify) 
{
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write(JSON.stringify(toStringify));
  response.end();
}


/*
The JSON data are stored in the database if not yet existing
 */
function registerIfNotExists(datas, model, callback, errorCallback) 
{
  console.log('[registerIfNotExists]\tRegister ', datas, ' in model ', model.name);
  
  try 
  {
     var query = model.find(JSON.parse(datas));
     query.exec(function (err, results) 
     {
        if (results.length === 0) 
        {
	    var newModel = new model(JSON.parse(datas));
	    newModel.save(function(err) 
	    {
		if (err) 
		{
		   throw err;
	        }
		console.log('[registerIfNotExists]\tElement saved in the database.');
		if (callback) 
		{
		   callback();
		}
	    });
	    
	 } 
	 else 
	 {
	    console.log('[registerIfNotExists]\tThe element already exists in the database.');
	    if (callback) 
	    {
		callback();
	    }
	 }
     });
   } 
   catch (err) 
   {
     console.log(err);
     errorCallback();
   }
}


/*
Send a HTML file
 */
function routeToHTMLFile(response, fileName) 
{
  console.log('[routeToHTMLFile]\tThe handler to send a HTML file is called.');
  fs.readFile(fileName, function(error, file) 
  {
     if (error) 
     {
       response.writeHead(500, {'Content-Type': 'text/plain'});
       response.write(error + '\n');
       response.end();
     } 
     else 
     {
       response.writeHead(200, {'Content-Type': 'text/html'});
       response.write(file);
       response.end();
     }
  });
}



function queryResult(response, errorCode) 
{
   var success = (typeof errorCode === 'undefined');
   var result = {
		  success: success
	        };
   if (!success) 
   {
      result.error = errorCode;
   }
   sendJSON(response, result);
}



/*
 This function is in charge to concatenate the data chunks received and to call
 the callback function with it.
 */
function executeWhenRequestEnded(request, aFunction) {
  var postData = '';
  request.addListener('data', function(postDataChunk) {
    postData += postDataChunk;
  });
  request.addListener('end', function() {
    aFunction(postData);
  });
}

exports.registerTest = registerTest;
exports.registerDevice = registerDevice;
exports.getDevice = getDevice;
exports.getResults = getResults;
exports.getTest = getTest;
exports.registerResult = registerResult;
exports.charting = charting;
exports.getTables = getTables;
exports.getTableContent = getTableContent;
exports.remove = remove;
exports.add = add;
exports.getTestEntry = getTestEntry;
exports.getDeviceEntry = getDeviceEntry;
exports.getAppPortal = getAppPortal;
exports.getSpecificResult = getSpecificResult;
exports.whoAmI = whoAmI;
