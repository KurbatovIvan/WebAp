package ru.torgovator;

import java.sql.Connection;
import java.sql.PreparedStatement;

import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class users {
	private static final Logger log = LogManager.getLogger(MyOrg.class);

	public static void adduser(HttpSession session) {
		try {
			Connection connection = Application.getConnection();
			String sqlstring = getsqladduser();
			PreparedStatement statement = connection.prepareStatement(sqlstring);
			String GoogleId = (String) session.getAttribute("GoogleId");
			String GoogleEmail = (String) session.getAttribute("GoogleEmail");

			statement.setString(1, GoogleId);
			statement.setString(2, GoogleEmail);
			statement.setString(3, "null");
			statement.setString(4, "null");

			statement.executeUpdate();
			statement.close();

		} catch (Exception e) {
			log.error(e.getMessage(), e);
			e.printStackTrace();
		}
	}

	private static String getsqladduser() {
		return "EXECUTE PROCEDURE ADDUSER (?,?,?,?);";
	}
}
