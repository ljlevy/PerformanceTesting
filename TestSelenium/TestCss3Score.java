package demo2;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import junit.framework.TestCase;

import org.json.JSONException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestCss3Score extends DemoTest 
{
	private final String url = "http://css3test.com";
	private String tmp_resfile="";	

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestCss3Score.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 800);

		// wait until timeTaken that indicates duration of test is displayed
		try 
		{
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("timeTaken")));
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

		int start = consoleText.indexOf("");
		int end = consoleText.indexOf("%");
		System.out.println("### start is:" + start + ", end is: " + end + " ");

		String nb = consoleText.substring(start, end).trim();

		int Totalscore = Integer.parseInt(nb);

		System.out.println("TestCss3Score.   Score " + Totalscore);

		DButilities DB = new DButilities();
		
		
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
					
			tmp_resfile = ""+tmp_resfile+"/Css3ScoreResult.htm";
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
		
		DB.addTestCase("Css3TestScore", "Checks css3 features", "external", url);

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
