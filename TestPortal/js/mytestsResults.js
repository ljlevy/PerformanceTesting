
var TheDataBaseUrl="http://" + location.hostname + ":" + location.port ;
console.log(" url is : "+TheDataBaseUrl+" ");

function parserAttribute(tst_id,deviceid,nbmax,extended)
{
    this.testname = "";
    this.test_id = tst_id;
    this.device_id = deviceid;
    this.NBMaxParam = nbmax;
    this.paramidx = 0;
    this.extended = extended;
}





window.onload = function () {
    getDeviceList();
    getTestList();
	
	localStorage.setItem("nbFpsEntries", 0);

    shwoshart();
};


var sid = 0;


var button = document.getElementById("showRel");
button.onclick = function(){updateDeviceList();};

var wrapperOrange=null;
var myTableOrange = null;
var wrapperPassed=null;
var wrapperPassedLayout=null;
var myTablePassed = null;
var myTablePassedLayout = null;
var wrapperFps=null;
var myTableFps = null;
var wrapperScore=null;
var myTableScore = null;
var wrapperJet=null;
var myTableJet = null;
var wrapperDuration=null;
var myTableDuration = null;
var ImageConverted = false;

function shwoshart(){

    var button = document.getElementById("showButton");
    button.onclick = function(){updateChart();};

}


function updateDeviceList() {

    var selector = document.getElementById("deviceSelector");
    var isFiltered  = document.getElementById("onlyRel").checked;
    var initial_length= selector.length;
    var final_length =0;
    var i=0;

    console.log("### isFiltered: "+isFiltered+" initial_length: "+initial_length+"  ");
    if (isFiltered)
    {
      // Update selector dynamically according to filter 
      for (i = 0; i < initial_length; i++)
      {
        // Remove not REL mw 
        if ( (selector[i] != undefined) &&  (selector[i].text.indexOf(".REL") == -1) )
        {
           console.log("Removing "+selector[i].text+" from "+selector[i]+" "); 
           var optionId = document.getElementById(""+selector[i].value+"");  
           selector.removeChild(optionId); 
           /*		   
           if (selector.contains(selector[i]))
           {		   
              selector.removeChild(selector[i]);
		   }  
		   */
        }
        else
        {
          if (selector[i] != undefined) 
          {
             console.log(" keep value is : "+selector[i].text+" ");
          }
        }
      }
      // update final length
      final_length = selector.length;

      console.log("###  Final selector len is: "+final_length+" ");
      if (initial_length != final_length)
      {
         updateDeviceList(); 
      }
 
   }
   else
   {
      /* Destroy all values */
      for (i = 0; i < initial_length; i++)
      {
         if (selector[i] != undefined)
         {
            console.log("Removing "+selector[i].text+" ");
            var optionId = document.getElementById(""+selector[i].value+"");                     
            selector.removeChild(optionId); 
			
			/*
		    if (selector.contains(selector[i]))
            {
              selector.removeChild(selector[i]);
			}
			*/
         }
      }
      /* Rebuild all values */
      getDeviceList();

      selector = document.getElementById("deviceSelector");
      final_length = selector.length;

      console.log("###  Final selector len is: "+final_length+" ");
   }
}

// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages': ['corechart']});

// Load the Visualization API and the piechart package.
 google.load('visualization', '1.0', {'packages':['table']});
  
  
// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChartPassed(data) {
    // Set chart options

    console.log("drawChartPassed, data: "+data+" , nb raw: "+data.getNumberOfRows()+" ");

    var nbraw = data.getNumberOfRows();
	

    wrapperPassed = new google.visualization.ChartWrapper({
    chartType: 'BarChart',
    options: {'title': ' PASSED test results',
	    'width': 900,
        'height': nbraw*80,
        hAxis: {title: 'Test'},
        vAxis: {
            title: 'Passed per Device'
        },
	    chartArea: {left:"30%", width:"50%"},
        seriesType:"bars",
        // series: {8: {type: "line"}},

    },
    dataTable:data,
    containerId: 'chart_div_passed'
     });

    var nbcol = data.getNumberOfColumns()/2;
    var heit = 30*nbraw*nbcol;
 
    if (heit < 200) 
    {
        heit = 200;
    }

     console.log(" nbraw: "+nbraw+" , nbcol: "+nbcol+" , heit: "+heit+" ");

     wrapperPassed.setOption('height', heit);
     wrapperPassed.draw(data);
	  
   
     /*  Set table  */
     view = new google.visualization.DataView(data);

     console.log(" "+document.getElementById("table_sort_div_passed")+" ");
	 
     myTablePassed = new google.visualization.Table(document.getElementById("table_sort_div_passed"));
     myTablePassed.draw(view);	
	 
     google.visualization.events.addListener(myTablePassed, 'sort',
        function(event) {
          data.sort([{column: event.column, desc: !event.ascending}]);
          wrapperPassed.draw(view);
       });     

}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChartPassedLayout(data) {
    // Set chart options

    console.log("drawChartPassedLayout, data: "+data+" , nb raw: "+data.getNumberOfRows()+" ");

    var nbraw = data.getNumberOfRows();
	

    wrapperPassedLayout = new google.visualization.ChartWrapper({
    chartType: 'BarChart',
    options: {'title': ' VIDEO LAYOUT test results',
	    'width': 900,
        'height': nbraw*20,
        hAxis: {title: 'Test'},
        vAxis: {
            title: 'Passed per Device'
        },
	    chartArea: {left:"30%", width:"50%"},
        seriesType:"bars",
        // series: {8: {type: "line"}},

    },
    dataTable:data,
    containerId: 'chart_div_passed_layout'
     });

    var nbcol = data.getNumberOfColumns()/2;
    var heit = 20*nbraw*nbcol;
 
    if (heit < 200) 
    {
        heit = 200;
    }

     console.log(" nbraw: "+nbraw+" , nbcol: "+nbcol+" , heit: "+heit+" ");

     wrapperPassedLayout.setOption('height', heit);
     wrapperPassedLayout.draw(data);
	  
   
     /*  Set table  */
     view = new google.visualization.DataView(data);

     console.log(" "+document.getElementById("table_sort_div_passed_layout")+" ");
	 
     myTablePassedLayout = new google.visualization.Table(document.getElementById("table_sort_div_passed_layout"));
     myTablePassedLayout.draw(view);	
	 
     google.visualization.events.addListener(myTablePassedLayout, 'sort',
        function(event) {
          data.sort([{column: event.column, desc: !event.ascending}]);
          wrapperPassedLayout.draw(view);
       });     

}


