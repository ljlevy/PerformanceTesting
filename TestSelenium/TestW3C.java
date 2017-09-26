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

public class TestW3C extends DemoTest 
{
	private final String url = DButilities.DB_SERVER + "/tools/runner/index.html";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("W3C.setUp()");
		wd.get(url);

		// wait a little : 10 seconds until the page has been loaded
		Thread.sleep(10000);

		WebElement StartBtn = wd.findElement(By.id("start"));
		StartBtn.click();

		WebDriverWait wait = new WebDriverWait(wd, 12000);
		try 
		{
			// Wait until end of test
			wait.until(ExpectedConditions.textToBePresentInElementValue(By.className("progress-bar"), "5.0%"));

			StartBtn.click();

			// wait a little : 10 seconds until the page has been loaded
			Thread.sleep(10000);

			WebElement DownLoadBtn = wd.findElement(By.id("download"));
			DownLoadBtn.click();
			
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
	public void testW3C()
	{
		WebElement console = wd.findElement(By.xpath("//th[1]"));
		String consoleText = console.getText();
		int nbPassed = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("//th[2]"));
		consoleText = console.getText();
		int nbFailed = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("//th[3]"));
		consoleText = console.getText();
		int nbTimeouts = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("//th[4]"));
		consoleText = console.getText();
		int nbErrors = Integer.parseInt(consoleText);

		DButilities DB = new DButilities();
		DB.addTestCase("Test W3C", "Run different features compliant with W3C","internal", url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("W3C Passed ", nbPassed);
			obj.put("Failed ", nbFailed);
			obj.put("Timeouts ", nbTimeouts);
			obj.put("Errors ", nbErrors);
			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}

		System.out.println("Passed " + nbPassed);
		System.out.println("Failed " + nbFailed);
		System.out.println("Timeouts " + nbTimeouts);
		System.out.println("Errors " + nbErrors);
	}
}
