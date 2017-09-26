package demo2;

import org.json.JSONException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestCraftMind extends DemoTest 
{
	/*
	 * original:
	 * http://www.craftymind.com/factory/guimark3/bitmap/GM3_JS_Bitmap.html
	 */
	private final String url = DButilities.DB_SERVER+ "/TestSuite/CanvasTest/CraftMind/bitmap/GM3_JS_Bitmap.html";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();
		System.out.println("craftymind.setUp()");
		wd.get(url);
		new WebDriverWait(wd, 200);
		// wait a little : 20 seconds to have correct FPS
		Thread.sleep(20000);
	}

	@AfterClass
	public void afterClass() 
	{
		wd.quit();
	}

	@Test
	public void testFPS() 
	{
		WebElement console = wd.findElement(By.id("fps"));
		String consoleText = console.getText();

		int start = consoleText.indexOf("");
		int end = consoleText.indexOf(" FPS");
		String nb = consoleText.substring(start, end).trim();

		System.out.println("### consoleText is " + consoleText + " , start is:"+ start + ", end is " + end + ", nb is " + nb + " ");

		float FPSscore = Float.parseFloat(nb);
		System.out.println("craftymind.   FPS " + FPSscore);

		DButilities DB = new DButilities();
		DB.addTestCase("CraftMind animation",
				       "Check performances on craft shooting moving object based on bitmap",
				       "internal", 
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());
		
		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("FPS ", FPSscore);
			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}
