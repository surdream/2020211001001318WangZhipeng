<%@ page import="java.io.PrintWriter" %><%--
  Created by IntelliJ IDEA.
  User: 小联
  Date: 2022/4/12
  Time: 16:33
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@include file="header.jsp"%>
<h1>Login</h1>
<%
    if((request.getAttribute("message") != null)){
        out.print("<h3>"+request.getAttribute("message")+"</h3>");
    }
%>
<form method="post" action="login">
    Username:<input type="text" name="username"/><br/>
    Password:<input type="password" name="password"/><br/>
    <input type="submit" value="submit"/>
</form>
<%@include file="footer.jsp"%>