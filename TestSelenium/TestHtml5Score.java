package demo2;

import java.io.IOException;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;


import junit.framework.TestCase;

import org.json.JSONException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestHtml5Score extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/html5test-version-5.0/index.html";
	
private String tmp_resfile="";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestHtml5Score.setUp()");
		// wd.get("http://www.html5test.com");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 800);

		// wait until score that indicates duration of test is displayed
		try 
		{
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("score")));
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
		wd.quit();
	}

	@Test
	public void testFPS() throws IOException 
	{
		WebElement console = wd.findElement(By.id("score"));
		String consoleText = console.getText();

		System.out.println("### consoleText is:" + consoleText + " ");
		// something like that : "YOUR BROWSER SCORES 393 OUT OF 555 POINTS"

		int start = consoleText.indexOf("S ") + 1;
		int end = consoleText.indexOf(" OUT OF 555 POINTS");
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		String nb = consoleText.substring(start, end).trim();

		System.out.println("### nb is:" + nb + " ");

		int Totalscore = Integer.parseInt(nb);

		System.out.println("TestHtml5Score.   Score " + Totalscore);

		DButilities DB = new DButilities();
		
		// Manage or not take screen
		if ( true == false)
		{		
		  /* ---------------------------------------------- *
		  /*  Begin Take a screen shot                     */ 
		  /* --------------------------------------------- */
		  String contentFile = wd.getPageSource();
		
		  try 
		  {
			
			 tmp_resfile = "/tmp/"+DB.deviceMW()+"/"+DB.deviceMVER()+"/"+DB.deviceMODEL()+"";	
			 tmp_resfile= tmp_resfile.replace(" ", "_");		
		     File theDir = new File(""+tmp_resfile+"");
		    
		     try
		     {
				 System.out.println("### Creating directory "+theDir+"  ");
		    	 theDir.mkdirs();
		     }
		     catch (Exception e1) 
			 {
				 System.out.println("### Directory "+theDir+" already created ");
			 }
					
			  tmp_resfile = ""+tmp_resfile+"/Html5ScoreResult.htm";
			  System.out.println("### Creating file "+tmp_resfile+" ");			
				

		      FileWriter w = new FileWriter(""+tmp_resfile+"");

		     BufferedWriter out= new BufferedWriter(w);
		     out.write(contentFile);
		     out.flush();
		     out.close();
		   
			  /* Set good rights */
	    	  Runtime.getRuntime().exec("chmod -R 777 /tmp/"+DB.deviceMW());		   	
		  } 
		  catch (Exception e1) 
		  {
			  System.out.println("### File "+tmp_resfile+" already created ");
		  }		
		
		  /* ---------------------------------------------- *
		  /*  End Take a screen shot                       */ 
		  /* --------------------------------------------- */				
		}
			
		
		DB.addTestCase("Html5TestScore",
				       "Html5Score Tests: focuses on features implemented",
				       "internal", url);

		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());
		
		org.json.JSONObject obj = new org.json.JSONObject();
		try 
		{
			obj.put("Browser scores ", Totalscore);
			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}
