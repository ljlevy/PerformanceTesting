package demo2;

import junit.framework.TestCase;




import java.io.File;



import org.apache.commons.io.FileUtils;
import org.json.JSONException;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestVideoTexturing extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/TestVideo/test_video_transformed.html";

	private String tmp_resfile = "/tmp/TestVideoTexturing.jpg";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestVideoTexturing.setUp()");
		wd.get(url);

		System.out.println("TestVideoTexturing.setUp() current url "+ wd.getCurrentUrl());

		WebDriverWait wait = new WebDriverWait(wd, 800);
		// Wait until score that indicates duration of test is displayed
		
		try 
		{
			wait.until(ExpectedConditions.visibilityOfElementLocated(By
					.id("EndTest")));
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
	public void testFPS() 
	{
		float res = 0;
		WebElement console = wd.findElement(By.id("EndTest"));
		String consoleText = console.getText();

		System.out.println("### EndTest is:" + consoleText + " ");

		// Use this scale to see something in the graph
		res = 100;
				
		DButilities DB = new DButilities();
		DB.addTestCase("Video texturing test",
				       "Video texturing in a canvas in rotation", 
				       "internal", 
				       url);

		/* -------------------------------- */
		/* ---- Begin Take screen shot ----- */
		/* -------------------------------- */

		try 
		{
			   // take screenshot and save it in a file
			   File scrFile = ((TakesScreenshot) wd).getScreenshotAs(OutputType.FILE);
	
			   File destFile= new File(""+tmp_resfile+"");
			   
				Thread.sleep(20000);

				// copy the file to the required path
				FileUtils.copyFile(scrFile, destFile);	
				
				// Delete capture (comment this if you want it )
				 //destFile.delete();

			} 
		    catch (Exception e) 
		    {
				// If it fails to take screenshot then this block will execute
				System.out.println("Failure to take screenshot " + e);
			    e.printStackTrace();
			}

		/* ----------------------------------- */
		/* ----- End take a screen shot ------- */
		/* ----------------------------------- */

		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();
		try 
		{
			obj.put("PLAYBACK PASSED", res);
			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}
