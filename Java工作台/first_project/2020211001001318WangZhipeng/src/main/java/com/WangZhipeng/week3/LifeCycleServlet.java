package com.Wangzhipeng.week3;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@WebServlet(
        urlPatterns = {"/life"}
)
public class LifeCycleServlet extends HttpServlet {
    Connection con = null;
    ServletContext context = null;
    String driver = "";
    String url = "";
    String username = "";
    String password = "";

    public LifeCycleServlet(){
        System.out.println("i am in constructor");
//        System.out.println(System.getProperty("file.encoding"));
    }

    public void init(){

//        法④：（使用ServletContext使每个servlet都能使用db）
        context = getServletContext();
        driver = context.getInitParameter("driver");
        url = context.getInitParameter("url");
        username = context.getInitParameter("username");
        password = context.getInitParameter("password");


        try {
            Class.forName(driver);
            System.out.println("驱动成功");
        } catch (ClassNotFoundException e) {
            System.out.println("驱动失败");
        }
        try {
            con = DriverManager.getConnection(url, username, password);
            System.out.println("连接成功 Connection --> " + con);
        } catch (Exception e) {
            System.out.println("连接失败");
        }

        System.out.println("i am in init() --> " + con);
    }
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("i am in doGet()");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("i am in doPost()");
    }

    @Override
    public void destroy() {
        System.out.println("i am in destroy");
        try {
            con.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
}
