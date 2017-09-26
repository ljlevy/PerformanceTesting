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

public class TestSpeedometer extends DemoTest 
{
	private final String url = "http://www.browserbench.org/Speedometer";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("Speedometer.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 7200);

		// wait until score that indicates duration of test is displayed
		try 
		{
			// WebElement TlsBtn = wd.findElement(By.className("buttons"));
			WebElement TlsBtn = wd.findElement(By.xpath("//button[contains(.,'Start')]"));

			TlsBtn.click();
			System.out.println("Clicking on Start Test button, looking for show-details");

			// Wait until end of test
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("show-details")));
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
		WebElement console = wd.findElement(By.id("result-number"));
		String consoleText = console.getText();
		float resNumber = Float.parseFloat(consoleText);

		System.out.println("### Result number is:" + consoleText + " ");

		DButilities DB = new DButilities();
		DB.addTestCase("Speedometer benchmark score",
				       "Simulates user interactions in web applications", 
				       "external",
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());
		
		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("Score: Number runs / minutes", resNumber);
			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}