function drawChartFps(data) {
    // Set chart options
    var i,j=0; 
	var nbFpsEntries=0;
    console.log("drawChartFps, data: "+data+", nbraw: "+data.getNumberOfRows()+"  ");

    var nbraw = data.getNumberOfRows();
	
    wrapperFps = new google.visualization.ChartWrapper({
    chartType: 'BarChart',
    options: {'title': ' FPS test results',
              'width': 900,
              'height': nbraw*80,
               hAxis: {title: 'Test'},
               vAxis: {
                      title: 'Score per Device in fps'
                      },
			   chartArea: {left:"30%", width:"50%"},
               seriesType:"bars",
              },
      dataTable:data,
      containerId: 'chart_div_fps'
     });

     var nbcol = data.getNumberOfColumns()/2;
     var heit = 30*nbraw*nbcol;

     if (heit < 200)
     {
        heit = 200;
     }

     console.log(" nbraw: "+nbraw+" , nbcol: "+nbcol+", heit: "+heit+" ");


	 wrapperFps.setOption('height', heit);
     wrapperFps.draw(data);
		
	 
	 /*  Set table  */
	 var view = new google.visualization.DataView(data);
     //view.setColumns([0,1]);
	 
	 console.log(" "+document.getElementById("table_sort_div_fps")+" ");

	 
     myTableFps = new google.visualization.Table(document.getElementById("table_sort_div_fps"));
     myTableFps.draw(view);	
	 
	 google.visualization.events.addListener(myTableFps, 'sort',
     function(event) {
        data.sort([{column: event.column, desc: !event.ascending}]);
        wrapperFps.draw(view);
      });
		 
	 
    
  }
 

function drawChartScoreOrange(data) {

    // Set Chart options
    var i,j=0;
    console.log("drawChartScore, data: "+data+", nbraw: "+data.getNumberOfRows()+"  ");

    var nbraw = data.getNumberOfRows();
	
	 wrapperOrange = new google.visualization.ColumnChart(document.getElementById('chart_div_score_orange'));
	 
    var options = {
      'title': ' Orange SCORE test results',
       'width': 1200,
        hAxis: {title: 'Test'},
         vAxis: {
                     title: 'Score per Device'
                 },
		chartArea: {left:"5%", width:"50%"},		 
    };
	 
	 /*
	  wrapperOrange = new google.visualization.ChartWrapper({

                    chartType: 'BarChart',
                    options: {'title': ' Orange SCORE test results',
                             'width': 900,
                             'height': nbraw*30,
                              hAxis: {title: 'Test'},
                              vAxis: {
                              title: 'Score per Device'
                             },
							 chartArea: {left:"30%", width:"50%"},
                    seriesType:"bars",
                    annotations: {
                               boxStyle: {
                                     stroke: '#888',           // Color of the box outline.
                                     strokeWidth: 1,           // Thickness of the box outline.
                                     rx: 10,                   // x-radius of the corner curvature.
                                     ry: 10,                   // y-radius of the corner curvature.
                                     gradient: {               // Attributes for linear gradient fill.
                                          color1: '#fbf6a7',      // Start color for gradient.
                                          color2: '#33b679',      // Finish color for gradient.
                                          x1: '0%', y1: '0%',     // Where on the boundary to start and end the
                                          x2: '100%', y2: '100%', // color1/color2 gradient, relative to the
                                          // upper left corner of the boundary.
                                          useObjectBoundingBoxUnits: true // If true, the boundary for x1, y1,
                                           // x2, and y2 is the box. If false,
                                           // it's the entire chart.
                                       }
                                 }
                   }					
                },
                dataTable:data,				
                containerId: 'chart_div_score_orange',			
           });
     */
    
    var nbcol = data.getNumberOfColumns()/2;
    var heit = 30*nbraw*nbcol;

    if (heit < 200)
    {
       heit = 200;
    }

    console.log(" nbraw: "+nbraw+" , nbcol: "+nbcol+", heit: "+heit+"  ");

    //wrapperOrange.draw(data);
	wrapperOrange.draw(data, options);
	     	
	 /*  Set table  */
	 var view = new google.visualization.DataView(data);

	 console.log(" "+document.getElementById("table_sort_div_score_orange")+" ");

	 
     myTableOrange = new google.visualization.Table(document.getElementById("table_sort_div_score_orange"));
     myTableOrange.draw(view);	
	 
	 google.visualization.events.addListener(myTableOrange, 'sort',
       function(event) {
         data.sort([{column: event.column, desc: !event.ascending}]);
         wrapperOrange.draw(view);
      });	
	
 }
 

