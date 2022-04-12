<%@ page import="java.sql.ResultSet" %><%--
  Created by IntelliJ IDEA.
  User: 小联
  Date: 2022/4/11
  Time: 16:08
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="header.jsp"%>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.sql.SQLException" %>
<h1>User List</h1>
<table border width="80%">
    <tr>
        <td>ID</td>
        <td>UserName</td>
        <td>Password</td>
        <td>Email</td>
        <td>Gender</td>
        <td>Birthdate</td>
    </tr>
    <%
        ResultSet rs = (ResultSet) request.getAttribute("rsname");
        if(rs == null){
    %>
        <tr>
            <td>No Data!!!</td>
        </tr>
    <%
        }else{
            PrintWriter writer = response.getWriter();
            int sum = 0;
            while(rs.next()){
                try {
                    sum++;
    %>
        <tr>
            <td><%=sum%></td>
            <td><%=rs.getString("username") %></td>
            <td><%=rs.getString("password")%></td>
            <td><%=rs.getString("email")%></td>
            <td><%=rs.getString("gender")%></td>
            <td><%=rs.getString("birthDate")%></td>
        </tr>
    <%
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
        }
    %>
</table>
<%@include file="footer.jsp"%>
