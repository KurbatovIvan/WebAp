package ru.torgovator;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Formatter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import ru.torgovator.BuilderQueryZakupki.BuilderZakupki;

/** Servlet implementation class GetZakupki */
@WebServlet("/GetZakupki")
public class GetZakupki extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger log = LogManager.getLogger(GetZakupki.class);

	private final String c1 = "and  (zk.purchaseobjectinfo like '%1С%') ";
	private final String itTorg = " and ((substring(PO.OKPD2_CODE from 1 for 2)='62') or (substring(PO.OKPD2_CODE from 1 for 2)='58') or (substring(PO.OKPD2_CODE from 1 for 2)='63')) ";
	private final String actualTorg = " and zk.enddate>=current_timestamp ";

	/** @see HttpServlet#HttpServlet() */
	public GetZakupki() {
		super();
		// TODO Auto-generated constructor stub
	}

	/** @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response) */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// получаем сессию
		HttpSession session = request.getSession();
		System.out.println(request.getRequestURI().toString());
		String krista = request.getParameter("onlyKrista");
		String GoogleId = request.getParameter("GoogleId");
		String GoogleEmail = request.getParameter("GoogleEmail");
		String inn = request.getParameter("inn");
		String actualTorgString = request.getParameter("actualTorg");
		String odinS = request.getParameter("odinS");
		String ittortg = request.getParameter("ittortg");

		System.out.println("GoogleId=" + GoogleId);
		System.out.println("GoogleEmail=" + GoogleEmail);
		System.out.println("id session=" + session.getId());
		session.setAttribute("GoogleId", GoogleId);
		session.setAttribute("GoogleEmail", GoogleEmail);
		adduser(session);
		response.setContentType("application/json");
		response.setCharacterEncoding(StandardCharsets.UTF_8.name());

		String where = "";

		if ((actualTorgString != null) && (actualTorgString.equals("yes"))) {
			where = where + actualTorg;
		}
		if ((odinS != null) && (odinS.equals("yes"))) {
			where = where + c1;
		}

		if ((ittortg != null) && (ittortg.equals("yes"))) {
			where = where + itTorg;
		}
		String sqlReq = ((BuilderZakupki) new BuilderQueryZakupki.BuilderZakupki().where(where).innTorg(inn)
				.userid(GoogleId).mytorg(krista)).build().getSelectQuery();

		System.out.println(sqlReq);

		response.getWriter().write(new Gson().toJson(getDataFromDataBase(sqlReq)));
	}

	public static JsonArray getDataFromDataBase(String sqlquery) {
		JsonArray dataarr = new JsonArray();

		Connection connection;
		try {
			connection = Application.getConnection();

			PreparedStatement s = connection.prepareStatement(sqlquery);

			ResultSet rs = s.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData();

			int nColumnsCount;
			// Засовываем это все в массив JSON
			try {
				nColumnsCount = rs.getMetaData().getColumnCount();
				while (rs.next()) {
					JsonObject data = new JsonObject();
					for (int n = 1; n < nColumnsCount + 1; n++) {
						Object obj = rs.getObject(n);
						String result = "";
						if (obj != null) {
							result = obj.toString();
							if (rsmd.getColumnType(n) == 8) {
								Formatter f = new Formatter(); // объявление объекта
								//								System.out.println("Не форматированное:" + obj.toString());
								f.format("%.2f ", obj);
								//								System.out.println("Форматированное:" + f);
								result = f.toString();
								result = result.replace(',', '.'); // Заменяем запятую на точку для JS
							}
							data.addProperty(rsmd.getColumnLabel(n), result);
						}
					}
					dataarr.add(data);
				}
			} catch (SQLException e) {
				log.error(e.getMessage(), e);

			}
		} catch (Exception e1) {

			log.error(e1.getMessage(), e1);
		}
		return dataarr;
	}

	private static void adduser(HttpSession session) {
		Boolean useradded = (Boolean) session.getAttribute("useradded");
		if ((useradded == null) || (useradded == false)) {
			users.adduser(session);
			session.setAttribute("useradded", true);
		}
	}
}
