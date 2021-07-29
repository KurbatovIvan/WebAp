package ru.torgovator;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.firebirdsql.pool.FBSimpleDataSource;

public class SQLConnector {
	private static final Logger log = LogManager.getLogger(SQLConnector.class);
	private DataSource dataSource;
	private DBConnectInfo DBConnectInfo;

	public SQLConnector(DBConnectInfo DBConnectInfo) {
		this.dataSource = createDbConnection(DBConnectInfo);
		this.DBConnectInfo = DBConnectInfo;
	}

	private DataSource createDbConnection(DBConnectInfo DBConnectInfo) {
		String database = DBConnectInfo.dbPath.toLowerCase();
		if ((database.endsWith(".gdb")) || (database.endsWith(".fdb"))) {
			return tryConnectToFirebird(DBConnectInfo);
		}
		return null;
	}

	private DataSource tryConnectToFirebird(DBConnectInfo DBConnectInfo) {
		FBSimpleDataSource pool = new FBSimpleDataSource();

		pool.setDatabase(getFirebirdConnectionUrl(DBConnectInfo));
		pool.setUserName(DBConnectInfo.user);
		pool.setPassword(DBConnectInfo.password);
		pool.setCharSet("cp1251");
		pool.setSqlDialect("3");

		log.info(new StringBuilder().append("для подключения ").append(DBConnectInfo)
				.append(" будет использоваться Firebird").toString());

		return pool;
	}

	private String getFirebirdConnectionUrl(DBConnectInfo DBConnectInfo) {
		String url = DBConnectInfo.dbPath;
		if (url.indexOf(':') == url.lastIndexOf(':'))
			url = new StringBuilder().append("localhost:").append(url).toString();
		return url;
	}

	private String getOracleConnectionSchema(DBConnectInfo DBConnectInfo) {
		String db = DBConnectInfo.dbPath;
		int slashIndex = db.indexOf('\\');
		if (slashIndex == -1)
			slashIndex = db.length();
		return db.substring(slashIndex + 1, db.length());
	}

	public Connection getConnection() throws Exception {
		Connection db = this.dataSource.getConnection();

		if (("oracle.jdbc.driver.OracleConnection".equals(db.getClass().getName()))
				|| ("oracle.jdbc.driver.T2CConnection".equals(db.getClass().getName())))
			setCurrentSchema(db, getOracleConnectionSchema(this.DBConnectInfo));
		return db;
	}

	private void setCurrentSchema(Connection connection, String schema) throws SQLException {
		Statement s = null;
		try {
			s = connection.createStatement();
			s.execute(new StringBuilder().append("alter session set current_schema = ").append(schema).toString());
			log.info(new StringBuilder().append("текущая схема: ").append(schema).toString());
		} finally {
			try {
				if (s != null)
					s.close();
			} catch (SQLException e) {
				logSqlException(e);
			}
		}
	}

	public static void logSqlException(SQLException e) {
		StringBuilder sb = new StringBuilder();
		SQLException next = e;
		while (next != null) {
			sb.append(next.getMessage());
			sb.append('\n');
			sb.append(" Error Code: ");
			sb.append(next.getErrorCode());
			sb.append('\n');
			sb.append(" SQL State: ");
			sb.append(next.getSQLState());
			sb.append('\n');
			next = next.getNextException();
		}
		log.error(sb.toString());
	}
}