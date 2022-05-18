<%--
  Created by IntelliJ IDEA.
  User: 小联
  Date: 2022/5/18
  Time: 8:37
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>MyDearJsp</title>
<%--    <%--%>
<%--    Object All= request.getAttributeNames();--%>
<%--    System.out.println(All);--%>
<%--    %>--%>
</head>
<body>
<table>
  <tr><td>name:</td><td><%=request.getAttribute("sName")%></td></tr>
    <tr><td>submit:</td><td>${submit}</td></tr>
  <tr><td>class:</td><td>${sClass}</td></tr>
<%--    <tr><td>class:</td><td>${All.sClass}</td></tr>--%>
  <tr><td>ID:</td><td><%=request.getAttribute("sId")%></td></tr>
</table>
</body>
</html>
