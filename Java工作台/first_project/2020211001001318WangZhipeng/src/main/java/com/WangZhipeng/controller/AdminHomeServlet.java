package com.Wangzhipeng.controller;
import com.Wangzhipeng.model.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "AdminHomeServlet",value="/admin/home")
public class AdminHomeServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher("WEB-INF/views/index.jsp").forward(request,response);
        System.out.println("???");
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("user") != null){
            User user = (User) session.getAttribute("user");
            if ("admin".equals(user.getUsername())) {
                request.getRequestDispatcher("/WEB-INF/views/admin/index.jsp").forward(request, response);
            } else {
                session.invalidate();
                request.setAttribute("message", "Unauthorized Access Admin Module!!!");
                request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
            }
        }else{
            request.setAttribute("message", "Please login as admin!!!");
            request.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }
}