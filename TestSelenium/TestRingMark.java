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

public class TestRingMark extends DemoTest 
{
	private final String url = "http://rng.io";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestRingMark.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 1000);

		// wait until Completed that indicates end of test is displayed
		try 
		{
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("rng-view-completed")));
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
		// ring 0
		WebElement console = wd.findElement(By.id("ring0"));
		String consoleText = console.getText();

		System.out.println("### consoleText is:" + consoleText + " ");
		// something like that : "r.0 Ring 0"

		int start = consoleText.indexOf("(") + 1;
		int end = consoleText.indexOf(" failed");
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		String nbFailed = consoleText.substring(start, end).trim();

		start = consoleText.indexOf(", ") + 1;
		end = consoleText.indexOf(" passed");
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		String nbPassed = consoleText.substring(start, end).trim();

		System.out.println("### nbFailed is:" + nbFailed + ", nbPassed is "+ nbPassed + " ");

		int PassedRing0 = Integer.parseInt(nbPassed);

		// ring 1
		console = wd.findElement(By.id("ring1"));
		consoleText = console.getText();

		System.out.println("### consoleText is:" + consoleText + " ");

		start = consoleText.indexOf("(") + 1;
		end = consoleText.indexOf(" failed");
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		nbFailed = consoleText.substring(start, end).trim();

		start = consoleText.indexOf(", ") + 1;
		end = consoleText.indexOf(" passed");
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		nbPassed = consoleText.substring(start, end).trim();

		System.out.println("### nbFailed is:" + nbFailed + ", nbPassed is "+ nbPassed + " ");

		int PassedRing1 = Integer.parseInt(nbPassed);

		// ring 2
		console = wd.findElement(By.id("ring2"));
		consoleText = console.getText();

		System.out.println("### consoleText is:" + consoleText + " ");

		start = consoleText.indexOf("(") + 1;
		end = consoleText.indexOf(" failed");
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		nbFailed = consoleText.substring(start, end).trim();

		start = consoleText.indexOf(", ") + 1;
		end = consoleText.indexOf(" passed");
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		nbPassed = consoleText.substring(start, end).trim();

		System.out.println("### nbFailed is:" + nbFailed + ", nbPassed is "+ nbPassed + " ");

		int PassedRing2 = Integer.parseInt(nbPassed);

		DButilities DB = new DButilities();
		DB.addTestCase("RingMark benchmark",
				       "Check html5 supported capabilities", 
				       "external", 
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();

		System.out.println("### PassedRing2 is:" + PassedRing2+ ", PassedRing0 is " + PassedRing0 + " ");

		try 
		{
			obj.put("Ring 2 PASSED:", PassedRing2);
			obj.put("Ring 0 PASSED:", PassedRing0);
			obj.put("Ring 1 PASSED:", PassedRing1);
			
			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}