function drawChartScore(data) {
    // Set chart options
 
     var i,j=0;
     console.log("drawChartScore, data: "+data+", nbraw: "+data.getNumberOfRows()+"  ");

    var nbraw = data.getNumberOfRows();
	

    wrapperScore = new google.visualization.ChartWrapper({
                    chartType: 'BarChart',
                    options: {'title': ' SCORE test results',
                              'width': 900,
                              'height': nbraw*50,
                               hAxis: {title: 'Test'},
                               vAxis: {
                               title: 'Score per Device'
                             },
					 chartArea: {left:"30%", width:"50%", height:"40%"},
                     seriesType:"bars",
                },
                dataTable:data,
                containerId: 'chart_div_score'
           });
    
    var nbcol = data.getNumberOfColumns()/2;
    var heit = 30*nbraw*nbcol;

    if (heit < 200)
    {
       heit = 200;
    }

    console.log(" nbraw: "+nbraw+" , nbcol: "+nbcol+", heit: "+heit+"  ");

    wrapperScore.draw(data);
	   
	 /*  Set table  */
	 var view = new google.visualization.DataView(data);

	 console.log(" "+document.getElementById("table_sort_div_score")+" ");

	 
     myTableScore = new google.visualization.Table(document.getElementById("table_sort_div_score"));
     myTableScore.draw(view);	
	 
	 google.visualization.events.addListener(myTableScore, 'sort',
      function(event) {
         data.sort([{column: event.column, desc: !event.ascending}]);
         wrapperScore.draw(view);
      });	

 }

 function drawChartScoreJet(data) {
    // Set chart options
 
    var i,j=0;
    console.log("drawChartScoreJet, data: "+data+", nbraw: "+data.getNumberOfRows()+"   ");

    var nbraw = data.getNumberOfRows();
	

    wrapperJet = new google.visualization.ChartWrapper({
                    chartType: 'BarChart',
                    options: {'title': ' JetStream SCORE test results',
                             'width': 900,
                             'height': nbraw*50,
                              hAxis: {title: 'Test'},
                              vAxis: {
                              title: 'Score per Device'
                             },
							 chartArea: {left:"20%", width:"50%", height:"40%"},
                     seriesType:"bars",
                },
                dataTable:data,
                containerId: 'chart_div_score_jet'
           });

    
    var nbcol = data.getNumberOfColumns()/2;
    var heit = 30*nbraw*nbcol;

    if (heit < 200)
    {
       heit = 200;
    }

    console.log(" nbraw: "+nbraw+" , nbcol: "+nbcol+", heit: "+heit+"  ");

     wrapperJet.draw(data);
	
	 /*  Set table  */
	 var view = new google.visualization.DataView(data);
	 
	 console.log(" "+document.getElementById("table_sort_div_score_jet")+" ");

	 
      myTableJet = new google.visualization.Table(document.getElementById("table_sort_div_score_jet"));
      myTableJet.draw(view);	
	 
	 google.visualization.events.addListener(myTableJet, 'sort',
     function(event) {
         data.sort([{column: event.column, desc: !event.ascending}]);
         wrapperJet.draw(view);
      });	

 }
 
 
 
 

function drawChartDuration(data) {
    // Set chart options
    
    var i,j=0;
    console.log("drawChartDuration, data: "+data+", nbraw is "+data.getNumberOfRows()+" ");

    var nbraw = data.getNumberOfRows();
			
    wrapperDuration = new google.visualization.ChartWrapper({
                  chartType: 'BarChart',
                  options: {'title': ' TIME in mseconds',
				  	        'width': 900,
                            'height': nbraw*80,
                             hAxis: {title: 'Test', minValue: 0.1},
                             vAxis: {
                                     title: 'Score per Device'
                             },
							 chartArea: {left:"30%", width:"50%"},
                             seriesType:"bars",
                             // series: {8: {type: "line"}},
                  },
                  dataTable:data,
                  containerId: 'chart_div_ms'
         });
		 
		 //hAxis: {title: "Test", minValue: 0, logScale: true}}

    var nbcol = data.getNumberOfColumns()/2;
    var heit = 30*nbraw*nbcol;

    if (heit < 200) 
    {
       heit = 200;
    }

    console.log(" nbraw: "+nbraw+" , nbcol: "+nbcol+", heit: "+heit+"  ");


    wrapperDuration.draw(data);
   
    /*  Set table  */
    var view = new google.visualization.DataView(data);
	 
    console.log(" "+document.getElementById("table_sort_div_ms")+" ");

	 
    myTableDuration = new google.visualization.Table(document.getElementById("table_sort_div_ms"));
    myTableDuration.draw(view);	
	 
    google.visualization.events.addListener(myTableDuration, 'sort',
      function(event) {
        data.sort([{column: event.column, desc: !event.ascending}]);
        wrapperDuration.draw(view);
      });     

}


function getDeviceList() {

console.log("getDeviceList, url is : "+TheDataBaseUrl+"/getTableContent?target=Device");


    $.ajax({
        url: ''+TheDataBaseUrl+'/getTableContent?target=Device',
        dataType: 'json'
    }).done(function (deviceresponse) {
            var devicetest = deviceresponse;
            var deviceselector = addDeviceTest(devicetest);

     });

}




function getTestList() {


    // Tests
    $.ajax({
        url: ''+TheDataBaseUrl+'/getTableContent?target=Test',
        dataType: 'json'
    }).done(function (response) {
            var itemsTests = response;
            // Proceed  the responses
            var selector = addComboList(itemsTests, "Test");
            selector.selectedIndex = 0;
           // updateChart(selector[selector.selectedIndex].value);


    });

}


function addDeviceTest(jsonData) {

    var content = jsonData.content;
    var keys = jsonData.keys;
    var selector = document.getElementById("deviceSelector");
    var option;
	var ArrayValue = []; 
	var SortedArrayValue = [];
	
	// update selector size
	selector.size = content.length;
    
    // populate the option dynamically according to json data	
	
	/////////// SORT ITEMS ////////////////:	
	/* First memorize the items  */		
    for (var i = 0; i < content.length; i++) {
        ArrayValue[i] = getItemTextAndValue(content[i],keys);
    }
	
    /* Now sort them */
	SortedArrayValue = ArrayValue.sort();
	
	  
	// for debug 
	/*
	for (var i = 0; i < content.length; i++) {
		console.log(" SortedArrayValue["+i+"][0] for addDeviceTest is "+ArrayValue[i][0]+" ");
    }
	*/	
		
	/* Now create option dynamically */
	 for (var i = 0; i < content.length; i++) {

        option = document.createElement('option');
        option.text = SortedArrayValue[i][0];
        option.value = SortedArrayValue[i][1];
	    option.id = SortedArrayValue[i][1];
        //console.log(" ### option.text is : "+option.text+", option.value is "+option.value+" ");
        selector.appendChild(option);
    }	
   	
	///////// END SORT ITEMS /////////
	
     /*
    for (var i = 0; i < content.length; i++) {
        var values = getItemTextAndValue(content[i],keys);
        option = document.createElement('option');
        option.text = values[0];
        option.value = values[1];
        option.id = values[1];
        //console.log(" ### option.text is : "+option.text+", option.value is "+option.value+" ");
        selector.appendChild(option);
    }
     */
	 
    var p  = document.getElementById("resultList");

    var list =  document.getElementById("deviceList");	
	
	// update deviceList size
	list.size = content.length;

    var button = document.getElementById("AddButton");
    button.onclick = function(){additem(list,selector);};

    var button = document.getElementById("DeleteButton");

    button.onclick = function(){Supprimer(list);};

    return selector;
}

