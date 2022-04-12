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
        //ʹ�ø÷������������ݿ�
        context = sce.getServletContext();
        driver = context.getInitParameter("driver");
        url = context.getInitParameter("url");
        username = context.getInitParameter("username");
        password = context.getInitParameter("password");

        try {
            Class.forName(driver);
//            System.out.println("�����ɹ�");
        } catch (ClassNotFoundException e) {
//            System.out.println("����ʧ��");
        }
        try {
            con = DriverManager.getConnection(url, username, password);
            context.setAttribute("con", con);
//            System.out.println("���ӳɹ� Connection in jdbc --> " + con);
        } catch (Exception e) {
//            System.out.println("����ʧ��");
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        sce.getServletContext().removeAttribute("con");
    }
}
