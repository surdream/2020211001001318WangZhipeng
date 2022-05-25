<%--
  Created by IntelliJ IDEA.
  User: Lenovo
  Date: 5/15/2021
  Time: 11:32 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>validate</title>
</head>
<body>
<jsp:useBean id="user" scope="request" class="com.lab2.Login"/>

<jsp:setProperty name="user" property="*"/>
<%
    if (user.getUsername().equals("admin") && user.getPassword().equals("admin"))
    {
%>
<jsp:forward page="welcome.jsp"/>
<%
}else {
%>
<%
    out.println("username or password error message");
%>
<jsp:include page="login.jsp"/>
<%
    }
%>
</body>
</html>