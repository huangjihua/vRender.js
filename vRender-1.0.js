(function(e) {
    e.vRender || (e.vRender = {});
    Array.prototype.each = function(e) {
        var l = this.length;
        for (var i = 0; i < l; i++) {
            e(this[i])
        }
    };
    function clearNewArray(e){
        if(e.__ob__){
            var newe={};
            for(var a in e.__ob__){
                newe[a]=clearNewArray(e.__ob__[a]);
            }
            return newe;
        }else{
            return e;
        }
    }
    function fuzhivm(newObj,vm){
        newObj[vm]=function(){
            var arg=[];
            var l=arguments.length;
            for(var i=0;i<l;i++){
                arg.push(clearNewArray(arguments[i]));
            }
            var obj=newObj.__ob__[vm].apply(newObj.__ob__,arg);
            newObj.length=newObj.__ob__.length;
            return obj;
        }
    }

    function _createpType(value, dataType, msg, columnValue) {
        if((/[^*+-\\/]+/g).test(dataType)){
        if (dataType == "time") {
            if (_num.test(value)) {
                value = value * 1
            }
            var _tm = new Date(value);
            if (_tm != "Invalid Date") {
                value = _tm.getFullYear() + "/" + (_tm.getMonth() + 1) + "/" + _tm.getDate() + " " + _tm.getHours() + ":" + _tm.getMinutes() + ":" + _tm.getSeconds()
            }
        } else {
            if (dataType == "shortTime") {
                if (_num.test(value)) {
                    value = value * 1
                }
                var _tm2 = new Date(value);
                if (_tm2 != "Invalid Date") {
                    value = _tm2.getFullYear() + "/" + (_tm2.getMonth() + 1) + "/" + _tm2.getDate()
                }
            } else {
             if (dataType) {
                                var _tbol = true;
                                switch ("function") {
                                    case typeof(this.config[dataType]):
                                        value = this.config[dataType](value);
                                        _tbol = false;
                                        break;
                                    case typeof(window[dataType]):
                                        value = window[dataType](value);
                                        _tbol = false;
                                        break
                                }
                                if (_tbol && /([yMdhms]+)/.test(dataType)) {
                                    value = format(dataType, value)
                                } else {}
                            }
            }
        }
        }
        return value
    }
    var _rdkh = new RegExp("^[{(]|[)}]$", "g");

    function format(fmt, value) {
        if (_num.test(value)) {
            value = value * 1
        }
        var time = new Date(value);
        if (time != "Invalid Date") {
            var o = {
                "M+": time.getMonth() + 1,
                "d+": time.getDate(),
                "h+": time.getHours(),
                "m+": time.getMinutes(),
                "s+": time.getSeconds(),
                "q+": Math.floor((time.getMonth() + 3) / 3),
                "S": time.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length))
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
                }
            }
            return fmt
        } else {
            return ""
        }
    }
    function _judge(columnValue,upRegKeys,round) {
        var value;
        if((/^['"]+/).test(columnValue)){           
            value=columnValue.substring(1,columnValue.length-1);
        }
        else if (columnValue == "this") {
            value = data
        } else {
            if (_strReg.test(columnValue)) {
                value = columnValue.replace(_strRegV, "")
            } else {
                value=_createObjValue.apply(this,arguments);
            }
        }
        return value
    }
    function _zsplits(e){
        var ar= e.split(/[.]|[\[\].]{2,3}|[\[]|[\]]/);
        if(!ar[ar.length-1]){
            ar.pop();
        }
        return ar;
    }
    function columnPathReg(upRegKeys,columnValue,round){
        var columnAr=_zsplits(columnValue);
        if(upRegKeys&&upRegKeys[columnAr[0]]){
            var columnFirst=columnAr[0];
            columnFirst=columnPathReg(upRegKeys,upRegKeys[columnAr[0]],round);
            if(round&&round[columnAr[0]]!==undefined){
                columnAr[0]=round[columnAr[0]];
            }
            columnAr.unshift(columnFirst);
        }
        return columnAr.join(".");
    }
    function setcolumnValueReg(value,columnValue,round,setValue){
        var columnAr = _zsplits(columnValue);
        var l=columnAr.length;
        for(var i=0;i<l;i++){
            if(typeof(value[columnAr[i]])!=="object"){
                value[columnAr[i]]=setValue;
            }else{
                value=value[columnAr[i]];
            }
        }
    }
    function columnValueReg(value,columnValue,round){
        var columnAr = _zsplits(columnValue);
        var l=columnAr.length;
        for(var i=0;i<l;i++){
            if(value!==undefined){
                if (typeof(value) == "string" && _num.test(columnAr[i])) {
                    columnAr[i] = columnAr[i] * 1;
                    if (columnAr[i] > 0 && value.length > columnAr[i]) {
                        value = value.substring(0, columnAr[i]) + "..."
                    } else {
                        if (columnAr[i] < 0 && value.length >= -1 * columnAr[i]) {
                            value = "*" + value.substring(-1 * columnAr[i], value.length)
                        }
                    }
                }else{
                    if(columnAr[i]=="$index"){
                        value=columnAr[i-1];
                    }else if(value[columnAr[i]] !== undefined){
                        value = value[columnAr[i]];
                    }else{
                        value="";
                        break;
                    }
                }
            }else{
                if(columnAr[i]=="$index"){
                    value=columnAr[i-1];
                }else{
                    value="";
                    break;
                }
            }
        }
        return value;
    }
    function _createObjValue(columnValue,upRegKeys,round){      
        if (columnValue.indexOf(".") > -1||columnValue.indexOf("[") > -1) {
            columnValue=columnPathReg(upRegKeys,columnValue,round);
            var columnAr = _zsplits(columnValue);
            value = this.data;
            var oldChildKey=columnValueReg(value,columnValue,round);
            value=oldChildKey;
        }else {
            var value=this.data;
            columnValue=columnPathReg(upRegKeys,columnValue,round);
            value=columnValueReg(value,columnValue,round);
        }        
        if(this.dom){           
            __defineProperty2.call(this,columnValue,upRegKeys,round);
        }
        return typeof(value)=="object"?"":value
    }
    function _createValue(columnValue,status,dom,defaultText,upRegKeys,round) {    
        var value = "",
            nodata = "";        
        this.dom=dom;
        this.defaultText=defaultText;
        var arg1 = columnValue.indexOf("?");  
        if((/[-*+\/]+/).test(columnValue)){                     
            var _columnValue=columnValue.replace(/\s+/g,"");
            var _values;
            var that=this;
            var _resvalue;            
            var _values=_columnValue.match(/[^+\-\*\/()]+/g);                
                _values.each(function(_v){     
                    if(!(/^-?[\d]+$/).test(_v)){
                        _resvalue=_createValue.call(that,_v,status,dom,defaultText,upRegKeys,round);
                        if(!(/-?[\d]+/).test(_resvalue)){
                            _resvalue=0;
                        }                        
                     _columnValue=_columnValue.replace(_v,_resvalue);       
                     }              
                });                                                                  
                _columnValue=_columnValue.replace(/[^.+\-\*\/()\d]+/g,"");                                            
                value =strToNumber(_columnValue);
        }
        else if (columnValue.indexOf("||") > -1) {
            var columnsplit = columnValue.split("||");
            if((/^-?[\d]+$/).test(columnsplit[1])){
                nodata=columnsplit[1] * 1;
            }else{
                nodata=_judge.call(this,columnsplit[1],upRegKeys,round);
            }
            value = _judge.call(this,columnsplit[0],upRegKeys,round);
            columnValue = columnsplit[0]
        }
        else if (arg1 > -1) {
            var argV = columnValue.substring(arg1 + 1, columnValue.length);
            var _left = argV.match(/^'[^\n\\]+':|^"[^\n\\]+":|^[^\n\\]+:/)[0];
            var _right = argV.match(/:[^\n\\'"]+$|:'[^\n\\]+$|:"[^\n\\]+$/)[0];
            if (_judge.call(this,columnValue.substring(0, arg1),upRegKeys,round)) {             
                value = _judge.call(this,_left.substring(0, _left.length - 1),upRegKeys,round)
            } else {
                value = _judge.call(this,_right.substring(1, _right.length),upRegKeys,round)
            }
        } else {
            value = _judge.call(this,columnValue,upRegKeys,round);
        }
        if (status) {
            status = status[0];
            var p = status.replace(_rdkh, "").split(",");
            var l = p.length;
            for (var i = 0; i < l; i++) {
                var _pNm = p[i].split(":");
                if (_pNm[0] == value||(_pNm[0]===""&&value===undefined)) {
                    value = _pNm[1]
                }
            }
        }
        return (value || value === 0) ? value : nodata
    }
    var _outType = ["{{", "}}"];
    var _strReg = new RegExp("^['\"]{1}[^\r]+['\"]{1}$");
    var _strRegV = new RegExp("^['\"]{1}|['\"]{1}$", "g");
    var _getText, _getList, _getType, _getTypeV, _getStatus, _getStatusV, _reText, _canRe, _getAll, _anNum2, _num, _fnum, _toReg;
    function createRegex() {
        _getText = "[^\\n(" + _outType[1] + ")(" + _outType[0] + ")]+";
        _getType = "(\\([^\\n(" + _outType[1] + ")(" + _outType[0] + ")]+\\)){0,1}";
        _getTypeV = "[^*+-\\/"+_outType[1] + _outType[0]+"]+([^\\n" + _outType[1] + _outType[0] + "]+)";
        _getStatus = "({[^\\n{}]+}){0,1}";
        _getStatusV = "([^\\n{}]+[:,]+[^\\n{}]+){1}";
        _reText = new RegExp(_getStatus + "(" + _outType[0] + "|" + _outType[1] + ")|" + _getType, "g");
        _canRe = new RegExp(_outType[0] + "|" + _outType[1] + "|\\([^\\n]+\\)}}", "g");        
        _getAll = new RegExp(_outType[0] + "[^\\n{}]*({[^\\n{}]*})?[^\\n{}]*"+ _outType[1], "g");
        _anNum2 = new RegExp("[^\\(\\)]+"), _num = new RegExp("^-{0,1}\\d+$"), _fnum = new RegExp("^\\d{0,20}[.]{0,1}\\d{0,20}$");
        _toReg = new RegExp("(\\(|\\)|\\[|\\]|\\||\\?|\\$)", "g")
    }
    createRegex();
    function _angular(_str,dom,upRegKeys,round) {        
        var str=_str,pstr=str.match(_getAll);        
        if(pstr){            
            var l=pstr.length;            
            for(var i=0;i<l;i++){                
                var funcs="";
                var vm = pstr[i].match(_getTypeV);                                
                if (vm) {                                
                    if((/[^*+-\\/]+\(/).test(vm)){                        
                        vm = vm[0].replace(/^[^(]+\(|\)$/g, "");
                        funcs= pstr[i].replace(_reText, "");
                    } else{vm=vm[0]}
                }                                                                                            
                str = str.replace(pstr[i], _createpType.call(this,_createValue.call(this,vm,pstr[i].match(_getStatusV),dom,_str,upRegKeys,round), funcs, this.data, vm));
            }
            
            return str
        }else{return _str}
        
    }
    function _evFuncReg(evFunc){
        if(evFunc.indexOf("on")===-1){
            evFunc="on"+evFunc;
        }
        return evFunc;
    }
    function _bindEvent(el,evName,evFunc,upRegKeys,round){
        var that=this;
        var _evFunc=evFunc.split(/[()]/);
        if(!_evFunc[_evFunc.length-1]){
            _evFunc.pop();
        }
        var evArguments=[];
        evFunc=_evFunc[0];
        if(_evFunc[1]){
            var evArg=_evFunc[1].split(",");
            evArg.each(function(arg){
                evArguments.push(_createObjValue.call(that,arg,upRegKeys,round));
            })

        }
        if(that.config[evFunc]&&typeof(that.config[evFunc])=="function"){
            el[_evFuncReg(evName)]=function (){
                this.$data=that.data;
                that.config[evFunc].apply(this,evArguments);
            }
        }
        else if(window[evFunc]&&typeof(window[evFunc])=="function"){
            el[_evFuncReg(evName)]=function (){
                this.$data=that.data;
                window[evFunc].apply(this,evArguments);
            }
        }
    }
    function _rendereEl(el,upRegKeys,round){
        var l=el.attributes.length;
        var _regKeys;
        for(var i=0;i<l;i++){
            if(el.attributes[i].name=="v-for"){
                var childkey = el.attributes[i].value.split(/\s+in\s+/);
                if (!el.__childNodes) {
                    el.__childNodes = [];
                    var k = el.childNodes.length;
                    for (var j = 0; j < k; j++) {
                        el.__childNodes.push(el.childNodes[j]);
                    }
                }
                el.newChildKey = childkey[0]; //Ҫ
                upRegKeys || (upRegKeys = {});
                upRegKeys[childkey[0]] =childkey[1];
                round || (round = {})
                round[childkey[0]] = {};
                _regKeys={upRegKeys:upRegKeys,round:round};
                //����dom
                var columnAr=columnPathReg(upRegKeys, childkey[1], round);
                columnAr=_zsplits(columnAr);
                var _vmPath=columnAr.join(".");
                _regKeys._nodeel = _saveDom(this.data, el, _vmPath, "", round, _regKeys);
                if(columnAr.length==1){
                    this.data[columnAr[0]]=_AryToObj.call(this, this.data[columnAr[0]],_vmPath, this.data, this.back, upRegKeys,round);
                    this.data.__ob__ || (this.data.__ob__ = {});
                    this.data.__ob__[columnAr[0]] = this.data[columnAr[0]];
                    __defineProperty.call(this, this.data, columnAr[0], _vmPath, this.data, this.back, upRegKeys,round);
                }else{
                    var vm=columnAr[columnAr.length-1];
                    columnAr.pop();
                    var data=columnValueReg(this.data,columnAr.join("."),round);
                    data[vm]=_AryToObj.call(this, data[vm], _vmPath, this.data, this.back, upRegKeys,round);
                    data.__ob__ || (data.__ob__ = {});
                    data.__ob__[vm] = data[vm];
                    __defineProperty.call(this, data, vm, _vmPath, this.data, this.back, upRegKeys,round);
                }
            }
            else if(el.attributes[i].name.indexOf("v-on:")>-1){
                var evName=el.attributes[i].name.replace("v-on:","");
                var evFunc=el.attributes[i].value;
                _bindEvent.call(this,el,evName,evFunc,upRegKeys,round);
            }
            else if(el.attributes[i].name=="v-str") {
                el.__vstr="1";
                el.innerHTML=_angular.call(this, el.__defaultText || el.innerHTML, el, upRegKeys, round);
            }
            else if(el.attributes[i].name=="v-model"){
                if(el.nodeName==="TEXTAREA"||el.nodeName==="INPUT"){
                    var columnAr=columnPathReg(upRegKeys,el.attributes[i].value,round);
                    var data=this.data;
                    el.onchange=el.onkeyup=function(event){
                        setcolumnValueReg(data,columnAr,round,event.target.value);
                    }
                }
            }
            else{
                _value=_angular.call(this,el.attributes[i].__defaultText||el.attributes[i].value,el.attributes[i],upRegKeys,round);
                (_value!==el.attributes[i].value)&&(el.attributes[i].value=_value);
            }
        }
        return _regKeys;
    }
    function _vuRenderChild(child,upRegKeys,round){
        if(child.nodeType==3){//#text
            var _value=_angular.call(this,child.__defaultText||child.textContent,child,upRegKeys,round);
            (_value!==child.textContent)&&(child.textContent=_value);
        }
        else{
            var regKeys=_rendereEl.call(this,child,upRegKeys,round);
            if(child.hasChildNodes()){
                if(regKeys){
                    regKeys.upRegKeys&&(upRegKeys=regKeys.upRegKeys);
                    regKeys.round&&(round=regKeys.round);
                    var data = columnValueReg(this.data, regKeys._nodeel._vmPath, regKeys._nodeel.round);
                    _vmForRender.call(this, regKeys._nodeel, upRegKeys, data);
                }else{
                    _vuRender.call(this,child,upRegKeys,round);
                }
            }
        }
        return child.nextSibling;
    }

    function _vuRender(el,upRegKeys,round){
        if(el.hasChildNodes()){
            var child=el.childNodes[0];
            while(child){
                child=_vuRenderChild.call(this,child,upRegKeys,round);
            }
        }
    }

    function _createRetrun(datas){
        return {
            __listen__: {__listen__time:0,__listen__key:{}},
            $watch: function(a, callback) {
                if (typeof(a) == "string") {
                    this.__listen__.__listen__key[a]=this.__listen__.__listen__time;
                    this.__listen__.__listen__time++;
                    this.__listen__[a] = callback
                }
            },
            $set:function(key,value){
                var _key=key.replace(/\[/g,".").replace(/\]/g,"");
                var _keysp=_key.split(".");
                var _value=datas;
                _keysp.each(function(e){                    
                    if(_value[e]==undefined){                       
                        _value[e]=value;
                    }else{
                        if(typeof(_value[e])!="object"){
                            _value[e]=value;
                        }else{
                            _value=_value[e];
                        }                    
                   }   
                })                
            }
        }
    }
    function Render(element, datas, _config){
        var el=element;
        if(typeof(element)=="string"){
            el=document.getElementById(element);
        }
        _config||(_config={});
        if(_config.view){
            var elview=_config.view;
            if(typeof(elview)=="string"){
                elview=document.getElementById(elview);
            }
            el.innerHTML=elview.innerHTML;
            elview.parentNode.removeChild(elview);
        }
        if(_config.viewStr){
            el.innerHTML=_config.viewStr;
        }
        datas.__obel__={};
        var back=_createRetrun(datas);
        _vuRenderChild.call({data:datas,config:_config,back:back},el,"","");
        return back;
    }
    function __obel_push(vmpath,endObj){
        vmpath.push(endObj);
    }
    function _saveDom(data,cElement,_vmPath,defaultText,round,upRegKeys){               
        var _round={};
        for(var a in round){
            _round[a]=round[a];
        }
        if(cElement){
            data.__obel__[_vmPath]||(data.__obel__[_vmPath]=[]);
            var endObj={el:cElement,round:_round,upRegKeys:upRegKeys,_vmPath:_vmPath};
            defaultText&&(endObj.el.__defaultText=defaultText);
            data.__obel__[_vmPath].push(endObj);
            return endObj;
        }
    }
    function _AryToObj(res,_vmPath, data, back, upRegKeys,round){
        var newArg={__ob__:res,length:res.length};
        for(var a in newArg.__ob__){
            if(a!="each"&&a!="__ob__"){
                newArg[a]=newArg.__ob__[a];
                //__defineProperty.call(this, res, a, _vmPath, data, back, upRegKeys,round);
            }
        }
        __defineProperty.call(this, newArg, "length", _vmPath, data, back, upRegKeys,round);
        var ar=["splice","push","shift","unshift","concat","pop"];
        ar.each(function(e){
            fuzhivm(newArg,e);
        })
        return newArg;
    }
    function __defineProperty2(vmPath,upRegKeys,round){
        var columnAr = columnPathReg(upRegKeys,vmPath,round);
        columnAr=_zsplits(columnAr);
        var value = this.data;
        var data=this.data;
        var cElement=this.dom;
        var defaultText=this.defaultText;
        var _vmPath="";var back=this.back;
        var that=this;
        if(columnAr.length>1){
            if(columnAr[0]){
                _vmPath=columnAr[0];
                value=value[_vmPath];
            }
            columnAr.shift();
        }
        if(typeof(value)!="object"){
            that.data.__ob__ || (that.data.__ob__ = {});
            __defineProperty.call(that, that.data, _vmPath, _vmPath, data, back, upRegKeys,round);
            _saveDom(data,cElement,_vmPath,defaultText,round,upRegKeys);
        }else{
            columnAr.each(function(columnAri) {
                _vmPath+="."+columnAri;
                var vm = columnAri.replace(/\[[-\d]+\]/, "");
                if(Array.isArray(value)){
                    value=value[vm]
                }else{                    
                        if(Array.isArray(value[vm])) {
                            value[vm] = _AryToObj.call(that, value[vm], _vmPath, data, back, upRegKeys, round);
                        }
                        else{
                            value.__ob__ || (value.__ob__ = {});
                            __defineProperty.call(that, value, vm, _vmPath, data, back, upRegKeys,round);
                            if(typeof(value[vm])!="object"){                                
                                //����dom
                                _saveDom(data,cElement,_vmPath,defaultText,round,upRegKeys);
                            }else{
                                value=value[vm]
                            }
                        }                   
                }
            })
        }
    }
    function _vmRender(defualtData,_nodeel,upRegKeys){
        this.data=defualtData;
        if(_nodeel.el.nodeName=="#text"){
            var _value=_angular.call(this,_nodeel.el.__defaultText,"",_nodeel.upRegKeys,_nodeel.round);
            (_value!==_nodeel.el.textContent)&&(_nodeel.el.textContent=_value);
        }else{
            if(_nodeel.el.__childNodes){
                _vmForRender.call({data:defualtData,back:this.back,config:this.config},_nodeel,upRegKeys,columnValueReg(defualtData,_nodeel._vmPath,_nodeel.round));
            }
            var _value=_angular.call(this,_nodeel.el.__defaultText,"",_nodeel.upRegKeys,_nodeel.round);
            (_value!==_nodeel.el.name)&&(_nodeel.el.name=_value);
            value=_angular.call(this,_nodeel.el.__defaultText,"",_nodeel.upRegKeys,_nodeel.round);
            (_value!==_nodeel.el.value)&&(_nodeel.el.value=_value);
        }
        if(_nodeel.el.__vstr == 1) {
            _nodeel.el.innerHTML=_angular.call(this, _nodeel.el.__defaultText || _nodeel.el.innerHTML, "", upRegKeys, _nodeel.round);
        }
    }
    function _vmForRender(_nodeel,upRegKeys,e){
        var i=(_nodeel.el.__childNodes.length)* e.length;
        if(!_nodeel.el.childNodes[i]){
            //׷���µ�
            _vmForAppend.call(this,_nodeel,i,upRegKeys);
        }else{//�Ƴ����
            while(_nodeel.el.childNodes[i]){
                _nodeel.el.removeChild(_nodeel.el.childNodes[i]);
            }
            _vmForAppend.call(this,_nodeel,i,upRegKeys, e.length);
        }
    }
    function _defineReRend(_vmPath,defualtData,back,upRegKeys,config){
        defualtData.__obel__[_vmPath]&&defualtData.__obel__[_vmPath].each(function(_nodeel){
            _vmRender.call({data:defualtData,back:back,config:config},defualtData,_nodeel,upRegKeys);
            //�ж�Ҫɾ��Ķ�ڵ�����ӵĽڵ�
            var data=columnValueReg(defualtData,_nodeel._vmPath,_nodeel.round);
            if(!_nodeel.el.__defaultText&&_nodeel.childs&&Array.isArray(data.__ob__)){
                _vmForRender.call({data:defualtData,back:back},_nodeel,upRegKeys,data);
            }
        });
    }

    function __defineProperty(date, vm,_vmPath,defualtData,back,upRegKeys,round) {
        if(date[vm]===undefined){
            date[vm]="";
        }
        date.__ob__[vm]=date[vm];
        var that=this;
        Object.defineProperty(date, vm, {
            set: function(e) {            
                //�������¸�ֵ
                if(Array.isArray(e)){
                    var l= e.length;
                    if(e[l-1].__ob__){
                        var _e=e[l-1];
                        e.pop();
                        for(var i=0;i<l;i++){
                            e.push(clearNewArray(_e[i]));
                        }
                    }
                }
                this.__ob__[vm] = e;              
                //$watch
                var obj = {};                
                var __funkey=_vmPath.replace(/\.\d+./,".").replace(/\.\d+$/,"").replace(/^\./,"");                
                var _index=_vmPath.split(".");
                if(!(/^\d+$/).test(_index[_index.length-1])){
                    _index.pop();
                }
                             
                that.back.__listen__[_vmPath] && that.back.__listen__[_vmPath].call(that.data.__ob__,e,_index[_index.length-1]);
                if(__funkey!=_vmPath){
                    that.back.__listen__[__funkey] &&that.back.__listen__[__funkey].call(that.data.__ob__,e,_index[_index.length-1]);
                }
                                
                  //�������鴦��
                var fatherPath=_vmPath.replace(/\.\d+$/,"");
                var cDate=columnValueReg(defualtData,fatherPath,round);
                if(vm=="length"&&Array.isArray(cDate.__ob__)){
                    //ѭ��
                    defualtData.__obel__[fatherPath]&&defualtData.__obel__[fatherPath].each(function(_nodeel){
                        //�ж�Ҫɾ��Ķ�ڵ�����ӵĽڵ�
                        if(_nodeel.el.__childNodes){
                            var data=columnValueReg(defualtData,_nodeel._vmPath,_nodeel.round);
                            var l=data.length;
                            for(var i=0;i<l;i++){
                                if(data[i]===undefined){
                                    data[i]=data.__ob__[i];
                                    if(!data[i].__ob__){
                                        data[i].__ob__={};
                                    }else{
                                        data[i].__ob__=data[i].__ob__;
                                    }
                                    //_objdefine(date,i);
                                }
                            }
                        }
                        _vmRender.call({data:defualtData,back:back,config:that.config},defualtData,_nodeel,upRegKeys);
                    });
                }else{
                    _defineReRend.call(this,_vmPath,defualtData,back,upRegKeys,that.config);
                }
            },
            get: function() {
                return this.__ob__[vm]
            }
        })

    }
    e.vRender.render = function(el, data, _config) {
        return Render(el,data,_config);
    }
    //����els
    function _xunhuanWhil(child, newEl,config) {
        var _child = child.cloneNode();
        if(_child.nodeType!==3){
            xunhuanEls(child, _child,config);
            if(child.__childNodes){
                _child.__childNodes=child.__childNodes;
            }
            _copyEvent(child, _child,config);
            _copyAttri(child, _child);
        }
        if (child.__defaultText){
            _child.__defaultText = child.__defaultText;
        }
        newEl.appendChild(_child);
    }
    function xunhuanEls(e, newEl,config) {
        var child = e.childNodes[0];
        while (child) {
            _xunhuanWhil(child, newEl,config);
            child = child.nextSibling;
        }
    }
    var p=["onchange", "onclick","onerror", "onfocus","onkeydown","onkeyup", "onload"];
    function _copyEvent(ca,newEl,config){
        if(config.copyEvent){
            p.each(function(e){
                newEl[e]=ca[e];
            })
        }
    }
    function _copyAttri(ca,newEl){
        var l=ca.attributes.length;
        for(var i=0;i<l;i++){
            ca.attributes[i].__defaultText&&(newEl.attributes[i].__defaultText=ca.attributes[i].__defaultText);
        }
    }
    function _vmForAppend(_nodeel, newI, upRegKeys,append) {
        var _baseRound = _nodeel.el.childNodes.length / _nodeel.el.__childNodes.length;
        var _round = append?append-_baseRound:(newI - _nodeel.el.childNodes.length) / _nodeel.el.__childNodes.length;
        var l = _nodeel.el.__childNodes.length;
        for (var i = 0; i < _baseRound; i++) {
            var n = 0;
            while (n < l) {
                //��Ⱦ
                _nodeel.round[_nodeel.el.newChildKey] = i;
                if(_nodeel.el.childNodes[n+i*l]){
                    _vuRenderChild.call(this, _nodeel.el.childNodes[n+i*l], upRegKeys, _nodeel.round);
                }
                n++;
            }
        }
        var child=_nodeel.el.__childNodes;
        for (var i = 0; i < _round; i++) {
            for(var n=0;n<l;n++){
                var _child = child[n].cloneNode();
                if (child[n].__defaultText) {
                    _child.__defaultText = child[n].__defaultText;
                }
                if(_child.nodeType!==3){
                    xunhuanEls(child[n], _child,this.config);
                    _copyEvent(child[n], _child,this.config);
                    _copyAttri(child[n], _child);
                }
                _nodeel.el.appendChild(_child);
                //��Ⱦ
                _nodeel.round[_nodeel.el.newChildKey] = _baseRound + i;
                _vuRenderChild.call(this, _child, upRegKeys, _nodeel.round);
            }
        }
    }
    function strToNumberSuan(str) {
    var p=str.match(/[\d.]+\*[\d.]+/);  
    var values;
    //3��
    if(p){              
        values=p[0].split("*");
        values=values[0]*values[1];
        str=str.replace(p[0],values);
    }else{
        //3y    
        p=str.match(/[\d.]+\/[\d.]+/);  
        if(p){      
            values=p[0].split("/");                 
            values=values[0]/values[1];     
            str=str.replace(p[0],values);       
        }else{
            p=str.match(/-?[\d.]+\+-?[\d.]+/);  
            if(p){                      
                values=p[0].split("+");                 
                values=values[0]*1+values[1]*1;
                str=str.replace(p[0],values);       
            }else{
                p=str.match(/[\d.]?\-[\d.]+/);  
                if(p){
                    values=p[0].split("-");                 
                    values=values[0]*1-values[1]*1;
                    str=str.replace(p[0],values);       
                }
            }
        }
    }
    str=str.replace(/[()]+/g,"");       
    return str;
}

function strToNumber(str) {
    var part;
    while(str.match(/\([-*+\/0-9.]+\)/)){
        part=str.match(/\([-*+\/0-9.]+\)/)[0];      
        str=str.replace(part,strToNumberSuan(part));
    }    
    while((/-?[\d.]?[*-+\/]+-?[\d.]+/).test(str)){
        str=strToNumberSuan(str);   
    }       
    return (str*1).toFixed(6)*1;
}
})(window);
