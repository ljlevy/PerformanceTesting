package demo2;

import java.io.IOException;

import junit.framework.TestCase;

import org.json.JSONException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestJetStream extends DemoTest {
	//private final String url = "http://www.browserbench.org/JetStream";

	private final String url = DButilities.DB_SERVER+ "/TestSuite/JetStream/index.html";
	
	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("JetStream.setUp()");
		wd.get(url);

		WebDriverWait wait = new WebDriverWait(wd, 4800);
		try 
		{

			WebElement TlsBtn = wd.findElement(By.id("status"));
			TlsBtn.click();
			System.out.println("Clicking on Start Test button, looking for show-details");

			// Wait until end of test
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[@class=\"score\"]")));
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
	public void testFPS() throws IOException 
	{
		WebElement console = wd.findElement(By.id("results-cell-geomean-Latency"));
		String consoleText = console.getText();
		int start = 0;
		int end = consoleText.indexOf(" ±");
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		System.out.println("### Latency is:" + consoleText + " ");
		float latency = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-regex-dna"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### Regex Dna is:" + consoleText + " ");
		float regex_dna = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-gcc-loops.cpp"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### Gcc loops is:" + consoleText + " ");
		float gcc_loops_cpp = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-3d-cube"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### 3D cube is:" + consoleText + " ");
		float d_cube = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-splay-latency"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### Splay latency is:" + consoleText + " ");
		float splay_latency = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-hash-map"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### Hash map is:" + consoleText + " ");
		float hash_map = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-3d-raytrace"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### 3D raytrace is:" + consoleText + " ");
		float d_raytrace = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-tagcloud"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### tag cloud is:" + consoleText + " ");
		float tag_cloud = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-mandreel"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### mandreel is:" + consoleText + " ");
		float mandreel = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-base64"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### base64 is:" + consoleText + " ");
		float base = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-typescript"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### typescript is:" + consoleText + " ");
		float typescript = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-n-body.c"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### n body c is:" + consoleText + " ");
		float n_body_c = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-code-first-load"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### code first load is:" + consoleText + " ");
		float code_first = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-geomean-Throughput"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### Throughput is:" + consoleText + " ");
		float throughput = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-navier-stokes"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### navier stokes is:" + consoleText + " ");
		float navier_stokes = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-code-multi-load"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### code multi load is:" + consoleText + " ");
		float code_multi_load = Float.parseFloat(consoleText.substring(start,end).trim());

		console = wd.findElement(By.id("results-cell-bigfib.cpp"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### bigfib.cpp is:" + consoleText + " ");
		float bigfib_cpp = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-pdfjs"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### pdfjs is:" + consoleText + " ");
		float pdfjs = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-cdjs"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### cdjs is:" + consoleText + " ");
		float cdjs = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-box2d"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### box2d is:" + consoleText + " ");
		float box = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-proto-raytracer"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### proto raytracer is:" + consoleText + " ");
		float proto_raytracer = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-crypto-aes"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### crypto aes is:" + consoleText + " ");
		float crypto_aes = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-container.cpp"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### container cpp is:" + consoleText + " ");
		float container_cpp = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-quicksort.c"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### quicksort c is:" + consoleText + " ");
		float quicksort_c = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-crypto-md5"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### crypto md5 is:" + consoleText + " ");
		float crypto_md5 = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-crypto"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### crypto is:" + consoleText + " ");
		float crypto = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-regexp-2010"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### regexp 2010 is:" + consoleText + " ");
		float regexp_2010 = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-crypto-sha1"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### crypto sha1 is:" + consoleText + " ");
		float crypto_sha1 = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-delta-blue"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### delta blue is:" + consoleText + " ");
		float delta_blue = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-richards"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### richards is:" + consoleText + " ");
		float richards = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-date-format-tofte"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### date format tofte is:" + consoleText + " ");
		float date_format_tofte = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-dry.c"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### dry c is:" + consoleText + " ");
		float dry_c = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-splay"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### splay is:" + consoleText + " ");
		float splay = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-date-format-xparb"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### date format xparb is:" + consoleText + " ");
		float date_format_xparb = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-earley-boyer"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### earley boyer is:" + consoleText + " ");
		float earley_boyer = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-towers.c"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### towers.c is:" + consoleText + " ");
		float towers_c = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-mandreel-latency"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### mandreel latency is:" + consoleText + " ");
		float mandreel_latency = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-float-mm.c"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### float_mm_c is:" + consoleText + " ");
		float float_mm_c = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-zlib"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### zlib is:" + consoleText + " ");
		float zlib = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-n-body"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### n-body is:" + consoleText + " ");
		float n_body = Float.parseFloat(consoleText.substring(start, end).trim());

		console = wd.findElement(By.id("results-cell-gbemu"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### gbemu is:" + consoleText + " ");
		float gbemu = Float.parseFloat(consoleText.substring(start, end).trim());

		/* Geometric mean */
		console = wd.findElement(By.id("results-cell-geomean"));
		consoleText = console.getText();
		start = 0;
		end = consoleText.indexOf(" ±");
		System.out.println("### Result number is:" + consoleText + " ");
		float resNumber = Float.parseFloat(consoleText.substring(start, end).trim());

		DButilities DB = new DButilities();
		DB.addTestCase("Jet Stream benchmark score",
				       "Javascript benchmark suite focused on the most advanced web applications",
				       "internal", 
				       url);

		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());
		
		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("Total Score is", resNumber);
			obj.put("Latency is", latency);
			obj.put("Regex Dna is", regex_dna);
			obj.put("Gcc loops is", gcc_loops_cpp);
			obj.put("3D cube is", d_cube);
			obj.put("Splay latency is", splay_latency);
			obj.put("Hash map is", hash_map);
			obj.put("3D ray trace is", d_raytrace);
			obj.put("tag cloud is", tag_cloud);
			obj.put("mandreel is", mandreel);
			obj.put("base 64 is", base);
			obj.put("typescript is", typescript);
			obj.put("n body c is", n_body_c);
			obj.put("code first load is", code_first);
			obj.put("Throughput is", throughput);
			obj.put("navier stokes is", navier_stokes);
			obj.put("code multi load is", code_multi_load);
			obj.put("bigfib cpp is", bigfib_cpp);
			obj.put("pdfjs is", pdfjs);
			obj.put("cdjs is", cdjs);
			obj.put("box2d is", box);
			obj.put("proto raytracer is", proto_raytracer);
			obj.put("crypto aes is", crypto_aes);
			obj.put("container cpp is", container_cpp);
			obj.put("quicksort c is", quicksort_c);
			obj.put("crypto md5 is", crypto_md5);
			obj.put("crypto is", crypto);
			obj.put("regexp 2010 is", regexp_2010);
			obj.put("crypto sha1 is", crypto_sha1);
			obj.put("delta blue is", delta_blue);
			obj.put("richards is", richards);
			obj.put("date format tofte is", date_format_tofte);
			obj.put("dry c is", dry_c);
			obj.put("splay is", splay);
			obj.put("date format xparb is", date_format_xparb);
			obj.put("earley boyer is", earley_boyer);
			obj.put("towers c is", towers_c);
			obj.put("mandreel latency is", mandreel_latency);
			obj.put("float mm c is", float_mm_c);
			obj.put("zlib is", zlib);
			obj.put("n body is", n_body);
			obj.put("gbemu is", gbemu);

			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}
