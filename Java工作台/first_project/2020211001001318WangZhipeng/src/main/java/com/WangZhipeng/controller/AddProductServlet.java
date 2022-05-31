package com.Wangzhipeng.controller;
import com.Wangzhipeng.dao.ProductDao;
import com.Wangzhipeng.model.Category;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Logger;

import com.Wangzhipeng.model.Product;



@WebServlet(name = "AddProductServlet",value = "/admin/addProduct")
@MultipartConfig(maxFileSize = 16177215)
public class AddProductServlet extends HttpServlet {

    private Connection con = null;
    private static final Logger log = Logger.getLogger(String.valueOf(AddProductServlet.class));

    @Override
    public void init() throws ServletException {
        con =(Connection)getServletContext().getAttribute("dbConn");

    }

    public void destroy() {
        super.destroy();
    }


    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Category category = new Category();
        List<Category> categoryList = category.findAllCategory(con);
        request.setAttribute("categoryList", categoryList);
        String path = "/WEB-INF/views/admin/addProduct.jsp";
        request.getRequestDispatcher(path).forward(request, response);

    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String productName = request.getParameter("productName");
        Double price =  request.getParameter("price")!= null?Double.parseDouble(request.getParameter("price")):0.0;
        int categoryId = request.getParameter("categoryId")!=null?Integer.parseInt(request.getParameter("categoryId")):0;
        String productDescription = request.getParameter("productDescription");

        InputStream inputStream = null;
        Part picture = request.getPart("picture");

        if (picture != null){
            System.out.println("file name :" + picture.getName() + "size" + picture.getSize() + "file type" + picture.getContentType());
            inputStream = picture.getInputStream();
        }

        Product product = new Product();
        product.setProductName(productName);
        product.setPrice(price);
        product.setProductDescription(productDescription);
//        product.setPicture(inputStream);
        product.setCategoryId(categoryId);

        ProductDao dao = new ProductDao();
        int i = 0;
        try{
            i = dao.save(product,inputStream,con);
        }catch (SQLException e){
            e.printStackTrace();
        }

        if (i>0){
            request.getRequestDispatcher("/WEB-INF/views/admin/productList.jsp").forward(request,response);
        }
    }

}