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

public class TestKraken extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/Kraken/kraken-1-1/driver.html";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("Kraken.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 7200);

		// wait until score that indicates duration of test is displayed
		try 
		{
			System.out.println("Waiting for console results");
			
			// Wait until end of test
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("console")));
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
		System.out.println("Kraken.getResult() " + name);
		String str = name + ':';
		int start = test.indexOf(str) + str.length();
		int end = test.indexOf("ms", start);
		String nb = test.substring(start, end).trim();
		return Float.parseFloat(nb);
	}

	@Test
	public void testFPS() 
	{
		WebElement console = wd.findElement(By.id("console"));
		String consoleText = console.getText();

		System.out.println("### console text is:" + consoleText + " ");

		float totalTime = getResult(consoleText, "Total");
		System.out.println("### totalTime is:" + totalTime + " ");

		float ai = getResult(consoleText, "ai");
		System.out.println("### ai is:" + ai + " ");

		float astar = getResult(consoleText, "astar");
		System.out.println("### astar is:" + astar + " ");

		float audio = getResult(consoleText, "audio");
		System.out.println("### audio is:" + audio + " ");

		float beat_detection = getResult(consoleText, "beat-detection");
		System.out.println("### beat-detection is:" + beat_detection + " ");

		float dft = getResult(consoleText, "dft");
		System.out.println("### dft is:" + dft + " ");

		float fft = getResult(consoleText, "fft");
		System.out.println("### fft is:" + fft + " ");

		float oscillator = getResult(consoleText, "oscillator");
		System.out.println("### oscillator is:" + oscillator + " ");

		float imaging = getResult(consoleText, "imaging");
		System.out.println("### imaging is:" + imaging + " ");

		float gaussian_blur = getResult(consoleText, "gaussian-blur");
		System.out.println("### gaussian-blur is:" + gaussian_blur + " ");

		float darkroom = getResult(consoleText, "darkroom");
		System.out.println("### darkroom is:" + darkroom + " ");

		float desaturate = getResult(consoleText, "desaturate");
		System.out.println("### desaturate is:" + desaturate + " ");

		float json = getResult(consoleText, "json");
		System.out.println("### json is:" + json + " ");

		float parse_financial = getResult(consoleText, "parse-financial");
		System.out.println("### parse-financial is:" + parse_financial + " ");

		float stringify_tinderbox = getResult(consoleText,
				"stringify-tinderbox");
		System.out.println("### stringify-tinderbox is:" + stringify_tinderbox
				+ " ");

		float stanford = getResult(consoleText, "stanford");
		System.out.println("### stanford is:" + stanford + " ");

		float crypto_aes = getResult(consoleText, "crypto-aes");
		System.out.println("### crypto-aes is:" + crypto_aes + " ");

		float crypto_ccm = getResult(consoleText, "crypto-ccm");
		System.out.println("### crypto-ccm is:" + crypto_ccm + " ");

		float crypto_pbkdf2 = getResult(consoleText, "crypto-pbkdf2");
		System.out.println("### crypto-pbkdf2 is:" + crypto_pbkdf2 + " ");

		float crypto_sha256_iterative = getResult(consoleText,
				"crypto-sha256-iterative");
		System.out.println("### crypto-sha256-iterative is:"
				+ crypto_sha256_iterative + " ");

		DButilities DB = new DButilities();
		
		DB.addTestCase("Kraken benchmark duration",
				       "A Javascript benchmark from Mozilla fundation", 
				       "internal",
				        url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("Total", totalTime);

			org.json.JSONObject ai_res = new org.json.JSONObject();
			ai_res.put("Global result", ai);
			ai_res.put("astar", astar);
			obj.put("ai", ai_res);

			org.json.JSONObject audio_res = new org.json.JSONObject();
			audio_res.put("Global result", audio);
			audio_res.put("beat-detection", beat_detection);
			audio_res.put("dft", dft);
			audio_res.put("fft", fft);
			audio_res.put("oscillator", oscillator);
			obj.put("audio", audio_res);

			org.json.JSONObject imaging_res = new org.json.JSONObject();
			imaging_res.put("Global result", imaging);
			imaging_res.put("gaussian-blur", gaussian_blur);
			imaging_res.put("darkroom", darkroom);
			imaging_res.put("desaturate", desaturate);
			obj.put("imaging", imaging_res);

			org.json.JSONObject json_res = new org.json.JSONObject();
			json_res.put("Global result", json);
			json_res.put("parse-financial", parse_financial);
			json_res.put("stringify-tinderbox", stringify_tinderbox);
			obj.put("json", json_res);

			org.json.JSONObject stanford_res = new org.json.JSONObject();
			stanford_res.put("Global result", stanford);
			stanford_res.put("crypto-aes", crypto_aes);
			stanford_res.put("crypto-ccm", crypto_ccm);
			stanford_res.put("crypto-pbkdf2", crypto_pbkdf2);
			stanford_res.put("crypto-sha256-iterative", crypto_sha256_iterative);
			obj.put("stanford", stanford_res);

			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}