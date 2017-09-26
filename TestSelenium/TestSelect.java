package demo2;

import java.io.File;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebElement;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;



//For screen capture 
import java.awt.AWTException;
import java.awt.Dimension;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.IOException;

import javax.imageio.ImageIO;

import static java.lang.System.err;

public class TestSelect extends DemoTest 
{
	private final String url = DButilities.DB_SERVER+ "/TestSuite/Select/pop_up_select_test.htm";
	
    private String tmp_resfile = "/tmp/TestSelect.jpg";

	@BeforeClass
	public void beforeClass() throws Exception 
	{
		DemoTest.setUpWD();

		System.out.println("TestSelect.setUp()");
		wd.get(url);

		// wait a little : 5 seconds until the page has been loaded
		Thread.sleep(5000);

		try 
		{				
			// Click a first one to expand
			WebElement StartBtn = wd.findElement(By.id("formselect"));
			StartBtn.click();		
			
			// Wait a little : 5 seconds until we see the selection list
			Thread.sleep(5000);
			
			// Wait a little : 5 seconds until we see the selection list
			Thread.sleep(5000);			
			
			
		} catch (Exception e1) 
		{
			System.out.println("Item to select not found");
		}
	}

	@AfterClass
	public void afterClass() 
	{
		wd.quit();
	}

	@Test
	public void testSelect() 
	{
		
		WebElement console = wd.findElement(By.id("MyText"));
		
		String consoleText = console.getText();
		
		System.out.println("### consoleText is:" + consoleText + " ");
		
		
		/* -------------------------------- */
		/* ---- Begin Take screen shot ----- */
		/* -------------------------------- */

		try {
			   // take screenshot and save it in a file
			   File scrFile = ((TakesScreenshot) wd).getScreenshotAs(OutputType.FILE);
	
			   File destFile= new File(""+tmp_resfile+"");
			   
				Thread.sleep(20000);

				// copy the file to the required path
				FileUtils.copyFile(scrFile, destFile);	
				

			} 
		    catch (Exception e) 
		    {
				// if it fails to take screenshot then this block will execute
				System.out.println("Failure to take screenshot " + e);
			     e.printStackTrace();

			}

		/* ----------------------------------- */
		/* ----- End take a screen shot ------- */
		/* ----------------------------------- */			
		
		final String newFileName="/tmp/TestSelect2.jpg";
		final String newFileFormat="jpg";
		final int newDelayInMs= 20000;
		
		GraphicsDevice[] screens = GraphicsEnvironment.getLocalGraphicsEnvironment().getScreenDevices();
				
		final Dimension screenDimension = Toolkit.getDefaultToolkit().getScreenSize();
	    final Rectangle screenRectangle = new Rectangle(screenDimension);
	    try
	    {
	        final Robot robot = new Robot(screens[0]);
	        robot.delay(newDelayInMs);
	        final BufferedImage screenImage = robot.createScreenCapture(screenRectangle);
	        ImageIO.write(screenImage, newFileFormat, new File(newFileName));
	    }
	    catch (AWTException awtEx)
	    {
	        if (System.console() == null)
	        {
	            err.println("Not supported for headless console - " + awtEx.toString());
	        }
	        else
	        {
	            err.println("Not supported for this environment - " + awtEx.toString());
	        }
	     }
	     catch (IOException ioEx)
	     {
	         err.println("Unable to write screen shot to file " + newFileName + " - "+ ioEx.toString());
	      }				
	}
}