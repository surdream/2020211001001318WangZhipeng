package com.Wangzhipeng.week4;

import javax.jws.WebService;
import javax.servlet.*;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;

//法③：（在java里写一个服务器，不需要在web.xml中写一堆的东西）
@WebServlet(
//        name = "JDBCDemoServlet",
        urlPatterns = {"/jdbc"}
//        initParams = {
//                @WebInitParam(name = "driver",value = "com.microsoft.sqlserver.jdbc.SQLServerDriver"),
//                @WebInitParam(name = "url",value = "jdbc:sqlserver://localhost:1433;database=userdb;encrypt=false"),
//                @WebInitParam(name = "username",value = "sa"),
//                @WebInitParam(name = "password",value = "123456789"),
//        },
//        loadOnStartup = 1   //这个让页面前进一次，一加载就执行
)
public class JDBCDemoServlet extends HttpServlet {
    Connection con = null;


    @Override
    public void init() throws ServletException {
        super.init();
        
//        连接数据库，获取数据库必要信息

//        法①：（数据写在java类中）
//        String driver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
//        String url = "jdbc:sqlserver://localhost:1433;database=userdb;encrypt=false";
//        String username = "sa";
//        String password ="123456789";
//

//        法②：（配合servlet将数据写在web.xml中）
//        ServletConfig config = getServletConfig();
//        String driver = config.getInitParameter("driver");
//        String url = config.getInitParameter("url");
//        String username = config.getInitParameter("username");
//        String password = config.getInitParameter("password");

//        法④：（使用ServletContext使每个servlet都能使用db）
        ServletContext context = getServletContext();
        String driver = context.getInitParameter("driver");
        String url = context.getInitParameter("url");
        String username = context.getInitParameter("username");
        String password = context.getInitParameter("password");


        try {
            Class.forName(driver);
            System.out.println("驱动成功");
        } catch (ClassNotFoundException e) {
            System.out.println("驱动失败");
        }
        try {
            con = DriverManager.getConnection(url, username, password);
            System.out.println("连接成功 Connection in jdbc --> " + con);
        } catch (Exception e) {
            System.out.println("连接失败");
        }

    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

//        连接数据库只需要一次即可,这里只做insert操作
//        连接数据库
//        String driver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
//        String url = "jdbc:sqlserver://localhost:1433;database=userdb;encrypt=false";
//        String username = "sa";
//        String password ="123456789";
//
//
//        try {
//            Class.forName(driver);
//        } catch (ClassNotFoundException e) {
//            System.out.println("驱动失败");
//        }
//        try {
//            Connection con = DriverManager.getConnection(url, "sa", "123456789");
//            System.out.println("Connection --> " + con);
//        } catch (Exception e) {
//            System.out.println("连接失败");
//        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    public void destroy(){
        super.destroy();
        try {
            con.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
}
