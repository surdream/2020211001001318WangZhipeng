package com.Wangzhipeng.week6;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "RedirectServlet", value = "/redirect")
public class RedirectServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Redirect - same server - Relative URL
        // 1.直接输入redirect 会发生路径跳转，仅后面/后的发生改变
//        System.out.println("before redirect:");
//        response.sendRedirect("index.jsp");// (不带/)


        // 2.8080后面的全部改变
//        System.out.println("after redirect:");
//        response.sendRedirect("/index.jsp");// (带/)

        // 3.完整网站地址，带有https://www.xxx.xxx ,直接跳转到该网页
        response.sendRedirect("http://www.baidu.com");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
