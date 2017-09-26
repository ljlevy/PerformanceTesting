package demo2;

public class TestCanvas extends DemoTest 
{
	protected float getResult(String test, String name) 
	{
		System.out.println("moving_rectangles.getResult() test " + test+ " name " + name);
		String str = "\"" + name + "\":";
		System.out.println("Test_CanvasMoving_points0.getResult() str " + str);
		int start = test.indexOf(str) + str.length();
		int end = test.indexOf("}", start);
		System.out.println("Test_CanvasMoving_points0.getResult() start "+ start + " end " + end);

		String nb = test.substring(start, end).trim();
		System.out.println("Test_CanvasMoving_points0.getResult() nb " + nb);

		return Float.parseFloat(nb);
	}
}
