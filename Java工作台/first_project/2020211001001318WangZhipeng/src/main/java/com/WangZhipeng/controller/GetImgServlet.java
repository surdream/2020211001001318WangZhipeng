package com.Wangzhipeng.controller;
import com.Wangzhipeng.dao.ProductDao;

import java.io.IOException;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebListener;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(value = "/getImg")
public class GetImgServlet extends HttpServlet {

    Connection con = null;

    public void init() throws ServletException {
        con = (Connection) getServletContext().getAttribute("dbConn");
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        ProductDao dao = new ProductDao();
        int id = 0;
        if (request.getParameter("id") != null) {
            id = Integer.parseInt(request.getParameter("id"));
            try {
                byte[] imgByte = new byte[0];
                System.out.println("productId:"+ request.getParameter("id"));
                imgByte = dao.getPictureById(id, con);
                if (imgByte != null) {
                    System.out.println(imgByte);
                    response.setContentType("image/gif");
                    OutputStream os = response.getOutputStream();
                    os.write(imgByte);
                    os.flush();
                }
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }
}
