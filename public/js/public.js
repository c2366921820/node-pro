//封装id选择器
function $id(id){
	return document.getElementById(id);
}


//获取某个范围之间的随机整数
function getRand(startNum,endNum){
	return parseInt(Math.random()*(endNum-startNum+1) + startNum);
}

//随机获取六位十六进制颜色值
function getRandColor(){
	var colorCh = "0123456789abcdef";
	var str = "#";
	for (var i = 0; i < 6; i++) {
		var index = getRand(0,15);
		str += colorCh.charAt(index);
	}
	console.log(str);
	return str;
}
//随机获取num位数字验证码
function getYZM(num){
	var yzm = "";
	for (var i = 0; i < num; i++) {
		var randAS = getRand(48,122);
		if((randAS >= 48 && randAS <= 57) || (randAS >= 65 && randAS <= 90) || (randAS >= 97 && randAS <= 122) ){
			var ch = String.fromCharCode(randAS);
			yzm += ch;
		}else{
			i--;
		}
	}
	return yzm;
}
//获取这种格式的日期：2018年X月X日 00:00:00 星期X
function dateToString(date){
	//2018年X月X日 00:00:00 星期X
	// y/m/d h:M:s
	var week = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"]
	
	var dateStr = "";
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	var w = date.getDay();
	var h = date.getHours();
	var M = date.getMinutes();
	var s = date.getSeconds();
	
	dateStr += y+"年"+getDB(m)+"月"+getDB(d)+"日" 
	dateStr += " " + getDB(h) + ":" + getDB(M) + ":" + getDB(s);
	dateStr += " " + week[w];
	return dateStr;
}

function getDB(num){
	return num < 10 ? "0" + num : num;
}

//获取两个时间的时间差，返回是一个秒数。
function getTimeDif(startTime,endTime){
	return (endTime.getTime() - startTime.getTime())/1000;
}

//添加一个新节点到目标节点的后面。
function insertAfter(newEle,targetEle){
	var parent = targetEle.parentNode;
	//如果目标节点是最后一个子节点，直接把新节点添加到父节点的最后就可以了
	if(parent.lastElementChild === targetEle){
		parent.appendChild(newEle);
	}else{
		//如果目标节点不是最后一个子节点，把新节点添加到这个子节点的下一个兄弟节点的前边
		parent.insertBefore(newEle,targetEle.nextElementSibling);
	}
};
//跨浏览器兼容ie8及以下浏览器获取事件对象的button属性。
function getButton(eve){
	if(eve){
		return eve.button;
	}else if(window.event){
		var button = window.event.button;
		switch(button){
			case 1 : 
				return 0;
			case 4 : 
				return 1;
			case 2 : 
				return 2;
		}
	}
}

//跨浏览器兼容ie8及以下阻止冒泡。
function stopPropaG(e){
	if(e.stopPropagation){
		//说明是现代浏览器
		e.stopPropagation();
	}else{
		//说明是ie8及以下浏览器
		e.cancelBubble = true;
	}
}
//跨浏览器兼容ie8及以下阻止默认行为
function preventDefautEvent(e){
	return e.preventDefault ? e.preventDefault() : e.returnValue = false;
}
//跨浏览器兼容ie8及以下的事件兼听。
function addEvent(ele,eve,callBack){
	if(ele.addEventListener){
		ele.addEventListener(eve,callBack);
	}else{
		ele.attachEvent("on"+eve,callBack);
	}
}

//设置cookie的封装
function setCookie(key,value,date){
	if(date){
		document.cookie = key + "=" + value + "; expires=" + date;
	}else{
		document.cookie = key + "=" + value;
	}
}
//获取cookie
function getCookie(key){
	//"key1=值1; key2=值2"
	var cookieVal = document.cookie;
	var cookieArr = cookieVal.split("; ");
	for (var i = 0; i < cookieArr.length; i++) {
		var arr = cookieArr[i].split("=");
		if(arr[0] == key){
			return arr[1];
		}
	}
	return "";
}
//删除cookie
function deleteCookie(key){
	document.cookie = key+"=;expires="+new Date(0);
}

//跨浏览器兼容ie8及以下获取元素计算后样式值。
function getStyle(obj,attr){
	return window.getComputedStyle ? window.getComputedStyle(obj,null)[attr] : obj.currentStyle[attr];
}

//实现两个元素之间的碰撞
function pz(ele1,ele2){
	var ele1Rect = getRect(ele1);
	var ele2Rect = getRect(ele2);
	
	var ele1L = ele1Rect.left;
	var ele1R = ele1Rect.right;
	var ele1T = ele1Rect.top;
	var ele1B = ele1Rect.bottom;
	
	var ele2L = ele2Rect.left;
	var ele2R = ele2Rect.right;
	var ele2T = ele2Rect.top;
	var ele2B = ele2Rect.bottom;
	
	if(ele1R < ele2L || ele1B < ele2T || ele1L > ele2R || ele1T > ele2B){
		return false;
	}else{
		return true;
	}
	
}

//兼容ie7的两像素问题。
function getRect(ele){
	var rect = ele.getBoundingClientRect();
	var a = document.documentElement.clientLeft;
	return {
		left :rect.left -a,
		right:rect.right -a,
		top:rect.top -a,
		bottom:rect.bottom -a
	}
	
}