package com.lab2;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

@WebFilter(filterName = "WZPFilter")
public class WZPFilter implements Filter {
    public void destroy() {
    }

    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        System.out.println("WZPFilter -- before chain");
        chain.doFilter(req, resp);
        System.out.println("WZPFilter -- after chain");
    }
    public void init(FilterConfig config) throws ServletException {

    }

}