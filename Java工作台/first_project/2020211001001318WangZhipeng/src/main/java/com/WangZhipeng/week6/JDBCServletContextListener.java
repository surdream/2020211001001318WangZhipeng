package com.Wangzhipeng.week6;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

@WebListener
public class JDBCServletContextListener implements ServletContextListener {
    Connection con = null;
    PreparedStatement stmt = null;
    ServletContext context;
    String driver,url,username,password;
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        //使用该方法来连接数据库
        context = sce.getServletContext();
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
            context.setAttribute("con", con);
//            System.out.println("连接成功 Connection in jdbc --> " + con);
        } catch (Exception e) {
//            System.out.println("连接失败");
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        sce.getServletContext().removeAttribute("con");
    }
}
