package demo2;


import org.json.JSONException;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * 
 * This class allow to store result of performances tests associated to 
 * a middleware/version in a database.
 */
public class DButilities
{
	private final String USER_AGENT = "Mozilla/5.0";
	
	
	// Constants to specify
	private final static String SERVER_URL="http://URL_TO_DEFINE"; // For instance: http://nuxcmcwkit.com
    private final static String PORT="XXXX"; // For instance: "8899"
    
	static String MAC = "MY_MAC_ADRESS"; // For instance: "3C:62:00:7B:47:02";
	static String MW = "MY_MIDDLEWARE";  // For instance: "rdk2-1 IH";
	static String MVER = "MY_VERSION";   // For instance: "stable-17.0-50.102";
	static String MODEL = "MY_MODEL";    // For instance: "bcm_7252";
	// end to specify 
	
	public static String DB_SERVER = SERVER_URL + PORT;	
	static String POST = "true";

	org.json.JSONObject Testresult = new org.json.JSONObject();

	/*
	 *  A test case is defined by :
	 *  a name
	 *  a description
	 */
	class testcase 
	{
		String name;
		String description;
	};

	/*
	 * 
	 * A device test is defined by:
	 * a Dbserver: Data base server
	 * a middleware
	 * a middeware version
	 * a model
	 * a Mac address
	 * an IP address
	 * 
	 */
	class testDevice 
	{
		String DBserver;
		String middleware;
		String middlewareVersion;
		String model;
		String macadress;
		String IpAddress;
	};

	public testcase tc = new testcase();
	public testDevice tdevice = new testDevice();

    /**
    * Get http response after a get to an url
    * @param target: target added to root url
    * @param msg : additional message request
    */	
	private void GetMsg(String target, String msg) throws Exception 
	{
		String based_url = DB_SERVER;

		URL obj = new URL(based_url + target + msg);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		// Optional default is GET
		con.setRequestMethod("GET");

		// Add request header
		con.setRequestProperty("User-Agent", USER_AGENT);

		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'GET' request to URL : " + based_url);
		System.out.println("Response Code : " + responseCode);

		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) 
		{
			response.append(inputLine);
		}
		in.close();

		// print result
		System.out.println(response.toString());
	}
	
	
    /**
    * Post an Http request for a JSON message typ
    * @param target: target added to root url
    * @param msg : additional message request
    */		
	private void postmsg(String target, String msg) throws Exception 
	{
		String based_url = DB_SERVER;

		URL obj = new URL(based_url + target);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		System.out.println("URL to connect: "+based_url+" , "+target+" ");
		
		System.out.println("con.usingProxy: " + con.usingProxy());		
				
		// Add request header
		con.setRequestProperty("User-Agent", USER_AGENT);
		con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");		
		con.setRequestProperty("Content-Type", "application/json");		
		con.setRequestProperty("Accept", "application/json");		
		con.setRequestMethod("POST");		

		System.out.println("Set connect timeout of 3 seconds: ");		
		
		/* Set timeout of 3 seconds */ 
		con.setConnectTimeout(3000);
		con.setReadTimeout(3000);	
		
		String urlParameters = msg;
		System.out.println("POST " + msg);
		
		// Send post request
		con.setDoOutput(true);
		
		/* Post message is the option is activated */ 
		if ("true" == POST)
		{				
	      try
	      {
		      DataOutputStream wr = new DataOutputStream(con.getOutputStream());					
		
		      System.out.println("Write urlParameters: "+urlParameters+" ");						
		      wr.writeBytes(urlParameters);
		      wr.flush();
		      wr.close();

		      int responseCode = con.getResponseCode();
		      System.out.println("\nSending 'POST' request to URL : " + based_url);
		      System.out.println("Post parameters : " + urlParameters);
		      System.out.println("Response Code : " + responseCode);

		      BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		      String inputLine;
		      StringBuffer response = new StringBuffer();

		      while ((inputLine = in.readLine()) != null) 
		      {
			     response.append(inputLine);
		      }
		      in.close();

		   // print result
		   System.out.println(response.toString());
						
	      }
	      catch (Exception e)  
	      {
			   System.err.println("IOException"+e);
			   e.printStackTrace();
		   }			
		} /* end if Post message is the option is activated */
	} 


   /**
   * Implements getter
   */
	public String deviceMAC() 
	{
		return MAC;
	}

	public String deviceMW() 
	{
		return MW;
	}

	public String deviceMVER() 
	{
		return MVER;
	}

	public String deviceMODEL() 
	{
		return MODEL;
	}

	public String deviceRootUrl() 
	{
		return DB_SERVER;
	}

    /**
    * Add a test case in data base
    * @param name: test name
    * @param description : test description
    * @param localisation : internal/external url
    * @param url: url of the test to run.
    */	
	
	public void addTestCase(String name, 
			                String description,
			                String localisation, 
			                String url) 
	{
		tc.name = name;
		tc.description = description;

		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("name", name);
			obj.put("description", description);
			obj.put("localisation", localisation);
			obj.put("url", url);

		}
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}

		String tCase = obj.toString();

		try 
		{
			postmsg("/add?target=Test", tCase);
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}				
	}

	
    /**
    * Add device parameters in data base
    * @param midw: device middleware
    * @param version : device version
    * @param model : device model
    * @param addrmac: MAC address of the device.
    */		
	public org.json.JSONObject addDevice(String midw, 
			                             String version,
			                             String model, 
			                             String addrmac) 
	{
		testDevice tdevice = new testDevice();
		tdevice.middleware = midw;
		tdevice.middlewareVersion = version;
		tdevice.model = model;
		tdevice.macadress = addrmac;
		
		System.out.println("Calling addDevice");		

		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("middleware", midw);
			obj.put("middlewareVersion", version);
			obj.put("model", model);
			obj.put("macAddress", addrmac);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}

		String device = obj.toString();
		System.out.println(device);
		
		try 
		{
			postmsg("/add?target=STB", device);
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
		
		return obj;
	}
	
    /**
    * Remove a device from data base
    * @param deviceId: Device Identifier
    */
	public void removeDevice(String deviceId) 
	{
		try 
		{
			postmsg("/remove?target=STB&id=" + deviceId, "");
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}

    /**
    * Remove a test from data base
    * @param TestId: Test Identifier
    */
	public void removeTest(String TestId) 
	{
		try 
		{
			postmsg("/remove?target=Test&id", TestId);
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
	}

    /**
    * Get device name from a device Id
    * @param deviceId: Device Identifier
    */
	public String getDevice(String deviceId) 
	{
		String tCase = "";
		try 
		{
			GetMsg("/getSTB", tCase);
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
		return tCase;
	}


    /**
    * Register result associated to a test case/ device in the data base.
    * @param tc: test case to add
    * @param device: associated device
    * @param result: result to set
    */
	public void registerResult(testcase tc, 
			                   org.json.JSONObject device,
			                   org.json.JSONObject result) 
	{
		org.json.JSONObject test = new org.json.JSONObject();
		try 
		{
			test.put("name", tc.name);
			test.put("description", tc.description);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}

		org.json.JSONObject obj = new org.json.JSONObject();

		try 
		{
			obj.put("test", test);
			obj.put("device", device);
			obj.put("value", result);
		} 
		catch (JSONException e1) 
		{
			e1.printStackTrace();
		}

		String resultStr = obj.toString();
		System.out.println("BEGIN MSG to post" + resultStr);
		System.out.println("END MSG to post");
		
		try 
		{
			postmsg("/registerResult", resultStr);
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}		
	}	
}


