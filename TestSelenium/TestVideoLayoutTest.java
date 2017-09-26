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

public class TestVideoLayoutTest extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/Video_Layout_tests/video/";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestVideoLayoutTest.setUp()");
	}

	@AfterClass
	public void afterClass() 
	{
		wd.quit();
	}

	@Test
	public void testFPS() throws InterruptedException 
	{
		float res = 0;
		int i = 0;
		int isFailed = 0;
		int isComplete = 0;
		int nbFailed = 0;
		WebDriverWait wait = new WebDriverWait(wd, 800);
		org.json.JSONObject obj = new org.json.JSONObject();

		String testTitle[] =
		{
			"events/event_canplay",
			"events/event_canplaythrough",
			"events/event_loadeddata",
			"events/event_loadedmetadata",
			"events/event_loadstart",
			"events/event_order_canplay_canplaythrough",
			"events/event_order_canplay_playing",
			"events/event_loadedmetadata",
			"events/event_order_loadstart_progress",
			"events/event_play",
			"events/event_playing",
			"events/event_progress",
			"events/event_timeupdate",
			"error/error_null",
			"error/error_onerror_called_on_bogus_source",
			"error/error_property_exists",
			"currentSrc/currentSrc_empty_if_no_src",
			"currentSrc/currentSrc_nonempty_after_adding_source_child",
			"currentSrc/currentSrc_nonempty_after_setting_src",
			"currentSrc/currentSrc_property_exists",
			"canPlayType/canPlayType_application_octet_stream",
			"canPlayType/canPlayType_application_octet_stream_with_codecs_1",
			"canPlayType/canPlayType_application_octet_stream_with_codecs_2",
			"canPlayType/canPlayType_application_octet_stream_with_codecs_3",
			"canPlayType/canPlayType_bogus_type",
			"canPlayType/canPlayType_codecs_order_1",
			"canPlayType/canPlayType_codecs_order_2",
			"canPlayType/canPlayType_codecs_order_3",
			"canPlayType/canPlayType_method_exists",
			"canPlayType/canPlayType_supported_but_no_codecs_parameter_1",
			"canPlayType/canPlayType_supported_but_no_codecs_parameter_2",
			"canPlayType/canPlayType_supported_but_no_codecs_parameter_3",
			"canPlayType/canPlayType_two_implies_one_1",
			"canPlayType/canPlayType_two_implies_one_2",
			"canPlayType/canPlayType_two_implies_one_3",
			"canPlayType/canPlayType_two_implies_one_4",
			"canPlayType/canPlayType_two_implies_one_5",
			"canPlayType/canPlayType_two_implies_one_6",
			"networkState/networkState_during_loadstart",
			"networkState/networkState_during_progress",
			"networkState/networkState_initial",
			"networkState/networkState_property_exists",
			"paused/paused_false_during_play",
			"paused/paused_true_during_pause",
			"preload/preload_property_exists",
			"preload/preload_reflects_auto_value",
			"preload/preload_reflects_bogus_value",
			"preload/preload_reflects_empty",
			"preload/preload_reflects_metadata",
			"preload/preload_reflects_no_value",
			"preload/preload_reflects_none",
			"preload/preload_reflects_none_autoplay",
			"readyState/readyState_during_canplay",
			"readyState/readyState_during_canplaythrough",
			"readyState/readyState_during_loadeddata",
			"readyState/readyState_during_loadedmetadata",
			"readyState/readyState_during_playing",
			"readyState/readyState_initial",
			"readyState/readyState_property_exists",
			"src/src_reflects_attribute_not_source_elements",
			"src/src_reflects_no_value",
			"src/src_removal_does_not_trigger_loadstart",

		};

		for (int temp = 0; temp < testTitle.length; temp++) 
		{
			// Number of pass tests
			try 
			{
				System.out.println("### Testing " + testTitle[temp] + " ");

				wd.get(url + testTitle[temp] + ".html");
				
				// maximum time to wait
				wait = new WebDriverWait(wd, 800);
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("pass")));

			} catch (Exception e1) 
			{
				e1.printStackTrace();
				TestCase.fail(e1.getMessage());
			}

			WebElement console = wd.findElement(By.id("console"));
			String consoleText = console.getText();

			System.out.println("### consoleText is " + consoleText + " ");

			isComplete = consoleText.indexOf("TEST COMPLETE");

			// reset value
			nbFailed = 0;

			// Search the patter at any position
			for (i = 0; i < consoleText.length(); i++) 
			{
				isFailed = consoleText.indexOf("FAIL", i);

				// use this scale to see something in the graph
				if (isFailed >= 0) 
				{
					nbFailed++;
				}
			}

			// use this scale to see something in the graph
			if ((nbFailed > 0) || (isComplete < 0)) 
			{
				res = 5;
			} 
			else 
			{
				res = 100;
			}

			try 
			{
				obj.put("" + testTitle[temp] + "<br>", res);
			} 
			catch (JSONException e1) 
			{
				e1.printStackTrace();
			}

			// wait a little: 5 seconds
			Thread.sleep(5000);
		}

		DButilities DB = new DButilities();
		DB.addTestCase("Video layout test", 
				       "Video layout tests from WebkitQt",
				       "internal", 
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		DB.registerResult(DB.tc, deviceObj, obj);
	}
}
