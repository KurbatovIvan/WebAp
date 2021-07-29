package ru.torgovator;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet implementation class Addmyorg */
@WebServlet(description = "Добавляет в мои организации", urlPatterns = { "/Addmyorg" })
public class Addmyorg extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/** @see HttpServlet#HttpServlet() */
	public Addmyorg() {
		super();
		// TODO Auto-generated constructor stub
	}

	/** @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response) */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String inn = request.getParameter("inn");
		String user_id = request.getParameter("user_id");
		MyOrg.addmyorg(user_id, inn);
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

}
