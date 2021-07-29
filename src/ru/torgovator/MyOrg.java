package ru.torgovator;

import java.sql.Connection;
import java.sql.PreparedStatement;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/** @author ivank */
public class MyOrg {
	private static final Logger log = LogManager.getLogger(MyOrg.class);

	public static void removemyorg(String user_id, String inn) {
		try {
			Connection connection = Application.getConnection();
			String sqlstring = getsqlremove();
			PreparedStatement statement = connection.prepareStatement(sqlstring);
			statement.setString(1, inn);
			statement.setString(2, user_id);
			statement.executeUpdate();
			statement.close();

		} catch (Exception e) {
			log.error(e.getMessage(), e);
			e.printStackTrace();
		}
	}

	/** @param user_id
	 *            in Google
	 * @param ИНН
	 *            организации */
	public static void addmyorg(String user_id, String inn) {
		try {
			Connection connection = Application.getConnection();
			String sqlstring = getsqlinsert();
			PreparedStatement statement = connection.prepareStatement(sqlstring);
			statement.setString(1, inn);
			statement.setString(2, user_id);
			statement.executeUpdate();
			statement.close();

		} catch (Exception e) {
			log.error(e.getMessage(), e);
			e.printStackTrace();
		}
	}

	private static String getsqlinsert() {
		return "insert into my_org (inn, userid) values (?,?)";
	}

	private static String getsqlremove() {
		return "delete from my_org where inn=? and userid=?";
	}
}
