package com.Wangzhipeng.controller;

import com.Wangzhipeng.dao.OrderDao;
import com.Wangzhipeng.model.Item;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.util.List;


@WebServlet(name = "OrderDetailsServlet" ,value = "/orderDetails")
public class OrderDetailsServlet extends HttpServlet {
    Connection con = null;

    public void init() throws ServletException {
        super.init();
        con = (Connection) getServletContext().getAttribute("dbConn");
    }

    public void destroy() {
        super.destroy();
    }//put you code

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int orderId = request.getParameter("orderId") != null ? Integer.parseInt(request.getParameter("orderId")) : 0;
        Item item = new Item();
        OrderDao dao = new OrderDao();
        List<Item> items = dao.findItemsByOrderId(con, orderId);
//        log.info(item.toString());
        request.setAttribute("itemList", items);
        String path = "orderDetails.jsp";
//        log.info(path);
        request.getRequestDispatcher(path).forward(request, response);
    }
}