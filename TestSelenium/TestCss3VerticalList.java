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

public class TestCss3VerticalList extends DemoTest 
{
	private String consoleText;
	private final String url = DButilities.DB_SERVER+ "/TestSuite/Test_css3VerticalList/index.html?stb=TNC01";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("Test_css3VerticalList.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 200);
		try 
		{
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("average")));

			WebElement console = wd.findElement(By.id("average"));
			consoleText = console.getText();
			System.out.println("Test_css3VerticalList.setUpWD() TEXT "+ consoleText);
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
	public void testfps() {
		DButilities DB = new DButilities();
		DB.addTestCase("CSS3VerticalList", 
				       "CSS3 vertical list transitions",
				        "internal", 
				        url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());
		try 
		{
			org.json.JSONObject jsonobj = new org.json.JSONObject(consoleText);
			float fps = jsonobj.getLong("value");

			org.json.JSONObject obj = new org.json.JSONObject();
			try 
			{
				obj.put("Fps", fps);
			} 
			catch (JSONException e1) 
			{
				e1.printStackTrace();
			}

			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e) 
		{
			e.printStackTrace();
		}
	}
}
