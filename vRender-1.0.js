(function (e) {
    e.$ || (e.$ = {});
    function _createpType(value, dataType, msg,columnValue) {
        dataType && (dataType = dataType[0])
        if (dataType == "(time)") {
            if(_num.test(value)){
                value=value*1;
            }
            var _tm = new Date(value);
            if (_tm != "Invalid Date") {
                value = _tm.getFullYear() + "/" + (_tm.getMonth() + 1) + "/" + _tm.getDate() + " " + _tm.getHours() + ":" + _tm.getMinutes() + ":" + _tm.getSeconds()
            }
        } else if (dataType == "(shortTime)") {
            if(_num.test(value)){
                value=value*1;
            }
            var _tm2 = new Date(value);
            if (_tm2 != "Invalid Date") {
                value = _tm2.getFullYear() + "/" + (_tm2.getMonth() + 1) + "/" + _tm2.getDate();
            }
        } else if (dataType == "(image)") {
            value = toImgUrl(value);
        }
        else if (dataType == "(litImage)") {
            value = toImgUrl(value, 1);
        }
        else {
            if (dataType) {
                dataType = dataType.replace(_rdkh, "");
                if (_num.test(dataType)) {
                    dataType=dataType*1;
                    if (dataType > 0&&value.length>dataType) {
                        value = value.substring(0, dataType) + "...";
                    }
                    else if(dataType<0&&value.length>-1*dataType){
                        value = "*" + value.substring(-1 * dataType, value.length);
                    }
                } else {

                    if (typeof (window[dataType]) == "function") {
                        return window[dataType](value,columnValue);
                    }
                    else if (typeof (window[dataType.replace("obj_", "")]) == "function") {
                        return window[dataType.replace("obj_", "")](msg,columnValue);
                    }
                    if (/(y+)/.test(dataType)){
                        value = format(dataType, value);
                    }
                    else {
                        if(window[dataType]==undefined){
                            return "";
                        }else{
                            return window[dataType];
                        }

                    }
                }
            }
        }
        return value;
    }
    var _rdkh = new RegExp("^[{(]|[)}]$", "g");
    function format(fmt,value){
        if(_num.test(value)){
            value=value*1;
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
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;

        }else{
            return "";
        }

    }
    function _judge(columnValue, data){
        var value;
        if (columnValue.indexOf(".") > -1) {
            var columnAr = columnValue.split('.');
            var l=columnAr.length;
            if (data[columnAr[0]]!=undefined && data[columnAr[0]][columnAr[1]]) {
                value = data[columnAr[0]][columnAr[1]];
            } else {
                value = "";
            }
            for(var i=2;i<=l;i++){
                value[columnAr[i]]!=undefined&&(value=value[columnAr[i]]);
            }
        }else{
            value=data[columnValue]!=undefined?data[columnValue]:"";
        }
        return value;
    }

    function _createValue(columnValue, data, status) {
        var value="",nodata = "";
        var arg1=columnValue.indexOf("?"),arg2=columnValue.indexOf(":");
        if (columnValue.indexOf("||") > -1) {
            var columnsplit=columnValue.split("||");
            nodata = columnsplit[1];
            value = _judge(columnsplit[0],data);
            columnValue=columnsplit[0];
        }
        else if(arg1>-1&&arg2>-1){
            if(_judge(columnValue.substring(0,arg1),data)){
                value=_judge(columnValue.substring(arg1+1,arg2),data);
            }else{
                value=_judge(columnValue.substring(arg2+1,columnValue.length),data);
            }
        }else{
            value=_judge(columnValue,data);
        }
        if (status) {
            status = status[0];
            var p = status.replace(_rdkh, "").split(",");
            var l = p.length;
            for (var i = 0; i < l; i++) {
                var _pNm = p[i].split(":");
                if (_pNm[0] == value) {
                    value = _pNm[1];
                }
            }
        }

        return (value&&value!=0)?value:nodata;
    }
    var _outType=["{{","}}"];
    var _getText,_getChild,_getList,_getType,_getTypeV,_getStatus,_getStatusV,_reText,_canRe,_getAllChild,_getAllList,_getAll,_anNum2;
    function createRegex(){
        _getText = "[^\\n("+_outType[1]+")("+_outType[0]+")]+";
        _getChild = "\\[child[0-9]{0,1}\\]";
        _getList = "\\[list[0-9]{0,1}\\]";
        _getType = "\(\\([^\\n("+_outType[1]+")("+_outType[0]+")]+\\)\){0,1}";
        _getTypeV = "\(\\([^\\n("+_outType[1]+")("+_outType[0]+")]+\\)\)";

        _getStatus = "\({[^\\n]+}\){0,1}";
        _getStatusV = "\({[^\\n{}]+[:,]+[^\\n{}]+}\){1}";

        _reText = new RegExp(_getStatusV + "|\("+_outType[0]+"|"+_outType[1]+"\)|" + _getChild + "|" + _getList + "|" + _getType, "g");
        _canRe = new RegExp(_outType[0]+"|"+_outType[1]+"|" + _getChild + "|\\([^\\n]+\\)}}", "g");
        _getAllChild = new RegExp(_outType[0] + _getText + _getChild + _getType + _getStatus +_outType[1], "g");
        _getAllList = new RegExp(_outType[0] + _getText + _getList + _getType + _getStatus + _outType[1], "g");
        _getAll = new RegExp(_outType[0] + _getText + _getType + _getStatus + _outType[1], "g");
        _anNum2 = new RegExp("[^\\(\\)]+"), _num = new RegExp("^-{0,1}[0-9]+$");
    }
    createRegex();
    function vCreateChild(data,_attr,str,level){

        var msg=data[_attr]||[];
        if (_attr.indexOf(".") > -1) {
            var columnAr = _attr.split('.');
            var l=columnAr.length;
            if (data[columnAr[0]] && data[columnAr[0]][columnAr[1]]) {
                msg = data[columnAr[0]][columnAr[1]];
            }
            for(var i=2;i<=l;i++){
                msg[columnAr[i]]&&(msg=msg[columnAr[i]]);
            }
        }

        var childName = _outType[0] + _attr + "[list" + level + "]"+_outType[1], childEnd = _outType[0] + _attr + "[end" + level + "]"+_outType[1];
        var childStart = str.indexOf(childName);
        var childend = str.indexOf(childEnd);

        while (childStart > -1) {
            var regstr = str.substring(childStart + childName.length, str.indexOf(childEnd));
            var l = msg.length;
            var restultStr = "";
            var _getNowChild = new RegExp(_outType[0] + _getText + "\\[child" + level + "\\]" + _getType + _getStatus + _outType[1], "g");

            for (var i = 0; i < l; i++) {
                var tmp = regstr;

                while (tmp.match(_getNowChild)) {
                    var pstr = tmp.match(_getNowChild);
                    var text = pstr[0].replace(_reText, "");
                    var pType = pstr[0].match(_getTypeV);
                    var status = pstr[0].match(_getStatusV);

                    if (msg[i].constructor !=Object){
                        tmp = tmp.replace(pstr[0],msg[i], pType, msg[i])
                    }
                    else{
                        tmp = tmp.replace(pstr[0], _createpType(_createValue(text, msg[i], status), pType, msg[i],text))
                    }
                }
                tmp=createByLevel(msg[i],tmp,level?level*1+1:level+2);
                restultStr += tmp;
            }

            str=str.substring(0, childStart) + restultStr + str.substring(childend + childEnd.length, str.length - 1);
            childStart = str.indexOf(childName);
            childend = str.indexOf(childEnd);
        }
        return str;
    }

    function createByLevel(data,tempStr,level){
        var _getNowList = new RegExp(_outType[0] + _getText + "\\[list" + level + "\\]" + _getType + _getStatus + _outType[1], "g");

        var lkey = tempStr.match(_getNowList);

        if (lkey) {
            var _attr = lkey[0].replace(_reText, "");
            return vCreateChild(data,_attr,tempStr,level);
        }else{
            return tempStr;
        }
    }
    function _BaseRanderAppend(data, _tempStr,dl) {
        dl =dl?dl:data.length;
        var str = "";
        for (var j = 0; j < dl; j++) {
            var tempStr = _tempStr;
            tempStr=createByLevel(data[j],tempStr,"");
            str +=_angular(tempStr, data[j]);
        }
        return str;
    }

    function _angular(str, msg) {
        while (str.match(_getAll)) {
            var pstr = str.match(_getAll);
            var text = pstr[0].replace(_reText, "");
            var status = pstr[0].match(_getStatusV);
            var pType = pstr[0].match(_getTypeV);
            str = str.replace(pstr[0], _createpType(_createValue(text, msg, status), pType, msg,text));
        }
        return str;
    }

    function _createThisEle(element) {
        if (!window["v" + element]) {
            window["v" + element] = document.getElementById("vDis"+element)?document.getElementById("vDis"+element).innerHTML:document.getElementById(element).innerHTML;
        }
        return window["v" + element];
    }
    e.$.vRender=function(element,date,config){
        if(date.constructor!=Array){date=[date]}
        config||(config={});
        var strt=config["viewStr"]?config["viewStr"]:_createThisEle(config["view"]?config["view"]:element);
        if(config["delimiters"]&&Array.isArray(config["delimiters"])&&config["delimiters"].length>1){
            _outType=config["delimiters"];
            createRegex();
        }
        if(config["append"]&&config["append"]!=-1){
            document.getElementById(element).innerHTML+=_BaseRanderAppend(date,strt);
        }
	else if(config["append"]==-1){
		document.getElementById(element).innerHTML=_BaseRanderAppend(date,strt)+document.getElementById(element).innerHTML;	
	}
	else{
            document.getElementById(element).innerHTML=_BaseRanderAppend(date,strt)
        }
    }
    e.$.vRenderStr=function(str,model,config){
        if(model.constructor!=Array){model=[model]}
        config||(config={});
        if(config["delimiters"]&&Array.isArray(config["delimiters"])&&config["delimiters"].length>1){
            _outType=config["delimiters"];
            createRegex();
        }
        return _BaseRanderAppend(model,str);
    }
})(window)
