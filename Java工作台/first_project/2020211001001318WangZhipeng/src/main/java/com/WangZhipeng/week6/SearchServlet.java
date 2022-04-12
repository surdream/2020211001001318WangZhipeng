package com.Wangzhipeng.week6;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.Writer;

@WebServlet(name = "SearchServlet", value = "/search")
public class SearchServlet extends HttpServlet {
    String txt = null,search = null;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        txt = request.getParameter("txt");
        search = request.getParameter("search");
        System.out.println(search);
        if (txt == null){
            request.getRequestDispatcher("index.jsp").forward(request,response);
        }
        else{
            if(search.equals("baidu")){
                response.sendRedirect("https://www.baidu.com/s?wd="+txt);
//                response.sendRedirect("https://www.baidu.com");
            }else if(search == "bing"){
                response.sendRedirect("https://cn.bing.com/search?q="+txt);
            }else if(search == "goole"){
                response.sendRedirect("https://www.goole.com/search?q="+txt);
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
