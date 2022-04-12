package com.Wangzhipeng.week3;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet(
        urlPatterns = { "/register" }
)
public class RegisterServlet extends HttpServlet {
    Connection con = null;
    PreparedStatement stmt = null;
    ServletContext context;
//    String driver,url,username,password;

    @Override
    public void init() throws ServletException {
        super.init();

/*        context = getServletContext();
        driver = context.getInitParameter("driver");
        url = context.getInitParameter("url");
        username = context.getInitParameter("username");
        password = context.getInitParameter("password");

        try {
            Class.forName(driver);
//            System.out.println("驱动成功");
        } catch (ClassNotFoundException e) {
//            System.out.println("驱动失败");
        }
        try {
            con = DriverManager.getConnection(url, username, password);
//            System.out.println("连接成功 Connection in jdbc --> " + con);
        } catch (Exception e) {
//            System.out.println("连接失败");
        }*/
        con = (Connection) getServletContext().getAttribute("con");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("i am in doGet()");

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String email = request.getParameter("email");
        String gender = request.getParameter("Gender");
        String birthDate = request.getParameter("birthDate");
//        PrintWriter writer = response.getWriter();

        try {
            stmt = con.prepareStatement("insert into usertable values(?,?,?,?,?)");
            stmt.setString(1, username);
            stmt.setString(2, password);
            stmt.setString(3, email);
            stmt.setString(4, gender);
            stmt.setString(5, birthDate);
            stmt.executeUpdate();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
            System.out.println("出错了");
        }
//            response.sendRedirect("Login.jsp");
        request.getRequestDispatcher("Login.jsp").forward(request,response);

        String trs = "", sql = "select * from usertable";
/*        int num = 0;
        String[] arr = new String[1000];*/
        try {
            PreparedStatement stmt = con.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
/*            while (rs.next()) {
                arr[num] = "<tr><td>" + (num + 1) + "</td><td>" + rs.getString(1) + "</td><td>" + rs.getString(2) +
                        "</td><td>" + rs.getString(3) + "</td><td>" + rs.getString(4) +
                        "</td><td>" + rs.getString(5) + "</td></tr>";
                num++;
            }

            for (int i = 0; i < num; i++) {
                trs += arr[i];
            }*/

            // 向jsp传递数据库数据
            request.setAttribute("rsname",rs);
            request.getRequestDispatcher("userList.jsp").forward(request,response);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }



/*        PrintWriter writer = response.getWriter();
        writer.println(
                "<table border width=\"80%\">" +
                        "<tr>" +
                        "<td>ID</td>" +
                        "<td>UserName</td>" +
                        "<td>Password</td>" +
                        "<td>Email</td>" +
                        "<td>Gender</td>" +
                        "<td>Birthdate</td>" +
                        "</tr>" +
                        trs +
                        "</table>"
        );*/

    }


    @Override
    public void destroy() {
        super.destroy();
        try {
            con.close();
            stmt.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

}
