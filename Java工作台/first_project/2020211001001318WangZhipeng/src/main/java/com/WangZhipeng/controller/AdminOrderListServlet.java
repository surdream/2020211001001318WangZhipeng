package com.Wangzhipeng.controller;

import com.Wangzhipeng.dao.OrderDao;
import com.Wangzhipeng.model.Order;
import com.Wangzhipeng.model.Payment;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.sql.Connection;
import java.util.List;

@WebServlet(name = "AdminOrderListServlet", value = "/admin/orderList")
public class AdminOrderListServlet extends HttpServlet {
    private Connection con = null;
    public void init(){
        con = (Connection)getServletContext().getAttribute("dbConn");
    }
    public void destroy(){
        super.destroy();
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Payment> paymentTypeList= Payment.findAllPayment(con);
        request.setAttribute("paymentTypeList",paymentTypeList);
        OrderDao orderDao = new OrderDao();
        List<Order> orderList = orderDao.findAll(con);
        request.setAttribute("orderList",orderList);
        String path="/WEB-INF/views/admin/orderList.jsp";
        request.getRequestDispatcher(path).forward(request,response);
    }
}