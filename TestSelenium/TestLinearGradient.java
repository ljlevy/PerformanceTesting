package demo2;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestLinearGradient extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/TestKeyFrame/Test_linear_gradient.html";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestLinearGradient.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 300);
		wait.until(ExpectedConditions.textToBePresentInElement(By.id("fps"),"FPS"));

		// wait a little : 5 seconds to have correct FPS
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
		System.out.println("NOT IMPLEMENTED!");
	}
}