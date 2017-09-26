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

import demo2.DButilities;
import demo2.DemoTest;

public class TestDash extends DemoTest 
{
	private final String url = DButilities.DB_SERVER
			+ "/TestSuite/Dash/dash_youtube/dash-player.html?url="
			+ "http://yt-dash-mse-test.commondatastorage.googleapis.com/media/"
			+ "car-20120827-manifest.mpd";

	
	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestDash.setUp()");
		wd.get(url);

		System.out.println("TestDash.setUp() current url " + wd.getCurrentUrl());

		WebDriverWait wait = new WebDriverWait(wd, 600);

		// wait until score that indicates duration of test is displayed
		try 
		{
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("EndTest")));
		} 
		catch (Exception e1) 
		{
			e1.printStackTrace();
			TestCase.fail(e1.getMessage());
		}
	}

	@AfterClass
	public void afterClass() {
		wd.quit();
	}

	@Test
	public void testFPS() 
	{
		String audio_decoded = "";
		String video_decoded = "";
		String frame_decoded = "";
		String dropped_frames = "";
		float average_audio_decoded = 0;
		float average_video_decoded = 0;
		float average_frame_decoded = 0;
		float average_dropped_frames = 0;
		int start = 0;
		int end = 0;
		WebElement console = null;

		console = wd.findElement(By.id("audio_decoded"));
		String consoleText = console.getText();

		start = consoleText.indexOf("p/s: ") + 4;
		end = consoleText.indexOf(".") == -1 ? start + 4 : consoleText.indexOf(".") + 3;
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		audio_decoded = consoleText.substring(start, end).trim();
		System.out.println("### audio_decoded is:" + audio_decoded + " ");

		if (!audio_decoded.equals("NaN")) 
		{
			average_audio_decoded = Float.parseFloat(audio_decoded);
			average_audio_decoded = average_audio_decoded / 100;
			System.out.println("### average_audio_decoded is:"+ average_audio_decoded + " ");
		}

		console = wd.findElement(By.id("video_decoded"));
		consoleText = console.getText();

		start = consoleText.indexOf("p/s: ") + 4;
		end = consoleText.indexOf(".") == -1 ? start + 4 : consoleText
				.indexOf(".") + 3;
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		video_decoded = consoleText.substring(start, end).trim();
		System.out.println("### video_decoded is:" + video_decoded + " ");

		if (!video_decoded.equals("NaN")) 
		{
			average_video_decoded = Float.parseFloat(video_decoded);
			average_video_decoded = average_video_decoded / 100;
			System.out.println("### average_video_decoded is:"+ average_video_decoded + " ");
		}

		console = wd.findElement(By.id("frames_decoded"));
		consoleText = console.getText();

		start = consoleText.indexOf("p/s: ") + 4;
		end = consoleText.indexOf(".") == -1 ? start + 4 : consoleText.indexOf(".") + 3;
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		frame_decoded = consoleText.substring(start, end).trim();
		System.out.println("### frame_decoded is:" + frame_decoded + " ");

		if (!frame_decoded.equals("NaN")) 
		{
			average_frame_decoded = Float.parseFloat(frame_decoded);
			System.out.println("### average_frame_decoded is:"+ average_frame_decoded + " ");
		}

		console = wd.findElement(By.id("dropped_frames"));
		consoleText = console.getText();

		start = consoleText.indexOf("p/s: ") + 4;
		end = consoleText.indexOf(".") == -1 ? start + 4 : consoleText.indexOf(".");
		System.out.println("### start is:" + start + ", end is: " + end + " ");
		dropped_frames = consoleText.substring(start, end).trim();
		System.out.println("### dropped_frames is:" + dropped_frames + " ");

		if (!dropped_frames.equals("NaN")) 
		{
			average_dropped_frames = Integer.parseInt(dropped_frames);
			System.out.println("### average_dropped_frames is:"+ average_dropped_frames + " ");
		}

		DButilities DB = new DButilities();
		DB.addTestCase("Frame score statistics on Dash",
				       "Statistics and score on decoding frames on dash", "internal",
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("average aud decoded x100", average_audio_decoded);
			obj.put("average vid decoded x100 ", average_video_decoded);
			obj.put("average frame decoded", average_frame_decoded);
			obj.put("average dropped frames", average_dropped_frames);

			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}