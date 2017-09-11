var http = require('http');
var url = require('url');
var db = require('./db');

//var WebSocket = require('ws');

var SERVER_PORT = 8899;

var SERVER_VERSION = "0.1.1";

/*
 Node server start function
 */
function start(route, handle) 
{
    'use strict';
    function onRequest(request, response) 
    {
        var postData = '';
        var pathname = url.parse(request.url).pathname;
        var query = url.parse(request.url, true).query;
        request.setEncoding('utf8');
        console.log('[onRequest]\tRequest for the path name :  ', pathname, '.');
        route(handle, pathname, query, response, request);
    }

    // Option to display only the current version
    if (process.argv.length === 3) 
    {
        if (process.argv[2] === '-v' || process.argv[2] === '-V') 
        {
            console.log('[start]\tTest Server version : ' + SERVER_VERSION);
        }
        return;
    }
    // Request the database connection and launch the server
    db.connect();
    http.createServer(onRequest).listen(SERVER_PORT);
    console.log('**** Test Server version ',SERVER_VERSION ,' is started on port ', SERVER_PORT,' ****');
}

exports.start = start;
