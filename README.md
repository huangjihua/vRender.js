
##vRender.js是什么?
* 基于原生javascript编写的一个前端渲染库，帮助前端人员轻松将JSON数据渲染至html<br>
* 超轻量，压缩后仅5kb，使用纯字符串加正则表达式实现，避免了使用大量dom操作消耗较多性能的问题

##例子1

```code
<div id="view">
    {{value}}
</div>
<script>
    vRender.render("view",{value:"hello"})
    //或者
    //var view=document.getElmentById("view");
    //vRender.render(view,{value:"hello"})
</script>
```
###渲染结果
```code
hello
```
##例子2

```code
<div id="view">
    {{value||'无数据'}}
</div>
<script>
    vRender.render("view",{value:""})
</script>
```
###渲染结果
```code
无数据
```
##例子3

```code
<div id="view">
    {{value?'有数据':'无数据'}}
</div>
<script>
    vRender.render("view",{value:""})
</script>
```
###渲染结果
```code
无数据
```
##数据变化自动更新视图
```code
<div id="view">
    {{value?'有数据':'无数据'}}
</div>
<script>
    var model={value:""}
    vRender.render("view",model);
    model.value="1";
</script>
```
###渲染结果
```code
有数据
```
##监听数据变化,$watch监听，$set修改

```code
<div id="view">
{{value}}
</div>
<script>
var model={value:""}

var vm=vRender.render("view",model);

vm.$watch("value",function(val){//val是监听到的新的值
	this.value+="妹子";
})

model.value="你好";
//或者 vm.$set("value","妹子");

</script>
```
###渲染结果
```code
你好妹子
```
##数据双向绑定v-model

```code
<div id="view">
值：{{value}}
<input value="" v-model="value" >
</div>
<script>

var model={value:""}

var vm=vRender.render("view",model);

</script>
```
##v-for数据列表循环
```code
<div id="view" v-for="user in friend">
    朋友：{{user.name}}<br>
<br>
</div>
<script>
    var model={name:"小红",friend:[{name:"小明"},{name:"小白"}]};
    
    vRender.render("view", model);
</script>
```
###渲染结果
```code
小明
小白 
```

##调用已经写好的function

```code
<div id="view">
    {{func1(value)}}
    <br>
    {{func2(value)}}
</div>
<script>
   var model={value:'ok'},
   var config={
       func1:function(e){
          return e;
          }
    }
    
    //config里没有func2则调用全局
    function func2(e){
        return e+":func2";
    }
    vRender.render("view", model,config);
    
</script>
```
###渲染结果
```code
ok
ok:func2
```

##字符串截取

```code
<div id="view">
	{{value.5}}
    <br>
    {{value.-5}}
</div>
<script>
    vRender.render("view",{value:"1234567890"})
</script>
```
###渲染结果
```code
12345... 
*67890   
```
##时间

```code
<div id="view">
    {{time(value)}}
    <br>
    {{shortTime(num)}}
    <br>
    {{yyyy-MM-dd(value)}}
</div>
<script>
    var model={value:"2015/12/24 11:22:56",num:1451360409000}

    vRender.render("view", model);
</script>
```
###渲染结果
```code
2015/12/24 11:22:56 
2015/12/29
2015-12-24
```

##建立虚拟view,id前边加“vDis"

```code
<div id="div1"></div>
<div id="vDisdiv1" style="display:none">
    {{value}}
    <br>
    {{made||"无"}}
</div>
<script>
    vRender.render("div1",{value:"hello"})
</script>
```
###渲染结果
```code
hello
无
```



##状态

```code
<div id="view">
    {{value{0:未支付,1:已支付,2:已退款,:暂无内容}}}<br>
</div>
<script>
    var model=[{value:0},{value:1},{value:2}];

    vRender.render("view", model);
</script>
```
###渲染结果
```code
未支付
已支付
已退款
```




##有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(888dazhuang@163.com)
* QQ: 360883898





