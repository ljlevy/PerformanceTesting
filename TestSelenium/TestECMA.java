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

public class TestECMA extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/Ecmascript/test262_ecmascript.html#"; 
	
	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestECMA.setUp()");
		wd.get(url);

		// wait a little : 10 seconds until the page has been loaded
		Thread.sleep(10000);

		try 
		{
			// For QT48 the button is not clicked although html page does it
			WebElement StartBtn = wd.findElement(By.id("btnRunAll"));
			StartBtn.click();
			
		} 
		catch (Exception e1)
		{
			System.out.println("Already clicked");
		}

		WebDriverWait wait = new WebDriverWait(wd, 6400);
		try 
		{
			// Wait until end of test
			wait.until(ExpectedConditions.textToBePresentInElement(By.id("progressbar"), "Testing complete!"));
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
	public void testECMA() 
	{		
		String consoleText;
		WebElement console = wd.findElement(By.id("testsToRun"));
		consoleText = console.getText();

		console = wd.findElement(By.id("totalCounter"));
		consoleText = console.getText();
		int totalCounter = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("Pass"));
		consoleText = console.getText();
		int PassedEcma = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("Fail"));
		consoleText = console.getText();
		int FailedEcma = Integer.parseInt(consoleText);

		DButilities DB = new DButilities();
		DB.addTestCase("Ecma benchmark score","Javascript standard implementation", "internal", url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("ECMA: Passed ", PassedEcma);
			obj.put("Failed ", FailedEcma);
			obj.put("Total ", totalCounter);

			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}

		System.out.println("ECMA Passed " + PassedEcma);
		System.out.println("ECMA Failed " + FailedEcma);
		System.out.println("ECMA Total " + totalCounter);				
	}	
}
