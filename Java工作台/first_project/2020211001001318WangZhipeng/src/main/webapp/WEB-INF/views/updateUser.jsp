<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<%
    User userInfo = (User) request.getAttribute("userInfo");
    pageContext.setAttribute("userInfo",userInfo);
%>
<%@include file="header.jsp"%>
<span style="color: red">${requestScope.get("message")}</span>
<form action="updateUser" method="post">
    <input type="hidden" name="id" value="${userInfo.ID}">
    username: <input type="text" name="username" value="${userInfo.username}"><br>
    password: <input type="text" name="password" value="${userInfo.password}"><br>
    email: <input type="email" name="email" value="${userInfo.email}"><br>
    gender: <input type="radio" name="gender" value="male" <%=userInfo.getGender().equals("male")?"checked":""%> > Male
    <input type="radio" name="gender" value="female" <%=userInfo.getGender().equals("female")?"checked":""%>> Female
    <br>
    birth: <input type="date" name="birth" value="${userInfo.birthdate}"><br>
    <input type="submit" value="update">
</form>
<%@include file="footer.jsp"%>
</body>
</html>
