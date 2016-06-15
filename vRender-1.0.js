(function(e) {
    e.vRender || (e.vRender = {});
    Array.prototype.each = function(e) {
        var l = this.length;
        for (var i = 0; i < l; i++) {
            e(this[i])
        }
    };

    function _createpType(value, dataType, msg, columnValue) {
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
                if (dataType == "image") {
                    value = toImgUrl(value)
                } else {
                    if (dataType == "litImage") {
                        value = toImgUrl(value, 1)
                    } else {
                        if (dataType == "smallImage") {
                            value = toImgUrl(value, 2)
                        } else {
                            if (dataType) {
                                var _tbol = true;
                                switch ("function") {
                                    case typeof(config[dataType]):
                                        value = config[dataType](value);
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
    function _judge(columnValue, data) {
        var value;
        if (columnValue == "this") {
            value = data
        } else {
            if (_strReg.test(columnValue)) {
                value = columnValue.replace(_strRegV, "")
            } else {
                if (columnValue.indexOf(".") > -1) {
                    var columnAr = columnValue.split(".");
                    value = data;
                    columnAr.each(function(columnAri) {
                        if (typeof(value) == "string" && _num.test(columnAri)) {
                            columnAri = columnAri * 1;
                            if (columnAri > 0 && value.length > columnAri) {
                                value = value.substring(0, columnAri) + "..."
                            } else {
                                if (columnAri < 0 && value.length > -1 * columnAri) {
                                    value = "*" + value.substring(-1 * columnAri, value.length)
                                }
                            }
                        } else {
                            value[columnAri] != undefined ? (value = value[columnAri]) : value = ""
                        }
                    })
                } else {
                    value = data[columnValue]
                }
            }
        }
        return value
    }
    function _createValue(columnValue, data, status) {
        var value = "",
            nodata = "";
        if (columnValue.indexOf("||") > -1) {
            var columnsplit = columnValue.split("||");
            nodata = _fnum.test(columnsplit[1]) ? columnsplit[1] * 1 : _judge(columnsplit[1], data);
            value = _judge(columnsplit[0], data);
            columnValue = columnsplit[0]
        }
        var arg1 = columnValue.indexOf("?");
        if (arg1 > -1) {
            var argV = columnValue.substring(arg1 + 1, columnValue.length);
            var _left = argV.match(/^'[^\n\\]+':|^"[^\n\\]+":|^[^\n\\]+:/)[0];
            var _right = argV.match(/:[^\n\\'"]+$|:'[^\n\\]+$|:"[^\n\\]+$/)[0];
            if (_judge(columnValue.substring(0, arg1), data)) {
                value = _judge(_left.substring(0, _left.length - 1), data)
            } else {
                value = _judge(_right.substring(1, _right.length), data)
            }
        } else {
            value = _judge(columnValue, data)
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
    var _getText, _getChild, _getList, _getType, _getTypeV, _getStatus, _getStatusV, _reText, _canRe, _getAllChild, _getAllList, _getAll, _anNum2, _num, _fnum, _toReg;

    function createRegex() {
        _getText = "[^\\n(" + _outType[1] + ")(" + _outType[0] + ")]+";
        _getChild = "\\[child\\d{0,1}\\]";
        _getList = "\\[list\\d{0,1}\\]";
        _getType = "(\\([^\\n(" + _outType[1] + ")(" + _outType[0] + ")]+\\)){0,1}";
        _getTypeV = "(\\([^\\n(" + _outType[1] + ")(" + _outType[0] + ")]+\\))";
        _getStatus = "({[^\\n{}]+}){0,1}";
        _getStatusV = "([^\\n{}]+[:,]+[^\\n{}]+){1}";
        _reText = new RegExp(_getStatus + "(" + _outType[0] + "|" + _outType[1] + ")|" + _getChild + "|" + _getList + "|" + _getType, "g");
        _canRe = new RegExp(_outType[0] + "|" + _outType[1] + "|" + _getChild + "|\\([^\\n]+\\)}}", "g");
        _getAllChild = new RegExp(_outType[0] + _getText + _getChild + _getType + _getStatus + _outType[1], "g");
        _getAllList = new RegExp(_outType[0] + _getText + _getList + _getType + _getStatus + _outType[1], "g");
        _getAll = new RegExp(_outType[0] + _getText + _getType + _getStatus + _outType[1] + "", "g");
        _anNum2 = new RegExp("[^\\(\\)]+"), _num = new RegExp("^-{0,1}\\d+$"), _fnum = new RegExp("^\\d{0,20}[.]{0,1}\\d{0,20}$");
        _toReg = new RegExp("(\\(|\\)|\\[|\\]|\\||\\?)", "g")
    }
    createRegex();

    function vCreateChild(data, _attr, str, level) {
        var msg = (data && data[_attr]) ? data[_attr] : [];
        if (!Array.isArray(msg)) {
            msg = [msg]
        }
        if (_attr.indexOf(".") > -1) {
            var columnAr = _attr.split(".");
            var l = columnAr.length;
            if (data[columnAr[0]] && data[columnAr[0]][columnAr[1]]) {
                msg = data[columnAr[0]][columnAr[1]]
            }
            columnAr.each(function(columnAri) {
                msg[columnAri] && (msg = msg[columnAri])
            })
        }
        var childName = _outType[0] + _attr + "[list" + level + "]" + _outType[1],
            childEnd = _outType[0] + _attr + "[end" + level + "]" + _outType[1];
        var childStart = str.indexOf(childName);
        var childend = str.indexOf(childEnd);
        while (childStart > -1) {
            var regstr = str.substring(childStart + childName.length, str.indexOf(childEnd));
            var l = msg.length;
            var restultStr = "";
            var _getNowChild = new RegExp(_outType[0] + _getText + _getType + _getStatus + "\\[child" + level + "\\]" + _outType[1], "g");
            msg.each(function(msgi) {
                var tmp = regstr;
                var pstr;
                while (pstr = tmp.match(_getNowChild)) {
                    var text = pstr[0].replace(_reText, "");
                    var vm = pstr[0].match(_getTypeV);
                    if (vm) {
                        vm = vm[0].replace(/^\(|\)$/g, "")
                    } else {
                        vm = text;
                        text = ""
                    }
                    var status = pstr[0].match(_getStatusV);
                    if (msgi.constructor != Object) {
                        tmp = tmp.replace(new RegExp(pstr[0].replace(_toReg, "\\$1"), "g"), _createpType(msgi,text,msgi,vm));
                    } else {
                        tmp = tmp.replace(new RegExp(pstr[0].replace(_toReg, "\\$1"), "g"), _createpType(_createValue(vm, msgi, status), text, msgi, vm))
                    }
                }
                tmp = createByLevel(msgi, tmp, level ? level * 1 + 1 : level + 2);
                restultStr += tmp
            });
            str = str.substring(0, childStart) + restultStr + str.substring(childend + childEnd.length, str.length);
            childStart = str.indexOf(childName);
            childend = str.indexOf(childEnd)
        }
        return str
    }
    function createByLevel(data, tempStr, level) {
        var _getNowList = new RegExp(_outType[0] + _getText + "\\[list" + level + "\\]" + _getType + _getStatus + _outType[1], "g");
        var lkey = tempStr.match(_getNowList);
        if (lkey) {
            var _lkey=tempStr;
            lkey.each(function(e){
                var _attr = e.replace(_reText, "");
                tempStr=vCreateChild(data, _attr, tempStr, level);
            })
            return tempStr;
        } else {
            return tempStr
        }
    }
    function _BaseRanderAppend(data, _tempStr, dl) {
        dl = dl ? dl : data.length;
        var str = "";
        data.each(function(dataj) {
            var tempStr = _tempStr;
            tempStr = createByLevel(dataj, tempStr, "");
            str += _angular(tempStr, dataj)
        });
        return str
    }
    function _angular(str, msg) {
        var pstr;
        while (pstr = str.match(_getAll)) {
            var text = pstr[0].replace(_reText, "");
            var vm = pstr[0].match(_getTypeV);
            if (vm) {
                vm = vm[0].replace(/^\(|\)$/g, "")
            } else {
                vm = text;
                text = ""
            }
            str = str.replace(new RegExp(pstr[0].replace(_toReg, "\\$1"), "g"), _createpType(_createValue(vm, msg, pstr[0].match(_getStatusV)), text, msg, vm))
        }
        return str
    }
    function _createThisEle(element) {
        if (!window["v" + element]) {
            window["v" + element] = document.getElementById("vDis" + element) ? document.getElementById("vDis" + element).innerHTML : document.getElementById(element).innerHTML
        }
        return window["v" + element]
    }
    function RenderStr(str, model, _config) {
        config = _config;
        if (model.constructor != Array) {
            model = [model]
        }
        config || (config = {});
        if (config["delimiters"] && Array.isArray(config["delimiters"]) && config["delimiters"].length > 1) {
            _outType = config["delimiters"];
            createRegex()
        }
        return _BaseRanderAppend(model, str)
    }
    function Render(element, date, _config) {
        config = _config;
        config || (config = {});
        var els = document.getElementById(element);
        var strt = config["viewStr"] ? config["viewStr"] : _createThisEle(config["view"] ? config["view"] : element);
        if (config["append"] && config["append"] != -1) {
            els.innerHTML += RenderStr(strt, date, _config)
        } else {
            if (config["append"] == -1) {
                els.innerHTML = RenderStr(strt, date, _config) + els.innerHTML
            } else {
                els.innerHTML = RenderStr(strt, date, _config)
            }
        }
    }
    var config;
    e.vRender.renderStr = RenderStr;

    function __defineProperty(date, vm, arg, back,dateo,vmPath) {
        date.__ob__[vm] = date[vm];
        Object.defineProperty(date, vm, {
            set: function(e) {
                this.__ob__[vm] = e;
                var obj = {};
                var __funkey=vmPath.replace(/.\d+./,".").replace(/.\d+$/,"");
                if(back.__listen__[vmPath]&&back.__listen__[__funkey]){
                    if(back.__listen__.__listen__key[vmPath]<=back.__listen__.__listen__key[__funkey]){
                        back.__listen__[vmPath].apply(obj, arguments);
                        back.__listen__[__funkey].apply(obj,arguments);
                    }else{
                        back.__listen__[__funkey].apply(obj,arguments);
                        back.__listen__[vmPath].apply(obj, arguments);
                    }
                }else{
                    back.__listen__[vmPath] && back.__listen__[vmPath].apply(obj, arguments);
                    back.__listen__[__funkey] && back.__listen__[__funkey].apply(obj, arguments);
                }
                for (var b in obj) {
                    this.__ob__[b] = obj[b]
                }
                var that=this;
                clearTimeout(window["_rendout"+arg[0]]);
                window["_rendout"+arg[0]]=setTimeout(function(){if(back.render){back.render();}else{Render.apply(that, arg);}},1);
            },
            get: function() {
                return this.__ob__[vm]
            }
        })
    }

    function __dp(date, arg, back,dateo,vmPath) {
        if (typeof(date) == "object") {
            date.__ob__ = {};
                for (var vm in date) {
                    if(vm != "__ob__" && vm != "__listen__"){
                        var _vmPath=vmPath?vmPath+"."+vm:vm;
                            __defineProperty(date, vm, arg, back,dateo,_vmPath);
                            __dp(date[vm],arg,back,dateo,_vmPath);
                    }
                }
        }
    }
    e.vRender.render = function(el, o, config) {
        if (o) {
            if (config && config["$watch"] === true) {
                var Arg = arguments;
                var back = {
                    __listen__: {__listen__time:0,__listen__key:{}},
                    $watch: function(a, callback) {
                        if (typeof(a) == "string") {
                            this.__listen__.__listen__key[a]=this.__listen__.__listen__time;
                            this.__listen__.__listen__time++;
                            this.__listen__[a] = callback
                        }
                    },
                    render:config.$render
                };
                Render(el, o, config);
                if (Array.isArray(o)) {
                    array_defineProperty(o,Arg,back);
                } else {
                    __dp(o, Arg, back,o);
                }
                return back
            } else {
                Render(el, o, config)
            }
        }
    }
})(window);
