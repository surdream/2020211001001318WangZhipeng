package com.Wangzhipeng.week2.demo;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

public class HelloWorldServlet extends HttpServlet {

    String name="Wangzhipeng";
    String id="2020211001001318";
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        PrintWriter writer=response.getWriter();
        response.setContentType("text/html;charset=utf-8");
        Date date=new Date();
        writer.println("name: "+name+"<br/>");
        writer.println("id: "+id+"<br/>");
        writer.println("Date and Time: "+date+"<br/>");
    }





    public void doPost(HttpServletRequest request, HttpServletResponse response) {

    }

}
