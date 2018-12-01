//登陆的正则验证
$("#name").blur(
    function (){ 
    var name=$("#name").val()
    if(!( /^\w{1,18}$/).test(name)){ 
        $("#name-err").fadeIn().delay(1000).fadeOut()
    }
}
)

$("#pwd").blur(
    function (){ 
    var pwd=$("#pwd").val()
    if(!( /^\w{6,18}$/).test(pwd)){ 
        $("#pwd-err").fadeIn().delay(1000).fadeOut()
    }
}
)
$("#phoneNumber").blur(
    function (){ 
    var phoneNumber=$("#phoneNumber").val()
    if(!(/^1[34578]\d{9}$/.test(phoneNumber))){ 
        $("#phone-err").fadeIn().delay(1000).fadeOut()
    }
}
)
$("#nickname").blur(
    function (){ 
    var nickname=$("#nickname").val()
    if(!(/^[\w\u4e00-\u9fa5]{6,8}$/.test(nickname))){ 
        $("#nickname-err").fadeIn().delay(1000).fadeOut()
    }
}
)