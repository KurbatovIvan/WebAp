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

import ru.torgovator.BuilderQueryMyOrg.BuilderMyOrg;

/** Servlet implementation class GetMyOrg */
@WebServlet("/GetMyOrg")
public class GetMyOrg extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger log = LogManager.getLogger(GetZakupki.class);

	/** @see HttpServlet#HttpServlet() */
	public GetMyOrg() {
		super();
		// TODO Auto-generated constructor stub
	}

	/** @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response) */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("application/json");
		response.setCharacterEncoding(StandardCharsets.UTF_8.name());

		String size = request.getParameter("size");
		String nameorg = request.getParameter("nameorg");
		String offset = request.getParameter("offset");
		String count = request.getParameter("count");
		String user_id = request.getParameter("user_id");
		HttpSession session = request.getSession();
		String GoogleId = (String) session.getAttribute("GoogleId");

		String countorgresult = "";

		//		System.out.println("getstring=" + request.getQueryString());

		JsonArray dataarr = new JsonArray();
		String sqlReq = ((BuilderMyOrg) new BuilderQueryMyOrg.BuilderMyOrg().size(size).offset(offset).userid(GoogleId)
				.count(count).nameorg(nameorg).from("my_org morg inner join organization  org on (morg.inn=org.inn)")
				.fields("REGNUMBER, org.regnumber, org.inn, org.fullname, org.postaladdress, org.phone, org.email"))
						.build().getSelectQuery();

		if ((count != null) && (count.equals("yes"))) {
			// Если запрашивают количество с фронта то выдаем как текст, в противном случае JSON
			response.setContentType("text/plain");
		}
		;

		System.out.println(sqlReq);
		try {
			Connection connection = Application.getConnection();
			PreparedStatement s = connection.prepareStatement(sqlReq);

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
							if ((count != null) && (count.equals("yes"))) {
								countorgresult = result;

							}
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

		} catch (

		Exception e) {
			log.error(e.getMessage(), e);
			response.reset();
			throw new IOException(e);
		}
		if ((count != null) && (count.equals("yes"))) {
			response.getWriter().println(countorgresult);
		} else
			response.getWriter().write(new Gson().toJson(dataarr));
	}

	/** @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response) */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
