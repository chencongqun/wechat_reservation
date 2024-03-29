var MDialog = (function() {
    var e = "javascript:void(0)";
    var c = function(m) {
        return (typeof m == "undefined")
    };
    var g = function() {
        var o = '<div class="mModal"><a href="' + e + '"></a></div>';
        _q("body").insertAdjacentHTML("beforeEnd", o);
        o = null;
        var n = _q(".mModal:last-of-type");
        if (_qAll(".mModal").length > 1) {
            n.style.opacity = 0.01
        }
        _q("a", n).style.height = window.innerHeight + "px";
        n.style.zIndex = window._dlgBaseDepth++;
        return n
    };
    var h = function() {
        if (c(window._dlgBaseDepth)) {
            window._dlgBaseDepth = 900
        }
    };
    var k = function(m) {
        if (c(m)) {
            m = true
        }
        _q("body").style.overflow = m ? "hidden": "visible"
    };
    var i = function(P, G, K, w, L, H, A, x, M, z, Q, o, p) {
        if (c(G)) {
            G = null
        }
        if (c(K)) {
            K = null
        }
        if (c(L)) {
            L = null
        }
        if (c(H)) {
            H = null
        }
        if (c(A)) {
            A = null
        }
        if (c(x)) {
            x = null
        }
        if (c(M)) {
            M = null
        }
        if (c(z)) {
            z = null
        }
        if (c(Q)) {
            Q = true
        }
        if (c(o)) {
            o = true
        }
        h();
        var E = window.innerWidth,
        N = window.innerHeight,
        y = null,
        F = null;
        if (o) {
            F = g()
        }
        y = '<div class="mDialog"><figure></figure><h1></h1><h2></h2><h3></h3><footer>	<a class="two"></a>	<a class="two"></a>	<a class="one"></a></footer><a class="x">X</a></div>';
        _q("body").insertAdjacentHTML("beforeEnd", y);
        y = null;
        var J = _q("div.mDialog:last-of-type", _q("body")),
        C = _q("figure", J),
        s = _q("footer a.one", J),
        r = _q("footer a.two:nth-of-type(1)", J),
        q = _q("footer a.two:nth-of-type(2)", J),
        I = _q("a.x", J),
        B = 0,
        O = [],
        v = function(R, m, t) {
            R.addEventListener(m, t);
            O.push({
                o: R,
                e: m,
                f: t
            })
        },
        n = function(m, t) {
            var R = _q(m, J);
            if (t != null) {
                R.innerHTML = t
            } else {
                R.parentNode.removeChild(R)
            }
            return R
        },
        D = function(t) {
            if (/mModal/.test(t.currentTarget.className) && typeof MData(J, "closeByModal") !== "undefined" && MData(J, "closeByModal") == 0) {
                return
            }
            if (typeof p === "function") {
                p()
            }
            while (O.length) {
                var m = O.shift();
                m.o.removeEventListener(m.e, m.f)
            }
            J.parentNode.removeChild(J);
            window._dlgBaseDepth--;
            if (F == null) {
                return
            }
            F.parentNode.removeChild(F);
            window._dlgBaseDepth--;
            k(false)
        };
        var u = n("h1", P);
        if (u.clientHeight > 51) {
            u.style.textAlign = "left"
        }
        n("h2", G);
        n("h3", K);
        if (z == null) {
            J.removeChild(C)
        } else {
            _addClass(C, z)
        }
        C = null;
        if (A == null) {
            r.parentNode.removeChild(r);
            q.parentNode.removeChild(q);
            r = null;
            q = null;
            s.innerHTML = w;
            s.href = e;
            if (H != null) {
                _addClass(s, H)
            }
            if (L != null) {
                v(s, "click", L)
            }
            v(s, "click", D)
        } else {
            s.parentNode.removeChild(s);
            s = null;
            r.innerHTML = w;
            r.href = e;
            if (H != null) {
                _addClass(r, H)
            }
            if (L != null) {
                v(r, "click", L)
            }
            v(r, "click", D);
            q.innerHTML = A;
            q.href = e;
            if (M != null) {
                _addClass(q, M)
            }
            if (x != null) {
                v(q, "click", x)
            }
            v(q, "click", D)
        }
        if (Q) {
            I.href = e;
            v(I, "click", D)
        } else {
            I.parentNode.removeChild(I);
            I = null
        }
        if (F != null) {
            v(F, "click", D)
        }
        J.style.zIndex = window._dlgBaseDepth++;
        J.style.left = 0.5 * (E - J.clientWidth) + "px";
        B = parseInt(0.45 * (N - J.clientHeight));
        J.style.top = B + "px";
        MData(J, "ffixTop", B);
        if (o) {
            k()
        }
        a.close = D;
        return J
    };
    var j = function(s, q, t, r, p, u, n, m, o) {
        return i(s, q, t, r, p, u, null, null, null, n, m, o)
    };
    var f = function(v, o, q) {
        if (c(o)) {
            o = null
        }
        if (c(q)) {
            q = 3000
        }
        var r = '<div class="mNotice">	<span></span></div>';
        _q("body").insertAdjacentHTML("beforeEnd", r);
        h();
        var n = _q("div.mNotice:last-of-type", _q("body")),
        m = _q("span", n),
        s = window.innerWidth,
        p = window.innerHeight,
        u = 0;
        m.innerHTML = v;
        if (o != null) {
            _addClass(m, o)
        }
        n.style.zIndex = window._dlgBaseDepth++;
        n.style.left = 0.5 * (s - n.clientWidth) + "px";
        u = parseInt(0.45 * (p - n.clientHeight));
        n.style.top = u + "px";
        MData(n, "ffixTop", u);
        _setTimeout(function() {
            n.parentNode.removeChild(n);
            window._dlgBaseDepth--
        },
        q);
        return n
    };
    var b = function(u, D, H, n) {
        if (c(D)) {
            D = 295
        }
        if (c(H)) {
            H = true
        }
        if (c(n)) {
            n = true
        }
        h();
        var y = window.innerWidth,
        E = window.innerHeight,
        s = null,
        A = null;
        if (n) {
            A = g()
        }
        s = '<div class="mImgPopup"><figure></figure><a class="x">X</a></div>';
        _q("body").insertAdjacentHTML("beforeEnd", s);
        var z = _q("div.mImgPopup:last-of-type", _q("body")),
        w = _q("figure", z),
        B = _q("span", z),
        C = _q("a.x", z),
        y = window.innerWidth,
        E = window.innerHeight,
        v = 0,
        F = [],
        r = function(t, m, p) {
            t.addEventListener(m, p);
            F.push({
                o: t,
                e: m,
                f: p
            })
        },
        x = function(p) {
            while (F.length) {
                var m = F.shift();
                m.o.removeEventListener(m.e, m.f)
            }
            z.parentNode.removeChild(z);
            window._dlgBaseDepth--;
            if (A == null) {
                return
            }
            A.parentNode.removeChild(A);
            window._dlgBaseDepth--;
            k(false)
        },
        o = function(J) {
            var p = J.currentTarget,
            m = p.width,
            t = p.height,
            I = 1;
            w.appendChild(p);
            if (m > D) {
                I = m / D
            }
            w.style.height = z.style.height = p.style.height = parseInt(t / I) + "px";
            w.style.width = z.style.width = p.style.width = parseInt(m / I) + "px";
            q()
        },
        q = function() {
            z.style.zIndex = window._dlgBaseDepth++;
            z.style.left = 0.5 * (y - z.clientWidth) + "px";
            v = 0.5 * (E - z.clientHeight);
            z.style.top = v + "px";
            MData(z, "ffixTop", v);
            if (n) {
                k()
            }
        };
        q();
        if (H) {
            C.href = e;
            r(C, "click", x)
        } else {
            C.parentNode.removeChild(C);
            C = null
        }
        if (A != null) {
            r(A, "click", x)
        }
        var G = new Image;
        r(G, "load", o);
        G.src = u;
        a.close = x;
        return z
    };
    var l = function(r, t) {
        if (_q("#mLoading")) {
            return
        }
        if (c(r)) {
            r = ""
        }
        if (c(t)) {
            t = false
        }
        h();
        var q = window.innerWidth,
        s = window.innerHeight,
        p = null,
        n = null;
        if (t) {
            n = g();
            n.id = "mLoadingModal"
        }
        p = '<div id="mLoading"><div class="lbk"></div><div class="lcont">' + r + "</div></div>";
        _q("body").insertAdjacentHTML("beforeEnd", p);
        var o = _q("#mLoading");
        o.style.top = (_q("body").scrollTop + 0.5 * (s - o.clientHeight)) + "px";
        o.style.left = 0.5 * (q - o.clientWidth) + "px";
        return o
    };
    var d = function(v, o, n, s) {
        if (c(v)) {
            v = null
        }
        if (c(o)) {
            o = true
        }
        if (c(n)) {
            n = null
        }
        if (c(s)) {
            s = true
        }
        h();
        var z = window.innerWidth,
        r = window.innerHeight,
        y = null,
        p = null;
        if (s) {
            p = g()
        }
        y = '<div class="mDialog freeSet">' + v + '<a class="x">X</a></div>';
        _q("body").insertAdjacentHTML("beforeEnd", y);
        y = null;
        var x = _q("div.mDialog:last-of-type", _q("body")),
        w = _q("a.x", x),
        B = 0,
        u = [],
        q = function(C, m, t) {
            C.addEventListener(m, t);
            u.push({
                o: C,
                e: m,
                f: t
            })
        },
        A = function(t) {
            if (n != null) { (n)()
            }
            while (u.length) {
                var m = u.shift();
                m.o.removeEventListener(m.e, m.f)
            }
            x.parentNode.removeChild(x);
            window._dlgBaseDepth--;
            if (p == null) {
                return
            }
            p.parentNode.removeChild(p);
            window._dlgBaseDepth--;
            k(false)
        };
        if (o) {
            w.href = e;
            q(w, "click", A)
        } else {
            w.parentNode.removeChild(w);
            w = null
        }
        if (p != null) {
            q(p, "click", A)
        }
        x.style.zIndex = window._dlgBaseDepth++;
        x.style.left = 0.5 * (z - x.clientWidth) + "px";
        B = parseInt(0.45 * (r - x.clientHeight));
        x.style.top = B + "px";
        MData(x, "ffixTop", B);
        if (s) {
            k()
        }
        a.close = A;
        return x
    };
    var a = {
        ICON_TYPE_SUCC: "succ",
        ICON_TYPE_WARN: "warn",
        ICON_TYPE_FAIL: "fail",
        BUTTON_STYLE_ON: "on",
        BUTTON_STYLE_OFF: "off",
        confirm: i,
        alert: j,
        notice: f,
        popupImage: b,
        showLoading: l,
        popupCustom: d
    };
    return a
} ()),
MLoading = {
    show: MDialog.showLoading,
    hide: function() {
        var b = _q("#mLoading");
        if (b) {
            b.parentNode.removeChild(b)
        }
        var a = _q("#mLoadingModal");
        if (a) {
            a.parentNode.removeChild(a)
        }
    }
};