package com.Wangzhipeng.week5;
import com.Wangzhipeng.dao.UserDao;
import com.Wangzhipeng.model.User;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
@WebServlet(name = "LoginServlet", value = "/login")
public class LoginServlet extends HttpServlet {
    Connection con = null;
    @Override
    public void init() throws ServletException {
//    public Connection dbConn;
//    public void init() {
//        try { Class.forName(getServletConfig().getServletContext().getInitParameter("driver"));
//            dbConn = DriverManager.getConnection(getServletConfig().getServletContext().getInitParameter("url"), getServletConfig().getServletContext().getInitParameter("Username"), getServletConfig().getServletContext().getInitParameter("Password"));
//        } catch (Exception e) {
//            System.out.println(e); }
        con =(Connection)getServletContext().getAttribute("dbConn");
//        System.out.println(con);
    }


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        doPost(request, response);
        request.getRequestDispatcher("WEB-INF/views/login.jsp").forward(request, response);
    }
    @Override

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String password= request.getParameter("password");
        UserDao userDao=new UserDao();
        try {
            User user= userDao.findByUsernamePassword(con ,name,password);
            if(user!=null){
                //week 8
                // Cookie c=new Cookie(name:"sessionID"),value:""+user.getID());
                //c.setMaxAge(10*60);
                //response.addCookie(c);



                String rememberMe=request.getParameter("remember");
                if (rememberMe!=null &&rememberMe.equals("1"))
                {
                    Cookie usernameCookie = new Cookie("cUsername",user.getUsername());
                    Cookie passwordCookie= new Cookie("cPassword",user.getPassword());
                    Cookie rememberMeCookie = new Cookie("cRememberMe",request.getParameter("remember"));
                    usernameCookie.setMaxAge(10);
                    passwordCookie.setMaxAge(10);
                    rememberMeCookie.setMaxAge(10);
                    response.addCookie(usernameCookie);
                    response.addCookie(passwordCookie);
                    response.addCookie(rememberMeCookie);

                }


                HttpSession session=   request.getSession();
                System.out.println("session id-->"+session.getId());
                session.setMaxInactiveInterval(100000);


                session.setAttribute("user",user);
                request.getRequestDispatcher("WEB-INF/views/userinfo.jsp").forward(request,response);
            }else{
                request.setAttribute("msg" ,"username or password Error");
                request.getRequestDispatcher("WEB-INF/views/login.jsp").forward(request,response); }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        System.out.println(name + password);
        System.out.println(con);
        try {
            if( con != null){
              /*  String sql = "SELECT * FROM usertable WHERE name=? AND password=?;";
                PreparedStatement ps = con.prepareStatement(sql);
                ps.setString(1,name);
                ps.setString(2,password);
                ResultSet rs = ps.executeQuery();
                if(rs.next()){
                    // writer.println("Login Success!!!");
                    // writer.println("Welcome "+name+".");
                    request.setAttribute("ID",rs.getInt("id"));
                    request.setAttribute("Username",rs.getString("name"));
                    request.setAttribute("Password",rs.getString("password"));
                    request.setAttribute("Email",rs.getString("email"));
                    request.setAttribute("Gender",rs.getString("gender"));
                    request.setAttribute("Birthdate",rs.getDate("birthdate"));
                    request.getRequestDispatcher("userinfo.jsp").forward(request, response);
                }else{
                    request.setAttribute("msg" ,"username or password Error");
                    request.getRequestDispatcher("login.jsp").forward(request,response);
                    //  writer.print("Username or Password Error!!!");
                }
            }
        }catch (Exception e) {
            System.out.println(e);
        }
    }*/
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
