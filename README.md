# my.js(更新中...)
个人编写的一个小型js库，用原生es5封装了一些es6的方法、常用的算法、设计模式
# 简介：
  <p>_是my.js暴露出来的接口，每一次访问_返回一个__实例，而__是一个构造函数，它的原型里面有很多方法，从而可以通过_.xxx()调用里面的方法。</p>去
# API:
 ## _.Promise_:
 <p>手动实现的还是有挺多局限性的</p>
### then
 ```new _.Promise_(function(resolve，reject){setTimeOut(){console.log(1)}，1000}).then(function(resolve，reject){setTimeOut(){console.log(2)}，500)
```
