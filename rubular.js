function $w(e) {
    return (e = e.strip()) ? e.split(/\s+/) : []
}
function $H(e) {
    return e && e.constructor == Hash ? e : new Hash(e)
}
function $(e) {
    if (1 < arguments.length) {
        for (var t = 0, n = [], r = arguments.length; t < r; t++)
            n.push($(arguments[t]));
        return n
    }
    return "string" == typeof e && (e = document.getElementById(e)),
    Element.extend(e)
}
function $$() {
    return Selector.findChildElements(document, $A(arguments))
}
var Prototype = {
    Version: "1.5.0",
    BrowserFeatures: {
        XPath: !!document.evaluate
    },
    ScriptFragment: "(?:<script.*?>)((\n|\r|.)*?)(?:</script>)",
    emptyFunction: function() {},
    K: function(e) {
        return e
    }
}
  , Class = {
    create: function() {
        return function() {
            this.initialize.apply(this, arguments)
        }
    }
}
  , Abstract = new Object;
Object.extend = function(e, t) {
    for (var n in t)
        e[n] = t[n];
    return e
}
,
Object.extend(Object, {
    inspect: function(e) {
        try {
            return e === undefined ? "undefined" : null === e ? "null" : e.inspect ? e.inspect() : e.toString()
        } catch (t) {
            if (t instanceof RangeError)
                return "...";
            throw t
        }
    },
    keys: function(e) {
        var t = [];
        for (var n in e)
            t.push(n);
        return t
    },
    values: function(e) {
        var t = [];
        for (var n in e)
            t.push(e[n]);
        return t
    },
    clone: function(e) {
        return Object.extend({}, e)
    }
}),
Function.prototype.bind = function() {
    var e = this
      , t = $A(arguments)
      , n = t.shift();
    return function() {
        return e.apply(n, t.concat($A(arguments)))
    }
}
,
Function.prototype.bindAsEventListener = function(t) {
    var n = this
      , r = $A(arguments);
    t = r.shift();
    return function(e) {
        return n.apply(t, [e || window.event].concat(r).concat($A(arguments)))
    }
}
,
Object.extend(Number.prototype, {
    toColorPart: function() {
        var e = this.toString(16);
        return this < 16 ? "0" + e : e
    },
    succ: function() {
        return this + 1
    },
    times: function(e) {
        return $R(0, this, !0).each(e),
        this
    }
});
var Try = {
    these: function() {
        for (var e, t = 0, n = arguments.length; t < n; t++) {
            var r = arguments[t];
            try {
                e = r();
                break
            } catch (i) {}
        }
        return e
    }
}
  , PeriodicalExecuter = Class.create();
