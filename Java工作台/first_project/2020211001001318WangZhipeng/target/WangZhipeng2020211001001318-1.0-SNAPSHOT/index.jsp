<%@ page contentType="text/html; charset=GB2312" pageEncoding="GBK" %>
<%@include file="header.jsp"%>
<%--<h1 width="100%"><%= "Hello World!!!" %></h1>--%>
<h2>Welcome to My Online Shop Home Page µÄ»°</h2>
<form method="get" target="_blank" action="search">
    <input type="text" name="txt" size=30/>
    <select name="search">
        <option value="baidu">Baidu</option>
        <option value="bing">Bing</option>
        <option value="goole">Goole</option>
    </select>
    <input type="submit" value="search"/>
</form>
<br/>
<a href="hello-servlet">Hello Servlet</a>
<%@include file="footer.jsp"%>