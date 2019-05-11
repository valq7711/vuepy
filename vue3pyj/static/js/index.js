(function(){
"use strict";
var ՐՏ_5;
function ՐՏ_in(val, arr) {
    if (typeof arr.indexOf === "function") {
        return arr.indexOf(val) !== -1;
    }
    return arr.hasOwnProperty(val);
}
function ՐՏ_Iterable(iterable) {
    var tmp;
    if (iterable.constructor === [].constructor || iterable.constructor === "".constructor || (tmp = Array.prototype.slice.call(iterable)).length) {
        return tmp || iterable;
    }
    return Object.keys(iterable);
}
function ՐՏ_print() {
    if (typeof console === "object") {
        console.log.apply(console, arguments);
    }
}
function range(start, stop, step) {
    var length, idx, range;
    if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
    }
    step = arguments[2] || 1;
    length = Math.max(Math.ceil((stop - start) / step), 0);
    idx = 0;
    range = new Array(length);
    while (idx < length) {
        range[idx++] = start;
        start += step;
    }
    return range;
}
function ՐՏ_type(obj) {
    return obj && obj.constructor && obj.constructor.name ? obj.constructor.name : Object.prototype.toString.call(obj).slice(8, -1);
}
function ՐՏ_eq(a, b) {
    var ՐՏitr6, ՐՏidx6;
    var i;
    if (a === b) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b) || a instanceof Object && b instanceof Object) {
        if (a.constructor !== b.constructor || a.length !== b.length) {
            return false;
        }
        if (Array.isArray(a)) {
            for (i = 0; i < a.length; i++) {
                if (!ՐՏ_eq(a[i], b[i])) {
                    return false;
                }
            }
        } else {
            if (Object.keys(a).length !== Object.keys(b).length) {
                return false;
            }
            ՐՏitr6 = ՐՏ_Iterable(a);
            for (ՐՏidx6 = 0; ՐՏidx6 < ՐՏitr6.length; ՐՏidx6++) {
                i = ՐՏitr6[ՐՏidx6];
                if (!ՐՏ_eq(a[i], b[i])) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}
var ՐՏ_modules = {};
ՐՏ_modules["asset"] = {};
ՐՏ_modules["asset.fs_path"] = {};
ՐՏ_modules["asset.common"] = {};
ՐՏ_modules["asset.rs_require"] = {};
ՐՏ_modules["load_js"] = {};

(function(){
    var __name__ = "asset";

    ՐՏ_modules["asset"]["fs_path"] = ՐՏ_modules["asset.fs_path"];

    ՐՏ_modules["asset"]["common"] = ՐՏ_modules["asset.common"];

    ՐՏ_modules["asset"]["rs_require"] = ՐՏ_modules["asset.rs_require"];
})();

(function(){
    var __name__ = "asset.fs_path";
    var RE_FP_INFO;
    RE_FP_INFO = /^((.*?\/)?([^\/]+?))(\.([^\.]+))?$/;
    function is_valid_name(name) {
        return /^(\.\w|\w)(\w|\.)*/.test(name);
    }
    function to_arr(path) {
        var ՐՏitr1, ՐՏidx1;
        var dirs, beg, d;
        if (path === "" || path === "/") {
            return [ "" ];
        }
        dirs = path.split("/");
        if (dirs[dirs.length-1] === "") {
            dirs = dirs.slice(0, -1);
        }
        beg = dirs[0] === "" ? 1 : 0;
        ՐՏitr1 = ՐՏ_Iterable(dirs.slice(beg));
        for (ՐՏidx1 = 0; ՐՏidx1 < ՐՏitr1.length; ՐՏidx1++) {
            d = ՐՏitr1[ՐՏidx1];
            if (!(d === ".." || is_valid_name(d))) {
                throw new Error("Bad path: " + path);
            }
        }
        return dirs;
    }
    function path_arr_resolve(arr, allow_out_root) {
        var ՐՏitr2, ՐՏidx2;
        var i, ret, path_start, it;
        i = 0;
        ret = [];
        path_start = 0;
        ՐՏitr2 = ՐՏ_Iterable(arr);
        for (ՐՏidx2 = 0; ՐՏidx2 < ՐՏitr2.length; ՐՏidx2++) {
            it = ՐՏitr2[ՐՏidx2];
            if (it === "") {
                ret[0] = "";
                i = 1;
                path_start = 1;
                continue;
            } else if (it === "..") {
                --i;
                if (i >= path_start) {
                    continue;
                } else if (!allow_out_root) {
                    throw new Error("Out of root dir");
                } else {
                    ret.unshift("..");
                    ++path_start;
                    i += 2;
                    continue;
                }
            }
            ret[i] = it;
            ++i;
        }
        return ret.slice(0, i);
    }
    function path_join() {
        var ՐՏitr3, ՐՏidx3;
        var arr, p_str;
        arr = [];
        ՐՏitr3 = ՐՏ_Iterable(arguments);
        for (ՐՏidx3 = 0; ՐՏidx3 < ՐՏitr3.length; ՐՏidx3++) {
            p_str = ՐՏitr3[ՐՏidx3];
            if (p_str) {
                Array.prototype.push.apply(arr, to_arr(p_str));
            }
        }
        return path_arr_resolve(arr).join("/");
    }
    function rel_path_join() {
        var ՐՏitr4, ՐՏidx4;
        var arr, p_str;
        arr = [];
        ՐՏitr4 = ՐՏ_Iterable(arguments);
        for (ՐՏidx4 = 0; ՐՏidx4 < ՐՏitr4.length; ՐՏidx4++) {
            p_str = ՐՏitr4[ՐՏidx4];
            if (p_str) {
                Array.prototype.push.apply(arr, to_arr(p_str));
            }
        }
        return path_arr_resolve(arr, true).join("/");
    }
    function path_split(pth) {
        var fp_info, ret;
        fp_info = RE_FP_INFO.exec(pth);
        ret = {
            fpath_no_ext: fp_info[1],
            dir: fp_info[2],
            fname_no_ext: fp_info[3],
            ext: fp_info[5]
        };
        ret.tail = ret.fname = ret.ext ? ret.fname_no_ext + "." + ret.ext : ret.fname_no_ext;
        return ret;
    }
    ՐՏ_modules["asset.fs_path"]["RE_FP_INFO"] = RE_FP_INFO;

    ՐՏ_modules["asset.fs_path"]["is_valid_name"] = is_valid_name;

    ՐՏ_modules["asset.fs_path"]["to_arr"] = to_arr;

    ՐՏ_modules["asset.fs_path"]["path_arr_resolve"] = path_arr_resolve;

    ՐՏ_modules["asset.fs_path"]["path_join"] = path_join;

    ՐՏ_modules["asset.fs_path"]["rel_path_join"] = rel_path_join;

    ՐՏ_modules["asset.fs_path"]["path_split"] = path_split;
})();

(function(){
    var __name__ = "asset.common";
    function asyncer(fun) {
        var ctx, ret;
        ctx = {
            self: void 0,
            args: void 0
        };
        function pret(ok, err) {
            function inner(f, ret_v) {
                var v;
                try {
                    f = f || fun.apply(ctx.self, ctx.args);
                    v = f.next(ret_v);
                } catch (ՐՏ_Exception) {
                    var e = ՐՏ_Exception;
                    err(e);
                }
                if (!v.done) {
                    if (v.value instanceof Promise) {
                        v.value.then(function(ret_v) {
                            inner(f, ret_v);
                        }, function(e) {
                            try {
                                f.throw(e);
                            } catch (ՐՏ_Exception) {
                                var e = ՐՏ_Exception;
                                err(e);
                            }
                        });
                    } else {
                        Promise.resolve(v.value).then(function(ret_v) {
                            inner(f, ret_v);
                        });
                    }
                } else {
                    ok(v.value);
                }
            }
            inner();
        }
        ret = function() {
            ctx.self = this;
            ctx.args = arguments;
            return new Promise(pret);
        };
        ret.__name__ = fun.__name__ || fun.name;
        return ret;
    }
    function upload_text() {
        function prom(ok, err) {
            var el, ret;
            el = document.createElement("input");
            el.setAttribute("type", "file");
            el.setAttribute("multiple", true);
            el.style.display = "none";
            document.body.appendChild(el);
            ret = [];
            el.onchange = function() {
                var done, i, fr;
                done = el.files.length;
                for (i = 0; i < el.files.length; i++) {
                    fr = new FileReader();
                    fr._filename_ = el.files[i].name;
                    fr.onloadend = function(s) {
                        ret.push({
                            name: s.target._filename_,
                            value: s.target.result
                        });
                        --done;
                        if (done === 0) {
                            ok(ret);
                        }
                    };
                    fr.readAsText(el.files[i]);
                }
            };
            el.click();
            document.body.removeChild(el);
        }
        return new Promise(prom);
    }
    function download(s, filename, mime) {
        var blob, el_data, el;
        blob = new Blob([ s ], {
            type: mime || "text/plain;charset=utf-8;"
        });
        el_data = window.URL.createObjectURL(blob);
        el = document.createElement("a");
        el.setAttribute("href", el_data);
        el.setAttribute("download", filename);
        el.style.display = "none";
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
        window.URL.revokeObjectURL(blob);
    }
    function format_num(format, num) {
        var ՐՏ_1, ՐՏ_2;
        var sign_zer_dig, flt_num, sign, zer, dot_idx;
        sign_zer_dig = /^%?(\+)?(\d+)?\.(\d+)?f$/.exec(format);
        if (sign_zer_dig) {
            flt_num = parseFloat(num);
            sign = flt_num < 0 ? "-" : sign_zer_dig[1] && flt_num > 0 ? "+" : "";
            flt_num = Math.abs(flt_num);
            if (sign_zer_dig[3]) {
                flt_num = flt_num.toFixed(parseInt(sign_zer_dig[3]));
            }
            if (sign_zer_dig[2]) {
                zer = parseInt(sign_zer_dig[2]);
                flt_num = flt_num.toString();
                dot_idx = flt_num.indexOf(".");
                dot_idx = (dot_idx !== (ՐՏ_1 = -1) && (typeof dot_idx !== "object" || !ՐՏ_eq(dot_idx, ՐՏ_1))) ? dot_idx : flt_num.length;
                if ((dot_idx !== (ՐՏ_2 = -1) && (typeof dot_idx !== "object" || !ՐՏ_eq(dot_idx, ՐՏ_2)))) {
                    if (zer - dot_idx > 0) {
                        flt_num = "0".repeat(zer - dot_idx) + flt_num;
                    }
                }
            }
            flt_num = sign + flt_num;
            return flt_num;
        } else {
            throw new Error("bad format: " + format);
        }
    }
    function SF(text, props) {
        function replacer(str_, p) {
            var t, p_chain;
            if (t = /^("|')(.+?)("|')$/.exec(p)) {
                return props[t[2]];
            }
            if ((p_chain = p.split(".")) && p_chain.length > 1) {
                return p_chain.reduce(function(it, p) {
                    return it[p];
                }, props);
            }
            return props[p];
        }
        return text.replace(/\$\{ *(.+?) *\}/g, replacer);
    }
    function _SF(s, args) {
        var splitter, arr, cntr, i, name_format;
        splitter = /(%%)|(%(?:\([a-zA-Z0-9_.]+\))?(?:(?:s)|(?:\+?\d*\.\d*f)))/;
        arr = s.split(splitter);
        cntr = 0;
        for (i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i].startsWith("%")) {
                if (arr[i] === "%%") {
                    arr[i] = "%";
                } else if (arr[i] === "%s") {
                    arr[i] = args[cntr];
                    ++cntr;
                } else if (arr[i].startsWith("%(")) {
                    name_format = /%\(([a-zA-Z0-9_.]+)\)(s|\+?\d*\.\d*f)/.exec(arr[i]);
                    if (name_format[2] === "s") {
                        arr[i] = args[name_format[1]];
                    } else {
                        arr[i] = format_num(name_format[2], args[name_format[1]]);
                    }
                } else if (/%(\+)?(\d+)?\.(\d+)?f/.test(arr[i])) {
                    arr[i] = format_num(arr[i], args[cntr]);
                    ++cntr;
                } else {
                    throw new Error("bad format: " + arr[i]);
                }
            }
        }
        return arr.join("");
    }
    class Drag_listener {
        constructor (catcher, debounce) {
            var self = this;
            self.catcher = catcher;
            self.x0 = 0;
            self.y0 = 0;
            self.dx = 0;
            self.dy = 0;
            self.vc = null;
            self.listeners = {};
            self.debounce = debounce || 50;
        }
        get_mousedn_listener () {
            var self = this;
            function _inner_(e) {
                var listeners;
                self.vc = this;
                self.x0 = e.clientX;
                self.y0 = e.clientY;
                if (!self.catcher) {
                    self.catcher = function(what, e, args) {
                        self.vc.$emit(what, e, args);
                    };
                }
                if (!(ՐՏ_in("move", self.listeners))) {
                    self.listeners = {
                        move: self.mousemove(),
                        up: self.mouseup()
                    };
                }
                listeners = self.listeners;
                document.addEventListener("mousemove", listeners.move, false);
                document.addEventListener("mouseup", listeners.up, false);
                e.stopPropagation();
                e.preventDefault();
                self.catcher("drag_start", e, {
                    x0: self.x0,
                    y0: self.y0,
                    vc: self.vc
                });
            }
            self.listeners.dn = _inner_;
            return _inner_;
        }
        mousemove () {
            var self = this;
            function _inner_(e) {
                var ՐՏ_3, ՐՏ_4;
                e.stopPropagation();
                e.preventDefault();
                function process_move() {
                    self.dx = e.clientX - self.x0;
                    self.dy = e.clientY - self.y0;
                    self.catcher("drag_move", e, {
                        dx: self.dx,
                        dy: self.dy,
                        vc: self.vc
                    });
                    _inner_.move_fired = true;
                }
                if (((ՐՏ_3 = _inner_.move_fired) === (ՐՏ_4 = void 0) || typeof ՐՏ_3 === "object" && ՐՏ_eq(ՐՏ_3, ՐՏ_4))) {
                    process_move();
                } else if (_inner_.move_fired) {
                    _inner_.move_fired = false;
                    setTimeout(process_move, self.debounce);
                }
            }
            return _inner_;
        }
        mouseup () {
            var self = this;
            function _inner_(e) {
                document.removeEventListener("mousemove", self.listeners.move);
                document.removeEventListener("mouseup", self.listeners.up);
                e.stopPropagation();
                e.preventDefault();
                self.catcher("drag_stop", e, {
                    dx: self.dx,
                    dy: self.dy,
                    vc: self.vc
                });
            }
            return _inner_;
        }
        static get_listener (catcher, debounce) {
            var obj;
            obj = new Drag_listener(catcher, debounce);
            return obj.get_mousedn_listener();
        }
    }
    function make_drag_listener(catcher, debounce) {
        var ctx;
        ctx = {
            catcher: catcher,
            x0: 0,
            y0: 0,
            dx: 0,
            dy: 0,
            vc: null,
            debounce: debounce || 50,
            move_done: null
        };
        function mousemove(e) {
            function process_move() {
                ctx.dx = e.clientX - ctx.x0;
                ctx.dy = e.clientY - ctx.y0;
                ctx.catcher.call(null, "drag_move", e, {
                    dx: ctx.dx,
                    dy: ctx.dy,
                    vc: ctx.vc
                });
                ctx.move_done = true;
            }
            e.stopPropagation();
            e.preventDefault();
            if (ctx.move_done === null) {
                process_move();
            } else if (ctx.move_done) {
                ctx.move_done = false;
                setTimeout(process_move, ctx.debounce);
            }
        }
        function mouseup(e) {
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mouseup", mouseup);
            e.stopPropagation();
            e.preventDefault();
            ctx.catcher.call(null, "drag_stop", e, {
                dx: ctx.dx,
                dy: ctx.dy,
                vc: ctx.vc
            });
        }
        function mousedn(e) {
            ctx.vc = this;
            ctx.x0 = e.clientX;
            ctx.y0 = e.clientY;
            if (!ctx.catcher) {
                ctx.catcher = function(what, e, args) {
                    ctx.vc.$emit(what, e, args);
                };
            }
            document.addEventListener("mousemove", mousemove, false);
            document.addEventListener("mouseup", mouseup, false);
            e.stopPropagation();
            e.preventDefault();
            ctx.catcher.call(null, "drag_start", e, {
                x0: ctx.x0,
                y0: ctx.y0,
                vc: ctx.vc
            });
        }
        return mousedn;
    }
    function blur_click_listener(el, cb) {
        var ret, blur;
        ret = {};
        blur = false;
        function doc_click_cap(e) {
            blur = true;
            setTimeout(function() {
                blur && cb(e);
            }, 0);
        }
        function el_click(e) {
            blur = false;
        }
        ret.start = function() {
            document.addEventListener("click", doc_click_cap, true);
            el.addEventListener("click", el_click, true);
        };
        ret.stop = function() {
            document.removeEventListener("click", doc_click_cap, true);
            el.removeEventListener("click", el_click, true);
        };
        return ret;
    }
    ՐՏ_modules["asset.common"]["asyncer"] = asyncer;

    ՐՏ_modules["asset.common"]["upload_text"] = upload_text;

    ՐՏ_modules["asset.common"]["download"] = download;

    ՐՏ_modules["asset.common"]["format_num"] = format_num;

    ՐՏ_modules["asset.common"]["SF"] = SF;

    ՐՏ_modules["asset.common"]["_SF"] = _SF;

    ՐՏ_modules["asset.common"]["Drag_listener"] = Drag_listener;

    ՐՏ_modules["asset.common"]["make_drag_listener"] = make_drag_listener;

    ՐՏ_modules["asset.common"]["blur_click_listener"] = blur_click_listener;
})();

(function(){
    var __name__ = "asset.rs_require";
    var fs_path = ՐՏ_modules["asset.fs_path"];
    
    var asyncer = ՐՏ_modules["asset.common"].asyncer;
    
    function doc_ready(arg_to_pass) {
        var p;
        p = function(ok, err) {
            document.addEventListener("readystatechange", function() {
                if (document.readyState === "complete") {
                    ok(arg_to_pass);
                }
            });
        };
        if (document.readyState === "complete") {
            return Promise.resolve(arg_to_pass);
        }
        return new Promise(p);
    }
    function prom(f) {
        var ret;
        ret = function() {
            var self, args, p;
            self = this;
            args = Array.prototype.slice.call(arguments);
            p = function(ok, err) {
                args.push(ok, err);
                f.apply(self, args);
            };
            return new Promise(p);
        };
        return ret;
    }
    var RS_require = (ՐՏ_5 = class RS_require {
        constructor (cfg) {
            var self = this;
            var define;
            self.cfg = cfg;
            self.modules = {};
            self.load_stack = [];
            define = window.define = function(req_list, mod) {
                self.define(req_list, mod);
            };
            define.amd = true;
            self.fs_path = fs_path;
        }
        mount_module (as_name, mod) {
            var self = this;
            self.modules[as_name] = mod;
        }
        define (req_list, mod) {
            var self = this;
            var mod_name, ok;
            if (ՐՏ_type(req_list) === "Function") {
                mod = req_list;
                req_list = [];
            }
            mod_name = self.load_stack[self.load_stack.length-1].name;
            ok = self.load_stack[self.load_stack.length-1].ok;
            function mount_mod(req_mods) {
                self.load_stack.pop();
                self.mount_module(mod_name, mod.apply(null, req_mods));
                ok(self.modules[mod_name]);
            }
            if (req_list && req_list.length) {
                self.load_amd_list(req_list, mod_name).then(mount_mod);
            } else {
                mount_mod([]);
            }
        }
        load_amd (name, requester, ok, err) {
            var self = this;
            var is_url, ret, s, src, js_root_dir;
            is_url = /https?:\/{2}.*/.test(name);
            if (!is_url) {
                if (name.startsWith("./")) {
                    name = name.slice(2);
                }
                if (requester) {
                    name = fs_path.rel_path_join(requester.split("/").slice(0, -1).join("/"), name);
                }
            }
            if (self.load_stack.find(function(it) {
                var ՐՏ_6;
                return ((ՐՏ_6 = it.name) === name || typeof ՐՏ_6 === "object" && ՐՏ_eq(ՐՏ_6, name));
            })) {
                throw new Error("Circular dependency: " + name + " and " + requester);
            }
            ret = self.modules[name];
            if (ret) {
                ok(ret);
            } else {
                s = document.createElement("script");
                src = name;
                if (!is_url) {
                    js_root_dir = self.cfg && self.cfg.js_root_dir || "";
                    src = fs_path.rel_path_join(js_root_dir, src);
                }
                s.src = src + ".js";
                s.async = true;
                s.onerror = function() {
                    err(name);
                };
                self.load_stack.push({
                    name: name,
                    ok: ok
                });
                document.head.appendChild(s);
            }
        }
        *load_amd_list (mod_lst, requester) {
            var ՐՏitr5, ՐՏidx5;
            var self = this;
            var ret, mod;
            ret = [];
            ՐՏitr5 = ՐՏ_Iterable(mod_lst);
            for (ՐՏidx5 = 0; ՐՏidx5 < ՐՏitr5.length; ՐՏidx5++) {
                mod = ՐՏitr5[ՐՏidx5];
                ret.push(yield self.load_amd(mod, requester));
            }
            return ret;
        }
        get (name) {
            var self = this;
            var mod;
            mod = self.modules[name];
            if (!mod) {
                throw new Error("Module `" + name + "` is not loaded");
            }
            return self.modules[name];
        }
    }, (function(){
        Object.defineProperties(ՐՏ_5.prototype, {
            load_amd: {
                enumerable: false, 
                writable: true, 
                value: prom(ՐՏ_5.prototype.load_amd)
            },
            load_amd_list: {
                enumerable: false, 
                writable: true, 
                value: asyncer(ՐՏ_5.prototype.load_amd_list)
            }
        });
        ;
    })(), ՐՏ_5);
    ՐՏ_modules["asset.rs_require"]["doc_ready"] = doc_ready;

    ՐՏ_modules["asset.rs_require"]["prom"] = prom;

    ՐՏ_modules["asset.rs_require"]["RS_require"] = RS_require;
})();

(function(){
    var __name__ = "load_js";
    function load(rs_req) {
        function get_mods() {
            var mods;
            mods = [ "codemirror/lib/codemirror.js", "codemirror/mode/python/python.js", "codemirror/mode/javascript/javascript.js", "codemirror/mode/css/css.js", "codemirror/mode/xml/xml.js", "codemirror/mode/htmlmixed/htmlmixed.js", "codemirror/addon/hint/show-hint.js", "codemirror/addon/hint/javascript-hint.js", "codemirror/addon/hint/anyword-hint.js", "codemirror/addon/mode/simple.js", "codemirror/addon/edit/matchbrackets.js", "codemirror/addon/dialog/dialog.js", "codemirror/addon/search/searchcursor.js", "codemirror/addon/search/search.js", "codemirror/keymap/vim.js", "axios.min.js" ];
            mods = mods.map(function(it) {
                var ret;
                ret = it.split(".js")[0];
                return ret;
            });
            return mods;
        }
        return rs_req.load_amd_list(get_mods(), "");
    }
    ՐՏ_modules["load_js"]["load"] = load;
})();

(function(){

    var __name__ = "__main__";

    var rs_require = ՐՏ_modules["asset.rs_require"];
    
    var load_js = ՐՏ_modules["load_js"];
    
    window.onbeforeunload = function() {
        return "hi!";
    };
    function init() {
        var js_root_dir, rs_req;
        js_root_dir = window.location.pathname.split("/", 2).join("/") + "/static/js/";
        window.rs_req = rs_req = new rs_require.RS_require({
            js_root_dir: js_root_dir
        });
        load_js.load(rs_req).then(function() {
            rs_req.load_amd("app", "").then(function(app) {
                app.start("#app");
                ՐՏ_print("Done!!!");
            });
        });
    }
    init();
})();
})();