function Supprimer(list) {
    
    var i=0;
    if (list.options.selectedIndex >= 0)
    { 
       for (i=0; i< list.length; i++)
       {
          console.log(" list length: "+list.length+" , selected value: "+list.options[i].selected+" i: "+i+" ");
          if ( true == list.options[i].selected)
          {
             list.removeChild(list.options[i]);
             console.log(" list length: "+list.length+"  ");
          }
       }
    } 
    else 
    {
       alert("Impossible to suppress: Nothing is selected ! ");
    } 
}








function addComboList(jsonData,labelText) {
    var content = jsonData.content;
    var keys = jsonData.keys;
    var selector = document.getElementById("testSelector");
	var ArrayValue = []; 
	var SortedArrayValue = []; 
	
    // compute dynamically list of tests according to jason data
    selector.size = content.length;

    var option;
		
	//////////  SORT ITEMS /////////////
	
	/*  Memorize the values */
	 for (var i = 0; i < content.length; i++) {
        ArrayValue[i] = getItemTextAndValue(content[i],keys);
		//console.log(" ArrayValue["+i+"][0] is "+ArrayValue[i][0]+" ");
    }
	 
	 /* Now sort them */
	SortedArrayValue = ArrayValue.sort();
	
	  
	// for debug 
	/* 
	for (var i = 0; i < content.length; i++) {
		console.log(" SortedArrayValue["+i+"][0] for addComboList is "+ArrayValue[i][0]+" ");
    }
	*/
		
	/* Now build dynamically the options  */
	
	 for (var i = 0; i < content.length; i++) {

        option = document.createElement('option');
        option.text = SortedArrayValue[i][0];
        option.value = SortedArrayValue[i][1];
        //console.log("text="+option.text+" - id="+option.value);
        selector.appendChild(option);
    }	
	 
	/////// END sort DATA //////////
	
	/*
    for (var i = 0; i < content.length; i++) {
        var values = getItemTextAndValue(content[i],keys);
        option = document.createElement('option');
        option.text = values[0];
        option.value = values[1];
        console.log("text="+option.text+" - id="+option.value);
        selector.appendChild(option);
    }
    */
    var list = document.getElementById("selectTestList");
	
	// Compute dynamically list of tests according to jason data
    list.size = content.length;

    var button = document.getElementById("AddButtonTest");
    button.onclick = function(){additem(list,selector);};

    var button = document.getElementById("DeleteButtonTest");
    button.onclick = function(){Supprimer(list);};

    return selector;
}





function additem(list,sel)
{
   for (i=0; i< sel.length; i++)
   {
     if ( true == sel.options[i].selected)
     {
       var o = document.createElement('option');
       var value = sel.options[i /*sel.selectedIndex*/].value;
       o.text = sel.options[i /*sel.selectedIndex*/].text;
       o.value = value;
       list.appendChild(o);
    }
   }

}

/*
 Return the expected item label and associated value for the combo box item
 */
function getItemTextAndValue(content,keys) {
    var text = '';
    var id;
    for (var j = 0; j < keys.length; j++) {
        if (keys[j] === '_id') {
            id = content[keys[j]];
        } else if (keys[j] !== '__v') {
            text += content[keys[j]] + ' ';
        }
    }
    text = text.substring(0, text.length - 1);
    return [text,id];
}

function resetDraw()
{

     ImageConverted = false;
	 
    // Remove chart + tables at drawing update 
	
	// Orange Tests
	if (null != wrapperOrange)
	{
	   //wrapperOrange.clear();
	   wrapperOrange.clearChart();
	}
	if (null != myTableOrange)
	{
	   myTableOrange.clearChart();
	}

	// Passed Layout tests
	if (null != wrapperPassedLayout)
	{
	   wrapperPassedLayout.clear();
	}
	if (null != myTablePassedLayout)
	{
	   myTablePassedLayout.clearChart();
	}	
	
	// Passed tests
	if (null != wrapperPassed)
	{
	   wrapperPassed.clear();
	}
	if (null != myTablePassed)
	{
	   myTablePassed.clearChart();
	}	

	// FPS tests
	if (null != wrapperFps)
	{
	   wrapperFps.clear();
	}
	if (null != myTableFps)
	{
	   myTableFps.clearChart();
	}

	// Score tests
	if (null != wrapperScore)
	{
	   wrapperScore.clear();
	}
	if (null != myTableScore)
	{
	   myTableScore.clearChart();
	}	
	   
	 // Jet Stream tests  
	if (null != wrapperJet)
	{
	   wrapperJet.clear();
	}
	if (null != myTableJet)
	{
	   myTableJet.clearChart();
	}	   

	// Duration tests
	if (null != wrapperDuration)
	{
	   wrapperDuration.clear();
	}
	if (null != myTableDuration)
	{
	   myTableDuration.clearChart();
	}	
	   
}


