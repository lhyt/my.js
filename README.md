# my.js(更新中...)
个人编写的一个小型js库，用原生es5封装了一些es6的方法、常用的算法、设计模式

用karma测试代码覆盖率，需要全局安装一系列（具体容易百度到）再npm i，然后karma start，config文件自行配置
# 简介：
  \_是my.js暴露出来的接口，每一次访问_返回一个__实例，而__是一个构造函数，它的原型里面有很多方法，从而可以通过_.xxx()调用里面的方法。
# API:

## \_.$inject:

依赖注入：
example：\_.$inject(services,function(c,a,b){a();b();c()})

services是一个对象，存放的是一系列的函数集，比如：
```javascript
var services = {
	c:()=>{console.log(1)},
	v:()=>{console.log(2)},
	b:()=>{console.log(3)}
}
```
我们在$inject方法中可以按需注入，比如我在某个函数里面需要用到b、c两个函数的时候

var di = \_.$inject(services,function(c,b){b();c();})

di();//3,1

注意，函数的参数名字必须和services里面的一样，不可以自定义

## \_.$iterator

迭代器，\_.$iterator（arr，index）

传入参数是一个数组以及迭代的起点

### next方法

每一次调用，返回的是下一个元素：\_.$iterator([1,2,3],0).next() //1

\_.$iterator([1,2,3],0).next()//2

\_.$iterator([1,2,3],0).next()//3

\_.$iterator([1,2,3],0).next()//null

### reset方法

重置index为0

## \_.$hider

输入参数为字符串类型，也就是toString后的结果

隐藏代码，并可以用eval执行

eval(\_.$hider('console.log(1)'))

## \_.$token(慎用，必须安装一些依赖)

生成token，用法：
```javascript
_.$token().createToken(data,timeout) //创建token，data是一个json对象
_.$token().decodeToken(token)  //解释token，返回一个对象
_.$token().checkToken(token)  //检测token，返回boolean

```
## \_.$move

传入的是dom元素\_.$move（dom），使得dom元素可以拖拽
eg:
```javascript
var div = document.querySelector('div');_.$move（dom）
```

 ## \_.Promise_:
 
 类似于es6

实例化： new \_.Promise_(fn/null)
 
 example:new \_.Promise_(function(resolve，reject){[your code];resolve（[data]）/reject([err])})
 
 <p>内部代码执行完后，必须手动resolve或者reject</p>
 
### then
<p>内部代码执行完后，也是需要手动resolve或者reject</p>
example: new \_.Promise_(...).then（function(resolve，reject){[your code];resolve（[data]/reject([err]}）

```javascript
 new _.Promise_(function(resolve，reject){
 setTimeOut(){console.log(1);resolve()
 }，1000})
 .then(function(resolve，reject){
 setTimeOut(){console.log(2);
 resolve()
 }，500)
```
### resolve和reject

表示\_.Promise_对象将要以什么状态结束，它们也可以传入参数，提供后续操作使用：resolve（[data]）,reject([err])

 ### all
 
 example: new \_.Promise_().all([arr])
 
 all的参数是一个数组，接受的参数是resolve的一个匿名函数，比如：
 <br>
 ```javascript
 function(resolve,begin){
                setTimeout(function(){
                    console.log(1);
                    resolve();
                }, 1500);
            }
```
<br> 
执行完成需要手动resolve，当数组全部函数执行完成，state将会变成resolved

### race

example: new \_.Promise_().race([arr])
<br>
和all一样，但是每一个函数里面需要传入另一个参数，begin，表示内部代码块开始执行，也就是说代码块被begin和resolve包围着
<br>
```javascript
function(resolve,begin){
                setTimeout(function(){
                	begin();
                    console.log(4);
                    resolve();
                }, 1500);
            }
```
**warning:用了throw Error（）实现中断异步任务，所以后台会报错:sorry!i have to throw error to stop other function**


## \_.extension_

类似于es6的扩展运算符，\_.extension_()传入的参数不限，如果最后一个参数是函数，则前面参数将会被注入该函数进行调用。如果传入的参数最后一个不是函数，则返回[...arguments]

\_.extension_(1,2,3,function(){
		return arguments[0]
	})//1
 
 \_.extension_(1,2,3)//[1,2,3]
 
 ## \_.new_
 
 相当于原生的new关键字，传入参数是一个构造函数\_.new_（obj）
 
 ## \_.htmlEncode_
 
 传入参数类型为字符串。
 
 XSS过滤器，对用户输入的html反转义，防止xss攻击，\_.htmlEncode_（str）

## \_.copy_

对象的深拷贝，传入的应该是object数据类型，如果不是也没有意义，多此一举

## \_.ajax_

\_.ajax_(type,async,url,data,timeout,success,contentType,jsonp)

		@params {String} type http请求类型
	 	@params {Boolean} async(true) 是否异步
		@params {String} url 
		@params {\*} data 提交的数据（任何类型）
		@params {Number} timeout 超时
		@params {Function} success 成功的回调函数
		@params {Object} contentType 请求体类型
		@params {Boolean} jsonp(false) 是否用jsonp，用了只能实现get请求

## \_.sort_

\_.sort_（arr，bool）arr是传入排序数组，bool表示是否逆序排序（默认true顺序排序）

排序算法。如果数组元素数量小于20将会进行冒泡排序，大于20将会使用快速排序

## \_.type_

更高端的判断类型，包括原生的各种对象：Date、Number、String、Regexp等等

example: \_.type_(new Date()) //date

## \_.preload_

图片预加载，\_.preload_（图片url，占位图，插入的节点）

三个参数都需要有，当图片没有完全加载，就会用占位图代替

## \_.lazyload_

图片懒加载，\_.lazyload_（图片url组成的数组，占位图）

此api需要自己引入img标签（要多少加多少），src为占位图url，并自己设计一个属性：data-src属性值是要加载的图片的url
```html
<img src="占位图.gif" data-src="1.jpg">
```
当滚动屏幕时候，就加载图片，里面还有防抖节流的优化

## \_.presome_

批量图片预加载，\_.presome_(图片url组成的数组，插入节点的位置)

## \_.add_
大数相加（包括数字已经大于浏览器承受的情况），传入参数为两个数字字符串\_.add_（a，b）
如果正常情况，两个特别大的数字直接相加会显示Infinity

## \_.event_
自定义事件
 ```javascript
var e = new _.event_()
e.on('a',function(b){console.log(b)})//注册事件
e.emit('a',1)//触发事件
e.remove('a')//删除事件
 ```
