package com.lab1;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "defaultServlet", value = "/default")
public class defaultServlet extends HttpServlet {
    private int index = 0;

    @Override
    public void init() throws ServletException {
        super.init();
        System.out.println("I am from default contructor");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        index++;
        PrintWriter writer=response.getWriter();
        response.setContentType("text/html;charset=utf-8");
        writer.println("2020211001001318-WangZhipeng"+"<br/>");
        writer.println("Since loading,this servelt has been accessed "+index+" times");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