function updateChart() {

    console.log("Test UPDATE char");

    var testlist = document.getElementById("selectTestList");
    var devicelist = document.getElementById("deviceList");
		
    var dataScore = new google.visualization.DataTable();
    var dataScoreOrange = new google.visualization.DataTable();
    var dataScoreJet = new google.visualization.DataTable();	
    var dataFps = new google.visualization.DataTable();
    var dataPassed = new google.visualization.DataTable();
	var dataPassedLayout = new google.visualization.DataTable();
    var dataDuration = new google.visualization.DataTable();


    var nbtest = testlist.options.length;
    var nbdevice = devicelist.options.length;
	
	/* Force redrawing , if data have been previously displayed */ 
    resetDraw();
	
	
    console.log(" test list is : "+testlist+", devicelist is : "+devicelist+" nbtest is "+nbtest+", nbdevice is "+nbdevice+" ");
	
    dataScoreOrange.addColumn('string', 'test_Parameter');
    dataScoreJet.addColumn('string', 'test_Parameter');	
    dataScore.addColumn('string', 'test_Parameter');
    dataFps.addColumn('string', 'test_Parameter');
    dataPassed.addColumn('string', 'test_Parameter');
    dataPassedLayout.addColumn('string', 'test_Parameter');
    dataDuration.addColumn('string', 'test_Parameter');
	


    for (var j = 0;j < nbdevice; j++)
    {
        dataScoreOrange.addColumn('number', devicelist.options[j].text);
        dataScoreJet.addColumn('number', devicelist.options[j].text);	
        dataScore.addColumn('number', devicelist.options[j].text);		
        dataFps.addColumn('number', devicelist.options[j].text);
        dataPassed.addColumn('number', devicelist.options[j].text);
		dataPassedLayout.addColumn('number', devicelist.options[j].text);		
        dataDuration.addColumn('number', devicelist.options[j].text);
    }
	


    var maxValue = 0;
    var maxColumnID = false;

    var startidxFps = 0 , startidxScore = 0, startidxScoreOrange=0,  startidxScoreJet = 0, startidxPassed = 0, startidxPassedLayout = 0, startidxDuration = 0;
    var paramArray;
    var nbrow;

    if (0 == nbdevice)
    {
       alert("You have to add at least one Device !");
    } 
    else if (0 == testlist.options.length)
    {
       alert("You have to add at least one Test ! ");
    }
    else
    {
        /* Reset previous graph */
        /*  dataScore.removeRows(0, dataScore.getNumberOfRows() );
        dataFps.removeRows(0, dataFps.getNumberOfRows() );
        dataPassed.removeRows(0, dataPassed.getNumberOfRows() );
        dataDuration.removeRows(0, dataDuration.getNumberOfRows() ); */
		

		
       
       /* Update the new graph according to test list */ 
       GetTestResult(testlist, 0, dataFps, dataScore, dataScoreOrange, dataScoreJet, dataPassed, dataPassedLayout, dataDuration,  startidxFps, startidxScore, startidxScoreOrange, startidxScoreJet, startidxPassed, startidxPassedLayout, startidxDuration, nbdevice);
    }

}


var id = 0;



function GetTestResult(testlist, testidx, dataFps, dataScore, dataScoreOrange, dataScoreJet, dataPassed, dataPassedLayout, dataDuration, startidxFps, startidxScore,startidxScoreOrange, startidxScoreJet, startidxPassed, startidxPassedLayout, startidxDuration, nbdevice)
{
      var nbrow;
      var test_attribute;
      var nbtest = testlist.options.length;
      var CURRENT_TYPE = "";
      
      test_id = testlist.options[testidx].value;

      console.log("GetTestResult , test_id: "+test_id+", nbtest: "+nbtest+" , desc: "+testlist.options[testidx].text+" ");

      var extres  = document.getElementById("extRes");

     extended = extres.checked;
	console.log("BDU: " + ''+TheDataBaseUrl+'/getResults?target=' + test_id);
      $.ajax({
        url: ''+TheDataBaseUrl+'/getResults?target=' + test_id,
        dataType: 'json'
         }).done(function(respon,nbrow) {

		 
            if (respon.length > 0) {
            nbrow = countparams(respon,0,extended, 0);

            console.log(" nbrow is "+nbrow+" , text is:  "+testlist.options[testidx].text+" ");

            /* Read  type of result */

			// Test specific score as they have too many elements and have not the same scale
			// first "Orange Mark"
            if (
                   (testlist.options[testidx].text.indexOf("Orange") != -1 )
                || (testlist.options[testidx].text.indexOf("orange") != -1 )
                || (testlist.options[testidx].text.indexOf("ORANGE") != -1 ) 
              )
            {
                dataScoreOrange.addRows(nbrow);
                CURRENT_TYPE = "ORANGE SCORE";
                console.log("Adding "+nbrow+" rows for dataScoreOrange ");
            }

 			// Then "Jet Stream" 
	        else if (    
                       (testlist.options[testidx].text.indexOf("Jet") != -1 )
					|| (testlist.options[testidx].text.indexOf("Jet Stream") != -1 )
                    || (testlist.options[testidx].text.indexOf("JET") != -1 )

                    ) 
            {
                dataScoreJet.addRows(nbrow);
                CURRENT_TYPE = "JETSTREAM SCORE";
                console.log("Adding "+nbrow+" rows for dataScoreJet ");
            }			  
			
            // Then generic scores			
            else if (    
                   (testlist.options[testidx].text.indexOf("score")  != -1 ) 
                || (testlist.options[testidx].text.indexOf("Score")  != -1 ) 
                || (testlist.options[testidx].text.indexOf("SCORE")  != -1 )
                || (testlist.options[testidx].text.indexOf("Mark")   != -1)
                || (testlist.options[testidx].text.indexOf("Octane") != -1 )
                || (testlist.options[testidx].text.indexOf("Ecma")   != -1 )
                || (testlist.options[testidx].text.indexOf("ECMA")   != -1 )
                || (testlist.options[testidx].text.indexOf("Speedo") != -1 )

              ) 
            {
                dataScore.addRows(nbrow);
                CURRENT_TYPE = "SCORE";
                console.log("Adding "+nbrow+" rows for dataScore ");
            }
			

			
            else if ( (testlist.options[testidx].text.indexOf("Duration")  != -1 ) 
                   || (testlist.options[testidx].text.indexOf("duration")  != -1 )
                   || (testlist.options[testidx].text.indexOf("DURATION")  != -1 )
                   || (testlist.options[testidx].text.indexOf("Sunspider") != -1 )
                   || (testlist.options[testidx].text.indexOf("sunspider") != -1 )
                   || (testlist.options[testidx].text.indexOf("SunSpider") != -1 )
                   || (testlist.options[testidx].text.indexOf("Kraken")    != -1 )
                   || (testlist.options[testidx].text.indexOf("kraken")    != -1 )



               )
            {
               dataDuration.addRows(nbrow);
               CURRENT_TYPE="DURATION";
               console.log("Adding "+nbrow+" rows for dataDuration ");
            }
            else if ( 
			           (testlist.options[testidx].text.indexOf("layout")      != -1 ) 
                    )
            {
               dataPassedLayout.addRows(nbrow);
               CURRENT_TYPE="PASSED_LAYOUT";
               console.log("Adding "+nbrow+" rows for dataPassed Layout ");
            }
            else if ( (testlist.options[testidx].text.indexOf("Video")      != -1 ) 
                  ||  (testlist.options[testidx].text.indexOf("video")      != -1 ) 
                  ||  (testlist.options[testidx].text.indexOf("storage")    != -1 )
                  ||  (testlist.options[testidx].text.indexOf("Storage")    != -1 )
                  ||  (testlist.options[testidx].text.indexOf("web socket") != -1 )
                  ||  (testlist.options[testidx].text.indexOf("WEB SOCKET") != -1 )


                )
            {
               dataPassed.addRows(nbrow);
               CURRENT_TYPE="PASSED";
               console.log("Adding "+nbrow+" rows for dataPassed ");
            }
            else
            {
               dataFps.addRows(nbrow);
               CURRENT_TYPE="FPS";
               console.log("Adding "+nbrow+" rows for dataFps ");
            }
            var devicelist = document.getElementById("deviceList");
            devicelist.size = nbtest;
            for (var j = 0;j < nbdevice; j++)
            {
                test_attribute = new parserAttribute(test_id, devicelist.options[j].value, nbrow,extended);

                fillTestIntable(dataFps, dataScore, dataScoreOrange, dataScoreJet, dataPassed, dataPassedLayout, dataDuration, startidxFps, startidxScore, startidxScoreOrange, startidxScoreJet, startidxPassed, startidxPassedLayout, startidxDuration,j,nbrow,nbdevice,test_attribute);
                console.log("  nbrow is "+nbrow+", test_id is "+test_id+" , test_attribute is "+test_attribute+" ");
            }
            testidx++;

            if (testidx < nbtest)
            {
                    console.log(" testidx: "+testidx+" ");
                    if (CURRENT_TYPE === "ORANGE SCORE")
                    {
                       startidxScoreOrange = startidxScoreOrange + nbrow;
                    }
				    else if (CURRENT_TYPE === "JETSTREAM SCORE")
                    {
                       startidxScoreJet = startidxScoreJet + nbrow;
                    }	
                    else if (CURRENT_TYPE === "SCORE")
                    {
                       startidxScore = startidxScore + nbrow;
                    }									
                    else if (CURRENT_TYPE === "FPS")
                    {
                      startidxFps = startidxFps + nbrow;
                    }
                    else if ( CURRENT_TYPE === "PASSED_LAYOUT")
                    {
                      startidxPassedLayout = startidxPassedLayout + nbrow;
                    }					
                    else if ( CURRENT_TYPE === "PASSED")
                    {
                      startidxPassed = startidxPassed + nbrow;
                    }
                    else if ( CURRENT_TYPE === "DURATION")
                    {
                      startidxDuration = startidxDuration + nbrow;
                    }
 
                    GetTestResult(testlist, testidx, dataFps, dataScore, dataScoreOrange, dataScoreJet, dataPassed, dataPassedLayout, dataDuration, startidxFps, startidxScore, startidxScoreOrange, startidxScoreJet, startidxPassed, startidxPassedLayout, startidxDuration, nbdevice);
            }
        }
        });
}



