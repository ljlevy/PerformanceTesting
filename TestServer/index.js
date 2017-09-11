var server = require('./serverApp/js/server');
var router = require('./serverApp/js/router');
var requestHandlers = require('./serverApp/js/requestHandlers');



// Define the available handler functions
var handle = {};
handle['/registerTest'] = requestHandlers.registerTest;
handle['/registerDevice'] = requestHandlers.registerDevice;
handle['/getDevice'] = requestHandlers.getDevice;
handle['/getResults'] = requestHandlers.getResults;
handle['/getTest'] = requestHandlers.getTest;
handle['/getTables'] = requestHandlers.getTables;
handle['/getTableContent'] = requestHandlers.getTableContent;
handle['/remove'] = requestHandlers.remove;
handle['/registerResult'] = requestHandlers.registerResult;
handle['/charting'] = requestHandlers.charting;
handle['/add'] = requestHandlers.add;
handle['/getTestEntry'] = requestHandlers.getTestEntry;
handle['/getDeviceEntry'] = requestHandlers.getDeviceEntry;
handle['/AppPortal'] = requestHandlers.getAppPortal;
handle['/getSpecificResult'] = requestHandlers.getSpecificResult;
handle['/whoAmI'] = requestHandlers.whoAmI;

server.start(router.route, handle);
