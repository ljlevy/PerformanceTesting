var fs = require('fs');

MimeMap = {
    'txt': 'text/plain',
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'xml': 'application/xml',
    'json': 'application/json',
    'js': 'application/javascript',
    'gz': 'application/x-gzip',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
    'svg': 'image/svg+xml'
};

/*
 * Define the String startsWith function
 */
String.prototype.startsWith = function(str) {return (this.match("^"+str)==str);};


/*
This function is in charge of routing.
 Two cases for the path name :
- It is a handle property referencing a function : the processing is delegated to this function
- It is a file or directory : the path name is prefixed with the html folder and then processed
 */
function route(handle, pathname, query, response, request) 
{
   console.log('[route]\tStart the processing of the URL : ' + pathname + '.');
   if (query) 
   {
      console.log('\tAssociated query string : ', query);
   }
   if (typeof handle[pathname] === 'function') 
   {
      handle[pathname](response, request, query);
   } 
   else 
   {
      processPathname(request, response, pathname);
   }
}

/*
Allow to response with HTML or directory content
 */
function processPathname(request, response, pathname) 
{
      
    var initial_path = pathname; 
	
    if (pathname.startsWith('/Test')) 
    {
       pathname = '..' + pathname;
    }
    else
    {
	if (pathname[0] !== '/')
        {
	   pathname = '/' + pathname;
	}
	pathname = 'html' + pathname;
    }
    
    console.log(" pathname is "+pathname+" ");
    console.log('[processPathname] Processing ', pathname);
    
    fs.stat(pathname, function (err, stats) 
    {
        if (err) 
        {
           return sendMissing(request, response, pathname);
        }
        if (stats.isDirectory()) 
        {
            return sendDirectory(request, response, pathname);
        }
        return sendFile(request, response, pathname);
    });
}


/*
Proceed to directory listing.
Each directory entry found is suffixed with '/'.
 */
function sendDirectory(req, res, path) 
{
    fs.readdir(path, function (err, files) 
    {
        if (err) 
        {
            return sendError(req, res, error);
        }

        if (!files.length) 
        {
            return writeDirectoryIndex(req, res, path, []);
        }

        var remaining = files.length;
        files.forEach(function (fileName, index) 
        {
            fs.stat(path + '/' + fileName, function (err, stat) 
            {
                if (err)
                    return sendError(req, res, err);
                if (stat.isDirectory()) 
                {
                    files[index] = fileName + '/';
                }
                if (!(--remaining)) 
                {
                    return writeDirectoryIndex(req, res, path, files);
                }
            });
        });
    });
}


/*
Internal server error : HTTP 500 error code is sent
 */
function sendError(req, res, error) 
{
  res.writeHead(500, {
      'Content-Type': 'text/html'
  });
  
  res.write('<!doctype html>\n');
  res.write('<title>Internal Server Error</title>\n');
  res.write('<h1>Internal Server Error</h1>');
  res.write('<pre>' + escapeHtml(error) + '</pre>');
  res.end();
}


/*
Send a HTML file containing the list of the file names
 */
function writeDirectoryIndex(req, res, path, files) 
{
  var urlBase = (path[path.length - 1] === '/') ? "" : path.replace("../", "./") + '/';
  
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  
  if (req.method === 'HEAD') 
  {
     res.end();
     return;
  }
  
  res.write('<!doctype html>\n');
  res.write('<title>' + escapeHtml(path) + '</title>\n');
  res.write('<style>\n');
  res.write('  ol { list-style-type: none; font-size: 1.2em; } * {background-color:white;}\n');
  res.write('</style>\n');
  res.write('<h1>Directory: ' + escapeHtml(path) + '</h1>');
  res.write('<ol>');
  
  files.forEach(function(fileName) 
  {
      console.log("[writeDirectoryIndex] fileName: " + fileName + " urlBase: " + urlBase);
      if (fileName.charAt(0) !== '.') 
      {
         res.write('<li><a href="' + urlBase + 
         escapeHtml(fileName) + '">' +
         escapeHtml(fileName) + '</a></li>');
      }
  });
  
  res.write('</ol>');
  res.end();
}


/*
Return corresponding string value where special characters are converted into compliant HTML sequence
 */
function escapeHtml(value) 
{
    return value.toString().
    replace('<', '&lt;').
    replace('>', '&gt;').
    replace('"', '&quot;');
}


/*
The requested HTML file doesn't exists : HTTP 404 error sent.
 */
function sendMissing(req, res, path) 
{
   res.writeHead(404, {
      'Content-Type': 'text/html'
   });
   
   res.write('<!doctype html>\n');
   res.write('<title>404 Not Found</title>\n');
   res.write('<h1>Not Found</h1>');
   res.write(
     '<p>The requested URL ' +
     escapeHtml(path) +
     ' was not found on this server.</p>'
    );
  
  res.end();
}


/*
The requested HTML file is sent with the corresponding mime type
*/
function sendFile(req, res, path) 
{
   console.log('[sendFile]\tSend file : ' + path);
   var file = fs.createReadStream(path);
   res.writeHead(200, {
     'Content-Type': MimeMap[path.split('.').pop()] || 'text/plain'
   });
   
   if (req.method === 'HEAD') 
   {
      res.end();
   } 
   else 
   {
      file.on('data', res.write.bind(res));
      file.on('close', function() 
      {
         res.end();
      });
      
      file.on('error', function(error) 
      {
         sendError(req, res, error);
      });
   }
}

exports.route = route;