function fillTestIntable (dataFps, dataScore, dataScoreOrange, dataScoreJet, dataPassed, dataPassedLayout, dataDuration ,startidxFps, startidxScore,startidxScoreOrange, startidxScoreJet, startidxPassed, startidxPassedLayout, startidxDuration ,deviceidx,nbrow,nbdevice,test_attr)
 {

    var rowidx = 0;
    var string_passed="";
    var typeObjectResult="";
	var sliced_string="";

    {
        $.ajax({
        url: ''+TheDataBaseUrl+'/getResults?target=' + test_attr.test_id + '&targetDevice=' + test_attr.device_id,
        dataType: 'json'
        }).done(function(response) {

            if (response.length > 0) {
         
                 var param  = new Array([2*nbrow]);
                 
                 console.log("Calling fillTestInTable ");
                 iterateAttributesAndFormHTMLLabels(param, response,nbrow,0,"",1,"",test_attr, 0);

                console.log(" Now looping for all row : nbrow "+nbrow+" ");
                for (k = 0; k< nbrow; k++)
                {  
                    // check type of object
                    if ( 
					     (param[k].indexOf != null) &&  (param[k].indexOf("layout") != -1 ) 
                       )
                   { 
                         console.log("Passed Layout results");
                         typeObjectResult="PASSED_LAYOUT";

                        rowidx = startidxPassedLayout+k;
                        if (deviceidx== 0)
                        {
                           console.log("1st value: "+rowidx+" , param[k] : "+param[k]+" ");
                           dataPassedLayout.setValue(rowidx,0,param[k]);
                        }
                        if ( typeof param[k+nbrow] == 'number' )
                        {
                           string_passed = (param[k+nbrow]).toString();
                        }
                        else
                        {
                           string_passed = param[k+nbrow];
                        }
                        console.log("2nd value for PassedLayout:rowidx: "+rowidx+",param["+k+nbrow+"]: "+param[k+nbrow]+",string_passed: "+string_passed+",typeObjectResult: "+typeObjectResult+"  ");
                        dataPassedLayout.setValue(rowidx,deviceidx+1, string_passed);
				   
                   }					   
                    // check type of object
                    else if ( (param[k].indexOf != null) &&  (param[k].indexOf("Video") != -1 ) 
                       || (param[k].indexOf("VIDEO") != -1 ) 
                       || (param[k].indexOf("video") != -1 )
                       || (param[k].indexOf("storage") != -1 )
                       || (param[k].indexOf("Storage") != -1 )
                       || (param[k].indexOf("web socket") != -1 )
                       || (param[k].indexOf("WEB SOCKET") != -1 )
 
                      )
                    {

                         console.log("Passed results");
                         typeObjectResult="PASSED";

                        rowidx = startidxPassed+k;
                        if (deviceidx== 0)
                        {
                           console.log("1st value: "+rowidx+" , param[k] : "+param[k]+" ");
                           dataPassed.setValue(rowidx,0,param[k]);
                        }
                        if ( typeof param[k+nbrow] == 'number' )
                        {
                           string_passed = (param[k+nbrow]).toString();
                        }
                        else
                        {
                           string_passed = param[k+nbrow];
                        }
                        console.log("2nd value for Passed:rowidx: "+rowidx+",param["+k+nbrow+"]: "+param[k+nbrow]+",string_passed: "+string_passed+",typeObjectResult: "+typeObjectResult+"  ");
                        dataPassed.setValue(rowidx,deviceidx+1, string_passed);

                    }

					// Test specific scores to display specific graphs as there have too many elements and scale is not the same
					// First "Orange Mark" 
                    else  if (
                                   (param[k].indexOf != null) && (param[k].indexOf("orange") != -1 )
                               || (param[k].indexOf("Orange") != -1 )
                         )
                    {
                         console.log("Orange Score results");
                         typeObjectResult="ORANGE SCORE";

                        rowidx = startidxScoreOrange+k;
                        if (deviceidx== 0)
                        {
                           console.log("1st value: "+rowidx+" , param[k] : "+param[k]+" ");
						   // Remove "OrangeMark benchmark." string as it redudant
                           sliced_string = param[k].slice(param[k].indexOf(".")+1,param[k].length);						   
						   dataScoreOrange.setValue(rowidx,0,sliced_string);
                        }
                        if ( typeof param[k+nbrow] == 'number' )
                        {
                           string_passed = (param[k+nbrow]).toString();
                        }
                        else
                        {
                           string_passed = param[k+nbrow];
                        }
                        console.log("2nd value for Score:rowidx: "+rowidx+" ,param["+k+nbrow+"]: "+param[k+nbrow]+",string_passed: "+string_passed+",typeObjectResult: "+typeObjectResult+"  ");
                        dataScoreOrange.setValue(rowidx,deviceidx+1, string_passed);
                    }
					// Then "JetStream"
                    else  if ( 
                                 (param[k].indexOf != null) &&  (param[k].indexOf("Jet") != -1 )
								 || (param[k].indexOf("jet") != -1 )
                             )

                    {
                         console.log("JetStream Score results");
                         typeObjectResult="JETSTREAM SCORE";

                        rowidx = startidxScoreJet+k;
                        if (deviceidx== 0)
                        {
                           console.log("1st value: "+rowidx+" , param[k] : "+param[k]+" ");
						   // Remove "Jet Stream benchmark score." string as it redudant
						   sliced_string = param[k].slice(param[k].indexOf(".")+1,param[k].length);	
                           dataScoreJet.setValue(rowidx,0,sliced_string);
                        }
                        if ( typeof param[k+nbrow] == 'number' )
                        {
                           string_passed = (param[k+nbrow]).toString();
                        }
                        else
                        {
                           string_passed = param[k+nbrow];
                        }
                        console.log("2nd value for JetStream Score:rowidx: "+rowidx+" ,param["+k+nbrow+"]: "+param[k+nbrow]+",string_passed: "+string_passed+",typeObjectResult: "+typeObjectResult+"  ");
                        dataScoreJet.setValue(rowidx,deviceidx+1, string_passed);
                    }					
										
					// Now other scores
                    else  if ( 
                                   (param[k].indexOf != null) && (param[k].indexOf("SCORE") != -1 ) 
                               || (param[k].indexOf("Mark") != -1 ) 
                               || (param[k].indexOf("score") != -1 ) 
                               || (param[k].indexOf("Score") != -1 )
                               || (param[k].indexOf("Octane") != -1 )
                               || (param[k].indexOf("ECMA") != -1 )
                               || (param[k].indexOf("Ecma") != -1 )
							   || (param[k].indexOf("Checks css3 features") != -1 )
                               //|| (param[k].indexOf("Jet") != -1 )
                               || (param[k].indexOf("Speedo") != -1 )

                         )
                    {
                         console.log("Score results");
                         typeObjectResult="SCORE";

                        rowidx = startidxScore+k;
                        if (deviceidx== 0)
                        {
                           console.log("1st value: "+rowidx+" , param[k] : "+param[k]+" ");
                           dataScore.setValue(rowidx,0,param[k]);
                        }
                        if ( typeof param[k+nbrow] == 'number' )
                        {
                           string_passed = (param[k+nbrow]).toString();
                        }
                        else
                        {
                           string_passed = param[k+nbrow];
                        }
                        console.log("2nd value for Score:rowidx: "+rowidx+" ,param["+k+nbrow+"]: "+param[k+nbrow]+",string_passed: "+string_passed+",typeObjectResult: "+typeObjectResult+"  ");
                        dataScore.setValue(rowidx,deviceidx+1, string_passed);
                    }
	
                    else  if (
                                   (param[k].indexOf != null) && (param[k].indexOf("duration") != -1 )
                               || (param[k].indexOf("DURATION") != -1 )
                               || (param[k].indexOf("Duration") != -1 )
                               || (param[k].indexOf("sunspider") != -1 )
                               || (param[k].indexOf("Sunspider") != -1 )
                               || (param[k].indexOf("SunSpider") != -1 )
                               || (param[k].indexOf("Kraken") != -1 )
                               || (param[k].indexOf("kraken") != -1 )

                         )
                    {
                         console.log("Duration results");
                         typeObjectResult="DURATION";

                        rowidx = startidxDuration+k;
                        if (deviceidx== 0)
                        {
                           console.log("1st value: "+rowidx+" , param[k] : "+param[k]+" ");
                           dataDuration.setValue(rowidx,0,param[k]);
                        }
                        if ( typeof param[k+nbrow] == 'number' )
                        {
                           string_passed = (param[k+nbrow]).toString() ;  
                        }
                        else
                        {
                           string_passed = param[k+nbrow];
                        }
                        console.log("2nd value for Duration:rowidx: "+rowidx+" ,param["+k+nbrow+"]: "+param[k+nbrow]+",string_passed: "+string_passed+",typeObjectResult: "+typeObjectResult+"  ");
                        dataDuration.setValue(rowidx,deviceidx+1, string_passed);
                    }

                    else
                    {
                         console.log("FPS results");
                         typeObjectResult="FPS";

                        rowidx = startidxFps+k;
                        if (deviceidx== 0)
                        {
                           console.log("1st value: "+rowidx+" , param[k] : "+param[k]+" ");
                           dataFps.setValue(rowidx,0,param[k]);
                        }
                        if ( typeof param[k+nbrow] == 'number' )
                        {
                           string_passed = (param[k+nbrow]).toString();
                        }
                        else
                        {
                           string_passed = param[k+nbrow];
                        }
                        console.log("2nd value for FPS:rowidx: "+rowidx+" ,param["+k+nbrow+"]: "+param[k+nbrow]+", string_passed: "+string_passed+", typeObjectResult: "+typeObjectResult+"  ");
                        dataFps.setValue(rowidx,deviceidx+1, string_passed);

                    }

                    //console.log(" #### param[k] is "+param[k]+" "); 
                  
                } //end for

				if (typeObjectResult=="PASSED_LAYOUT")
                {
                    drawChartPassedLayout(dataPassedLayout,'');
                }
                else if (typeObjectResult=="PASSED")
                {
                    drawChartPassed(dataPassed,'');
                }
                else if ( typeObjectResult=="ORANGE SCORE")
                {
                     drawChartScoreOrange(dataScoreOrange,'');
                }
                else if ( typeObjectResult=="JETSTREAM SCORE")
                {
                     drawChartScoreJet(dataScoreJet,'');
                }					
                else if ( typeObjectResult=="SCORE")
                {
                     drawChartScore(dataScore,'');
                }			
                else if ( typeObjectResult=="DURATION")
                {
                     drawChartDuration(dataDuration,'');
                }
                else
                {              
                   drawChartFps(dataFps,'');
                 
                }
            }
        });
    }
}







