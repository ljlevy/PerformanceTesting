package demo2;

import org.json.JSONException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestWebglSolarSystem extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/WebGlApp/Solar_System/solar_system.htm";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("WebglSolarSystem.setUp()");
		wd.get(url);

		new WebDriverWait(wd, 300);

		// Wait a little : 20 seconds to have correct FPS
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
		WebElement console = wd.findElement(By.id("fpsText"));
		String consoleText = console.getText();

		int start = consoleText.indexOf("");
		int end = consoleText.indexOf(" FPS");
		
		System.out.println("### consoleText is " + consoleText + " , start is:"+ start + ", end is " + end + " ");		
		
		String nb = consoleText.substring(start, end).trim();

		System.out.println("### consoleText is " + consoleText + " , start is:"+ start + ", end is " + end + ", nb is " + nb + " ");

		float FPSscore = Float.parseFloat(nb);
		System.out.println("WebglSolarSystem.   FPS " + FPSscore);

		DButilities DB = new DButilities();
		DB.addTestCase("Webgl Solar System",
				      "Checks performances of solar system using WebGL", 
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