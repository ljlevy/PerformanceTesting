package demo2;

import junit.framework.TestCase;

import org.json.JSONException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestVideoPaused extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/TestVideo/test_video_play_pause_stop.html";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestVideoPaused.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 800);

		// Wait until score that indicates duration of test is displayed
		try 
		{
			System.out.println("TestVideoPaused.beforeClass()found endtest beforevisible  "
							    + System.currentTimeMillis());
			
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("EndTest")));
			
			System.out.println("TestVideoPaused.beforeClass()found endtest visible  "
							  + System.currentTimeMillis());
			
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
		WebElement console = wd.findElement(By.id("Status"));
		String consoleText = console.getText();

		System.out.println("### Status is:" + consoleText + " ");

		// use this scale to see something in the graph
		if (consoleText.equals("PASSED")) 
		{
			res = 100;
		} 
		else 
		{
			res = 5;
		}

		DButilities DB = new DButilities();
		DB.addTestCase("Video Tag play, pause & stop",
				       "Play, pause and stop a mp4 video", 
				       "internal", 
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();
		try 
		{
			obj.put("PLAY/PAUSE/STOP PASSED", res);
			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}
