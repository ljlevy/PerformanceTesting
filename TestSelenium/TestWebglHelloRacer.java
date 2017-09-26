package demo2;

import org.json.JSONException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestWebglHelloRacer extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/WebGlApp/HelloRacer/webgl_HelloRacer.html";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("WebglHelloRacer.setUp()");
		wd.get(url);

		new WebDriverWait(wd, 300);

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
		WebElement console = wd.findElement(By.id("fpsText"));
		String consoleText = console.getText();

		System.out.println("### consoleText is:" + consoleText + " ");

		int start = consoleText.indexOf("");
		int end = consoleText.indexOf("FPS");
		System.out.println("### start is :  " + start + ", end is " + end + " ");

		String nb = consoleText.substring(start, end).trim();

		float FPSscore = Float.parseFloat(nb);
		System.out.println("WebglHelloRacer.   FPS " + FPSscore);

		DButilities DB = new DButilities();
		DB.addTestCase("Webgl Hello Racer",
				       "Checks performances of high-quality 3D using WebGL",
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