package demo2;

import junit.framework.TestCase;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import org.json.JSONException;

public class TestSunSpider extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/SunSpider_0_9_1/driver.html?type=new";
	private String consoleText;

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("SunSpider.setUp()");
		// wd.get("http://sunspider-mod.googlecode.com/svn/data/hosted/sunspider.html");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 1800);

		try
		{
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@value='Run Again']")));
			System.out.println("SunSpider.setUpWD() input visible");

			wait.until(ExpectedConditions.textToBePresentInElement(By.id("console"), "Total"));

			WebElement console = wd.findElement(By.id("console"));
			consoleText = console.getText();
			System.out.println("SunSpider.setUpWD() TEXT " + consoleText);
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

	static float getResult(String test, String name) 
	{
		System.out.println("SunSpider.getResult() " + name);
		String str = name + ':';
		int start = test.indexOf(str) + str.length();
		int end = test.indexOf("ms", start);
		String nb = test.substring(start, end).trim();
		System.out.println("SunSpider result  " + test + "   " + name + "  "+ nb);
		return Float.parseFloat(nb);
	}

	@Test
	public void PublishReport() 
	{
		float res;
		DButilities DB = new DButilities();
		DB.addTestCase("SunSpider Time measurement",
				       "Run set of tests with time duration", 
				       "internal", 
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());
		
		org.json.JSONObject obj = new org.json.JSONObject();
		try 
		{
			res = getResult(consoleText, "Total");
			obj.put("Total", res);

			org.json.JSONObject obj3d = new org.json.JSONObject();
			res = getResult(consoleText, "3d");
			obj3d.put("Global result", res);
			res = getResult(consoleText, "cube");
			obj3d.put("cube", res);
			res = getResult(consoleText, "morph");
			obj3d.put("morph", res);
			res = getResult(consoleText, "raytrace");
			obj3d.put("raytrace", res);
			obj.put("3d", obj3d);

			org.json.JSONObject objaccess = new org.json.JSONObject();
			res = getResult(consoleText, "access");
			objaccess.put("Global result", res);
			res = getResult(consoleText, "binary-trees");
			objaccess.put("binary-trees", res);
			res = getResult(consoleText, "fannkuch");
			objaccess.put("fannkuch", res);
			res = getResult(consoleText, "nbody");
			objaccess.put("nbody", res);
			res = getResult(consoleText, "nsieve");
			objaccess.put("nsieve", res);
			obj.put("access", objaccess);

			org.json.JSONObject objbitops = new org.json.JSONObject();
			res = getResult(consoleText, "bitops");
			objbitops.put("Global result", res);
			res = getResult(consoleText, "3bit-bits-in-byte");
			objbitops.put("3bit-bits-in-byte", res);
			res = getResult(consoleText, "bits-in-byte");
			objbitops.put("bits-in-byte", res);
			res = getResult(consoleText, "bitwise-and");
			objbitops.put("bitwise-and", res);
			res = getResult(consoleText, "nsieve-bits");
			objbitops.put("nsieve-bits", res);
			obj.put("bitops", objbitops);

			org.json.JSONObject controlflow = new org.json.JSONObject();
			res = getResult(consoleText, "controlflow");
			controlflow.put("Global result", res);
			res = getResult(consoleText, "recursive");
			controlflow.put("recursive", res);
			obj.put("controlflow", controlflow);

			org.json.JSONObject crypto = new org.json.JSONObject();
			res = getResult(consoleText, "crypto");
			crypto.put("Global result", res);
			res = getResult(consoleText, "aes");
			crypto.put("aes", res);
			res = getResult(consoleText, "md5");
			crypto.put("md5", res);
			res = getResult(consoleText, "sha1");
			crypto.put("sha1", res);
			obj.put("crypto", crypto);

			org.json.JSONObject date = new org.json.JSONObject();
			res = getResult(consoleText, "date");
			date.put("Global result", res);
			res = getResult(consoleText, "format-tofte");
			date.put("format-tofte", res);
			res = getResult(consoleText, "format-xparb");
			date.put("format-xparb", res);
			obj.put("date", date);

			org.json.JSONObject math = new org.json.JSONObject();
			res = getResult(consoleText, "math");
			math.put("Global result", res);
			res = getResult(consoleText, "cordic");
			math.put("cordic", res);
			res = getResult(consoleText, "partial-sums");
			math.put("partial-sums", res);
			res = getResult(consoleText, "spectral-norm");
			math.put("spectral-norm", res);
			obj.put("math", math);

			org.json.JSONObject regexp = new org.json.JSONObject();
			res = getResult(consoleText, "regexp");
			regexp.put("Global result", res);
			res = getResult(consoleText, "dna");
			regexp.put("dna", res);
			obj.put("regexp", regexp);

			org.json.JSONObject string = new org.json.JSONObject();
			res = getResult(consoleText, "string");
			string.put("Global result", res);
			res = getResult(consoleText, "base64");
			string.put("base64", res);
			res = getResult(consoleText, "fasta");
			string.put("fasta", res);
			res = getResult(consoleText, "tagcloud");
			string.put("tagcloud", res);
			res = getResult(consoleText, "unpack-code");
			string.put("unpack-code", res);
			res = getResult(consoleText, "validate-input");
			string.put("validate-input", res);
			obj.put("string", string);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}

		DB.registerResult(DB.tc, deviceObj, obj);
	}
}
