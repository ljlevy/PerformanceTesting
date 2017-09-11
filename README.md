# PerformanceTesting
How to compare performances of different devices, middlewares and browsers ?


OVERVIEW:
--------

With the emergence of HTML5, new Web standards have emerged: 
CSS-3D, SVG, Web-GL, Canvas2D, Web Socket, Local Storage...

Customers for these new features have performance requirements, particularly with regard to navigation (fluidity of transitions between film thumbnails, change of dynamic appearance, ...).

The devices must be qualified according to their CPU and GPU (Open-GL / Web-GL) capacities and achieve correct performance (at least 25 fps - frames per second) in order to have smooth navigation.

There are a number of test benchmarks to qualify the performance of a browser and its compatibility with the HTML5 standard.

For example:
-  Ring Mark 
-  Threejs
-  JetStream
-  Smashcat
-  Craftymind

Theoretically, the publication of these tests on the Internet on specialized sites must be a criterion of reliability.
In practice, only the requestAnimationFrame () function returns a reliable and comparative value.
There is no website that quotes exhaustively a group of reference benchmarks. A state of the existing is necessary to detect the most relevant tests.

This tutorial provides a simple tool to control the DOM of HTML pages (click on a button, read a DIV ...) 
and publish the results in a database.

The tools available to be done:

• Selenium which includes the WebDriver API and makes it easy to write tests in Java

• Mongodb for the management of a simple database.

MongoDB is a NoSQL data storage system, SchemaLess. 
The advantage is that it is not necessary to do a SQL script to create and define the data structure that powers the database.
A user can easily add new data to this object later

Concerning the display of the results:
The difficulty is to find a simple tool to visualize the data of a database and be able to display them graphically.
The tools available to be done are:

• nodejs: provides the ability to run JavaScript on remote server outside the browser.

  It is a free and JavaScript-based software platform that contains an integrated HTTP server library,
  making it possible to run a web server without the need for external software such as Apache or Lighttpd.

• googlechart: Standard google API for viewing data.

In this tutorial you will learn how to install and launch the Test Server based on nodejs 
and mongo database and use the tool to populate the tests results using Java and WebdriverSelenium on a PC environment. 

This tutorial is also valid for an installation on a LINUX platform. You just need to respect the unix convention for the files paths. 

The GIT source repository contains following directories:

• TestPortal contains all information concerning performances tests passed on some devices, 
  to be able to compare performances according to software version (fps, time, score ...)
   
  It is available at: http://serverName:8899/TestPortal/testsResults.html

• TestServer is based on nodes architecture and allows to route and populate mongo database with tests results.

• TestSuite is a suite of HTML files based on JavaScript (fpsmeter.js ...) able to make some performance measurement (fps, write values in the DOM ...).

It allows for instance to get html test pages from external links or modify them locally to add some specificities (stats.js for fps ...)
 
• TestSelenium is a collection of JAVA class that allows to get information on some URL and send the results to the data base using json format.
   
It is based on eclipse browser, TestNg add-in and Junit.
It uses WEBDRIVER to take control of the device and populate the tests database using a test framework coded in JAVA.

Each Java class implements a specific test, that means going to a specific url (internally copied or external), managing some actions : clicking on a button, waiting for results, and extracting data and posting them using a JSON request  in the mongo data base.

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();  // Manage Webdriver setup

		System.out.println("TestVideoPaused.setUp()");

		wd.get(url);        // Go to a specific url

		WebDriverWait wait = new WebDriverWait(wd, 800);

		try 
		{	
        // Wait for a condition				                
       /* wait.until(ExpectedConditions.visibilityOfElementLocated
        (By.id("EndTest"))); */
			
		} 
		catch (Exception e1) 
		{
		    e1.printStackTrace();
		    TestCase.fail(e1.getMessage());
		}
   }


	@AfterClass
	public void afterClass() 
	{
		wd.quit(); // quit webdriver 
	}

	@Test
	public void testFPS() 
       {
		DButilities DB = new DButilities();

		DB.addTestCase("CSS3 Horizontal list",
				          "Check performances CSS3 horizontal list transitions",
				          "internal", 
				           url);
		
		org.json.JSONObject stbObj = DB.addSTB(DB.stbMW(), 
				                          DB.stbMVER(),
				                          DB.stbMODEL(), 
				                          DB.stbMAC());

		org.json.JSONObject obj = new org.json.JSONObject();
		try 
		{
			obj.put("average aud decoded x100", average_audio_decoded);
			obj.put("average vid decoded x100 ", average_video_decoded);
			obj.put("average frame decoded", average_frame_decoded);
			obj.put("average dropped frames", average_dropped_frames);

			DB.registerResult(DB.tc, stbObj, obj);
		}
		 
		catch (JSONException e) 
		{
			e.printStackTrace();
		}
	}

CONFIGURATION:
-------------

DATA BASE:
---------

A device is defined with following Shema in mongo data base: (See file : TestServer/serverApp/DBEntries/Device.js)

