package demo2;

import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.testng.TestNG;
import org.testng.xml.XmlSuite;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * Main class that reads an xml config file  to run test cases sequentially
 * 
 */

public class MainTest 
{
	/**
	 * @param args
	 */
	public static void main(String[] args) 
	{
		System.out.println("MainTest");

		System.out.println("MainTest.main() " + " " + args[0]);
		try 
		{
			File fXmlFile = new File(args[0]);
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(fXmlFile);
			doc.getDocumentElement().normalize();
			NodeList nList = doc.getElementsByTagName("stbconfig");

			System.out.println("----------------------------");

			String wdURL = null;
			String wdMAC = null;
			String wdMW = null;
			String wdMVER = null;
			String wdMODEL = null;
			String wdPost = null;

			for (int temp = 0; temp < nList.getLength(); temp++) 
			{
				Element e = (Element) nList.item(temp);
				wdMAC = e.getAttribute("mac");
				wdURL = e.getAttribute("url");
				wdMW = e.getAttribute("middleware");
				wdMVER = e.getAttribute("version");
				wdMODEL = e.getAttribute("model");
				wdPost = e.getAttribute("post");
				
				System.out.println("-----Mac is: " + wdMAC + " url is:" + wdURL
						          + " middleware is : " + wdMW + " version is : "
						          + wdMVER + " Model is: " + wdMODEL);
			}

			if (wdURL == null)
				throw new Error();
			if (wdMW == null)
				throw new Error();
			if (wdMVER == null)
				throw new Error();
			if (wdMODEL == null)
				throw new Error();
			if (wdMAC == null)
				throw new Error();			
			if (wdPost == null)
				throw new Error();			
			

			DemoTest.URL = wdURL;
			DButilities.MAC = wdMAC;
			DButilities.MVER = wdMVER;
			DButilities.MODEL = wdMODEL;
			DButilities.MW = wdMW;
			DButilities.POST = wdPost;

			System.out.println("MainTest.main() WXDURL " + wdURL);
			nList = doc.getElementsByTagName("database");

			System.out.println("----------------------------");

			for (int temp = 0; temp < nList.getLength(); temp++) 
			{
				Element e = (Element) nList.item(temp);

				String url = e.getAttribute("url");

				System.out.println("\n-----Url of the database: " + url);
			}

			nList = doc.getElementsByTagName("class");

			System.out.println("----------------------------");

			@SuppressWarnings("rawtypes")
			Class[] classes = new Class[nList.getLength()];

			for (int temp = 0; temp < nList.getLength(); temp++) 
			{
				Element e = (Element) nList.item(temp);

				String Myname = e.getAttribute("name");

				System.out.println("\n----- Test to run is : " + Myname);

				classes[temp] = Class.forName(Myname);
			}

			TestNG test = new TestNG();

			test.setTestClasses(classes);
			
			// Follow test order without parallelizing 
			test.setPreserveOrder(true);
			test.setParallel(XmlSuite.PARALLEL_NONE);

			test.run();
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}

	XmlSuite s = new XmlSuite();
}
