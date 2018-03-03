# my.js(更新中...)
个人编写的一个小型js库，用原生es5封装了一些es6的方法、常用的算法、设计模式
# 简介：
  \_是my.js暴露出来的接口，每一次访问_返回一个__实例，而__是一个构造函数，它的原型里面有很多方法，从而可以通过_.xxx()调用里面的方法。
# API:

 ## \_.Promise_:
 
 类似于es6

实例化： new \_.Promise_(fn/null)
 
 example:new \_.Promise_(function(resolve，reject){[your code];resolve（[data]）/reject([err])})
 
 <p>内部代码执行完后，必须手动resolve或者reject</p>
 
### then
<p>内部代码执行完后，也是需要手动resolve或者reject</p>
example: new \_.Promise_(...).then（function(resolve，reject){[your code];resolve（[data]/reject([err]}）

>  `new _.Promise_(function(resolve，reject){
 setTimeOut(){console.log(1);resolve()
 }，1000})
 .then(function(resolve，reject){
 setTimeOut(){console.log(2);
 resolve()
 }，500)
`
### resolve和reject

表示\_.Promise_对象将要以什么状态结束，它们也可以传入参数，提供后续操作使用：resolve（[data]）,reject([err])

 ### all
 
 example: new \_.Promise_().all([arr])
 
 all的参数是一个数组，接受的参数是resolve的一个匿名函数，比如：
 <br>
 function(resolve,begin){
                setTimeout(function(){
                    console.log(1);
                    resolve();
                }, 1500);
            }
<br> 
执行完成需要手动resolve，当数组全部函数执行完成，state将会变成resolved

### race

example: new \_.Promise_().race([arr])
<br>
和all一样，但是每一个函数里面需要传入另一个参数，begin，表示内部代码块开始执行，也就是说代码块被begin和resolve包围着
<br>
function(resolve,begin){
                setTimeout(function(){
                	begin();
                    console.log(4);
                    resolve();
                }, 1500);
            }

**warning:用了throw Error（）实现中断异步任务，所以后台会报错**