var deviceSchema = mongoose.Schema({

  middleware: String,
  
  middlewareVersion: String,
  
  model: String,
  
  macAddress: String
});





A test has followng Shema: (See file : TestServer/serverApp/DBEntries/Test.js)

var testSchema = mongoose.Schema({

  name: String,
  
  description: String,
  
  localisation: String,
  
  url: String
  
});


Although a test result is defined by: (See file : TestServer/serverApp/DBEntries/Results.js)

var testResultSchema = mongoose.Schema({

  value: mongoose.Schema.Types.Mixed,
  
  test: {type: mongoose.Schema.Types.ObjectId, ref: 'tests'},
  
  device: {type: mongoose.Schema.Types.ObjectId, ref: 'devices'}
  
});



• TestServer/index.js implements all available handler functions to interrogate database.

• TestServer/serverApp/js/server.js use following port : SERVER_PORT = 8899;

• TestServer/serverApp/js/requestHandlers.js implements all the requests to get or post data in database.


You have to update correct value of data base server: name + port  in following files:

  - TestPortal/testsResults.js
  - TestPortal/database.js
  
  For instance : dataBaseUrlWithProxy = "http://toto.com:8899"
  

JAVA Files:
---------- 

 - TestSelenium/Dbutilities.java

    // Constants to specify
    private final static String SERVER_URL="http://URL_TO_DEFINE"; // For instance: http://nuxcmcwkit.com
    
    private final static String PORT="XXXX"; // For instance: "8899"
    
    static String MAC = "MY_MAC_ADRESS"; // For instance: "3C:62:00:7B:47:02";
	
    static String MW = "MY_MIDDLEWARE";  // For instance: "Linux";
	
    static String MVER = "MY_VERSION";   // For instance: "stable-17.0-50.102";
	
    static String MODEL = "MY_MODEL";    // For instance: "bcm_7252";
	
    // end to specify 
	
   public static String DB_SERVER = SERVER_URL + PORT;

  and also configure the correct IP and proxy of your device where you will run the tests.
  
 - TestSelenium/DemoTest.java

  	/*  IP address of the device + port: 
	   *   -  Chromedriver is used with port 9515,
	   *   -  Webdriver is used with port: 9517 ...
	  */
	  static String URL = "http://xxx.xx.xxx.xx:port"; // For instance: "http://172.21.122.20:9515";

	  /* 
	   * Proxy address + port 
	   */
	  static final String PROXY = "http://xxxx:80";  //For instance: "http://proxy-toto.com:80";
    
    this can be also done in file config.xml


CONFIGURING SERVER:
-----------------
 
 Several steps must be followed to be able to run webdriver tests and populate the TestPortal data base.

STEP 1°) Mongo database and node database server must be running in serverName processes.

if not, at first time, you have to run your own server as follows:

0. The source repository of Test server is available in TestServer directory.
    Clone it.
    
1. Download node.js here: https://nodejs.org/download/ and install it, for instance, in D:\Program Files\nodejs. 

    Your system environment path variable will be updated automatically.

2. Download MongoDB here: https://www.mongodb.com/download-center#enterprise  

   Extract the ZIP into for instance D:\Program Files\mongodb.
     
3. Install the Mongoose.js API :
   a.	Start a command line console
   b.	Enter the command : npm install mongoose


4. Start the database engine MongoDB

     4.1. Start a command line console
  
     4.2. Go into the mongoDB installation folder: D:\Program Files\mongodb.
  
     4.3. Create a folder named data
  
     4.4. Go into the binary mongodb folder : D:\Program Files\mongodb\bin
  
     4.5. Launch the engine: mongod --dbpath ..\data
  
     4.6. When mongodb is started, you will have the following messages at the end :
  
   ....
   Wed Nov 20 14:18:55.767 [initandlisten] waiting for connections on port 27017
   Wed Nov 20 14:18:55.870 [websvr] admin web console waiting for connections on po
   rt 28017
   
5. Start the Test Server

  There are two ways to launch the Test Server. This step allows you to start it as a foreground process.
  
    5.1. Start a command line console
  
    5.2. Go into the GIT repository TestServer folder : D:\GIT\benchmarks\TestServer
  
    5.3. Enter the command : node index.js
  
    5.4. Expected output in the console :
  
     **** Test Server version  0.1.1  is started on port  8899  ****
     The database is now connected and opened on the IP address : 172.21.204.219

In the mongodb console you will have:

   Wed Nov 20 14:26:20.746 [initandlisten] connection accepted from 172.21.204.219:58509 #1 (1 connection now open)
   Wed Nov 20 14:26:20.747 [initandlisten] connection accepted from 172.21.204.219:58510 #2 (2 connections now open)
   Wed Nov 20 14:26:20.748 [initandlisten] connection accepted from 172.21.204.219:58511 #3 (3 connections now open)
   Wed Nov 20 14:26:20.749 [initandlisten] connection accepted from 172.21.204.219:58512 #4 (4 connections now open)
   Wed Nov 20 14:26:20.749 [initandlisten] connection accepted from 172.21.204.219:58513 #5 (5 connections now open)


