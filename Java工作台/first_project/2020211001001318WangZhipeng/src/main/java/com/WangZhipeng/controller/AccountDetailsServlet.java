package com.Wangzhipeng.controller;
import com.Wangzhipeng.dao.OrderDao;
import com.Wangzhipeng.dao.UserDao;
import com.Wangzhipeng.model.Order;
import com.Wangzhipeng.model.User;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import java.sql.SQLException;
import java.util.List;
import java.sql.Connection;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
@WebServlet("/accountDetails")
public class AccountDetailsServlet extends HttpServlet {
    Connection con = null;

    @Override
    public void init(){
        con = (Connection) getServletContext().getAttribute("dbConn");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        if (session != null && session.getAttribute("user") != null){
            User user = (User)session.getAttribute("user");
            int id = user.getId();
            UserDao dao = new UserDao();
            try{
                user = dao.findById(con,id);
                request.setAttribute("user",user);
                OrderDao orderDao = new OrderDao();
                List<Order> orderList = orderDao.findByUserId(con, id);
                request.setAttribute("orderList",orderList);
                request.getRequestDispatcher("/WEB-INF/views/accountDetails.jsp").forward(request,response);
            }catch (SQLException e){
                e.printStackTrace();
            }
        }else {
            response.sendRedirect("login");
        }
    }
}