function countparams(jsonobj,nrow,extended,level){
    var tmprow = nrow;
    //console.log("extended is : "+extended+" ");
    for(var a in jsonobj){
        var tmplevel = level;
        if (a =="value")
        {
            tmprow = 0;
        }

        if (typeof jsonobj[a] == 'object'){

        if (extended || level <2)
        {
            tmplevel++;
            tmprow = countparams(jsonobj[a],tmprow,extended,tmplevel);
        }
        }else{
            tmprow++;
        }
    }
    return tmprow;
}




function iterateAttributesAndFormHTMLLabels(param,jsonobj, nbparam, nrow,rootname,ignorelog, testname,test_attr, level){

    var root_name="";
    var newObj= new Boolean(1);
    var parsevalue =0;
    var count=0;
    
    console.log("level" + level +"iterateAttributesAndFormHTMLLabels  ");

    for(var a in jsonobj){
        var tmplevel = level;
         
        console.log(" tmplevel is "+tmplevel+" "+typeof(a)+" ");
        if (a == "name")
        {
            test_attr.testname = jsonobj[a]+".";
        }

        console.log("level" + level +"iterateAttributesAndFormHTMLLabels   "+a+"    "+jsonobj[a]);
        if (typeof jsonobj[a] == 'object'){

            if (ignorelog == 0)
            {
                rootname = a;
            }
            if (a =="value")
            {
                ignorelog = 0;

            }
        if(test_attr.extended || level <1)
        {
          if (!ignorelog)
          {
             tmplevel++;

          }
          console.log("### ljl ### : "+jsonobj[a]+" rootname : "+rootname+", testname: "+testname+", test_attr: "+test_attr+" , tmplevel: "+tmplevel+"  ");
          nrow = iterateAttributesAndFormHTMLLabels(param,jsonobj[a],nbparam,nrow,rootname,ignorelog,testname, test_attr, tmplevel);
        }
      }
      else if (ignorelog == 0)
      {     
            console.log(" "+typeof a+" ");
            console.log("iterateAttributesAndFormHTMLLabels   log "+a+"    "+jsonobj[a]);
            /*if the first test log, write the param name*/
            if (nrow < nbparam)
            {
                console.log("iterateAttributesAndFormHTMLLabels   param "+test_attr.testname+",  root:  "+rootname+",   a: "+a+" ");
                param[nrow]=test_attr.testname + rootname +a;
                param[nrow+nbparam]=jsonobj[a];
            }

            nrow++;
            newObj = true;

            count = Object.keys(jsonobj).length
            console.log(" json object length: "+count+" ");
       }
    }
    return nrow;
}


 // Manage Picture saving 

