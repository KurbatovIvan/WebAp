package ru.torgovator;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Properties;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.Appender;
import org.apache.logging.log4j.core.Layout;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.appender.RollingFileAppender;
import org.apache.logging.log4j.core.appender.rolling.TimeBasedTriggeringPolicy;
import org.apache.logging.log4j.core.config.AppenderRef;
import org.apache.logging.log4j.core.config.Configuration;
import org.apache.logging.log4j.core.config.LoggerConfig;
import org.apache.logging.log4j.core.layout.PatternLayout;

/** Application Lifecycle Listener implementation class Application Выполняется
 * до запуска всего приложения */
@WebListener
public class Application implements ServletContextListener {
	private static final Logger log = LogManager.getLogger(Application.class);
	private static Properties appProps;
	private static SQLConnector sqlConnector;

	/** Default constructor. */
	public Application() {
		// TODO Auto-generated constructor stub
	}

	public static Properties getAppProps(String contextName) {
		if (appProps != null) {
			return appProps;
		}
		appProps = new Properties();
		File configDir = new File(System.getProperty("catalina.base"), "conf");
		File configFile = new File(configDir, String.format(contextName + ".properties", new Object[0]));
		InputStream stream = null;
		try {
			stream = new FileInputStream(configFile);
			appProps.load(stream);
		} catch (IOException e) {
			log.error(e.getMessage(), e);
			//e.getStackTrace();
			//System.out.println(e.getMessage());
		}
		return appProps;
	}

	/** @see ServletContextListener#contextDestroyed(ServletContextEvent) */
	public void contextDestroyed(ServletContextEvent arg0) {
		System.out.println("ServletContextListener was destroyed!");
	}

	/** @see ServletContextListener#contextInitialized(ServletContextEvent) */
	public void contextInitialized(ServletContextEvent arg0) {
		String contextName = "torgovator";
		System.out.println("ServletContextListener was created!");
		//		log.info("profserver=" + getAppProps(contextName).getProperty("proof.host"));

		LoggerContext ctx = (LoggerContext) LogManager.getContext(false);
		Configuration config = ctx.getConfiguration();
		Layout layout = PatternLayout.createLayout("%d [%t] %p %c - %m%n", null, config, null, null, true, true, null,
				null);

		TimeBasedTriggeringPolicy policy = TimeBasedTriggeringPolicy.createPolicy("1", "false");
		Appender appender = RollingFileAppender.createAppender(
				System.getenv("Catalina_home") + "/logs/" + contextName + ".log",
				System.getenv("Catalina_home") + "/logs/" + contextName + "/budget-%d{yyyy-MM-dd}.log.gz", "true",
				"budgetFile", "false", "4000", "true", policy, null, layout, null, "false", "false", null, config);

		appender.start();
		config.addAppender(appender);
		AppenderRef ref = AppenderRef.createAppenderRef("budgetFile", null, null);
		AppenderRef[] refs = { ref };
		Level level = Level.toLevel(getAppProps(contextName).getProperty("loglevel"));
		String classlevel = getAppProps(contextName).getProperty("classlevel");
		if (classlevel == null) {
			classlevel = "ru.krista";
		}
		LoggerConfig loggerConfig = LoggerConfig.createLogger(false, level,
				getAppProps(contextName).getProperty("classlevel"), "true", refs, null, config, null);
		loggerConfig.addAppender(appender, null, null);
		config.addLogger(classlevel, loggerConfig);
		ctx.updateLoggers();

		DBConnectInfo dbConnectInfo = new DBConnectInfo();
		dbConnectInfo.dbPath = getAppProps(contextName).getProperty("dbpath");
		dbConnectInfo.user = getAppProps(contextName).getProperty("user");
		dbConnectInfo.password = getAppProps(contextName).getProperty("password");

		System.out.println("dbPath=" + dbConnectInfo.dbPath);
		System.out.println("user=" + dbConnectInfo.user);
		System.out.println("password=" + dbConnectInfo.password);

		sqlConnector = new SQLConnector(dbConnectInfo);
	}

	public static Connection getConnection() throws Exception {
		return sqlConnector.getConnection();
	}
}