PeriodicalExecuter.prototype = {
    initialize: function(e, t) {
        this.callback = e,
        this.frequency = t,
        this.currentlyExecuting = !1,
        this.registerCallback()
    },
    registerCallback: function() {
        this.timer = setInterval(this.onTimerEvent.bind(this), 1e3 * this.frequency)
    },
    stop: function() {
        this.timer && (clearInterval(this.timer),
        this.timer = null)
    },
    onTimerEvent: function() {
        if (!this.currentlyExecuting)
            try {
                this.currentlyExecuting = !0,
                this.callback(this)
            } finally {
                this.currentlyExecuting = !1
            }
    }
},
String.interpret = function(e) {
    return null == e ? "" : String(e)
}
,
Object.extend(String.prototype, {
    gsub: function(e, t) {
        var n, r = "", i = this;
        for (t = arguments.callee.prepareReplacement(t); 0 < i.length; )
            (n = i.match(e)) ? (r += i.slice(0, n.index),
            r += String.interpret(t(n)),
            i = i.slice(n.index + n[0].length)) : (r += i,
            i = "");
        return r
    },
    sub: function(e, t, n) {
        return t = this.gsub.prepareReplacement(t),
        n = n === undefined ? 1 : n,
        this.gsub(e, function(e) {
            return --n < 0 ? e[0] : t(e)
        })
    },
    scan: function(e, t) {
        return this.gsub(e, t),
        this
    },
    truncate: function(e, t) {
        return e = e || 30,
        t = t === undefined ? "..." : t,
        this.length > e ? this.slice(0, e - t.length) + t : this
    },
    strip: function() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "")
    },
    stripTags: function() {
        return this.replace(/<\/?[^>]+>/gi, "")
    },
    stripScripts: function() {
        return this.replace(new RegExp(Prototype.ScriptFragment,"img"), "")
    },
    extractScripts: function() {
        var e = new RegExp(Prototype.ScriptFragment,"img")
          , t = new RegExp(Prototype.ScriptFragment,"im");
        return (this.match(e) || []).map(function(e) {
            return (e.match(t) || ["", ""])[1]
        })
    },
    evalScripts: function() {
        return this.extractScripts().map(function(script) {
            return eval(script)
        })
    },
    escapeHTML: function() {
        var e = document.createElement("div")
          , t = document.createTextNode(this);
        return e.appendChild(t),
        e.innerHTML
    },
    unescapeHTML: function() {
        var e = document.createElement("div");
        return e.innerHTML = this.stripTags(),
        e.childNodes[0] ? 1 < e.childNodes.length ? $A(e.childNodes).inject("", function(e, t) {
            return e + t.nodeValue
        }) : e.childNodes[0].nodeValue : ""
    },
    toQueryParams: function(e) {
        var t = this.strip().match(/([^?#]*)(#.*)?$/);
        return t ? t[1].split(e || "&").inject({}, function(e, t) {
            if ((t = t.split("="))[0]) {
                var n = decodeURIComponent(t[0])
                  , r = t[1] ? decodeURIComponent(t[1]) : undefined;
                e[n] !== undefined ? (e[n].constructor != Array && (e[n] = [e[n]]),
                r && e[n].push(r)) : e[n] = r
            }
            return e
        }) : {}
    },
    toArray: function() {
        return this.split("")
    },
    succ: function() {
        return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
    },
    camelize: function() {
        var e = this.split("-")
          , t = e.length;
        if (1 == t)
            return e[0];
        for (var n = "-" == this.charAt(0) ? e[0].charAt(0).toUpperCase() + e[0].substring(1) : e[0], r = 1; r < t; r++)
            n += e[r].charAt(0).toUpperCase() + e[r].substring(1);
        return n
    },
    capitalize: function() {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
    },
    underscore: function() {
        return this.gsub(/::/, "/").gsub(/([A-Z]+)([A-Z][a-z])/, "#{1}_#{2}").gsub(/([a-z\d])([A-Z])/, "#{1}_#{2}").gsub(/-/, "_").toLowerCase()
    },
    dasherize: function() {
        return this.gsub(/_/, "-")
    },
    inspect: function(e) {
        var t = this.replace(/\\/g, "\\\\");
        return e ? '"' + t.replace(/"/g, '\\"') + '"' : "'" + t.replace(/'/g, "\\'") + "'"
    }
}),
String.prototype.gsub.prepareReplacement = function(e) {
    if ("function" == typeof e)
        return e;
    var t = new Template(e);
    return function(e) {
        return t.evaluate(e)
    }
}
,
String.prototype.parseQuery = String.prototype.toQueryParams;
var Template = Class.create();
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/,
Template.prototype = {
    initialize: function(e, t) {
        this.template = e.toString(),
        this.pattern = t || Template.Pattern
    },
    evaluate: function(n) {
        return this.template.gsub(this.pattern, function(e) {
            var t = e[1];
            return "\\" == t ? e[2] : t + String.interpret(n[e[3]])
        })
    }
};
var $break = new Object
  , $continue = new Object
  , Enumerable = {
    each: function(n) {
        var r = 0;
        try {
            this._each(function(e) {
                try {
                    n(e, r++)
                } catch (t) {
                    if (t != $continue)
                        throw t
                }
            })
        } catch (e) {
            if (e != $break)
                throw e
        }
        return this
    },
    eachSlice: function(e, t) {
        for (var n = -e, r = [], i = this.toArray(); (n += e) < i.length; )
            r.push(i.slice(n, n + e));
        return r.map(t)
    },
    all: function(n) {
        var r = !0;
        return this.each(function(e, t) {
            if (!(r = r && !!(n || Prototype.K)(e, t)))
                throw $break
        }),
        r
    },
    any: function(n) {
        var r = !1;
        return this.each(function(e, t) {
            if (r = !!(n || Prototype.K)(e, t))
                throw $break
        }),
        r
    },
    collect: function(n) {
        var r = [];
        return this.each(function(e, t) {
            r.push((n || Prototype.K)(e, t))
        }),
        r
    },
    detect: function(n) {
        var r;
        return this.each(function(e, t) {
            if (n(e, t))
                throw r = e,
                $break
        }),
        r
    },
    findAll: function(n) {
        var r = [];
        return this.each(function(e, t) {
            n(e, t) && r.push(e)
        }),
        r
    },
    grep: function(n, r) {
        var i = [];
        return this.each(function(e, t) {
            e.toString().match(n) && i.push((r || Prototype.K)(e, t))
        }),
        i
    },
    include: function(t) {
        var n = !1;
        return this.each(function(e) {
            if (e == t)
                throw n = !0,
                $break
        }),
        n
    },
    inGroupsOf: function(t, n) {
        return n = n === undefined ? null : n,
        this.eachSlice(t, function(e) {
            for (; e.length < t; )
                e.push(n);
            return e
        })
    },
    inject: function(n, r) {
        return this.each(function(e, t) {
            n = r(n, e, t)
        }),
        n
    },
    invoke: function(t) {
        var n = $A(arguments).slice(1);
        return this.map(function(e) {
            return e[t].apply(e, n)
        })
    },
    max: function(n) {
        var r;
        return this.each(function(e, t) {
            e = (n || Prototype.K)(e, t),
            (r == undefined || r <= e) && (r = e)
        }),
        r
    },
    min: function(n) {
        var r;
        return this.each(function(e, t) {
            e = (n || Prototype.K)(e, t),
            (r == undefined || e < r) && (r = e)
        }),
        r
    },
    partition: function(n) {
        var r = []
          , i = [];
        return this.each(function(e, t) {
            ((n || Prototype.K)(e, t) ? r : i).push(e)
        }),
        [r, i]
    },
    pluck: function(t) {
        var n = [];
        return this.each(function(e) {
            n.push(e[t])
        }),
        n
    },
    reject: function(n) {
        var r = [];
        return this.each(function(e, t) {
            n(e, t) || r.push(e)
        }),
        r
    },
    sortBy: function(n) {
        return this.map(function(e, t) {
            return {
                value: e,
                criteria: n(e, t)
            }
        }).sort(function(e, t) {
            var n = e.criteria
              , r = t.criteria;
            return n < r ? -1 : r < n ? 1 : 0
        }).pluck("value")
    },
    toArray: function() {
        return this.map()
    },
    zip: function() {
        var n = Prototype.K
          , e = $A(arguments);
        "function" == typeof e.last() && (n = e.pop());
        var r = [this].concat(e).map($A);
        return this.map(function(e, t) {
            return n(r.pluck(t))
        })
    },
    size: function() {
        return this.toArray().length
    },
    inspect: function() {
        return "#<Enumerable:" + this.toArray().inspect() + ">"
    }
};
Object.extend(Enumerable, {
    map: Enumerable.collect,
    find: Enumerable.detect,
    select: Enumerable.findAll,
    member: Enumerable.include,
    entries: Enumerable.toArray
});
var $A = Array.from = function(e) {
    if (!e)
        return [];
    if (e.toArray)
        return e.toArray();
    for (var t = [], n = 0, r = e.length; n < r; n++)
        t.push(e[n]);
    return t
}
;
Object.extend(Array.prototype, Enumerable),
Array.prototype._reverse || (Array.prototype._reverse = Array.prototype.reverse),
Object.extend(Array.prototype, {
    _each: function(e) {
        for (var t = 0, n = this.length; t < n; t++)
            e(this[t])
    },
    clear: function() {
        return this.length = 0,
        this
    },
    first: function() {
        return this[0]
    },
    last: function() {
        return this[this.length - 1]
    },
    compact: function() {
        return this.select(function(e) {
            return null != e
        })
    },
    flatten: function() {
        return this.inject([], function(e, t) {
            return e.concat(t && t.constructor == Array ? t.flatten() : [t])
        })
    },
    without: function() {
        var t = $A(arguments);
        return this.select(function(e) {
            return !t.include(e)
        })
    },
    indexOf: function(e) {
        for (var t = 0, n = this.length; t < n; t++)
            if (this[t] == e)
                return t;
        return -1
    },
    reverse: function(e) {
        return (!1 !== e ? this : this.toArray())._reverse()
    },
    reduce: function() {
        return 1 < this.length ? this : this[0]
    },
    uniq: function() {
        return this.inject([], function(e, t) {
            return e.include(t) ? e : e.concat([t])
        })
    },
    clone: function() {
        return [].concat(this)
    },
    size: function() {
        return this.length
    },
    inspect: function() {
        return "[" + this.map(Object.inspect).join(", ") + "]"
    }
}),
Array.prototype.toArray = Array.prototype.clone,
window.opera && (Array.prototype.concat = function() {
    for (var e = [], t = 0, n = this.length; t < n; t++)
        e.push(this[t]);
    for (t = 0,
    n = arguments.length; t < n; t++)
        if (arguments[t].constructor == Array)
            for (var r = 0, i = arguments[t].length; r < i; r++)
                e.push(arguments[t][r]);
        else
            e.push(arguments[t]);
    return e
}
);
var Hash = function(e) {
    Object.extend(this, e || {})
};
Object.extend(Hash, {
    toQueryString: function(e) {
        var n = [];
        return this.prototype._each.call(e, function(e) {
            if (e.key) {
                if (e.value && e.value.constructor == Array) {
                    var t = e.value.compact();
                    if (!(t.length < 2))
                        return key = encodeURIComponent(e.key),
                        void t.each(function(e) {
                            e = e != undefined ? encodeURIComponent(e) : "",
                            n.push(key + "=" + encodeURIComponent(e))
                        });
                    e.value = t.reduce()
                }
                e.value == undefined && (e[1] = ""),
                n.push(e.map(encodeURIComponent).join("="))
            }
        }),
        n.join("&")
    }
}),
Object.extend(Hash.prototype, Enumerable),
Object.extend(Hash.prototype, {
    _each: function(e) {
        for (var t in this) {
            var n = this[t];
            if (!n || n != Hash.prototype[t]) {
                var r = [t, n];
                r.key = t,
                r.value = n,
                e(r)
            }
        }
    },
    keys: function() {
        return this.pluck("key")
    },
    values: function() {
        return this.pluck("value")
    },
    merge: function(e) {
        return $H(e).inject(this, function(e, t) {
            return e[t.key] = t.value,
            e
        })
    },
    remove: function() {
        for (var e, t = 0, n = arguments.length; t < n; t++) {
            var r = this[arguments[t]];
            r !== undefined && (e === undefined ? e = r : (e.constructor != Array && (e = [e]),
            e.push(r))),
            delete this[arguments[t]]
        }
        return e
    },
    toQueryString: function() {
        return Hash.toQueryString(this)
    },
    inspect: function() {
        return "#<Hash:{" + this.map(function(e) {
            return e.map(Object.inspect).join(": ")
        }).join(", ") + "}>"
    }
}),
ObjectRange = Class.create(),
Object.extend(ObjectRange.prototype, Enumerable),
Object.extend(ObjectRange.prototype, {
    initialize: function(e, t, n) {
        this.start = e,
        this.end = t,
        this.exclusive = n
    },
    _each: function(e) {
        for (var t = this.start; this.include(t); )
            e(t),
            t = t.succ()
    },
    include: function(e) {
        return !(e < this.start) && (this.exclusive ? e < this.end : e <= this.end)
    }
});
var $R = function(e, t, n) {
    return new ObjectRange(e,t,n)
}
  , Ajax = {
    getTransport: function() {
        return Try.these(function() {
            return new XMLHttpRequest
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP")
        }, function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }) || !1
    },
    activeRequestCount: 0,
    Responders: {
        responders: [],
        _each: function(e) {
            this.responders._each(e)
        },
        register: function(e) {
            this.include(e) || this.responders.push(e)
        },
        unregister: function(e) {
            this.responders = this.responders.without(e)
        },
        dispatch: function(n, r, i, s) {
            this.each(function(e) {
                if ("function" == typeof e[n])
                    try {
                        e[n].apply(e, [r, i, s])
                    } catch (t) {}
            })
        }
    }
};
if (Object.extend(Ajax.Responders, Enumerable),
Ajax.Responders.register({
    onCreate: function() {
        Ajax.activeRequestCount++
    },
    onComplete: function() {
        Ajax.activeRequestCount--
    }
}),
Ajax.Base = function() {}
,
Ajax.Base.prototype = {
    setOptions: function(e) {
        this.options = {
            method: "post",
            asynchronous: !0,
            contentType: "application/x-www-form-urlencoded",
            encoding: "UTF-8",
            parameters: ""
        },
        Object.extend(this.options, e || {}),
        this.options.method = this.options.method.toLowerCase(),
        "string" == typeof this.options.parameters && (this.options.parameters = this.options.parameters.toQueryParams())
    }
},
Ajax.Request = Class.create(),
Ajax.Request.Events = ["Uninitialized", "Loading", "Loaded", "Interactive", "Complete"],
Ajax.Request.prototype = Object.extend(new Ajax.Base, {
    _complete: !1,
    initialize: function(e, t) {
        this.transport = Ajax.getTransport(),
        this.setOptions(t),
        this.request(e)
    },
    request: function(e) {
        this.url = e,
        this.method = this.options.method;
        var t = this.options.parameters;
        ["get", "post"].include(this.method) || (t._method = this.method,
        this.method = "post"),
        (t = Hash.toQueryString(t)) && /Konqueror|Safari|KHTML/.test(navigator.userAgent) && (t += "&_="),
        "get" == this.method && t && (this.url += (-1 < this.url.indexOf("?") ? "&" : "?") + t);
        try {
            Ajax.Responders.dispatch("onCreate", this, this.transport),
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous),
            this.options.asynchronous && setTimeout(function() {
                this.respondToReadyState(1)
            }
            .bind(this), 10),
            this.transport.onreadystatechange = this.onStateChange.bind(this),
            this.setRequestHeaders();
            var n = "post" == this.method ? this.options.postBody || t : null;
            this.transport.send(n),
            !this.options.asynchronous && this.transport.overrideMimeType && this.onStateChange()
        } catch (r) {
            this.dispatchException(r)
        }
    },
    onStateChange: function() {
        var e = this.transport.readyState;
        1 < e && (4 != e || !this._complete) && this.respondToReadyState(this.transport.readyState)
    },
    setRequestHeaders: function() {
        var t = {
            "X-Requested-With": "XMLHttpRequest",
            "X-Prototype-Version": Prototype.Version,
            Accept: "text/javascript, text/html, application/xml, text/xml, */*"
        };
        if ("post" == this.method && (t["Content-type"] = this.options.contentType + (this.options.encoding ? "; charset=" + this.options.encoding : ""),
        this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005 && (t.Connection = "close")),
        "object" == typeof this.options.requestHeaders) {
            var e = this.options.requestHeaders;
            if ("function" == typeof e.push)
                for (var n = 0, r = e.length; n < r; n += 2)
                    t[e[n]] = e[n + 1];
            else
                $H(e).each(function(e) {
                    t[e.key] = e.value
                })
        }
        for (var i in t)
            this.transport.setRequestHeader(i, t[i])
    },
    success: function() {
        return !this.transport.status || 200 <= this.transport.status && this.transport.status < 300
    },
    respondToReadyState: function(e) {
        var t = Ajax.Request.Events[e]
          , n = this.transport
          , r = this.evalJSON();
        if ("Complete" == t) {
            try {
                this._complete = !0,
                (this.options["on" + this.transport.status] || this.options["on" + (this.success() ? "Success" : "Failure")] || Prototype.emptyFunction)(n, r)
            } catch (i) {
                this.dispatchException(i)
            }
            (this.getHeader("Content-type") || "text/javascript").strip().match(/^(text|application)\/(x-)?(java|ecma)script(;.*)?$/i) && this.evalResponse()
        }
        try {
            (this.options["on" + t] || Prototype.emptyFunction)(n, r),
            Ajax.Responders.dispatch("on" + t, this, n, r)
        } catch (i) {
            this.dispatchException(i)
        }
        "Complete" == t && (this.transport.onreadystatechange = Prototype.emptyFunction)
    },
    getHeader: function(e) {
        try {
            return this.transport.getResponseHeader(e)
        } catch (t) {
            return null
        }
    },
    evalJSON: function() {
        try {
            var json = this.getHeader("X-JSON");
            return json ? eval("(" + json + ")") : null
        } catch (e) {
            return null
        }
    },
    evalResponse: function() {
        try {
            return eval(this.transport.responseText)
        } catch (e) {
            this.dispatchException(e)
        }
    },
    dispatchException: function(e) {
        (this.options.onException || Prototype.emptyFunction)(this, e),
        Ajax.Responders.dispatch("onException", this, e)
    }
}),
Ajax.Updater = Class.create(),
Object.extend(Object.extend(Ajax.Updater.prototype, Ajax.Request.prototype), {
    initialize: function(e, t, n) {
        this.container = {
            success: e.success || e,
            failure: e.failure || (e.success ? null : e)
        },
        this.transport = Ajax.getTransport(),
        this.setOptions(n);
        var r = this.options.onComplete || Prototype.emptyFunction;
        this.options.onComplete = function(e, t) {
            this.updateContent(),
            r(e, t)
        }
        .bind(this),
        this.request(t)
    },
    updateContent: function() {
        var e = this.container[this.success() ? "success" : "failure"]
          , t = this.transport.responseText;
        this.options.evalScripts || (t = t.stripScripts()),
        (e = $(e)) && (this.options.insertion ? new this.options.insertion(e,t) : e.update(t)),
        this.success() && this.onComplete && setTimeout(this.onComplete.bind(this), 10)
    }
}),
Ajax.PeriodicalUpdater = Class.create(),
Ajax.PeriodicalUpdater.prototype = Object.extend(new Ajax.Base, {
    initialize: function(e, t, n) {
        this.setOptions(n),
        this.onComplete = this.options.onComplete,
        this.frequency = this.options.frequency || 2,
        this.decay = this.options.decay || 1,
        this.updater = {},
        this.container = e,
        this.url = t,
        this.start()
    },
    start: function() {
        this.options.onComplete = this.updateComplete.bind(this),
        this.onTimerEvent()
    },
    stop: function() {
        this.updater.options.onComplete = undefined,
        clearTimeout(this.timer),
        (this.onComplete || Prototype.emptyFunction).apply(this, arguments)
    },
    updateComplete: function(e) {
        this.options.decay && (this.decay = e.responseText == this.lastText ? this.decay * this.options.decay : 1,
        this.lastText = e.responseText),
        this.timer = setTimeout(this.onTimerEvent.bind(this), this.decay * this.frequency * 1e3)
    },
    onTimerEvent: function() {
        this.updater = new Ajax.Updater(this.container,this.url,this.options)
    }
}),
Prototype.BrowserFeatures.XPath && (document._getElementsByXPath = function(e, t) {
    for (var n = [], r = document.evaluate(e, $(t) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), i = 0, s = r.snapshotLength; i < s; i++)
        n.push(r.snapshotItem(i));
    return n
}
),
document.getElementsByClassName = function(e, t) {
    if (Prototype.BrowserFeatures.XPath) {
        var n = ".//*[contains(concat(' ', @class, ' '), ' " + e + " ')]";
        return document._getElementsByXPath(n, t)
    }
    for (var r, i = ($(t) || document.body).getElementsByTagName("*"), s = [], o = 0, a = i.length; o < a; o++)
        r = i[o],
        Element.hasClassName(r, e) && s.push(Element.extend(r));
    return s
}
,
!window.Element)
    var Element = new Object;
