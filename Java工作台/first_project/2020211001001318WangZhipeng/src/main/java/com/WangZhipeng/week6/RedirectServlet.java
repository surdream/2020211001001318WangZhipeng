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
        // 1.ֱ������redirect �ᷢ��·����ת��������/��ķ����ı�
//        System.out.println("before redirect:");
//        response.sendRedirect("index.jsp");// (����/)


        // 2.8080�����ȫ���ı�
//        System.out.println("after redirect:");
//        response.sendRedirect("/index.jsp");// (��/)

        // 3.������վ��ַ������https://www.xxx.xxx ,ֱ����ת������ҳ
        response.sendRedirect("http://www.baidu.com");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
