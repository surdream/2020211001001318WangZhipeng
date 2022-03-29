

<%@include file="header.jsp"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body{
            background-color: rgb(240, 234, 224);
        }
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .form{
            max-width: 500px;
            width: 400px;
            height: 460px;
            margin: 20px auto 0;
            border-radius: 8px;
            background-color: #f4f4f4;
            box-shadow: 0 0 20px #33333330;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .div1{
            margin-bottom: 20px;
            color: #666;
            width: 340px;
        }
        .div2{
            width: 340px;
            margin: 4px 0;
            user-select: none;
        }
        .Input{
            width: 340px;
            height: 36px;
            box-sizing: border-box;
            border: none;
            outline: none;
            background-color: #dfdfdf;
            padding: 0 14px;
            margin: 4px 0;
        }
        input[type='submit']{
            /* outline: none; */
            border: none;
            width: 110px;
            height: 36px;
            background-color: rgb(250, 140, 66);
            cursor: pointer;
            color: #fff;
            font-weight: bold;
        }
        input[type='submit']:active{
            background-color: rgb(230, 121, 48);
        }
        input[type='radio']{
            cursor: pointer;
        }
        .textColor{
            color: red;
        }
        .action{
            -webkit-animation: waggle .3s ;
            animation: waggle .3s;
            box-shadow: 0 0 4px rgb(250, 60, 60);
        }
        @keyframes waggle {
            0%,50%,100%{
                background-color: rgb(255, 60, 60);
            }
            25%{
                transform: translateX(-10px);
            }
            75%{
                transform: translateX(10px);
                background-color: rgb(255, 60, 60);
            }
        }
    </style>
</head>
<body>
<form action="register" method="post" class="form">
    <div class="div1">
        <span>New User Registration!</span>
    </div>
    <input type="text" class="Input" placeholder="Username" title="at least 8 characters" name="username">
    <input type="password" class="Input" placeholder="Password" name="password">
    <input type="email" class="Input" placeholder="Email" name="email">
    <div class="div2">
        <span>Gender</span>
        <input type="radio" name="Gender" value="Male">Male
        <input type="radio" name="Gender" value="Female">Female
    </div>
    <input class="Input" placeholder="Date of Birth (yyyy-mm-dd)" name="birthDate">
    <div class="div2">
        <input type="submit" value="Register" name="username">
    </div>
</form>
</body>
<script>
    let topText = document.querySelector('.div1 span');
    let inputs = document.querySelectorAll("input")
    let Username = inputs[0];
    let Password = inputs[1];
    let Email = inputs[2];
    let Birth = inputs[5];
    let submit = inputs[6];
    let error = 0;
    let titleList = ["New User Registration!"]

    let showTitle = function(str){
        topText.innerHTML = str;
        topText.classList.add("textColor");
    }
    let remove = function(){
        topText.innerHTML = "New User Registration!";
        topText.classList.remove("textColor");
    }


    Username.onblur = function(){
        if(Username.value != '' && Username.value.length < 8){
            Username.classList.add("action");
            showTitle("At Least 8 characters");
        }
        else{
            remove();
        }
    }
    Username.onfocus = function(){
        Username.classList.remove("action");
    }


    Email.onblur = function(){
        let reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
        if(Email.value != '' && !reg.test(Email.value)){
            Email.classList.add("action");
            showTitle("Error Email");
        }
        else{
            remove();
        }
    }
    Email.onfocus = function(){
        Email.classList.remove("action");
    }


    Birth.onblur = function(){
        let reg = /^\d{4}\-\d{2}\-\d{2}$/;
        if(Birth.value != '' && !reg.test(Birth.value)){
            Birth.classList.add("action");
            showTitle("Error Format");
        }
        else{
            remove();
        }
    }
    Birth.onfocus = function(){
        Birth.classList.remove("action");
    }


    submit.onclick = function(){
        if(Username.value == ''){
            showTitle("Username Cannot Be Empty");
            return false;
        }
        else if(inputs[1].value == ''){
            showTitle("Password Cannot Be Empty")
            return false;
        }
        else if(Email.value == ''){
            showTitle("Email Cannot Be Empty")
            return false;
        }
        else if(!inputs[3].checked && !inputs[4].checked){
            showTitle("Please Select A Gender")
            return false;
        }
        else if(Birth.value == ''){
            showTitle("Birth Cannot Be Empty")
            return false;
        }
    }

</script>
</html>
<%@include file="footer.jsp"%>