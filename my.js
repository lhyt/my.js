/*
* my.js
* http://www.github.com/lhyt
* Create by lhyt
* Date: 2017-12-16 T21:26Z
* Update:Wed Mar 28 2018 20:09:45 GMT+0800 
*/

(function(global,factory){
	'use strict';
	typeof exports === 'object'&&typeof module !== 'undefined'?module.exports = factory():
	typeof define === 'function' && define.amd?define(factory) :
	(global._ = factory());
})(this,function(){
	var that
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

    function JsonToString(json){
		var arr = [];
		for(var i in json){
			//console.log(i+option.data[i])
			arr.push(i+'='+json[i])
		};
		//console.log(arr.join('&'));
		return arr.join('&');
	}

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

	 function bubble(arr) {
	    var len = arr.length;
	    var preIndex, current;
	    for (var i = 1; i < len; i++) {
		preIndex = i - 1;
		current = arr[i];
		while(preIndex >= 0 && arr[preIndex] > current) {
		    arr[preIndex+1] = arr[preIndex];
		    preIndex--;
		}
		arr[preIndex+1] = current;
	    }
	    return arr;
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
			index = index||0;
			return {
				next: function () {
		            var element;
		            if (!(index < length)) {
		                return null;
		            }
		            element = data[index];
		            index = index + 1;
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
	    },

	    this.$token = function(){
	    	return {
	    		createToken:function(obj,timeout){
			        console.log(parseInt(timeout)||0);
			        var obj2={
			            data:obj,
			            created:parseInt(Date.now()/1000),
			            exp:parseInt(timeout)||10
			        };

			        var base64Str=Buffer.from(JSON.stringify(obj2),"utf8").toString("base64");
			        var secret="hel.h-five.com";
			        var hash=crypto.createHmac('sha256',secret);
			            hash.update(base64Str);
			        var signature=hash.digest('base64');


			        return  base64Str+"."+signature;
			    },
			    decodeToken:function(token){

			        var decArr=token.split(".");
			        if(decArr.length<2){

			            return false;
			        }

			        var payload={};
			        try{
			            payload=JSON.parse(Buffer.from(decArr[0],"base64").toString("utf8"));
			        }catch(e){
			            return false;
			        }

			        var secret="hel.h-five.com";        
			        var hash=crypto.createHmac('sha256',secret);
			            hash.update(decArr[0]);
			        var checkSignature=hash.digest('base64');

			        return {
			            payload:payload,
			            signature:decArr[1],
			            checkSignature:checkSignature
			        }
			    },
			    checkToken:function(token){
			        var resDecode=this.decodeToken(token);
			        if(!resDecode){

			            return false;
			        }

			        var expState=(parseInt(Date.now()/1000)-parseInt(resDecode.payload.created))>parseInt(resDecode.payload.exp)?false:true;
			        if(resDecode.signature===resDecode.checkSignature&&expState){

			            return true;
			        }

			        return false;
			    }
	    	}

	    	this.callback_func = null
	    },


	    this.$move = function (ele){
			this.ele = ele
			this.ismoving = false
			var that = this
			var w = window.innerWidth
			var h = window.innerHeight
			var height = +document.defaultView.getComputedStyle(this.ele).height.slice(0,-2)
			var width = +document.defaultView.getComputedStyle(this.ele).width.slice(0,-2)
			this._x = this._y = this.startX = this.startY= 0
			this.ele.onmousedown = function(e){
				that.ismoving = true
				that.startX = e.clientX
				that.startY = e.clientY
			}
			this.ele.onmousemove = function(e){
				if(that.ismoving){
					if((+that._x+ e.clientX-that.startX<=0)||(+that._y+ e.clientY-that.startY<=0)||(+that._x+ e.clientX-that.startX>=+w-width)||(+that._y+ e.clientY-that.startY>=+h-height)){
						return
					}
					that.ele.style.marginLeft =+that._x+ e.clientX-that.startX +'px'
					that.ele.style.marginTop =+that._y+ e.clientY-that.startY +'px'
				}
			}
			this.ele.onmouseleave = this.ele.onmouseup = function(){
				that.ismoving = false
				that._x = that.ele.style.marginLeft.slice(0,-2)
				that._y = that.ele.style.marginTop.slice(0,-2)
			}
		}
		
	};
	__.prototype = {
		callback_func:null,
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
		copy_:function(arr){
			var temp
			if (typeof arr == 'number'||typeof arr == 'boolean'||typeof arr == 'string') {
				return arr.valueOf() 
			}
			if(arr instanceof Array){
				temp = []
				for(x in arr){
					temp[x] = copy(arr[x])
				}
				return temp
			}else if(arr instanceof RegExp){
				temp = arr.valueOf()
				var str = (temp.global ? 'g' : '') +(temp.ignoreCase ? 'i': '')+(temp.multiline ? 'm' : '')
				return new RegExp(arr.valueOf().source,str)
			}else if(arr instanceof Function){
				var str = arr.toString();
				/^function\s*\w*\s*\(\s*\)\s*\{(.*)/.test(str);
				var str1 = RegExp.$1.slice(0,-1);
				return new Function(str1)
			}else if(arr instanceof Date){
				return new Date(arr.valueOf());
			}else if(arr instanceof Object){
				try{
					temp = JSON.parse(JSON.stringify(arr))
				}catch(e){
					console.error(e)
					return
				}
				if(arr.__proto__.constructor !== Object){
					temp.__proto__.constructor = arr.__proto__.constructor
				}
				return temp
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
		ajax_:function(param){
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
		    xhr = xhr()
		    var params = {}
		    params.type = param.type|| "GET";
	        params.async =param.async || true;
	        params.url =param.url || window.location.href;
	        params.data =param.data || "";
	        params.timeout =param.timeout || 10000;
	        params.success =param.success || function(){};
			params.contentType =param.contentType || {"Content-type":"x-www-form-urlencoded"};
			params.jsonp = param.jsonp||false
			if(!params.jsonp){
				switch(params.type.toLowerCase()){
					case 'get':
					xhr.open(params.type,params.url+'?'+JsonToString(params.data),params.async);
					xhr.send();
					break;
					case 'post':
					xhr.open(params.type,params.url,params.async);
					xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
					xhr.send(JSON.stringify(params.data));
					break;									
				}

			}else{
				var count = 0
				var scriptDom = document.createElement("script")
				var _id = 'myjsonp-data'+count++
				that = this
				console.log(_)
				console.log(__)
			   	this.__proto__.callback_func = function(data){
			   		params.success(data)
			   		document.body.removeChild(document.querySelector('#'+_id))
			   	}
			   	console.log(this.__proto__.callback_func)
			    scriptDom.setAttribute('src',params.url+'?cb=_.__proto__.callback_func&'+JsonToString(params.data))
			    scriptDom.setAttribute('id',_id)
			    document.body.appendChild(scriptDom)
			}
			if(params.async){
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4){
						if(xhr.status>=200&&xhr.status<300||xhr.status==304){
							params.success(xhr.responseText)
						}
						else{
							console.error('server error');
						}
					}
				}				
			}else{
				params.success(xhr.responseText)
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
    	},

    	add_:function(a,b){
				if(typeof a !== 'string'||typeof b !== 'string'){
					console.error('require string')
					return
				}
				if(isNaN(+a)||isNaN(+b)){
					console.error('require to be normal number string')
					return		
				}
				var min = a.length>b.length?b:a
				var max = a.length<b.length?b:a
				var len = min.length
				var lenmax = max.length
				var upgrade = 0
				if(a.length===b.length){
					min = a;
					max = b;
				}
				var res = []
				while(len--){
					var sum = parseInt(min[len])+parseInt(max[--lenmax])
					if(upgrade){
						sum += upgrade
						upgrade = 0
					}
					if(sum>=10){
						sum -= 10
						upgrade = 1
					}	
					res.unshift(sum)
				}
				res = res.join("")
				if(upgrade){
					if(lenmax-len-1>0){
						var mid = +max.slice(lenmax-len-2,lenmax-len-1)+1
						res = max.slice(0,lenmax-len-2)+mid+res
					}else if(lenmax-len===1){
						res = 1+parseInt(max.slice(0,1))+res
					}
				}else if(a.length!==b.length){
					res = max.slice(0,lenmax-len-1) + res
				}
				return res
			},
		
			event_:function (){
				this.list=[],
				this.on=function(key,cb){
					if(!this.list[key]){
						this.list[key] = []
					}
					this.list[key].push(cb)
				},
				this.emit = function(){
					var key = Array.prototype.shift.call(arguments)
					var e = this.list[key]
					if(!e){
						console.error('event is not on')
						return
					}
					var args = Array.prototype.slice.call(arguments)
					for(var i = 0;i<e.length;i++){
						e[i].apply(null,args)
					}
				},
				this.remove=function(key){
					delete this.list[key]
				}
			},
		
		 bfs_:function(arr,start,end){
			var row = arr.length
			if(arr[0].length!==row){
			    console.error('require a matrix')
				return
			}
			var quene = []
			var i = start
			var visited = {}
			var order = []
			quene.push(i)
			while(quene.length){
				for(var j = 0;j<row;j++){
					if(arr[i][j]){
						if(!visited[j]){
							quene.push(j)//队列加入未访问
						}
					}
				}
				quene.shift()//取出队列第一个
				visited[i] = true//记录已经访问
				while(visited[quene[0]]){
					quene.shift()
				}
				order.push(i)//记录顺序
				i = quene[0]
			}
			return {visited:visited,result:!!visited[end],order:order}
		},
		
		dfs_:function (arr,start,end){
			var row = arr.length
			var visited = {}
			var i = start
			var index = null
			var stark = []
			var order = []
			function d(i){
				stark.push(i)
				for(var j = 0;j<row;j++){
					if(arr[i][j]&&!visited[j]){
						visited[j] = true
						d(j)
					}
				}
				order.push(stark.pop())
				visited[i] = true
				return 
			}
			d(i)
			return {visited:visited,result:!!visited[end],order:!!visited[end]?order:order.slice(1)}
		}



	}

	return _();
})