Element.extend = function(e) {
    if (!e || _nativeExtensions || 3 == e.nodeType)
        return e;
    if (!e._extended && e.tagName && e != window) {
        var t = Object.clone(Element.Methods)
          , n = Element.extend.cache;
        for (var r in "FORM" == e.tagName && Object.extend(t, Form.Methods),
        ["INPUT", "TEXTAREA", "SELECT"].include(e.tagName) && Object.extend(t, Form.Element.Methods),
        Object.extend(t, Element.Methods.Simulated),
        t) {
            var i = t[r];
            "function" != typeof i || r in e || (e[r] = n.findOrStore(i))
        }
    }
    return e._extended = !0,
    e
}
,
Element.extend.cache = {
    findOrStore: function(e) {
        return this[e] = this[e] || function() {
            return e.apply(null, [this].concat($A(arguments)))
        }
    }
},
Element.Methods = {
    visible: function(e) {
        return "none" != $(e).style.display
    },
    toggle: function(e) {
        return e = $(e),
        Element[Element.visible(e) ? "hide" : "show"](e),
        e
    },
    hide: function(e) {
        return $(e).style.display = "none",
        e
    },
    show: function(e) {
        return $(e).style.display = "",
        e
    },
    remove: function(e) {
        return (e = $(e)).parentNode.removeChild(e),
        e
    },
    update: function(e, t) {
        return t = void 0 === t ? "" : t.toString(),
        $(e).innerHTML = t.stripScripts(),
        setTimeout(function() {
            t.evalScripts()
        }, 10),
        e
    },
    replace: function(e, t) {
        if (e = $(e),
        t = void 0 === t ? "" : t.toString(),
        e.outerHTML)
            e.outerHTML = t.stripScripts();
        else {
            var n = e.ownerDocument.createRange();
            n.selectNodeContents(e),
            e.parentNode.replaceChild(n.createContextualFragment(t.stripScripts()), e)
        }
        return setTimeout(function() {
            t.evalScripts()
        }, 10),
        e
    },
    inspect: function(i) {
        var s = "<" + (i = $(i)).tagName.toLowerCase();
        return $H({
            id: "id",
            className: "class"
        }).each(function(e) {
            var t = e.first()
              , n = e.last()
              , r = (i[t] || "").toString();
            r && (s += " " + n + "=" + r.inspect(!0))
        }),
        s + ">"
    },
    recursivelyCollect: function(e, t) {
        e = $(e);
        for (var n = []; e = e[t]; )
            1 == e.nodeType && n.push(Element.extend(e));
        return n
    },
    ancestors: function(e) {
        return $(e).recursivelyCollect("parentNode")
    },
    descendants: function(e) {
        return $A($(e).getElementsByTagName("*"))
    },
    immediateDescendants: function(e) {
        if (!(e = $(e).firstChild))
            return [];
        for (; e && 1 != e.nodeType; )
            e = e.nextSibling;
        return e ? [e].concat($(e).nextSiblings()) : []
    },
    previousSiblings: function(e) {
        return $(e).recursivelyCollect("previousSibling")
    },
    nextSiblings: function(e) {
        return $(e).recursivelyCollect("nextSibling")
    },
    siblings: function(e) {
        return (e = $(e)).previousSiblings().reverse().concat(e.nextSiblings())
    },
    match: function(e, t) {
        return "string" == typeof t && (t = new Selector(t)),
        t.match($(e))
    },
    up: function(e, t, n) {
        return Selector.findElement($(e).ancestors(), t, n)
    },
    down: function(e, t, n) {
        return Selector.findElement($(e).descendants(), t, n)
    },
    previous: function(e, t, n) {
        return Selector.findElement($(e).previousSiblings(), t, n)
    },
    next: function(e, t, n) {
        return Selector.findElement($(e).nextSiblings(), t, n)
    },
    getElementsBySelector: function() {
        var e = $A(arguments)
          , t = $(e.shift());
        return Selector.findChildElements(t, e)
    },
    getElementsByClassName: function(e, t) {
        return document.getElementsByClassName(t, e)
    },
    readAttribute: function(e, t) {
        if (e = $(e),
        document.all && !window.opera) {
            var n = Element._attributeTranslations;
            if (n.values[t])
                return n.values[t](e, t);
            n.names[t] && (t = n.names[t]);
            var r = e.attributes[t];
            if (r)
                return r.nodeValue
        }
        return e.getAttribute(t)
    },
    getHeight: function(e) {
        return $(e).getDimensions().height
    },
    getWidth: function(e) {
        return $(e).getDimensions().width
    },
    classNames: function(e) {
        return new Element.ClassNames(e)
    },
    hasClassName: function(e, t) {
        if (e = $(e)) {
            var n = e.className;
            return 0 != n.length && !(n != t && !n.match(new RegExp("(^|\\s)" + t + "(\\s|$)")))
        }
    },
    addClassName: function(e, t) {
        if (e = $(e))
            return Element.classNames(e).add(t),
            e
    },
    removeClassName: function(e, t) {
        if (e = $(e))
            return Element.classNames(e).remove(t),
            e
    },
    toggleClassName: function(e, t) {
        if (e = $(e))
            return Element.classNames(e)[e.hasClassName(t) ? "remove" : "add"](t),
            e
    },
    observe: function() {
        return Event.observe.apply(Event, arguments),
        $A(arguments).first()
    },
    stopObserving: function() {
        return Event.stopObserving.apply(Event, arguments),
        $A(arguments).first()
    },
    cleanWhitespace: function(e) {
        for (var t = (e = $(e)).firstChild; t; ) {
            var n = t.nextSibling;
            3 != t.nodeType || /\S/.test(t.nodeValue) || e.removeChild(t),
            t = n
        }
        return e
    },
    empty: function(e) {
        return $(e).innerHTML.match(/^\s*$/)
    },
    descendantOf: function(e, t) {
        for (e = $(e),
        t = $(t); e = e.parentNode; )
            if (e == t)
                return !0;
        return !1
    },
    scrollTo: function(e) {
        e = $(e);
        var t = Position.cumulativeOffset(e);
        return window.scrollTo(t[0], t[1]),
        e
    },
    getStyle: function(e, t) {
        e = $(e),
        ["float", "cssFloat"].include(t) && (t = "undefined" != typeof e.style.styleFloat ? "styleFloat" : "cssFloat"),
        t = t.camelize();
        var n = e.style[t];
        if (!n)
            if (document.defaultView && document.defaultView.getComputedStyle) {
                var r = document.defaultView.getComputedStyle(e, null);
                n = r ? r[t] : null
            } else
                e.currentStyle && (n = e.currentStyle[t]);
        return "auto" == n && ["width", "height"].include(t) && "none" != e.getStyle("display") && (n = e["offset" + t.capitalize()] + "px"),
        window.opera && ["left", "top", "right", "bottom"].include(t) && "static" == Element.getStyle(e, "position") && (n = "auto"),
        "opacity" == t ? n ? parseFloat(n) : (n = (e.getStyle("filter") || "").match(/alpha\(opacity=(.*)\)/)) && n[1] ? parseFloat(n[1]) / 100 : 1 : "auto" == n ? null : n
    },
    setStyle: function(e, t) {
        for (var n in e = $(e),
        t) {
            var r = t[n];
            "opacity" == n ? 1 == r ? (r = /Gecko/.test(navigator.userAgent) && !/Konqueror|Safari|KHTML/.test(navigator.userAgent) ? .999999 : 1,
            /MSIE/.test(navigator.userAgent) && !window.opera && (e.style.filter = e.getStyle("filter").replace(/alpha\([^\)]*\)/gi, ""))) : "" == r ? /MSIE/.test(navigator.userAgent) && !window.opera && (e.style.filter = e.getStyle("filter").replace(/alpha\([^\)]*\)/gi, "")) : (r < 1e-5 && (r = 0),
            /MSIE/.test(navigator.userAgent) && !window.opera && (e.style.filter = e.getStyle("filter").replace(/alpha\([^\)]*\)/gi, "") + "alpha(opacity=" + 100 * r + ")")) : ["float", "cssFloat"].include(n) && (n = "undefined" != typeof e.style.styleFloat ? "styleFloat" : "cssFloat"),
            e.style[n.camelize()] = r
        }
        return e
    },
    getDimensions: function(e) {
        var t = $(e = $(e)).getStyle("display");
        if ("none" != t && null != t)
            return {
                width: e.offsetWidth,
                height: e.offsetHeight
            };
        var n = e.style
          , r = n.visibility
          , i = n.position
          , s = n.display;
        n.visibility = "hidden",
        n.position = "absolute",
        n.display = "block";
        var o = e.clientWidth
          , a = e.clientHeight;
        return n.display = s,
        n.position = i,
        n.visibility = r,
        {
            width: o,
            height: a
        }
    },
    makePositioned: function(e) {
        e = $(e);
        var t = Element.getStyle(e, "position");
        return "static" != t && t || (e._madePositioned = !0,
        e.style.position = "relative",
        window.opera && (e.style.top = 0,
        e.style.left = 0)),
        e
    },
    undoPositioned: function(e) {
        return (e = $(e))._madePositioned && (e._madePositioned = undefined,
        e.style.position = e.style.top = e.style.left = e.style.bottom = e.style.right = ""),
        e
    },
    makeClipping: function(e) {
        return (e = $(e))._overflow || (e._overflow = e.style.overflow || "auto",
        "hidden" != (Element.getStyle(e, "overflow") || "visible") && (e.style.overflow = "hidden")),
        e
    },
    undoClipping: function(e) {
        return (e = $(e))._overflow && (e.style.overflow = "auto" == e._overflow ? "" : e._overflow,
        e._overflow = null),
        e
    }
},
Object.extend(Element.Methods, {
    childOf: Element.Methods.descendantOf
}),
Element._attributeTranslations = {},
Element._attributeTranslations.names = {
    colspan: "colSpan",
    rowspan: "rowSpan",
    valign: "vAlign",
    datetime: "dateTime",
    accesskey: "accessKey",
    tabindex: "tabIndex",
    enctype: "encType",
    maxlength: "maxLength",
    readonly: "readOnly",
    longdesc: "longDesc"
},
Element._attributeTranslations.values = {
    _getAttr: function(e, t) {
        return e.getAttribute(t, 2)
    },
    _flag: function(e, t) {
        return $(e).hasAttribute(t) ? t : null
    },
    style: function(e) {
        return e.style.cssText.toLowerCase()
    },
    title: function(e) {
        var t = e.getAttributeNode("title");
        return t.specified ? t.nodeValue : null
    }
},
Object.extend(Element._attributeTranslations.values, {
    href: Element._attributeTranslations.values._getAttr,
    src: Element._attributeTranslations.values._getAttr,
    disabled: Element._attributeTranslations.values._flag,
    checked: Element._attributeTranslations.values._flag,
    readonly: Element._attributeTranslations.values._flag,
    multiple: Element._attributeTranslations.values._flag
}),
Element.Methods.Simulated = {
    hasAttribute: function(e, t) {
        return t = Element._attributeTranslations.names[t] || t,
        $(e).getAttributeNode(t).specified
    }
},
document.all && !window.opera && (Element.Methods.update = function(t, e) {
    t = $(t),
    e = void 0 === e ? "" : e.toString();
    var n = t.tagName.toUpperCase();
    if (["THEAD", "TBODY", "TR", "TD"].include(n)) {
        var r = document.createElement("div");
        switch (n) {
        case "THEAD":
        case "TBODY":
            r.innerHTML = "<table><tbody>" + e.stripScripts() + "</tbody></table>",
            depth = 2;
            break;
        case "TR":
            r.innerHTML = "<table><tbody><tr>" + e.stripScripts() + "</tr></tbody></table>",
            depth = 3;
            break;
        case "TD":
            r.innerHTML = "<table><tbody><tr><td>" + e.stripScripts() + "</td></tr></tbody></table>",
            depth = 4
        }
        $A(t.childNodes).each(function(e) {
            t.removeChild(e)
        }),
        depth.times(function() {
            r = r.firstChild
        }),
        $A(r.childNodes).each(function(e) {
            t.appendChild(e)
        })
    } else
        t.innerHTML = e.stripScripts();
    return setTimeout(function() {
        e.evalScripts()
    }, 10),
    t
}
),
Object.extend(Element, Element.Methods);
var _nativeExtensions = !1;
/Konqueror|Safari|KHTML/.test(navigator.userAgent) && ["", "Form", "Input", "TextArea", "Select"].each(function(e) {
    var t = "HTML" + e + "Element";
    window[t] || ((window[t] = {}).prototype = document.createElement(e ? e.toLowerCase() : "div").__proto__)
}),
Element.addMethods = function(e) {
    function t(e, t, n) {
        n = n || !1;
        var r = Element.extend.cache;
        for (var i in e) {
            var s = e[i];
            n && i in t || (t[i] = r.findOrStore(s))
        }
    }
    Object.extend(Element.Methods, e || {}),
    "undefined" != typeof HTMLElement && (t(Element.Methods, HTMLElement.prototype),
    t(Element.Methods.Simulated, HTMLElement.prototype, !0),
    t(Form.Methods, HTMLFormElement.prototype),
    [HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement].each(function(e) {
        t(Form.Element.Methods, e.prototype)
    }),
    _nativeExtensions = !0)
}
;
var Toggle = new Object;
Toggle.display = Element.toggle,
Abstract.Insertion = function(e) {
    this.adjacency = e
}
,
Abstract.Insertion.prototype = {
    initialize: function(e, t) {
        if (this.element = $(e),
        this.content = t.stripScripts(),
        this.adjacency && this.element.insertAdjacentHTML)
            try {
                this.element.insertAdjacentHTML(this.adjacency, this.content)
            } catch (r) {
                var n = this.element.tagName.toUpperCase();
                if (!["TBODY", "TR"].include(n))
                    throw r;
                this.insertContent(this.contentFromAnonymousTable())
            }
        else
            this.range = this.element.ownerDocument.createRange(),
            this.initializeRange && this.initializeRange(),
            this.insertContent([this.range.createContextualFragment(this.content)]);
        setTimeout(function() {
            t.evalScripts()
        }, 10)
    },
    contentFromAnonymousTable: function() {
        var e = document.createElement("div");
        return e.innerHTML = "<table><tbody>" + this.content + "</tbody></table>",
        $A(e.childNodes[0].childNodes[0].childNodes)
    }
};
var Insertion = new Object;
Insertion.Before = Class.create(),
Insertion.Before.prototype = Object.extend(new Abstract.Insertion("beforeBegin"), {
    initializeRange: function() {
        this.range.setStartBefore(this.element)
    },
    insertContent: function(e) {
        e.each(function(e) {
            this.element.parentNode.insertBefore(e, this.element)
        }
        .bind(this))
    }
}),
Insertion.Top = Class.create(),
Insertion.Top.prototype = Object.extend(new Abstract.Insertion("afterBegin"), {
    initializeRange: function() {
        this.range.selectNodeContents(this.element),
        this.range.collapse(!0)
    },
    insertContent: function(e) {
        e.reverse(!1).each(function(e) {
            this.element.insertBefore(e, this.element.firstChild)
        }
        .bind(this))
    }
}),
Insertion.Bottom = Class.create(),
Insertion.Bottom.prototype = Object.extend(new Abstract.Insertion("beforeEnd"), {
    initializeRange: function() {
        this.range.selectNodeContents(this.element),
        this.range.collapse(this.element)
    },
    insertContent: function(e) {
        e.each(function(e) {
            this.element.appendChild(e)
        }
        .bind(this))
    }
}),
Insertion.After = Class.create(),
Insertion.After.prototype = Object.extend(new Abstract.Insertion("afterEnd"), {
    initializeRange: function() {
        this.range.setStartAfter(this.element)
    },
    insertContent: function(e) {
        e.each(function(e) {
            this.element.parentNode.insertBefore(e, this.element.nextSibling)
        }
        .bind(this))
    }
}),
Element.ClassNames = Class.create(),
Element.ClassNames.prototype = {
    initialize: function(e) {
        this.element = $(e)
    },
    _each: function(e) {
        this.element.className.split(/\s+/).select(function(e) {
            return 0 < e.length
        })._each(e)
    },
    set: function(e) {
        this.element.className = e
    },
    add: function(e) {
        this.include(e) || this.set($A(this).concat(e).join(" "))
    },
    remove: function(e) {
        this.include(e) && this.set($A(this).without(e).join(" "))
    },
    toString: function() {
        return $A(this).join(" ")
    }
},
Object.extend(Element.ClassNames.prototype, Enumerable);
var Selector = Class.create();
Selector.prototype = {
    initialize: function(e) {
        this.params = {
            classNames: []
        },
        this.expression = e.toString().strip(),
        this.parseExpression(),
        this.compileMatcher()
    },
    parseExpression: function() {
        function e(e) {
            throw "Parse error in selector: " + e
        }
        "" == this.expression && e("empty expression");
        for (var t, n, r, i, s = this.params, o = this.expression; t = o.match(/^(.*)\[([a-z0-9_:-]+?)(?:([~\|!]?=)(?:"([^"]*)"|([^\]\s]*)))?\]$/i); )
            s.attributes = s.attributes || [],
            s.attributes.push({
                name: t[2],
                operator: t[3],
                value: t[4] || t[5] || ""
            }),
            o = t[1];
        if ("*" == o)
            return this.params.wildcard = !0;
        for (; t = o.match(/^([^a-z0-9_-])?([a-z0-9_-]+)(.*)/i); ) {
            switch (n = t[1],
            r = t[2],
            i = t[3],
            n) {
            case "#":
                s.id = r;
                break;
            case ".":
                s.classNames.push(r);
                break;
            case "":
            case undefined:
                s.tagName = r.toUpperCase();
                break;
            default:
                e(o.inspect())
            }
            o = i
        }
        0 < o.length && e(o.inspect())
    },
    buildMatchExpression: function() {
        var e, t = this.params, r = [];
        if (t.wildcard && r.push("true"),
        (e = t.id) && r.push('element.readAttribute("id") == ' + e.inspect()),
        (e = t.tagName) && r.push("element.tagName.toUpperCase() == " + e.inspect()),
        0 < (e = t.classNames).length)
            for (var n = 0, i = e.length; n < i; n++)
                r.push("element.hasClassName(" + e[n].inspect() + ")");
        return (e = t.attributes) && e.each(function(e) {
            var t = "element.readAttribute(" + e.name.inspect() + ")"
              , n = function(e) {
                return t + " && " + t + ".split(" + e.inspect() + ")"
            };
            switch (e.operator) {
            case "=":
                r.push(t + " == " + e.value.inspect());
                break;
            case "~=":
                r.push(n(" ") + ".include(" + e.value.inspect() + ")");
                break;
            case "|=":
                r.push(n("-") + ".first().toUpperCase() == " + e.value.toUpperCase().inspect());
                break;
            case "!=":
                r.push(t + " != " + e.value.inspect());
                break;
            case "":
            case undefined:
                r.push("element.hasAttribute(" + e.name.inspect() + ")");
                break;
            default:
                throw "Unknown operator " + e.operator + " in selector"
            }
        }),
        r.join(" && ")
    },
    compileMatcher: function() {
        this.match = new Function("element","if (!element.tagName) return false;       element = $(element);       return " + this.buildMatchExpression())
    },
    findElements: function(e) {
        var t;
        if ((t = $(this.params.id)) && this.match(t) && (!e || Element.childOf(t, e)))
            return [t];
        for (var n = [], r = 0, i = (e = (e || document).getElementsByTagName(this.params.tagName || "*")).length; r < i; r++)
            this.match(t = e[r]) && n.push(Element.extend(t));
        return n
    },
    toString: function() {
        return this.expression
    }
},
Object.extend(Selector, {
    matchElements: function(e, t) {
        var n = new Selector(t);
        return e.select(n.match.bind(n)).map(Element.extend)
    },
    findElement: function(e, t, n) {
        return "number" == typeof t && (n = t,
        t = !1),
        Selector.matchElements(e, t || "*")[n || 0]
    },
    findChildElements: function(r, e) {
        return e.map(function(e) {
            return e.match(/[^\s"]+(?:"[^"]*"[^\s"]+)*/g).inject([null], function(e, t) {
                var n = new Selector(t);
                return e.inject([], function(e, t) {
                    return e.concat(n.findElements(t || r))
                })
            })
        }).flatten()
    }
});
var Form = {
    reset: function(e) {
        return $(e).reset(),
        e
    },
    serializeElements: function(e, t) {
        var n = e.inject({}, function(e, t) {
            if (!t.disabled && t.name) {
                var n = t.name
                  , r = $(t).getValue();
                r != undefined && (e[n] ? (e[n].constructor != Array && (e[n] = [e[n]]),
                e[n].push(r)) : e[n] = r)
            }
            return e
        });
        return t ? n : Hash.toQueryString(n)
    }
};
Form.Methods = {
    serialize: function(e, t) {
        return Form.serializeElements(Form.getElements(e), t)
    },
    getElements: function(e) {
        return $A($(e).getElementsByTagName("*")).inject([], function(e, t) {
            return Form.Element.Serializers[t.tagName.toLowerCase()] && e.push(Element.extend(t)),
            e
        })
    },
    getInputs: function(e, t, n) {
        var r = (e = $(e)).getElementsByTagName("input");
        if (!t && !n)
            return $A(r).map(Element.extend);
        for (var i = 0, s = [], o = r.length; i < o; i++) {
            var a = r[i];
            t && a.type != t || n && a.name != n || s.push(Element.extend(a))
        }
        return s
    },
    disable: function(e) {
        return (e = $(e)).getElements().each(function(e) {
            e.blur(),
            e.disabled = "true"
        }),
        e
    },
    enable: function(e) {
        return (e = $(e)).getElements().each(function(e) {
            e.disabled = ""
        }),
        e
    },
    findFirstElement: function(e) {
        return $(e).getElements().find(function(e) {
            return "hidden" != e.type && !e.disabled && ["input", "select", "textarea"].include(e.tagName.toLowerCase())
        })
    },
    focusFirstElement: function(e) {
        return (e = $(e)).findFirstElement().activate(),
        e
    }
},
Object.extend(Form, Form.Methods),
Form.Element = {
    focus: function(e) {
        return $(e).focus(),
        e
    },
    select: function(e) {
        return $(e).select(),
        e
    }
},
Form.Element.Methods = {
    serialize: function(e) {
        if (!(e = $(e)).disabled && e.name) {
            var t = e.getValue();
            if (t != undefined) {
                var n = {};
                return n[e.name] = t,
                Hash.toQueryString(n)
            }
        }
        return ""
    },
    getValue: function(e) {
        var t = (e = $(e)).tagName.toLowerCase();
        return Form.Element.Serializers[t](e)
    },
    clear: function(e) {
        return $(e).value = "",
        e
    },
    present: function(e) {
        return "" != $(e).value
    },
    activate: function(e) {
        return (e = $(e)).focus(),
        !e.select || "input" == e.tagName.toLowerCase() && ["button", "reset", "submit"].include(e.type) || e.select(),
        e
    },
    disable: function(e) {
        return (e = $(e)).disabled = !0,
        e
    },
    enable: function(e) {
        return (e = $(e)).blur(),
        e.disabled = !1,
        e
    }
},
Object.extend(Form.Element, Form.Element.Methods);
var Field = Form.Element
  , $F = Form.Element.getValue;
if (Form.Element.Serializers = {
    input: function(e) {
        switch (e.type.toLowerCase()) {
        case "checkbox":
        case "radio":
            return Form.Element.Serializers.inputSelector(e);
        default:
            return Form.Element.Serializers.textarea(e)
        }
    },
    inputSelector: function(e) {
        return e.checked ? e.value : null
    },
    textarea: function(e) {
        return e.value
    },
    select: function(e) {
        return this["select-one" == e.type ? "selectOne" : "selectMany"](e)
    },
    selectOne: function(e) {
        var t = e.selectedIndex;
        return 0 <= t ? this.optionValue(e.options[t]) : null
    },
    selectMany: function(e) {
        var t = e.length;
        if (!t)
            return null;
        for (var n = 0, r = []; n < t; n++) {
            var i = e.options[n];
            i.selected && r.push(this.optionValue(i))
        }
        return r
    },
    optionValue: function(e) {
        return Element.extend(e).hasAttribute("value") ? e.value : e.text
    }
},
Abstract.TimedObserver = function() {}
,
Abstract.TimedObserver.prototype = {
    initialize: function(e, t, n) {
        this.frequency = t,
        this.element = $(e),
        this.callback = n,
        this.lastValue = this.getValue(),
        this.registerCallback()
    },
    registerCallback: function() {
        setInterval(this.onTimerEvent.bind(this), 1e3 * this.frequency)
    },
    onTimerEvent: function() {
        var e = this.getValue();
        ("string" == typeof this.lastValue && "string" == typeof e ? this.lastValue != e : String(this.lastValue) != String(e)) && (this.callback(this.element, e),
        this.lastValue = e)
    }
},
Form.Element.Observer = Class.create(),
Form.Element.Observer.prototype = Object.extend(new Abstract.TimedObserver, {
    getValue: function() {
        return Form.Element.getValue(this.element)
    }
}),
Form.Observer = Class.create(),
Form.Observer.prototype = Object.extend(new Abstract.TimedObserver, {
    getValue: function() {
        return Form.serialize(this.element)
    }
}),
Abstract.EventObserver = function() {}
,
Abstract.EventObserver.prototype = {
    initialize: function(e, t) {
        this.element = $(e),
        this.callback = t,
        this.lastValue = this.getValue(),
        "form" == this.element.tagName.toLowerCase() ? this.registerFormCallbacks() : this.registerCallback(this.element)
    },
    onElementEvent: function() {
        var e = this.getValue();
        this.lastValue != e && (this.callback(this.element, e),
        this.lastValue = e)
    },
    registerFormCallbacks: function() {
        Form.getElements(this.element).each(this.registerCallback.bind(this))
    },
    registerCallback: function(e) {
        if (e.type)
            switch (e.type.toLowerCase()) {
            case "checkbox":
            case "radio":
                Event.observe(e, "click", this.onElementEvent.bind(this));
                break;
            default:
                Event.observe(e, "change", this.onElementEvent.bind(this))
            }
    }
},
Form.Element.EventObserver = Class.create(),
Form.Element.EventObserver.prototype = Object.extend(new Abstract.EventObserver, {
    getValue: function() {
        return Form.Element.getValue(this.element)
    }
}),
Form.EventObserver = Class.create(),
Form.EventObserver.prototype = Object.extend(new Abstract.EventObserver, {
    getValue: function() {
        return Form.serialize(this.element)
    }
}),
!window.Event)
    var Event = new Object;
Object.extend(Event, {
    KEY_BACKSPACE: 8,
    KEY_TAB: 9,
    KEY_RETURN: 13,
    KEY_ESC: 27,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_DELETE: 46,
    KEY_HOME: 36,
    KEY_END: 35,
    KEY_PAGEUP: 33,
    KEY_PAGEDOWN: 34,
    element: function(e) {
        return e.target || e.srcElement
    },
    isLeftClick: function(e) {
        return e.which && 1 == e.which || e.button && 1 == e.button
    },
    pointerX: function(e) {
        return e.pageX || e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)
    },
    pointerY: function(e) {
        return e.pageY || e.clientY + (document.documentElement.scrollTop || document.body.scrollTop)
    },
    stop: function(e) {
        e.preventDefault ? (e.preventDefault(),
        e.stopPropagation()) : (e.returnValue = !1,
        e.cancelBubble = !0)
    },
    findElement: function(e, t) {
        for (var n = Event.element(e); n.parentNode && (!n.tagName || n.tagName.toUpperCase() != t.toUpperCase()); )
            n = n.parentNode;
        return n
    },
    observers: !1,
    _observeAndCache: function(e, t, n, r) {
        this.observers || (this.observers = []),
        e.addEventListener ? (this.observers.push([e, t, n, r]),
        e.addEventListener(t, n, r)) : e.attachEvent && (this.observers.push([e, t, n, r]),
        e.attachEvent("on" + t, n))
    },
    unloadCache: function() {
        if (Event.observers) {
            for (var e = 0, t = Event.observers.length; e < t; e++)
                Event.stopObserving.apply(this, Event.observers[e]),
                Event.observers[e][0] = null;
            Event.observers = !1
        }
    },
    observe: function(e, t, n, r) {
        e = $(e),
        r = r || !1,
        "keypress" == t && (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || e.attachEvent) && (t = "keydown"),
        Event._observeAndCache(e, t, n, r)
    },
    stopObserving: function(e, t, n, r) {
        if (e = $(e),
        r = r || !1,
        "keypress" == t && (navigator.appVersion.match(/Konqueror|Safari|KHTML/) || e.detachEvent) && (t = "keydown"),
        e.removeEventListener)
            e.removeEventListener(t, n, r);
        else if (e.detachEvent)
            try {
                e.detachEvent("on" + t, n)
            } catch (i) {}
    }
}),
navigator.appVersion.match(/\bMSIE\b/) && Event.observe(window, "unload", Event.unloadCache, !1);
var Position = {
    includeScrollOffsets: !1,
    prepare: function() {
        this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
        this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    },
    realOffset: function(e) {
        for (var t = 0, n = 0; t += e.scrollTop || 0,
        n += e.scrollLeft || 0,
        e = e.parentNode; )
            ;
        return [n, t]
    },
    cumulativeOffset: function(e) {
        for (var t = 0, n = 0; t += e.offsetTop || 0,
        n += e.offsetLeft || 0,
        e = e.offsetParent; )
            ;
        return [n, t]
    },
    positionedOffset: function(e) {
        var t = 0
          , n = 0;
        do {
            if (t += e.offsetTop || 0,
            n += e.offsetLeft || 0,
            e = e.offsetParent) {
                if ("BODY" == e.tagName)
                    break;
                var r = Element.getStyle(e, "position");
                if ("relative" == r || "absolute" == r)
                    break
            }
        } while (e);
        return [n, t]
    },
    offsetParent: function(e) {
        if (e.offsetParent)
            return e.offsetParent;
        if (e == document.body)
            return e;
        for (; (e = e.parentNode) && e != document.body; )
            if ("static" != Element.getStyle(e, "position"))
                return e;
        return document.body
    },
    within: function(e, t, n) {
        return this.includeScrollOffsets ? this.withinIncludingScrolloffsets(e, t, n) : (this.xcomp = t,
        this.ycomp = n,
        this.offset = this.cumulativeOffset(e),
        n >= this.offset[1] && n < this.offset[1] + e.offsetHeight && t >= this.offset[0] && t < this.offset[0] + e.offsetWidth)
    },
    withinIncludingScrolloffsets: function(e, t, n) {
        var r = this.realOffset(e);
        return this.xcomp = t + r[0] - this.deltaX,
        this.ycomp = n + r[1] - this.deltaY,
        this.offset = this.cumulativeOffset(e),
        this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + e.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + e.offsetWidth
    },
    overlap: function(e, t) {
        return e ? "vertical" == e ? (this.offset[1] + t.offsetHeight - this.ycomp) / t.offsetHeight : "horizontal" == e ? (this.offset[0] + t.offsetWidth - this.xcomp) / t.offsetWidth : void 0 : 0
    },
    page: function(e) {
        var t = 0
          , n = 0
          , r = e;
        do {
            if (t += r.offsetTop || 0,
            n += r.offsetLeft || 0,
            r.offsetParent == document.body && "absolute" == Element.getStyle(r, "position"))
                break
        } while (r = r.offsetParent);
        for (r = e; window.opera && "BODY" != r.tagName || (t -= r.scrollTop || 0,
        n -= r.scrollLeft || 0),
        r = r.parentNode; )
            ;
        return [n, t]
    },
    clone: function(e, t, n) {
        var r = Object.extend({
            setLeft: !0,
            setTop: !0,
            setWidth: !0,
            setHeight: !0,
            offsetTop: 0,
            offsetLeft: 0
        }, n || {});
        e = $(e);
        var i = Position.page(e);
        t = $(t);
        var s = [0, 0]
          , o = null;
        "absolute" == Element.getStyle(t, "position") && (o = Position.offsetParent(t),
        s = Position.page(o)),
        o == document.body && (s[0] -= document.body.offsetLeft,
        s[1] -= document.body.offsetTop),
        r.setLeft && (t.style.left = i[0] - s[0] + r.offsetLeft + "px"),
        r.setTop && (t.style.top = i[1] - s[1] + r.offsetTop + "px"),
        r.setWidth && (t.style.width = e.offsetWidth + "px"),
        r.setHeight && (t.style.height = e.offsetHeight + "px")
    },
    absolutize: function(e) {
        if ("absolute" != (e = $(e)).style.position) {
            Position.prepare();
            var t = Position.positionedOffset(e)
              , n = t[1]
              , r = t[0]
              , i = e.clientWidth
              , s = e.clientHeight;
            e._originalLeft = r - parseFloat(e.style.left || 0),
            e._originalTop = n - parseFloat(e.style.top || 0),
            e._originalWidth = e.style.width,
            e._originalHeight = e.style.height,
            e.style.position = "absolute",
            e.style.top = n + "px",
            e.style.left = r + "px",
            e.style.width = i + "px",
            e.style.height = s + "px"
        }
    },
    relativize: function(e) {
        if ("relative" != (e = $(e)).style.position) {
            Position.prepare(),
            e.style.position = "relative";
            var t = parseFloat(e.style.top || 0) - (e._originalTop || 0)
              , n = parseFloat(e.style.left || 0) - (e._originalLeft || 0);
            e.style.top = t + "px",
            e.style.left = n + "px",
            e.style.height = e._originalHeight,
            e.style.width = e._originalWidth
        }
    }
};
/Konqueror|Safari|KHTML/.test(navigator.userAgent) && (Position.cumulativeOffset = function(e) {
    var t = 0
      , n = 0;
    do {
        if (t += e.offsetTop || 0,
        n += e.offsetLeft || 0,
        e.offsetParent == document.body && "absolute" == Element.getStyle(e, "position"))
            break;
        e = e.offsetParent
    } while (e);
    return [n, t]
}
),
Element.addMethods(),
shortcut = {
    all_shortcuts: {},
    add: function(u, l, h) {
        var e = {
            type: "keydown",
            propagate: !1,
            disable_in_input: !1,
            target: document,
            keycode: !1
        };
        if (h)
            for (var t in e)
                "undefined" == typeof h[t] && (h[t] = e[t]);
        else
            h = e;
        var n = h.target;
        "string" == typeof h.target && (n = document.getElementById(h.target));
        u = u.toLowerCase();
        var r = function(e) {
            var t;
            if ((e = e || window.event,
            h.disable_in_input) && (e.target ? t = e.target : e.srcElement && (t = e.srcElement),
            3 == t.nodeType && (t = t.parentNode),
            "INPUT" == t.tagName || "TEXTAREA" == t.tagName))
                return;
            e.keyCode ? code = e.keyCode : e.which && (code = e.which);
            var n = String.fromCharCode(code).toLowerCase();
            188 == code && (n = ","),
            190 == code && (n = ".");
            var r = u.split("+")
              , i = 0
              , s = {
                "`": "~",
                1: "!",
                2: "@",
                3: "#",
                4: "$",
                5: "%",
                6: "^",
                7: "&",
                8: "*",
                9: "(",
                0: ")",
                "-": "_",
                "=": "+",
                ";": ":",
                "'": '"',
                ",": "<",
                ".": ">",
                "/": "?",
                "\\": "|"
            }
              , o = {
                esc: 27,
                escape: 27,
                tab: 9,
                space: 32,
                "return": 13,
                enter: 13,
                backspace: 8,
                scrolllock: 145,
                scroll_lock: 145,
                scroll: 145,
                capslock: 20,
                caps_lock: 20,
                caps: 20,
                numlock: 144,
                num_lock: 144,
                num: 144,
                pause: 19,
                "break": 19,
                insert: 45,
                home: 36,
                "delete": 46,
                end: 35,
                pageup: 33,
                page_up: 33,
                pu: 33,
                pagedown: 34,
                page_down: 34,
                pd: 34,
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                f1: 112,
                f2: 113,
                f3: 114,
                f4: 115,
                f5: 116,
                f6: 117,
                f7: 118,
                f8: 119,
                f9: 120,
                f10: 121,
                f11: 122,
                f12: 123
            }
              , a = {
                shift: {
                    wanted: !1,
                    pressed: !1
                },
                ctrl: {
                    wanted: !1,
                    pressed: !1
                },
                alt: {
                    wanted: !1,
                    pressed: !1
                },
                meta: {
                    wanted: !1,
                    pressed: !1
                }
            };
            e.ctrlKey && (a.ctrl.pressed = !0),
            e.shiftKey && (a.shift.pressed = !0),
            e.altKey && (a.alt.pressed = !0),
            e.metaKey && (a.meta.pressed = !0);
            for (var c = 0; k = r[c],
            c < r.length; c++)
                "ctrl" == k || "control" == k ? (i++,
                a.ctrl.wanted = !0) : "shift" == k ? (i++,
                a.shift.wanted = !0) : "alt" == k ? (i++,
                a.alt.wanted = !0) : "meta" == k ? (i++,
                a.meta.wanted = !0) : 1 < k.length ? o[k] == code && i++ : h.keycode ? h.keycode == code && i++ : n == k ? i++ : s[n] && e.shiftKey && (n = s[n]) == k && i++;
            if (i == r.length && a.ctrl.pressed == a.ctrl.wanted && a.shift.pressed == a.shift.wanted && a.alt.pressed == a.alt.wanted && a.meta.pressed == a.meta.wanted && (l(e),
            !h.propagate))
                return e.cancelBubble = !0,
                e.returnValue = !1,
                e.stopPropagation && (e.stopPropagation(),
                e.preventDefault()),
                !1
        };
        this.all_shortcuts[u] = {
            callback: r,
            target: n,
            event: h.type
        },
        n.addEventListener ? n.addEventListener(h.type, r, !1) : n.attachEvent ? n.attachEvent("on" + h.type, r) : n["on" + h.type] = r
    },
    remove: function(e) {
        e = e.toLowerCase();
        var t = this.all_shortcuts[e];
        if (delete this.all_shortcuts[e],
        t) {
            var n = t.event
              , r = t.target
              , i = t.callback;
            r.detachEvent ? r.detachEvent("on" + n, i) : r.removeEventListener ? r.removeEventListener(n, i, !1) : r["on" + n] = !1
        }
    }
};
var Vendor = new Object;
Vendor.insertContent = function(e, t) {
    if (myField = document.getElementById(e),
    document.selection)
        myField.focus(),
        sel = document.selection.createRange(),
        sel.text = t,
        myField.focus();
    else if (myField.selectionStart || "0" == myField.selectionStart) {
        var n = myField.selectionStart
          , r = myField.selectionEnd
          , i = myField.scrollTop;
        myField.value = myField.value.substring(0, n) + t + myField.value.substring(r, myField.value.length),
        myField.focus(),
        myField.selectionStart = n + t.length,
        myField.selectionEnd = n + t.length,
        myField.scrollTop = i
    } else
        myField.value += t,
        myField.focus()
}
,
Vendor.copyToClipboard = function(e) {
    if (e.createTextRange) {
        var t = e.createTextRange();
        t && t.execCommand("Copy")
    } else {
        var n = "flashcopier";
        if (!document.getElementById(n)) {
            var r = document.createElement("div");
            r.id = n,
            document.body.appendChild(r)
        }
        document.getElementById(n).innerHTML = "";
        var i = '<embed src="/images/_clipboard.swf" FlashVars="clipboard=' + encodeURIComponent(e) + '" width="0" height="0" type="application/x-shockwave-flash"></embed>';
        document.getElementById(n).innerHTML = i
    }
}
;
var Rubular = {
    lastMessageSent: 0,
    lastMessageReceived: -1,
    testStringHasFocus: !1,
    inErrorState: !1,
    defaultRequestHeaders: function() {
        return {
            asynchronous: !0,
            evalScripts: !0
        }
    },
    example: function() {
        var e = new Date;
        $("regex").value = "(?<month>\\d{1,2})\\/(?<day>\\d{1,2})\\/(?<year>\\d{4})",
        $("test").value = "Today's date is: " + (e.getMonth() + 1) + "/" + e.getDate() + "/" + e.getFullYear() + "."
    },
    clearFields: function(e, t, n) {
        $("regex").value = Rubular.useIfDefined(e),
        $("options").value = Rubular.useIfDefined(t),
        $("test").value = Rubular.useIfDefined(n)
    },
    useIfDefined: function(e) {
        return void 0 === e ? "" : e
    },
    showSpinner: function() {
        $("ajax_loader_wrapper").show()
    },
    hideSpinner: function() {
        $("ajax_loader_wrapper").hide()
    },
    testRegex: function(e, t, n) {
        var r = Object.extend({
            force: !1
        }, n || {});
        if (!(this.isEditorEmpty() || this.inErrorState && !r.force)) {
            this.showSpinner();
            var i = ++this.lastMessageSent;
            this.pendingRequest && this.pendingRequest.transport && 4 != this.pendingRequest.transport.readyState && (this.pendingRequest.transport.abort(),
            this.pendingRequest = null),
            this.pendingRequest = new Ajax.Request("https://rubular.com/regex/do_test?message_id=" + i,Object.extend(this.defaultRequestHeaders(), {
                parameters: t,
                on0: this.onRegexParseError.bind(this, i),
                onFailure: this.onRegexParseError.bind(this, i)
            }))
        }
    },
    onRegexParseError: function(e) {
        this.lastMessageSent == e && (this.recordLastMessageReceived(e),
        this.handleParseError("Oops, there was an error handling your regex. We'll try again in a few seconds."))
    },
    handleParseResult: function(e) {
        this.lastMessageSent == e.message_id && (this.recordLastMessageReceived(e.message_id),
        e.retry ? this.handleParseError(e.error_message) : (Element.update("result", e.html),
        this.handleParseSuccess()))
    },
    recordLastMessageReceived: function(e) {
        this.lastMessageReceived = e
    },
    handleParseSuccess: function() {
        this.inErrorState = !1,
        this.hideSpinner(),
        this.clearNotice()
    },
    handleParseError: function(e) {
        this.showNotice(e, {
            fade: !1
        }),
        this.inErrorState = !0,
        this.scheduleAutoRetry()
    },
    scheduleAutoRetry: function() {
        this.hideSpinner(),
        setTimeout(function() {
            this.showNotice("Ok, trying again...", {
                fade: !1
            }),
            this.showSpinner(),
            setTimeout(function() {
                this.testRegex($("test_form"), Form.serialize("test_form"), {
                    force: !0
                })
            }
            .bind(this), 3e3)
        }
        .bind(this), 6e3)
    },
    isEditorEmpty: function() {
        return $("start_instructions") && ("" == $("regex").value || "" == $("test").value)
    },
    insertTab: function() {
        Vendor.insertContent("test", String.fromCharCode(9))
    },
    copyRegexToClipboard: function() {
        if ("" == $("regex").value)
            this.showNotice("Enter a regular expression first!");
        else {
            var e = "/" + $F("regex") + "/" + $F("options");
            Vendor.copyToClipboard(e),
            this.showNotice("Your regex has been copied to your clipboard!")
        }
    },
    showNotice: function(e, t) {
        var n = {
            fade: !0
        };
        Object.extend(n, t || {});
        var r = $("ajax_note");
        r.innerHTML = e,
        r.show(),
        n.fade && setTimeout(function() {
            r.innerHTML == e && this.clearNotice()
        }, 6e3 + 10 * e.length)
    },
    clearNotice: function() {
        $("ajax_note").innerHTML = "",
        $("ajax_note").hide()
    },
    makePermalink: function() {
        this.isEditorEmpty() ? this.showNotice("To create a permalink, first enter a regular expression and a test string.") : new Ajax.Request("/regex/make_permalink",Object.extend(this.defaultRequestHeaders(), {
            parameters: Form.serialize("test_form"),
            onFailure: this.onRegexParseError
        }))
    }
};
Event.observe(window, "load", function() {
    shortcut.add("Control+Shift+S", function() {
        Rubular.testStringHasFocus && Rubular.insertTab()
    }),
    $("test_form").getElements().each(function(e) {
        Event.observe(e, "focus", function(e) {
            Rubular.testStringHasFocus = "test" == Event.element(e).id
        })
    }),
    new Form.Observer("test_form",.2,function(e, t) {
        Rubular.testRegex(e, t)
    }
    )
});
