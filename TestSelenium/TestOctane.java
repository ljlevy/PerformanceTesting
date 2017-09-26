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

public class TestOctane extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/7.2_Octane/Octane_2_0_Subset.htm";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("Octane.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 1800);
		try 
		{
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("bottom-text")));
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
	public void testRichard() 
	{
		WebElement console = wd.findElement(By.id("Result-Richards"));
		String consoleText = console.getText();
		int richardRes = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("Result-DeltaBlue"));
		consoleText = console.getText();
		int DeltaBlueRes = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("Result-Crypto"));
		consoleText = console.getText();
		int CryptoRes = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("Result-RayTrace"));
		consoleText = console.getText();
		int RayTraceRes = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("Result-NavierStokes"));
		consoleText = console.getText();
		int NavierStokesRes = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("Result-PdfJS"));
		consoleText = console.getText();
		int PdfJSRes = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("Result-Box2D"));
		consoleText = console.getText();
		int Box2DRes = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("Result-CodeLoad"));
		consoleText = console.getText();
		int CodeLoadRes = Integer.parseInt(consoleText);

		console = wd.findElement(By.id("main-banner"));
		consoleText = console.getText();
		int start = consoleText.indexOf(": ") + 1;
		String nb = consoleText.substring(start, consoleText.length()).trim();
		int globalScore = Integer.parseInt(nb);

		DButilities DB = new DButilities();
		DB.addTestCase("Octane test score",
				       "Run a set of tests with different scores", 
				       "internal", 
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();
		try 
		{
			obj.put("Octane Score ", globalScore);
			obj.put("richardRes ", richardRes);
			obj.put("DeltaBlueRes ", DeltaBlueRes);
			obj.put("CryptoRes ", CryptoRes);
			obj.put("RayTraceRes ", RayTraceRes);
			obj.put("NavierStokesRes ", NavierStokesRes);
			obj.put("PdfJSRes ", PdfJSRes);
			obj.put("Box2DRes ", Box2DRes);
			obj.put("CodeLoadRes ", CodeLoadRes);

			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}

		System.out.println("Octane Score " + globalScore);
		System.out.println("richardRes " + richardRes);
		System.out.println("DeltaBlueRes " + DeltaBlueRes);
		System.out.println("CryptoRes " + CryptoRes);
		System.out.println("RayTraceRes " + RayTraceRes);
		System.out.println("NavierStokesRes " + NavierStokesRes);
		System.out.println("PdfJSRes " + PdfJSRes);
		System.out.println("Box2DRes " + Box2DRes);
		System.out.println("CodeLoadRes " + CodeLoadRes);
	}
}
