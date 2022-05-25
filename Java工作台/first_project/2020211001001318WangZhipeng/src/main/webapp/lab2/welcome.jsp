<%--
  Created by IntelliJ IDEA.
  User: Lenovo
  Date: 5/15/2021
  Time: 11:32 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Welcome</title>
</head>
<body>
<h2>Welcome,
    <%--todo 9 : use jsp:useBean to access the same instance of login bean from request scope--%>
    <jsp:useBean id="user" class="com.lab2.Login" scope="request"/>
    <%--todo 10 : use jsp:getProperty to display username --%>
    <jsp:getProperty name="user" property="username"/>
</h2>
<label>2020211001001318Wangzhipeng</label>
</body>
</html>
