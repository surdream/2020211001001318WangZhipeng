<%--
  Created by IntelliJ IDEA.
  User: 小联
  Date: 2022/5/18
  Time: 8:34
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>
<%String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <base href="<%=basePath%>">
    <text>i am MyJsp.jsp</text>
</head>
<body>
<form method="post" action="MyDearServletURL">
    name:<input type="text" name="sName"/><br/>
    class:<input type="text" name="sClass"/><br/>
    ID:<input type="text" name="sId"/><br/>
    <input type="submit" name="submit" value="Send data to server"/>
</form>
<br/>
</body>
</html>
