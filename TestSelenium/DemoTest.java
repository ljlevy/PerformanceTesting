package demo2;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.Level;

import junit.framework.TestCase;

import org.json.JSONException;
import org.junit.BeforeClass;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.logging.LogType;
import org.openqa.selenium.logging.LoggingPreferences;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.Command;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.DriverCommand;
import org.openqa.selenium.remote.HttpCommandExecutor;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.Response;
import org.openqa.selenium.remote.SessionId;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Demo test class that extends Junit TestCase and manage webdriver set-up
 * 
 * @author J. LEVY
 */
public class DemoTest extends TestCase 
{
	private static final boolean HACK = true;
	public static RemoteWebDriver wd;
	static Actions actions;

	/*  IP address of the device + port: 
	 *   -  Chromedriver is used with port 9515,
	 *   -  Webdriver is used with port: 9517 ...
	*/
	static String URL = "http://xxx.xx.xxx.xx:port"; // For instance: "http://172.21.122.20:9515";

	/* 
	 * Proxy address + port 
	 */
	static final String PROXY = "http://xxxx:80";  //For instance: "http://proxy-toto.com:80";

	/**
	 *  Wait for visibility of an element until timeout
	 * @param xpath: element that should be present on the page
	 */
	void scrollUntilPresent(String xpath) 
	{
		WebDriverWait wait = new WebDriverWait(wd, 0);

		for (int second = 0; second < 60; second++) 
		{
			long l0 = System.currentTimeMillis();
			WebElement until = null;
			try 
			{
				until = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(xpath)));
			} 
			catch (Exception e1) 
			{
				e1.printStackTrace();
			}

			System.out.println("DemoTest.scrollUntilPresent() elts " + until);

			if (until != null)
			{
				break;
			}
			wd.executeScript("window.scrollBy(0," + 100 + ")", "");
			long ttw = 10 - (System.currentTimeMillis() - l0);

