var mongoose = require('mongoose');

function connect() 
{
    var ipAddr = getIPAddress();
    mongoose.connect('mongodb://'+ipAddr+'/test');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Database connection error:'));
    
    db.once('open', function callback() 
    {
        console.log('The database is now connected and opened on the IP address : '+ipAddr);
    });
}


/*
Allow to retrieve the external IP address for the server.
This IP address is used to connect the database
 */
function getIPAddress() 
{
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) 
    {
       var iface = interfaces[devName];

       for (var i = 0; i < iface.length; i++) 
       {
           var alias = iface[i];
           if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
       }
    }
    return '0.0.0.0';
}

exports.connect = connect;


