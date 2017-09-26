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

public class TestOrangeMarkStats extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/orangemark-master/index.html";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestOrangeMarksetUp()");
		wd.get(url);

		// maximum time to wait
		WebDriverWait wait = new WebDriverWait(wd, 4000);				
		

		// Wait until end of tests is displayed (a div with id :"FinalTestResult")
		try 
		{
			System.out.println("### Waiting for FinalTestResult display");
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("FinalTestResult")));
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
	public void testOrangeMark() 
	{
		System.out.println("### Getting pass class values ");

		String testTitle[] = { "2d/frame-color", "2d/frame-color-alpha",
				"2d/frame-left-top", "2d/frame-opacity", "2d/frame-reflect",
				"2d/frame-rotate", "2d/frame-scale", "2d/frame-skew",
				"2d/frame-matrix", "2d/frame-border-radius",
				"2d/frame-width-height", "2d/frame-linear-gradient",
				"2d/image-left-top", "2d/image-opacity", "2d/image-reflect",
				"2d/image-rotate", "2d/image-scale", "2d/image-skew",
				"2d/image-matrix", "2d/text-left-top", "2d/text-opacity",
				"2d/text-reflect", "2d/text-rotate", "2d/text-scale",
				"2d/text-skew", "2d/text-emboss", "3d/frame-rotateXYZ",
				"3d/image-rotateXYZ", "3d/text-rotateXYZ", "3d/card-rotateXYZ",
				"3d/frame-carousel-rotateY", "3d/text-carousel-rotateY",
				"3d/image-carousel-rotateY", "3d/frame-sphere-rotateXYZ",
				"3d/text-carousel-rotateY", "3d/image-carousel-rotateY",
				"canvas/canvas-line", "canvas/canvas-arc",
				"canvas/canvas-bezier", "canvas/canvas-text",
				"webgl/webgl-bump", "webgl/webgl-flat", "webgl/webgl-opacity",
				"webgl/webgl-reflect" };
		
		WebElement NbWebPass[] = { null, null, null, null, null, null, null,
				null, null, null, null, null, null, null, null, null, null,
				null, null, null, null, null, null, null, null, null, null,
				null, null, null, null, null, null, null, null, null, null,
				null, null, null, null, null, null, null };
		
		WebElement FailedFpsWebDetail[] = { null, null, null, null, null, null,
				null, null, null, null, null, null, null, null, null, null,
				null, null, null, null, null, null, null, null, null, null,
				null, null, null, null, null, null, null, null, null, null,
				null, null, null, null, null, null, null };
		
		WebElement Score2DWeb = null;
		WebElement Score3DWeb = null;
		WebElement ScoreCanvasWeb = null;
		WebElement ScoreWebglWeb = null;

		String nbPass[] = { "", "", "", "", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
				"", "", "", "", "", "", "", "", "", "", "", "", "", "", "" };
		String consoleText;
		int start, end;
		
		int FailedFps[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0 };
		
		float Score2D = 0;
		float Score3D = 0;
		float ScoreCanvas = 0;
		float ScoreWebgl = 0;

		for (int temp = 0; temp < testTitle.length; temp++) 
		{
			// Number of pass tests
			try 
			{
				NbWebPass[temp] = wd.findElement(By.id("Score" + temp + ""));
				consoleText = NbWebPass[temp].getText();
				System.out.println("### consoleText is:" + consoleText + "");

				start = consoleText.indexOf("");
				end = consoleText.indexOf("/10");
				System.out.println("### start is:" + start + ", end is: " + end+ " ");
				nbPass[temp] = consoleText.substring(start, end).trim();
				System.out.println("### Nb of passed tests is:" + nbPass[temp]+ " ");
			} 
			catch (Exception e) 
			{
				nbPass[temp] = "0";
			}

			// Failed FPS detail
			try 
			{
				FailedFpsWebDetail[temp] = wd.findElement(By.id("FailedFps"+ temp + ""));
				consoleText = FailedFpsWebDetail[temp].getText();
				System.out.println("### Failed FPS  is:" + consoleText + " ");
				start = consoleText.indexOf("");
				end = consoleText.indexOf("");
				System.out.println("### start is:" + start + ", end is: " + end	+ " ");
				FailedFps[temp] = Integer.parseInt(consoleText.substring(start, end).trim());
				System.out.println("TestOrangeMarkStats: " + testTitle[temp] + "  Failed Fps " + FailedFps[temp]);
			} 
			catch (Exception e) 
			{
				FailedFps[temp] = 25;
			}

		}

		DButilities DB = new DButilities();
		DB.addTestCase("OrangeMark benchmark",
				       "Orange Browser Graphics Performances", 
				       "internal", 
				       url);
		
		org.json.JSONObject deviceObj = DB.addDevice(DB.deviceMW(), 
				                                     DB.deviceMVER(),
				                                     DB.deviceMODEL(), 
				                                     DB.deviceMAC());

		org.json.JSONObject obj = new org.json.JSONObject();
		try 
		{
			for (int temp = 0; temp < testTitle.length; temp++) 
			{
				obj.put("" + testTitle[temp] + "  Nb passed ", nbPass[temp]);
				obj.put("" + testTitle[temp] + "  Failed Fps ", FailedFps[temp]);
			}

			Score2DWeb = wd.findElement(By.id("Score2D"));
			consoleText = Score2DWeb.getText();
			System.out.println("### Score2D is:" + consoleText + "");
			start = consoleText.indexOf("");
			end = consoleText.indexOf("") + consoleText.length();
			System.out.println("### start is:" + start + ", end is: " + end + " ");
			Score2D = Float.parseFloat(consoleText.substring(start, end).trim());
			System.out.println("TestOrangeMarkStats: Score2D: " + Score2D + " ");

			obj.put("Score2D", Score2D);

			Score3DWeb = wd.findElement(By.id("Score3D"));
			consoleText = Score3DWeb.getText();
			System.out.println("### Score3D is:" + consoleText + "");
			start = consoleText.indexOf("");
			end = consoleText.indexOf("") + consoleText.length();
			System.out.println("### start is:" + start + ", end is: " + end + " ");
			Score3D = Float.parseFloat(consoleText.substring(start, end).trim());
			System.out.println("TestOrangeMarkStats: Score3D: " + Score3D + " ");
			obj.put("Score3D", Score3D);

			ScoreCanvasWeb = wd.findElement(By.id("ScoreCanvas"));
			consoleText = ScoreCanvasWeb.getText();
			System.out.println("### ScoreCanvas is:" + consoleText + "");
			start = consoleText.indexOf("");
			end = consoleText.indexOf("") + consoleText.length();
			System.out.println("### start is:" + start + ", end is: " + end+ " ");
			ScoreCanvas = Float.parseFloat(consoleText.substring(start, end).trim());
			System.out.println("TestOrangeMarkStats: ScoreCanvas: "+ ScoreCanvas + " ");
			obj.put("ScoreCanvas", ScoreCanvas);

			// It is unsupported for QT48
			try 
			{
				ScoreWebglWeb = wd.findElement(By.id("ScoreWebGL"));
				consoleText = ScoreWebglWeb.getText();
				System.out.println("### ScoreWebgl is:" + consoleText + "");
				start = consoleText.indexOf("");
				end = consoleText.indexOf("") + consoleText.length();
				System.out.println("### start is:" + start + ", end is: " + end+ " ");
				ScoreWebgl = Float.parseFloat(consoleText.substring(start, end).trim());
				System.out.println("TestOrangeMarkStats: ScoreWebgl: "+ ScoreWebgl + " ");

			} 
			catch (Exception e) 
			{
				ScoreWebgl = 0;
			}
			obj.put("ScoreWebgl", ScoreWebgl);
			DB.registerResult(DB.tc, deviceObj, obj);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}
	}
}
