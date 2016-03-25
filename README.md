
##vRender.js是什么?
* 基于原生javascript编写的一个前端渲染库，帮助前端人员轻松将JSON数据渲染至html<br>
* 超轻量，压缩后仅5kb，使用纯字符串加正则表达式实现，避免了使用大量dom操作消耗较多性能的问题

##例子1

```code
<div id="div1">
    {{value}}
    <br>
    {{made||无}}
    <br>
    {{made?value:"无"}}
</div>
<script>
    vRender.render("div1",{value:"hello"})
</script>
```
###渲染结果
```code
hello
无
无
```
##字符串renderStr

```code
<div id="div1">

</div>
<script>

document.getElementById("div1").innerHTML=vRender.renderStr("{{value}}",{value:"hello"});

</script>
```
###渲染结果
```code
hello
```
##$watch

```code
<div id="div1">
{{value1}}
<br>
{{value2}}
</div>
<script>
var model={value1:"hello",value2:"worder"}

var vm=vRender.render("div1",model);

model.value1="hi";

vm.$watch("value2",function(val){
	this.value1+=" girle";
})

model.value2="笑一个";

</script>
```
###渲染结果
```code
hi girle
笑一个
```
##建立虚拟view,id前边加“vDis"

```code
<div id="div1"></div>
<div id="vDisdiv1" style="display:none">
    {{value}}
    <br>
    {{made||无}}
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

##时间

```code
<div id="view">
    {{value(time)}}
    <br>
    {{num(shortTime)}}
    <br>
    {{value(yyyy-mm-dd)}}
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
##调用已经写好的function

```code
<div id="view">
    {{func1(value)}}
    <br>
    {{func2(text.value)}}
    <br>
    {{func3(this)}}
</div>
<script>
    function func1(e){
        return e+":func1";
    }
    
    function func2(e){
        return e+":func2";
    }
    
    function func3(e){
        return e.value+":func3";
    }

    var model={value:'hellow',text:{value:"word",obj:{p:"abcdeft"}}};

    vRender.render("view", model);
</script>
```
###渲染结果
```code
hellow:func1 
word:func2 
hellow:func3
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

##object

```code
<div id="view">		 
    
    {{text.value}}  <br>
        
    {{text.obj.p}}  <br>
        
    {{made||无}}
        
</div>
    
<script>
    
    var model={value:'hellow',text:{value:"word",obj:{p:"abcdeft"}}};

    vRender.render("view", model);

</script>
```
###渲染结果
```code
word 
abcdeft 
无 
```

##数组

```code
<div id="view">
全部：{{value}}     <br>
循环：
	{{value[list]}}
		{{value[child]}}
	{{value[end]}}
<br>
读取第一个：
	{{value.0}}     <br>
读取第二个：	
    {{value.1}}
</div>
<script>
    var model={value:["A","B"]}

    vRender.render("view", model);
</script>
```
###渲染结果
```code
全部：A,B
循环：AB
读取第一个：A
读取第二个：B
```
##object数组

```code
<div id="view">
    {{name}}
    <br>
<br>
</div>
<script>
   var model=[{name:"小明"},{name:"小白"}];

    vRender.render("view", model);
</script>
```
###渲染结果
```code
小明
小白
```

##子级object数组

```code
<div id="view">
    角色：{{name}}<br>
    朋友：
        {{friend[list]}}<!--循环渲染 开始标记-->
            {{name[child]}}
        {{friend[end]}}<!--循环渲染 结束标记-->
<br>
</div>
<script>
    var model={name:"小红",friend:[{name:"小明"},{name:"小白"}]};
    
    vRender.render("view", model);
</script>
```
###渲染结果
```code
角色：小红
朋友： 小明 小白 
```
##渲染至table，需要外边包一层div标签，然后要借助<!-- -->
```code
<div id="view">
	<table>
		<tr>
		<!--{{user[list]}}-->
			<td>{{name[child]}}  &nbsp;</td>
		<!--{{user[end]}}-->
		</tr>
	</table>
    <br>
<br>
</div>
<script>
   var model={user:[{name:"小明"},{name:"小白"}]};

    vRender.render("view", model);
</script>
```
###渲染结果
```code
小明 小白 
```
##更多级别的子级object数组

```code
<div id="view">
    角色：{{name}}<br>
    朋友：
    <ul>
        <li>
            {{friend[list]}}<!--循环渲染 开始标记-->
            朋友名字： {{name[child]}}<br>
            读书：
            <ul>
                {{book[list2]}}
                <li>
                    {{name[child2]}}
                </li>
                {{book[end2]}}
            </ul>
        </li>
        {{friend[end]}}<!--循环渲染 结束标记-->
    </ul>
    <br>
</div>

<script>

var model=[{name:"小红",
    friend:[
        {
            name:"小明",
                book:[
                    {name:'node.js'},
                    {name:'c#'}
                ]
            },
            {
                name:"小白",
                book:[
                    {name:'java'},
                    {name:'ruby'}
                ]
            }
        ]
    },
        {
            name:"小黑",
            friend:[
                {
                    name:"黑小明",
                    book:[
                        {name:'黑node.js'},
                        {name:'黑c#'}
                    ]
                },
                {
                    name:"黑小白",
                    book:[
                        {name:'黑java'},
                        {name:'黑ruby'}
                    ]
                }
            ]
        }
    ];

	vRender.render("view", model);
```
###渲染结果
```code
角色：小红
朋友：
    朋友名字： 小明
    读书：
        node.js        
        c#            
    朋友名字： 小白
    读书：
        java            
        ruby            

角色：小黑
朋友：
    朋友名字： 黑小明
    读书：
        黑node.js            
        黑c#
    朋友名字： 黑小白
    读书：
        黑java
        黑ruby            

```


##有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(888dazhuang@163.com)
* QQ: 360883898





