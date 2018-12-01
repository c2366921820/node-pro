//获取cookie中的nickname和username
var nick=getCookie("nickname");
var uname=getCookie("username");
var isAdmin=getCookie("isAdmin");
console.log(nick);
$("#nickName").html(nick);
//点击退出删除cookie并返回login页面
$("#exit").click(function(){
  $("#nickName").html("");
  deleteCookie("isAdmin");
  deleteCookie("nickname");
  deleteCookie("username")
  setTimeout(function(){
    alert("登陆过期请重新登陆");
    window.location.assign("http://localhost:3000/login.html")
  },1000)
})
console.log(isAdmin);
if(isAdmin=="false"){
  $("#userPage").css({display:"none"});
  $("#admin-show").css({display:"none"});
  $("#member-show").css({display:"inline"})
}
if(isAdmin=="true"){
  $("#userPage").css({display:"block"});
  $("#admin-show").css({display:"inline"});
  $("#member-show").css({display:"none"})
}