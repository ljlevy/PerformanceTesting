package demo2;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.DriverCommand;
import org.openqa.selenium.remote.RemoteWebDriver;

/**
 * Class that implements TakesScreenshot interface.
 */
public class DemoWebDriver extends RemoteWebDriver implements TakesScreenshot 
{
	public DemoWebDriver(java.net.URL url2, DesiredCapabilities cap) 
	{
		// TODO Auto-generated constructor stub
		super(url2, cap);
	}

	// Template
	public <X> X getScreenshotAs(OutputType<X> target) 
	{
		// Get the screenshot as base64.
		String base64 = execute(DriverCommand.SCREENSHOT).getValue().toString();
		// ... and convert it.
		return target.convertFromBase64Png(base64);
	}
}
