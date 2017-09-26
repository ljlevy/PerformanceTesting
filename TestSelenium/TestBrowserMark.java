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

public class TestBrowserMark extends DemoTest 
{
	private final String url = "http://browsermark.rightware.com";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestBrowserMark.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 4800);
		try {		

			// Click on button which has "start_test" class
			WebElement StartBtn = wd.findElement(By.id("start"));
			StartBtn.click();
			System.out.println("StartBtn " + StartBtn);

			// Wait until end of test
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("share_buttonfb")));
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
	public void testBrowserMark() 
	{
		WebElement console = wd.findElement(By.className("col-md-12 text-center overall-score"));
		String consoleText = console.getText();
		
		System.out.println("console text is "+ consoleText);	
		
		int start = consoleText.indexOf(",");
		int end = consoleText.indexOf("</div>");	
		
		String nb = consoleText.substring(start, end).trim();	

		System.out.println("nb "+ nb);	
		 		
		int BrowserMarkScore = Integer.parseInt(consoleText);

		DButilities DB = new DButilities();
		
		DB.addTestCase("BrowserMark benchmark",
				       "Push browser performance to the edge", 
				       "external", 
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("BrowserMark Performance score:", BrowserMarkScore);
			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1)
		{
			e1.printStackTrace();
		}
		
		System.out.println("BrowserMark Performance score:" + BrowserMarkScore);
	}
}