6. Start the Test Server as a daemon

  This step explains how to setup the Test Server as a daemon, needed in production mode.
  
     6.1. Start a command line console  
  
     6.2. Go into the GIT repository TestServer folder : D:\GIT\benchmarks\TestServer
  
     6.3. Enter the following command
          forever start --minUptime 1000 --spinSleepTime 1000 -a -o out-test.log -e err-test.log index.js
      
     6.4. To check the status, you can enter the command :
  
        forever list
     
         In the list you should have the command line previously entered with its forever pid
    
     6.5. To restart the server if needed
   
      forever restart --minUptime 1000 --spinSleepTime 1000 -a -o out-test.log -e err-test.log index.js

  
  7. Start the database as a daemon
  
   As the data base may be already started, this one shall be shutdown correctly:
   
     7.1. Go into the binary mongodb folder : D:\Program Files\mongodb\bin
   
     7.2. Shutdown the data base with the command :
        mongod --shutdown --dbpath ..\data
	
     7.3. Restart the data base as a daemon process
          mongod --fork --dbpath ..\data --logpath ..\data\mongodb.log

In case of error:

     a. Go into your database folder, for instance D:\Program Files\mongodb\data
   
     b. Remove the .lock file
   
     c. Go into the binary mongodb folder : D:\Program Files\mongodb\bin
   
     d. Enter the command :
       mongod --repair --dbpath ..\data


8. Start the client test portal

    8.1. Open Chrome web browser
  
    8.2. Go to http:\\localhost:8899\TestPortal\index.html  

      8899 is the port where test server has been started.


RUNING THE TESTS:
---------------

STEP 2°) Copy the binary and webdriver (cross compiled)  on your device and launch the Browser.

  • The fact to launch the browser has for effect to initialize WEBDRIVER.

STEP 3°) Run Webdriver test using java

  • You need to have a java version >= jre1.7.0_51 .

  • You can install such a version in your linux station locally :
    /local/eclipse/jre1.7.0_51/bin and make java pointed on /local/eclipse/jre1.7.0_51/bin/java

   There are 2 ways to do that:

  A°) Run all the tests using a single instruction.

  Syntax is the following : java -jar <test.jar> <config.xml>
  Where :
  - test.jar is the jar you have extracted from all Java classes
  - config.xml is a file that indicates information on the middleware, STB and the list of the tests to run.  
  
   Important fields to fill are:
   <stbconfig>
   •	
     o	mac: The MAC address of your device. It will be used to identify your tests in the Test Portal DataBase.
	
     o	url: The IP address of your STB + WEBDRIVER port
     
     o	middleware: The middleware you are using.
     
     o	version : The middleware version 
     
     o	model: The device model used.
     
   <database url>
    •	
      o	url: The url of the data base . http://serverName:8899  
        <testcase>
		
    •	
      o	List of tests to run using java. Each test make a wget on a url and has a JAVA class.

  For instance :
  /local/eclipse/jre1.7.0_51/bin/java -jar ~/test_suite/src/test.jar  ~/test_suite/config.xml

 <TEST> 
 <stbconfig mac="10:5F:49:91:44:90" url="myDeviceIP:9517" middleware="myMiddleware" version="myVersion" model="myModel"/>
 <database url="http://serverName:8899" />
 <testcase>
 <class name="demo2.SunSpiderTest"/>
 <class name="demo2.Test_canvasList"/>
 <class name="demo2.Test_CanvasMoving_points0"/>
 <class name="demo2.Test_CanvasMoving_points1"/>
 <class name="demo2.Test_CanvasMoving_points2"/>
 <class name="demo2.Test_CanvasMoving_points3"/>
 <class name="demo2.Test_CanvasMoving_points4"/>
 <class name="demo2.Test_CanvasMoving_points5"/>
 <class name="demo2.Test_CanvasMoving_points6"/>
 <class name="demo2.Test_CanvasMoving_rectangles"/>
 <class name="demo2.TestCraftMind"/>
 <class name="demo2.Test_css3List"/>
 <class name="demo2.Test_css3VerticalList"/>
 <class name="demo2.TestWebglGeometry"/>
 <class name="demo2.TestWebglLensFlares"/> 
 <class name="demo2.TestCss3Score"/> 
 <class name="demo2.TestHtml5Score"/> 
 </testcase>
 </TEST>

 B°) You can run one test in single mode using testNg and eclipse

  • Manage Run configurations :
     Select the Java Application and add Main Class
     
  • Add testng plugin :
      Go to help->install new software form eclipse and then tape : 
      
      url : http://beust.com/eclipse
      name: testng


VISUALISATION OF RESULTS:
-------------------------

Test results are then published in the mongo data base and you can compare them 
using the test Portal written in javascript.

You can access to them through: 

http://serverName:8899/TestPortal/index.html

http://serverName:8899/TestPortal/testsResults.html

http://serverName:8899/TestPortal/database.html