			if (ttw > 0)
			{	
				try 
			    {
					Thread.sleep(ttw);
				} 
			    catch (InterruptedException e)
			    {
			    	
				}
			}	
		}
	}

	/**
	 * Quit existing Webdriver sessions
	 * @param remoteAddress
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	static void quitExistingSession(URL remoteAddress) throws IOException 
	{
		// Thread.dumpStack();
		System.out.println("DemoTest.quitExistingSession()>>");
		try 
		{
			HttpCommandExecutor h = new HttpCommandExecutor(remoteAddress);
			Response r = h.execute(new Command(null, DriverCommand.GET_ALL_SESSIONS));

			Object value = r.getValue();
			ArrayList<Map<String, String>> list = (ArrayList<Map<String, String>>) value;
			System.out.println("\tDemoTest.ExistingSessions " + list);

			if (list.isEmpty())
			{
				return;
			}	

			Map<String, String> object = (Map<String, String>) list.get(0);
			String sid = (String) object.get("id");

			System.out.println("\tDemoTest.ExistingSession id=" + sid);

			if (sid != null) 
			{
				h.execute(new Command(new SessionId(sid), DriverCommand.QUIT));
			}
		} 
		catch (Throwable e) 
		{
			e.printStackTrace();
			throw new Error(e);
		}
	}

	protected static boolean toggleTo(String str, WebDriver wd)
	{
		for (Iterator<String> iterator = wd.getWindowHandles().iterator(); iterator.hasNext();) 
		{
			String hdl = iterator.next();
			wd.switchTo().window(hdl);

			String currentUrl = wd.getCurrentUrl().trim();
			
			System.out.println("### currentUrl is "+currentUrl+" ");

			if (currentUrl.startsWith(str)) 
			{
				return true;
			}
			if ("http".equals(str) && "".equals(currentUrl)) 
			{
				return true;
			}
		}
		return false;
	}

	protected static void toggleToHtml(WebDriver wd) 
	{
		toggleTo("http", wd);
	}

	/**
	 * Set up Web driver by settings capabilities and restarting web driver
	 *  @BeforeClass runs once before the entire test fixture.
	 */
	@BeforeClass
	public static void setUpWD() throws Exception 
	{
		try 
		{
			// Manage proxy settings
			System.out.println(">>DemoTest.setUpWD()");
			org.openqa.selenium.Proxy proxy = new org.openqa.selenium.Proxy();
			proxy.setHttpProxy(PROXY).setFtpProxy(PROXY).setSslProxy(PROXY);
			DesiredCapabilities cap = new DesiredCapabilities();
			cap.setCapability("browserStartWindow", "*");
			cap.setCapability("reuseUI", true);
			
            // Chromedriver treatement  to use remote inspector port
			int start = URL.indexOf("http://")+ 7;
			int end = URL.indexOf(":9515");				
			String stbIpaddress = URL.substring(start, end).trim();	
			System.out.println("stbIpaddress is:"+ stbIpaddress);
			
			Map<String, Object> chromeOptions = new HashMap<String, Object>();
			chromeOptions.put("debuggerAddress", ""+stbIpaddress+":9222");

			cap.setCapability(ChromeOptions.CAPABILITY, chromeOptions);	
			
			// End for chromedriver
			
			LoggingPreferences logs = new LoggingPreferences();
			Level level = Level.ALL;
			logs.enable(LogType.DRIVER, level);
			logs.enable(LogType.BROWSER, level);
			logs.enable(LogType.CLIENT, level);
			logs.enable(LogType.SERVER, level);
			cap.setCapability(CapabilityType.LOGGING_PREFS, logs);
			URL url2 = new URL(URL);
			System.out.println("\tDemoTest.setUpWD() url:" + URL);

			if (HACK) 
			{
				try 
				{
					System.out.println("\tDemoTest.setUpWD() quit ");
					quitExistingSession(url2);
				} 
				catch (Exception e) 
				{
					e.printStackTrace();
				}
			}

			System.out.println("\tDemoTest.setUpWD() new WD " + wd);
			/* Use method from parent class */
			if (HACK) 
			{
				wd = new DemoWebDriver(url2, cap) 
				{
					// @Override
					public void quit() 
					{

					}

					@Override
					public String toString() 
					{
						return getClass().getName() + "@" + hashCode();
					}
				};
			} 
			else
			{	
				wd = new RemoteWebDriver(url2, cap);
			}

			System.out.println("\tDemoTest.setUpWD() created WD " + wd);

			actions = new Actions(wd);
			toggleToHtml(wd);
		} 
		catch (Throwable e) 
		{
			e.printStackTrace();
		}
	}

	/*
	 * 
	 * Tear down by quitting Webdriver
	 */
	public static void tearDownWD() throws Exception 
	{
		System.out.println("DemoTest.tearDownWD()");
		wd.quit();
		wd = null;
	}

	/*
	 * 
	 * Sleep a while in milliseconds
	 */
	static void sleep(long ms) 
	{
		try 
		{
			Thread.sleep(ms);
		} 
		catch (InterruptedException e) 
		{
			e.printStackTrace();
		}
	}

	
    /**
     *  Read a File	from a string path
     *  @file: File to read
     */
	static String readFile(String file) throws IOException 
	{
		Charset cs = Charset.forName("UTF-8");
		InputStream stream = DemoTest.class.getResourceAsStream("rsc/" + file);
		
		try
		{
			Reader reader = new BufferedReader(new InputStreamReader(stream, cs));
			StringBuilder builder = new StringBuilder();
			char[] buffer = new char[8192];
			int read;
			while ((read = reader.read(buffer, 0, buffer.length)) > 0) 
			{
				builder.append(buffer, 0, read);
			}
			return builder.toString();
		} 
		finally 
		{
			stream.close();
		}
	}

	
   /** Parse a json string to extract information
    * @report: input string 
    * @return 	report
    * 
    */
	static String parsejson(String report) 
	{
		System.out.println("parsejson" + report);
		
		try 
		{
			org.json.JSONObject jsonobj = new org.json.JSONObject(report);

			String description = jsonobj.getJSONObject("test").getString("description");
			String name = jsonobj.getJSONObject("test").getString("name");
			String stbId = jsonobj.getString("stb");
			long fps = jsonobj.getLong("value");
			
			System.out.println("" + name + "|" + description + "|" + stbId+ "|" + fps);
			
		} 
		catch (JSONException e) 
		{
			e.printStackTrace();
		}

		return report;
	}
}
