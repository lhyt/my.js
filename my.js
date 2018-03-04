/*
* my.js
* http://www.github.com/lhyt
* Create by lhyt
* Date: 2017-12-16 T21:26Z
* Update:Thu Mar 01 2018 00:07:26 GMT+0800
*/

(function(global,factory){
	'use strict';
	typeof exports === 'object'&&typeof module !== 'undefined'?module.exports = factory():
	typeof define === 'function' && define.amd?define(factory) :
	(global._ = factory());
})(this,function(){
	var globalvar 
	var _ = function(){
		return new __()
	}

	var object2type = {}
	"Boolean Number String Function Array Date Regexp Error Null Undefined Object".split(" ").map(function(item,index){
	  object2type['[object '+item+']'] = item.toLowerCase()
	})

	var rep = {
        '00': '\u200b',
        '01': '\u200c',
        '10': '\u200d',
        '11': '\uFEFF'
    };

    function hide(str) {
        str = str.replace(/[^\x00-\xff]/g, function(a) { // 转码 Latin-1 编码以外的字符。
            return escape(a).replace('%', '\\');
        });

        str = str.replace(/[\s\S]/g, function(a) { // 处理二进制数据并且进行数据替换
            a = a.charCodeAt().toString(2);
            a = a.length < 8 ? Array(9 - a.length).join('0') + a : a;
            return a.replace(/../g, function(a) {
                return rep[a];
            });
        });
        return str;
    }

    var tpl = '("@code".replace(/.{4}/g,function(a){var rep={"\u200b":"00","\u200c":"01","\u200d":"10","\uFEFF":"11"};return String.fromCharCode(parseInt(a.replace(/./g, function(a) {return rep[a]}),2))}))';

	function quick(arr, left, right,bool) {
    	var len = arr.length,
        partitionIndex,
        left = typeof left == 'number' ? left : 0,
        right = typeof right == 'number' ? right : len-1;

	    if (left < right) {
		    var pivot = left, //（set pivot）
		    index = pivot + 1;
		    for (var i = index; i <= right; i++) {
		    	if(bool){
		    		if (arr[i] < arr[pivot]) {
		            var temp = arr[i];
				    arr[i] = arr[index];
				    arr[index] = temp;
		            index++;
		        	}    
		    	}else{
		    		if (arr[i] > arr[pivot]) {
		            var temp = arr[i];
				    arr[i] = arr[index];
				    arr[index] = temp;
		            index++;
		        	} 
		    	}
    
		    }
		    var temp = arr[pivot];
	    	arr[pivot] = arr[index - 1];
	    	arr[index - 1] = temp;
		    partitionIndex = index-1;
	        quick(arr, left, partitionIndex-1,bool);
	        quick(arr, partitionIndex+1, right,bool);
	    }
	    return arr;
	}

	function  bubble(arr){
	for(var i = 0,len = arr.length;i<len;i++){
		for (var j = 0; i < len-1-j; j++) {
			if(arr[j]>arr[j+1]){
				var temp = arr[j+1]
				arr[j+1] = arr[j]
				arr[j] = temp
			}
		}
	}
	return arr
	}

	function  bubblereverse(arr){
	for(var i = 0,len = arr.length;i<len;i++){
		for (var j = 0; i < len-1-j; j++) {
			if(arr[j]<arr[j+1]){
				var temp = arr[j+1]
				arr[j+1] = arr[j]
				arr[j] = temp
			}
		}
	}
	return arr
	}

	function throttle(fun, delay, time) {
        var timeout,
            startTime = new Date();
        return function() {
            var curTime = new Date();
            clearTimeout(timeout);
            if (curTime - startTime >= time) {
                fun();
                startTime = curTime;
            } else {
                timeout = setTimeout(fun, delay);
            }
        };
    };

    function lazyLoad(imgs,preloading){

    	return function(){
	    	scrollTop = window.scrollY;
		    imgs.forEach((item,index)=>{
		        if( (scrollTop===0 && item.dataset.src !== '' &&
					item.offsetTop < window.innerHeight + scrollTop)||
					(item.dataset.src !== '' && 
					item.offsetTop < window.innerHeight + scrollTop &&
					item.offsetTop > scrollTop) )
		        {
					item.setAttribute('src',item.dataset.src)
					item.setAttribute('data-src','')
		        }
		    })
    	}

	}

	function __(){
		this.$inject = function(services,f,scope){
			var $params = f.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].split(',');
			for (var i in $params) { 
			    $params[i] = services[$params[i]]; 
			}
			return function(){
		       	f.apply(scope || {}, $params);
		   	} 
		}

		this.$iterator = function(data,index){
			return {
				next: function () {
		            var element;
		            if (!(index < length)) {
		                return null;
		            }
		            element = data[index];
		            index = index + 2;
		            return element;
		        },

		        reset: function () {
		            index = 0;
		        },

		        current: function () {
		            return data[index];
		        }
			}
		}

		this.$hider = function(code, type) {
	        var str = hide(code); // 生成零宽字符串

	        str = tpl.replace('@code', str); // 生成模版
	        if (type === 'eval') {
	            str = 'eval' + str;
	        } else {
	            str = 'Function' + str + '()';
	        }

	        return str;
	    }
		
	};
	__.prototype = {
		//promise
		Promise_:function(fn){
			var count = 0;
            var that = this;
            fn = fn||function(resolve,reject){resolve()};
            this.data = undefined;
            this.allcount = 0;
            this.list = [];
            this.state = 'pending';
            this.isall = false;
            this.alllist = [];
            this.err = undefined;
            this.israce = false;
            this.handlerace = false;
            this.racinglist = []
            this.ok = false

            this.then = function(callback){
                that.list.push(callback);
                return that;
            }

            this.resolve = function(data){
            	that.data = data || that.data
            	if(that.israce&&that.handlerace){
            		that.ok = true
            	}else if(that.israce){
            		that.handlerace = true;
            		this.state = 'resolved'
            		return;
            	}
            	
            	if(that.isall){
            		that.allcount++
            	}else if(count == that.list.length) {//then
                	that.state = 'resolved';
                	return that.data;
                }
                if(that.allcount == that.alllist.length+1){//all
                	that.state = 'resolved';
                	that.isall = false;
                	return;
                }
                if(that.list[count++]){//common
                	that.list[count++](that.resolve,that.reject);
                }
                
            }
            this.alling = function(){
            	that.alllist.forEach(function(x,index){
            		x(that.resolve);
            	})
            }

            this.racing = function(){
            	that.alllist.forEach(function(x,index){
            		x(that.resolve,that.begin);
            	})    	
            }
            this.begin = function(){
            	if(that.ok){
            		throw Error('sorry!i have to throw error to stop other function')
            	}
            }

            this.reject = function(err){
            	that.err = err || that.err;
				that.state = 'rejected';
				console.error('this promise is rejected');
                return;
            }

            this.all = function(arr){
            	that.alllist = arr;
            	that.isall = true;
				fn(that.alling);
            }

            this.race = function(arr){
            	that.alllist = arr;
            	fn(that.racing);	
            	that.israce = true;
            	
            }
            setTimeout(function(){
            	fn(that.resolve,that.reject);
            },0);
            return this;
		},

		//[...arr],f(...arr)
		extension_:function(){
			if(arguments.length == 0){
				return
			}
			var f = arguments[arguments.length-1]
			var arr = Array.prototype.slice.call(arguments)
			if(typeof f == 'function'){
				var args = arr.slice(0,arr.length-1)
				return f.apply(null,args);
			}
			return arr;	  
		},

		async_:function(){
			
		},

		//new
		new_:function(constructorFunction){
			if(arguments.length !== 1){
				console.error('new_ require only 1 argument');
				return;
			}

			if(typeof arguments[0] !== 'function'){
				console.error('new_ require function name');
				return;
			}

			var obj  = {};
			obj.__proto__ = constructorFunction.prototype;
			return constructorFunction.call(obj);
		},


		//XSS filter
		htmlEncode_:function(str){
			if(typeof str != 'string'){
				console.error('htmlEncode_ require a string');
			}
		    var hex = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
		    var preescape = str;
		    var escaped = "";
		    for(var i = 0; i < preescape.length; i++){
		        var p = preescape.charAt(i);
		        escaped = escaped + escapeCharx(p);
		    }
		    
		    return escaped;
		                    
		    function escapeCharx(original){
		        var found=true;
		        var thechar=original.charCodeAt(0);
		        switch(thechar) {
		            case 10: return "<br/>"; break; //newline
		            case 32: return "&nbsp;"; break; //space
		            case 34:return "&quot;"; break; //"
		            case 38:return "&amp;"; break; //&
		            case 39:return "&#x27;"; break; //'
		            case 47:return "&#x2F;"; break; // /
		            case 60:return "&lt;"; break; //<
		            case 62:return "&gt;"; break; //>
		            case 198:return "&AElig;"; break;
		            case 193:return "&Aacute;"; break;
		            case 194:return "&Acirc;"; break; 
		            case 192:return "&Agrave;"; break; 
		            case 197:return "&Aring;"; break; 
		            case 195:return "&Atilde;"; break; 
		            case 196:return "&Auml;"; break; 
		            case 199:return "&Ccedil;"; break; 
		            case 208:return "&ETH;"; break;
		            case 201:return "&Eacute;"; break; 
		            case 202:return "&Ecirc;"; break; 
		            case 200:return "&Egrave;"; break; 
		            case 203:return "&Euml;"; break;
		            case 205:return "&Iacute;"; break;
		            case 206:return "&Icirc;"; break; 
		            case 204:return "&Igrave;"; break; 
		            case 207:return "&Iuml;"; break;
		            case 209:return "&Ntilde;"; break; 
		            case 211:return "&Oacute;"; break;
		            case 212:return "&Ocirc;"; break; 
		            case 210:return "&Ograve;"; break; 
		            case 216:return "&Oslash;"; break; 
		            case 213:return "&Otilde;"; break; 
		            case 214:return "&Ouml;"; break;
		            case 222:return "&THORN;"; break; 
		            case 218:return "&Uacute;"; break; 
		            case 219:return "&Ucirc;"; break; 
		            case 217:return "&Ugrave;"; break; 
		            case 220:return "&Uuml;"; break; 
		            case 221:return "&Yacute;"; break;
		            case 225:return "&aacute;"; break; 
		            case 226:return "&acirc;"; break; 
		            case 230:return "&aelig;"; break; 
		            case 224:return "&agrave;"; break; 
		            case 229:return "&aring;"; break; 
		            case 227:return "&atilde;"; break; 
		            case 228:return "&auml;"; break; 
		            case 231:return "&ccedil;"; break; 
		            case 233:return "&eacute;"; break;
		            case 234:return "&ecirc;"; break; 
		            case 232:return "&egrave;"; break; 
		            case 240:return "&eth;"; break; 
		            case 235:return "&euml;"; break; 
		            case 237:return "&iacute;"; break; 
		            case 238:return "&icirc;"; break; 
		            case 236:return "&igrave;"; break; 
		            case 239:return "&iuml;"; break; 
		            case 241:return "&ntilde;"; break; 
		            case 243:return "&oacute;"; break;
		            case 244:return "&ocirc;"; break; 
		            case 242:return "&ograve;"; break; 
		            case 248:return "&oslash;"; break; 
		            case 245:return "&otilde;"; break;
		            case 246:return "&ouml;"; break; 
		            case 223:return "&szlig;"; break; 
		            case 254:return "&thorn;"; break; 
		            case 250:return "&uacute;"; break; 
		            case 251:return "&ucirc;"; break; 
		            case 249:return "&ugrave;"; break; 
		            case 252:return "&uuml;"; break; 
		            case 253:return "&yacute;"; break; 
		            case 255:return "&yuml;"; break;
		            case 162:return "&cent;"; break; 
		            case '\r': break;
		            default:
		                found=false;
		                break;
		        }
		        if(!found){
		            if(thechar>127) {
		                var c=thechar;
		                var a4=c%16;
		                c=Math.floor(c/16); 
		                var a3=c%16;
		                c=Math.floor(c/16);
		                var a2=c%16;
		                c=Math.floor(c/16);
		                var a1=c%16;
		                return "&#x"+hex[a1]+hex[a2]+hex[a3]+hex[a4]+";";        
		            }
		            else{
		                return original;
		            }
		        }    
		    }
		},

		//object's copy
		copy_:function(obj){
		    var buf
		    if(obj instanceof Array){
		        buf = []
		        var i = obj.length
		        while(i--){
		            buf[i] = copy(obj[i])
		        }
		        return buf
		    }else if(obj instanceof Object){
		        buf = {}
		        for(var x in obj){
		            buf[x] = copy(obj[x])
		        }
		        return buf
		    }else{
		        return obj
		    }
		},

		parse_:function(url){

		},

		//ajax:type,async,url,data,timeout,success,contentType,jsonp
		/*
		*@params {String} type
		*@params {Boolean} async(true)
		*@params {String} url
		*@params {*} data
		*@params {Number} timeout
		*@params {Function} success
		*@params {Object} contentType
		*@params {Boolean} jsonp(false)
		*/
		ajax_:function(params){
			var xhr=(function(){
		        try{
		            /*****FF,Google*****/
		            return function(){
		                return new XMLHttpRequest();
		            };
		        }catch(e){
		            try{
		                /*****IE*****/
		                return function(){
		                    return new ActiveXObject("Msxml2.XMLHTTP");
		                };
		            }catch(e){
		                try{
		                    /*****其他IE*****/
		                    return function(){
		                        return new ActiveXObject("Microsoft.XMLHTTP");
		                    };
		                }catch(e){
		                    return null;
		                }
		            }
		        }
		    })();

		    params.type = param.type|| "GET";
	        params.async =param.async || true;
	        params.url =param.url || window.location.href;
	        params.data =param.data || "";
	        params.timeout =param.timeout || 10000;
	        params.success =param.success || function(){};
			params.contentType =params.contentType || {"Content-type":"x-www-form-urlencoded"};
			params.jsonp = params.jsonp||false

			if(!jsonp){
				switch(params.type.toLowerCase()){
					case 'get':
					xhr.open(params.type,params.url+'?'+JsonToString(params.data),true);
					xhr.send();
					break;
					case 'post':
					xhr.open(params.type,params.url,true);
					xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
					xhr.send(JSON.stringify(params.data));
					break;
				}

				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4){
						if(xhr.status>=200&&xhr.status<300||xhr.status==304){
							xhr.success(xhr.responseText)
						}
						else{
							console.error('server error');
						}
					}
				}
			}else{
				var scriptDom = document.createElement("script")
			    scriptDom.setAttribute('src',params.url+'?cb='+params.success)
			   	var callback_func = params.success
			    window[callback_func] = function (data) {
					console.log(data)
			    }
			    document.body.appendChild(scriptDom)
			}


		},

		//sort bool(true)
		sort_:function(arr,bool){
			if(!(arr instanceof Array)){
				console.error('sort_ require an array');
				return;
			}
			bool = typeof bool == "boolean"?bool:true;
			if(arr.length<20){
				if(bool){
					return bubble(arr)
				}else{
					return bubblereverse(arr)
				}
			}else{
				return quick(arr,undefined,undefined,bool);
			}
		},


		//all data type
		type_:function(obj){
			  return obj === null ? obj + '':typeof obj === 'object' || 
			  typeof obj === "function"?object2type[toString.call(obj) ]|| 
			  'object' :typeof obj
			},


		//preloading:pic,loading(url),node(a HTMLElement)
		preload_:function(pic,loading,node){
			if(arguments.length!=3){
				if(!pic){
					console.error('insert your photo')
					return
				}
				if(!loading){
					console.error('insert your loading photo')
					return
				}
				if(!node){
					console.error('insert your node to insert photo')
					return
				}
				console.error('preload_ only require 3 arguments')
				return
			}
			var myImage = (function(){
		    var imgNode = document.createElement("img");
		    node.appendChild(imgNode);
			    return {
			        setSrc: function(src) {
			            imgNode.src = src;
			        }
			    }
			})();

			var ProxyImage = (function(){
			    var img = new Image();
			    img.onload = function(){
			        myImage.setSrc(this.src);
			    };
			    return {
			        setSrc: function(src) {
			        myImage.setSrc(loading);
			        img.src = src;
			        }
			    }
			})();
			ProxyImage.setSrc(pic);
		},

		//lazyLoad of images,imgs is an array of HTMLElements
		lazyload_:function (imgs,preloading){
			var pre = this.preload_
	        var scrollTop = window.scrollY;
	    	lazyLoad(imgs,preloading)()
	    	window.addEventListener('scroll',throttle(lazyLoad(imgs,preloading),500,1000));
    	},

    	presome_:function(urlarr,node){
			var Images = new Array(urlarr.length);
			var ImgLoaded =0;
			function validateImages(i){
			    if (!Images[i].complete)
			    {
			        setTimeout(function(){
			        	Images[i].src = urlarr[i]
				    	Images[i].onLoad=validateImages(i);
			        },300);
			    }
			    else if (typeof Images[i].naturalWidth != "undefined" && Images[i].naturalWidth == 0)
			    {
			        setTimeout(function(){
			        	Images[i].src = urlarr[i]
				    	Images[i].onLoad=validateImages(i);
			        },300);
			    }
			    else
			    {
			        ImgLoaded++
			        if(ImgLoaded == l)
			        {
			            Images.forEach(function(x){
							node.appendChild(x)
						})
			        }
			    }
			}
				for(var i=0;i<Images.length;i++){
				    Images[i]=new Image();
				    Images[i].src = urlarr[i]
				    Images[i].onLoad=validateImages(i);
			    }
    	}

	}

	return _();
})
