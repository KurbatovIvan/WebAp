package ru.torgovator;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/MyServlet")
public class MyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF8");
		String firstName = request.getParameter("firstName");
		String LastName = request.getParameter("LastName");

		PrintWriter out = response.getWriter();
		out.println("<h3>Hello from Servlet. Get</h3><br>Again");
		out.println("Имя Сессия:" + session.getAttribute("firstName") + "<br>");
		out.println("Фамилия Сессия:" + session.getAttribute("LastName") + "<br>");
		out.close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		session.setMaxInactiveInterval(10);

		request.setCharacterEncoding("UTF8");
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF8");
		String firstName = request.getParameter("firstName");
		String LastName = request.getParameter("LastName");
		String gender = request.getParameter("gender");
		if ((firstName != "") && (LastName != "")) {
			session.setAttribute("firstName", firstName);
			session.setAttribute("LastName", LastName);
		}

		PrintWriter out = response.getWriter();
		out.println("<h3>Профиль сотрудника .POST</h3><br>");
		out.println("Имя:" + firstName + "<br>");
		out.println("Фамилия:" + LastName + "<br>");
		out.println("Имя Сессия:" + session.getAttribute("firstName") + "<br>");
		out.println("Фамилия Сессия:" + session.getAttribute("LastName") + "<br>");

		out.println("Пол:" + gender + "<br>");
		out.println("<a href=\"http://localhost:8080/WebApp/\"> Назад </a>");

		out.close();
	}

	@Override
	public void init() throws ServletException {
		// TODO Auto-generated method stub
		System.out.println("Initialization servlet");
		super.init();
	}

}
