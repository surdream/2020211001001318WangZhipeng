package com.Wangzhipeng.controller;

import com.Wangzhipeng.dao.ProductDao;
import com.Wangzhipeng.model.Category;
import com.Wangzhipeng.model.Product;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/productDetails")
public class ProductDetailsServlet extends HttpServlet {
    private Connection con=null;

    public void init() throws ServletException {
        con = (Connection) getServletContext().getAttribute("dbConn");
    }
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,IOException {
        int id = request.getParameter("id") != null?Integer.parseInt(request.getParameter("id")):0;
        ProductDao dao = new ProductDao();
        if(id == 0){
            return ;
        }
        List<Category> categoryList = Category.findAllCategory(con);
        request.setAttribute("categoryList", categoryList);

        Product product = null;
        try {
            product = dao.findById(id,con);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        request.setAttribute("p", product);
        String path = "/WEB-INF/views/productDetails.jsp";
        request.getRequestDispatcher(path).forward(request, response);
    }}
