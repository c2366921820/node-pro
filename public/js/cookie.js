/**
 * @class cookieApi瀹炵幇瀵筩ookie鐨勫鍒犳敼鏌�
 * @constructor
 * @return {Objct} 杩斿洖涓€涓猚ookieApi瀵硅薄
 * @example  var obj = new GcookieApi();
 * 
 */
function GcookieApi(kk){

}
/**
 * @method getCookie  鑾峰彇鎸囧畾name鐨刢ookie鍊�
 * @param  {name} 闇€瑕佽幏鍙栫殑cookie鐨刵ame鍊�
 * @return {String} 濡傛灉璇ookie瀛樺湪灏辫繑鍥瀋ookie鍊硷紝涓嶅瓨鍦ㄥ氨杩斿洖绌�
 */
GcookieApi.prototype.getCookie=function(name){
	var cookieStr=document.cookie;
	if(cookieStr.length>0){
		var start =cookieStr.indexOf(name+"=");
		if(start>-1){
			start+=name.length+1;
			var end = cookieStr.indexOf(";",start);
			if(end===-1){
				end=cookieStr.length;
			}
		}
		return decodeURIComponent(cookieStr.slice(start,end));
	}
	return "";
}
/**
 * @method getAllCookies 杩斿洖璺焜s鍚屾簮鐨勬墍鏈夌殑cookie
 * @return {String}  
 */
GcookieApi.prototype.getAllCookies=function(){
	return document.cookie;
}
/**
 * @method getCookiesByJson  浠son鐨勫舰寮忚繑鍥瀋ookie銆�
 * @return {JSON} 灏哻ookie宸瞛son鐨勫舰寮忚繑鍥�
 */
GcookieApi.prototype.getCookiesByJson=function(){
	//cookie涓€间笉鑳界洿鎺ヤ负鍒嗗彿(;),document.cookie涔熶笉浼氳繑鍥炴湁鏁堟湡銆佸煙鍚嶅拰璺緞锛屾墍浠ュ彲浠ヤ娇鐢ㄥ垎鍙�(;)鍒嗛殧cookie
	//浣跨敤JSON.parse鐨勬椂鍊欙紝瀛楃涓插舰寮忕殑瀵硅薄銆傚悕鍜屽€煎繀椤讳娇鐢ㄥ弻寮曞彿鍖呰９锛屽鏋滀娇鐢ㄥ崟寮曞彿灏变細鎶ラ敊  姣斿 JSON.parse("{'a':'1'}")鏄敊璇殑  搴旇涓篔SON.parse('"a":"1"');
	var cookieArr =document.cookie.split(";");
	var jsonStr='{';
	for(var i=0;i<cookieArr.length;i++){
		var cookie=cookieArr[i].split("=");
		jsonStr+='"'+cookie[0].replace(/\s+/g,"")+'":"'+decodeURIComponent(cookie[1])+'",';
	}
	jsonStr=jsonStr.slice(0,-1);
	jsonStr+='}';
	return JSON.parse(jsonStr);

}
/**@method deleteCookie  濡傛灉瑕佸垹闄や竴涓猚ookie锛屽繀椤诲煙鍚嶅拰path閮借窡宸叉湁鐨刢ookie鐩稿悓
 * @param {String} name cookie鍚峮ame
 * @param {String} value cookie鍊紇alue
 * @param {Number} time  cookie鐨勬湁鏁堟椂闂达紝姣斿2016-01-01 00:00:00锛屽鏋滀笉璁剧疆expres涓簊ession銆傚叧闂祻瑙堝櫒鍚庢垨鑰呰繃浜唖ession鏃堕棿灏辨竻闄ookie,
 * @param {String} domain cookie鐨勫煙鍚嶏紝榛樿涓簀s鏂囦欢鎵€鍦ㄥ煙鍚�
 * @param {String} path cookie璺緞锛岄粯璁や负褰撳墠璺緞js鏂囦欢鎵€鍦ㄨ矾寰�
 * @return {Undefined}
 */
GcookieApi.prototype.setCookie=function(name,value,time,domain,path){
	var str=name+"="+encodeURIComponent(value);
	if(time){
		var date = new Date(time).toGMTString();
		str+=";expires="+date;
	}
	str=domain?str+";domain="+domain : str;
	str=path?str+';path='+path :str;
	document.cookie=str;

}
/**
 * @description 瑕佸垹闄や竴涓猚ookie锛屾瘮濡俤omain鍜宲ath瀹屽叏鐩稿悓銆傚鏋滆缃甤ookie鏃舵病鏈夎缃甦omain鍜宲ath锛屽垯鍒犻櫎鏃朵篃涓嶉渶瑕佽缃繖涓や釜鍊硷紝濡傛灉璁剧疆浜嗗垯鍒犻櫎鏃跺氨闇€瑕佷紶鍏ヨ繖涓や釜鍊�
 * @param  {String} name   [cookie鍚峕
 * @param  {String} domain [cookie domian鍊糫
 * @param  {String} path   [cookie 璺緞]
 * @return {undefined}        [杩斿洖undefined]
 */
GcookieApi.prototype.deleteCookie=function(name,domain,path){
	var date = new Date("1970-01-01");
	var str=name+"=null;expires="+date.toGMTString();
	str=domain ? str+";domain="+domain : str;
	str=path ? str+";path="+path : str;
	document.cookie=str;
}
GcookieApi.prototype.deleteAllCookie=function(){
	var cookieJson=this.getCookiesByJson(),
	    str="",
	    date = new Date("1970-01-01");
	for(var i in cookieJson){
		str=i+"=null;expires="+date.toGMTString();
	}
	document.cookie=str;
}