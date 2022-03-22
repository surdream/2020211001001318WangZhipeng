package com.Wangzhipeng.week4;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(
        urlPatterns = { "/config" },
        initParams = {
            @WebInitParam(name = "name",value = "wangzhipeng"),
            @WebInitParam(name = "studentId",value = "2020211001001318"),
        }
)
public class ConfigDemoServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ServletConfig config = getServletConfig();
        String name = config.getInitParameter("name");
        String studentId = config.getInitParameter("studentId");


        PrintWriter writer = response.getWriter();
        writer.println("<br/> name : " + name);
        writer.println("<br/> studentId : " + studentId);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
