package demo2;

import org.json.JSONException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestWebglCustomAttributes extends DemoTest 
{
	private final String url = "http://threejs.org/examples/webgl_custom_attributes.html";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("WebglCustomAttribute.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 800);
		wait.until(ExpectedConditions.textToBePresentInElement(By.id("fps"),"FPS"));

		// Wait a little : 5 seconds to have correct FPS
		Thread.sleep(5000);
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

		System.out.println("### consoleText is:" + consoleText + " ");

		int start = consoleText.indexOf("");
		int end = consoleText.indexOf(" FPS");
		System.out.println("### start is :  " + start + ", end is " + end + " ");

		String nb = consoleText.substring(start, end).trim();

		float FPSscore = Float.parseFloat(nb);
		System.out.println("WebglGeometry.   FPS " + FPSscore);

		DButilities DB = new DButilities();
		
		DB.addTestCase("Webgl Custom attributes from threeJs",
				       "some shades are transformed using WebGL", 
				       "external", 
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