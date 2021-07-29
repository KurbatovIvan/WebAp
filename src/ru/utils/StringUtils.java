package ru.utils;

public class StringUtils {
	public static String getnotnull(String val) {
		if (val == null) {
			val = "";
		}

		if (val.equals("NaN")) {
			val = "0";
		}
		return val;
	}

}