function getImgData(chartContainer) {


    var chartArea = chartContainer.getElementsByTagName('svg')[0].parentNode;
    var svg = chartArea.innerHTML;
    var doc = chartContainer.ownerDocument;
    var canvas = doc.createElement('canvas');
    canvas.setAttribute('width', chartArea.offsetWidth);
    canvas.setAttribute('height', chartArea.offsetHeight);
        
    canvas.setAttribute('name', chartContainer);
		
    canvas.setAttribute(
            'style',
            'position: absolute; ' +
            'top: ' + (-chartArea.offsetHeight * 2) + 'px;' +
            'left: ' + (-chartArea.offsetWidth * 2) + 'px;');
     doc.body.appendChild(canvas);
     canvg(canvas, svg);
     var imgData = canvas.toDataURL("image/png");
     canvas.parentNode.removeChild(canvas);
     return imgData;
	
 }

 
 function saveAsImg(chartContainer) {
 
    
     var imgData = getImgData(chartContainer);
        
     // Replacing the mime-type will force the browser to trigger a download
     // rather than displaying the image in the browser window.
     window.location = imgData.replace("image/png", "image/octet-stream");
		
  }
      
function toImg(chartContainer, imgContainer) { 

 
     var doc = chartContainer.ownerDocument;
     var img = doc.createElement('img');
     img.src = getImgData(chartContainer);
		
		
        
     while (imgContainer.firstChild) {
             imgContainer.removeChild(imgContainer.firstChild);
     }
     imgContainer.appendChild(img);		  
     
}
