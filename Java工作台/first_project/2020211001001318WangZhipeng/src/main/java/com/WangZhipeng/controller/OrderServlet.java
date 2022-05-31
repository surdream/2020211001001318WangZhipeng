package com.Wangzhipeng.controller;
import com.Wangzhipeng.dao.OrderDao;
import com.Wangzhipeng.model.Item;
import com.Wangzhipeng.model.Payment;
import com.Wangzhipeng.model.Order;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@WebServlet(name = "OrderServlet ",value = "/order")
public class OrderServlet extends HttpServlet {
    Connection con = null;

    @Override
    public void init() {
        con = (Connection) getServletContext().getAttribute("dbConn");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int customerId = request.getParameter("customerId") != null ? Integer.parseInt(request.getParameter("customerId")) : 0;
        int paymentId = request.getParameter("paymentId") != null ? Integer.parseInt(request.getParameter("paymentId")) : 0;
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String phone = request.getParameter("phone");
        String address1 = request.getParameter("address1");
        String address2 = request.getParameter("address2");
        String postalCode = request.getParameter("postalCode");
        String state = request.getParameter("state");
        String city = request.getParameter("city");
        String country = request.getParameter("country");
        String notes = request.getParameter("notes");
        double orderTotal = request.getParameter("orderTotal") != null ? Double.parseDouble(request.getParameter("orderTotal")) : 0.0;
        String message = null;
        if (customerId == 0 || paymentId == 0 || firstName == null || firstName.trim().length() == 0 || phone == null || phone.trim().length() == 0 || address1 == null || address1.trim().length() == 0 || postalCode == null || postalCode.trim().length() == 0) {
            message = "Error|,Enter Required(*) Info.";
            request.setAttribute("message", message);
            List<Payment> paymenTypetList = Payment.findAllPayment(con);
            request.setAttribute("paymentTypeList", paymenTypetList);
            String path = "/WEB-INF/views/order.jsp";
            request.getRequestDispatcher(path).forward(request, response);
        }
        Order o = new Order();
        o.setCustomerId(customerId);
        o.setPaymentId(paymentId);
        o.setFirstName(firstName);
        o.setLastName(lastName);
        o.setPhone(phone);
        o.setAddress1(address1);
        o.setAddress2(address2);
        o.setCity(city);
        o.setCountry(country);
        o.setState(state);
        o.setNotes(notes);
        o.setPostalCode(postalCode);
        o.setOrderTotal(orderTotal);
        o.setPaymentId(paymentId);
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("cart") != null) {
            ArrayList<Item> cartItems = (ArrayList<Item>) session.getAttribute("cart");
            o.setOrderDetails(new HashSet<Item>(cartItems));
        }
        OrderDao dao = new OrderDao();
        int n = 0;
        try {
            n = dao.save(con, o);
        } catch (Exception e) {
            System.out.println(e);
        }
        if (n > 0) {
            String path = "/WEB-INF/views/orderSuccess.jsp";
            request.getRequestDispatcher(path).forward(request, response);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<com.Wangzhipeng.model.Payment> paymentTypeList = Payment.findAllPayment(con);
        request.setAttribute("paymentTypeList", paymentTypeList);
//                request.setAttribute("user", request.getSession(false).getAttribute("user"));
        String path = "/WEB-INF/views/order.jsp";
        request.getRequestDispatcher(path).forward(request, response);
    }
}