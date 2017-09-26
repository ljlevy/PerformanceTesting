package demo2;

import junit.framework.TestCase;

import org.json.JSONException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestWebSocket extends DemoTest 
{
	private final String url = "http://www.websocket.org/echo.html";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestWebSocket.setUp()");
		wd.get(url);

		System.out.println("TestWebSocket: current url " + wd.getCurrentUrl());
		System.out.println("!!!! Caution !!! ");
		System.out.println("1°) Put the device at correct time: date -s \"2014-06-01 16:41:00\" ");
		
		System.out.println("2°) Create following diretcories: " + "mkdir -p "
				+ "/etc/ssl/certs  " + "/usr/lib/ssl/certs "
				+ "/usr/share/ssl  " + "/usr/local/ssl " + "/var/ssl/certs "
				+ "/usr/local/ssl/certs " + "/etc/openssl/certs  "
				+ "/opt/openssl/certs");
		
		System.out.println("3°) Copy TLS certificates from  linux "+ "/etc/pki/tls/certs/ca-bundle.crt into them ");
		System.out.println("!!!!  !!! ");

		new WebDriverWait(wd, 800);

		// Wait until score that indicates duration of test is displayed
		try 
		{
			WebElement TlsBtn = wd.findElement(By.id("secureCb"));
			TlsBtn.click();
			System.out.println("Clicking on TLS button");
			// wait a little : 10 seconds
			Thread.sleep(10000);

			WebElement ConnectBtn = wd.findElement(By.id("connect"));
			ConnectBtn.click();
			System.out.println("Clicking on connect button");
			// wait a little : 10 seconds
			Thread.sleep(10000);

			WebElement SendBtn = wd.findElement(By.id("send"));
			SendBtn.click();
			System.out.println("Clicking on Send button");
			// wait a little : 10 seconds
			Thread.sleep(10000);

			WebElement DisconnectBtn = wd.findElement(By.id("disconnect"));
			DisconnectBtn.click();
			System.out.println("Clicking on Disconnect button");
			// wait a little : 10 seconds
			Thread.sleep(10000);
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
		float res = 0;
		WebElement console = wd.findElement(By.id("consoleLog"));
		String consoleText = console.getText();

		System.out.println("### Status is:" + consoleText + " ");

		int start = consoleText.indexOf("RECEIVED:");
		int end = start + 38;
		System.out.println("### start is:"+start+", end is: "+end+" ");

		String extractedString = consoleText.substring(start, end).trim();
		System.out.println("### extracted string is:" + extractedString + "###");

		// use this scale to see something in the graph
		if (extractedString.equals("RECEIVED: Rock it with HTML5 WebSocket")) 
		{
			res = 100;
			System.out.println("Result is OK");
		} 
		else 
		{
			res = 5;
			System.out.println("Result is KO");
		}

		DButilities DB = new DButilities();
		DB.addTestCase("Web Socket tests", "Web socket test using echo server",
				       "external", 
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();
		try 
		{
			obj.put("WEB SOCKET PASSED", res);
			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}
