package com.Wangzhipeng.lab1;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "MyDearJspServlet", value = "/MyDearServletURL")
public class MyDearJspServlet extends HttpServlet {
    String sName,sClass,sId,submit;
    Object All;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        sName = request.getParameter("sName");
        sClass = request.getParameter("sClass");
        sId = request.getParameter("sId");
        submit = request.getParameter("submit");

        All = request.getParameterNames();

        request.setAttribute("sName",sName);
        request.setAttribute("sClass",sClass);
        request.setAttribute("sId",sId);
        request.setAttribute("submit",submit);
//        request.setAttribute("All",All);

        request.getRequestDispatcher("lab1/MyDearJsp.jsp").forward(request,response);

    }
}
