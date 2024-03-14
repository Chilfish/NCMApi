// https://fn.music.163.com/g/chrome-extension-home-page-beta/
function AudioFingerprintRuntime() {
  let n; var o = void 0 !== o ? o : {}; let i = {}
  for (n in o)
    o.hasOwnProperty(n) && (i[n] = o[n])
  let read_; let readAsync; let readBinary; let c; let f; let l = []
  let p = './this.program'
  const ENVIRONMENT_IS_WEB = typeof window === 'object'
  const ENVIRONMENT_IS_WORKER = typeof importScripts === 'function'
  const ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string'
  let m = ''
  ENVIRONMENT_IS_NODE
    ? (
        m = ENVIRONMENT_IS_WORKER ? `${path.dirname(m)}/` : '//',
        read_ = function shell_read(t, e) {
          return c || (c = fs),
          f || (f = path),
          t = f.normalize(t),
          c.readFileSync(t, e ? null : 'utf8')
        },
        readBinary = function (t) {
          let e = read_(t, !0)
          return e.buffer || (e = new Uint8Array(e)),
          T(e.buffer),
          e
        }
        ,
        u = function (t, e, n) {
          c || (c = R(194)),
          f || (f = R(997)),
          t = f.normalize(t),
          c.readFile(t, (t, r) => {
            t ? n(t) : e(r.buffer)
          })
        },
        process.argv.length > 1 && (p = process.argv[1].replace(/\\/g, '/')),
        l = process.argv.slice(2),
        process.on('uncaughtException', (t) => {
          if (!(t instanceof ExitStatus))
            throw t
        }),
        process.on('unhandledRejection', (t) => {
          throw t
        }),
        function logExceptionOnExit(t, e) {
          if (_) {
            throw process.exitCode = t,
            e
          }
          let r;
          (r = e) instanceof ExitStatus || g(`exiting due to exception: ${r}`),
          process.exit(t)
        },
        o.inspect = function () {
          return '[Emscripten Module object]'
        }
      )
    : (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && (ENVIRONMENT_IS_WORKER ? m = self.location.href : typeof document != 'undefined' && document.currentScript && (m = document.currentScript.src),
      m = m.indexOf('blob:') !== 0 ? m.substr(0, m.replace(/[?#].*/, '').lastIndexOf('/') + 1) : '',
      read_ = function (t) {
        const e = new XMLHttpRequest()
        return e.open('GET', t, !1),
        e.send(null),
        e.responseText
      },
      ENVIRONMENT_IS_WORKER && (readBinary = function (t) {
        const e = new XMLHttpRequest()
        return e.open('GET', t, !1),
        e.responseType = 'arraybuffer',
        e.send(null),
        new Uint8Array(e.response)
      }),
      readAsync = function (t, e, r) {
        const n = new XMLHttpRequest()
        n.open('GET', t, !0),
        n.responseType = 'arraybuffer',
        n.onload = function () {
          n.status === 200 || n.status === 0 && n.response ? e(n.response) : r()
        },
        n.onerror = r,
        n.send(null)
      }
      )
  const v = o.print || console.log.bind(console)
  var g = o.printErr || console.warn.bind(console)
  for (n in i)
    i.hasOwnProperty(n) && (o[n] = i[n])
  i = null,
  o.arguments && (l = o.arguments),
  o.thisProgram && (p = o.thisProgram),
  o.quit && o.quit
  let w
  o.wasmBinary && (w = o.wasmBinary)
  let b; var _ = o.noExitRuntime || !0
  typeof WebAssembly != 'object' && abort('no native wasm support detected')
  let C = !1

  function T(t, e) {
    t || abort(`Assertion failed: ${e}`)
  }
  const UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : void 0

  function UTF8ArrayToString(heap, idx, maxBytesToRead) {
    const endIdx = idx + maxBytesToRead
    let endPtr = idx
    while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr
    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
      return UTF8Decoder.decode(heap.subarray(idx, endPtr))
    }
    else {
      var str = ''
      while (idx < endPtr) {
        let u0 = heap[idx++]
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0)
          continue
        }
        const u1 = heap[idx++] & 63
        if ((u0 & 224) === 192) {
          str += String.fromCharCode((u0 & 31) << 6 | u1)
          continue
        }
        const u2 = heap[idx++] & 63
        if ((u0 & 240) === 224)
          u0 = (u0 & 15) << 12 | u1 << 6 | u2
        else
          u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63

        if (u0 < 65536) {
          str += String.fromCharCode(u0)
        }
        else {
          const ch = u0 - 65536
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
        }
      }
    }
    return str
  }

  function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ''
  }
  function UTF8ToString(t, e) {
    return t ? UTF8ArrayToString(O, t, e) : ''
  }

  function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0))
      return 0
    const startIdx = outIdx
    const endIdx = outIdx + maxBytesToWrite - 1
    for (let i = 0; i < str.length; ++i) {
      let u = str.charCodeAt(i)
      if (u >= 55296 && u <= 57343) {
        const u1 = str.charCodeAt(++i)
        u = 65536 + ((u & 1023) << 10) | u1 & 1023
      }
      if (u <= 127) {
        if (outIdx >= endIdx)
          break
        heap[outIdx++] = u
      }
      else if (u <= 2047) {
        if (outIdx + 1 >= endIdx)
          break
        heap[outIdx++] = 192 | u >> 6
        heap[outIdx++] = 128 | u & 63
      }
      else if (u <= 65535) {
        if (outIdx + 2 >= endIdx)
          break
        heap[outIdx++] = 224 | u >> 12
        heap[outIdx++] = 128 | u >> 6 & 63
        heap[outIdx++] = 128 | u & 63
      }
      else {
        if (outIdx + 3 >= endIdx)
          break
        heap[outIdx++] = 240 | u >> 18
        heap[outIdx++] = 128 | u >> 12 & 63
        heap[outIdx++] = 128 | u >> 6 & 63
        heap[outIdx++] = 128 | u & 63
      }
    }
    heap[outIdx] = 0
    return outIdx - startIdx
  }

  function UTF8CharCount(t) {
    for (var e = 0, r = 0; r < t.length; ++r) {
      let n = t.charCodeAt(r)
      n >= 55296 && n <= 57343 && (n = 65536 + ((1023 & n) << 10) | 1023 & t.charCodeAt(++r)),
      n <= 127 ? ++e : e += n <= 2047 ? 2 : n <= 65535 ? 3 : 4
    }
    return e
  }
  let E; let S; let O; let k; let W; let j; let R; let M; let I; const UTF16Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf-16le') : void 0

  function UTF16ArrayToString(t, e) {
    for (var r = t, n = r >> 1, o = n + e / 2; !(n >= o) && W[n];)
      ++n
    if ((r = n << 1) - t > 32 && UTF16Decoder)
      return UTF16Decoder.decode(O.subarray(t, r))
    for (var i = '', a = 0; !(a >= e / 2); ++a) {
      const u = k[t + 2 * a >> 1]
      if (u === 0)
        break
      i += String.fromCharCode(u)
    }
    return i
  }

  function H(t, e, r) {
    if (void 0 === r && (r = 2147483647),
    r < 2)
      return 0
    for (var n = e, o = (r -= 2) < 2 * t.length ? r / 2 : t.length, i = 0; i < o; ++i) {
      const a = t.charCodeAt(i)
      k[e >> 1] = a,
      e += 2
    }
    return k[e >> 1] = 0,
    e - n
  }

  function Y(t) {
    return 2 * t.length
  }

  function V(t, e) {
    for (var r = 0, n = ''; !(r >= e / 4);) {
      const o = j[t + 4 * r >> 2]
      if (o === 0)
        break
      if (++r,
      o >= 65536) {
        const i = o - 65536
        n += String.fromCharCode(55296 | i >> 10, 56320 | 1023 & i)
      }
      else { n += String.fromCharCode(o) }
    }
    return n
  }

  function z(t, e, r) {
    if (void 0 === r && (r = 2147483647),
    r < 4)
      return 0
    for (var n = e, o = n + r - 4, i = 0; i < t.length; ++i) {
      let a = t.charCodeAt(i)
      if (a >= 55296 && a <= 57343)
        a = 65536 + ((1023 & a) << 10) | 1023 & t.charCodeAt(++i)
      if (j[e >> 2] = a,
      (e += 4) + 4 > o)
        break
    }
    return j[e >> 2] = 0,
    e - n
  }

  function B(t) {
    for (var e = 0, r = 0; r < t.length; ++r) {
      const n = t.charCodeAt(r)
      n >= 55296 && n <= 57343 && ++r,
      e += 4
    }
    return e
  }
  o.INITIAL_MEMORY
  let L; const G = []
  const N = []
  const q = []
  let J = 0
  let X = null
  let Z = null

  function abort(what) {
    throw o.onAbort && o.onAbort(what),
    g(what = `Aborted(${what})`),
    C = !0,
    1,
    what += '. Build with -s ASSERTIONS=1 for more info.',
    new WebAssembly.RuntimeError(what)
  }
  o.preloadedImages = {},
  o.preloadedAudios = {}
  let Q

  function isDataURI(t) {
    return t.startsWith('data:application/octet-stream;base64,')
  }

  function isFileURI(t) {
    return t.startsWith('file://')
  }

  function getBinary(file) {
    try {
      if (file === Q && w)
        return new Uint8Array(w)
      if (readBinary)
        return readBinary(file)
      throw 'both async and sync fetching of the wasm failed'
    }
    catch (t) {
      abort(t)
    }
  }

  function callRuntimeCallbacks(cb) {
    for (; cb.length > 0;) {
      const func = cb.shift()
      if (typeof func != 'function') {
        const r = func.func
        typeof r === 'number' ? void 0 === func.arg ? it(r)() : it(r)(func.arg) : r(void 0 === func.arg ? null : func.arg)
      }
      else { func(o) }
    }
  }
  const wasmBinaryFile = 'afp.wasm'
  isDataURI(wasmBinaryFile) || (Q = (function (t) {
    return wasmBinaryFile
  }(Q)))
  const ot = []

  function it(t) {
    let e = ot[t]
    return e || (t >= ot.length && (ot.length = t + 1),
    ot[t] = e = L.get(t)),
    e
  }

  function ExceptionInfo(excPtr) {
    this.excPtr = excPtr,
    this.ptr = excPtr - 16,
    this.set_type = function (t) {
      j[this.ptr + 4 >> 2] = t
    },
    this.get_type = function () {
      return j[this.ptr + 4 >> 2]
    },
    this.set_destructor = function (t) {
      j[this.ptr + 8 >> 2] = t
    },
    this.get_destructor = function () {
      return j[this.ptr + 8 >> 2]
    },
    this.set_refcount = function (t) {
      j[this.ptr >> 2] = t
    },
    this.set_caught = function (t) {
      t = t ? 1 : 0,
      S[this.ptr + 12 >> 0] = t
    },
    this.get_caught = function () {
      return S[this.ptr + 12 >> 0] != 0
    },
    this.set_rethrown = function (t) {
      t = t ? 1 : 0,
      S[this.ptr + 13 >> 0] = t
    },
    this.get_rethrown = function () {
      return S[this.ptr + 13 >> 0] != 0
    },
    this.init = function (t, e) {
      this.set_type(t),
      this.set_destructor(e),
      this.set_refcount(0),
      this.set_caught(!1),
      this.set_rethrown(!1)
    },
    this.add_ref = function () {
      const t = j[this.ptr >> 2]
      j[this.ptr >> 2] = t + 1
    },
    this.release_ref = function () {
      const t = j[this.ptr >> 2]
      return j[this.ptr >> 2] = t - 1,
      t === 1
    }
  }

  function ut(t) {
    switch (t) {
      case 1:
        return 0
      case 2:
        return 1
      case 4:
        return 2
      case 8:
        return 3
      default:
        throw new TypeError(`Unknown type size: ${t}`)
    }
  }
  let st = void 0

  function ct(t) {
    for (var e = '', r = t; O[r];)
      e += st[O[r++]]
    return e
  }
  const ft = {}
  const lt = {}
  const pt = {}

  function dt(t) {
    if (void 0 === t)
      return '_unknown'
    const e = (t = t.replace(/[^a-zA-Z0-9_]/g, '$')).charCodeAt(0)
    return e >= 48 && e <= 57 ? `_${t}` : t
  }

  function ht(t, e) {
    return t = dt(t),
    new Function('body', `return function ${t}() {\n    "use strict";    return body.apply(this, arguments);\n};\n`)(e)
  }

  function yt(t, e) {
    const r = ht(e, function (t) {
      this.name = e,
      this.message = t
      const r = new Error(t).stack
      void 0 !== r && (this.stack = `${this.toString()}\n${r.replace(/^Error(:[^\n]*)?\n/, '')}`)
    })
    return r.prototype = Object.create(t.prototype),
    r.prototype.constructor = r,
    r.prototype.toString = function () {
      return void 0 === this.message ? this.name : `${this.name}: ${this.message}`
    },
    r
  }
  let mt = void 0

  function vt(t) {
    throw new mt(t)
  }
  let gt = void 0

  function wt(t) {
    throw new gt(t)
  }

  function bt(t, e, r) {
    function n(e) {
      const n = r(e)
      n.length !== t.length && wt('Mismatched type converter count')
      for (let o = 0; o < t.length; ++o)
        _t(t[o], n[o])
    }
    t.forEach(((t) => {
      pt[t] = e
    }))
    const o = Array.from({ length: e.length })
    const i = []
    let a = 0
    e.forEach(((t, e) => {
      lt.hasOwnProperty(t)
        ? o[e] = lt[t]
        : (i.push(t),
          ft.hasOwnProperty(t) || (ft[t] = []),
          ft[t].push((() => {
            o[e] = lt[t],
            ++a === i.length && n(o)
          })))
    })),
    i.length === 0 && n(o)
  }

  function _t(t, e, r) {
    if (r = r || {},
    !('argPackAdvance' in e))
      throw new TypeError('registerType registeredInstance requires argPackAdvance')
    const n = e.name
    if (t || vt(`type "${n}" must have a positive integer typeid pointer`),
    lt.hasOwnProperty(t)) {
      if (r.ignoreDuplicateRegistrations)
        return
      vt(`Cannot register type '${n}' twice`)
    }
    if (lt[t] = e,
    delete pt[t],
    ft.hasOwnProperty(t)) {
      const o = ft[t]
      delete ft[t],
      o.forEach(((t) => {
        t()
      }))
    }
  }

  function Ct(t) {
    if (!(this instanceof Rt))
      return !1
    if (!(t instanceof Rt))
      return !1
    for (var e = this.$$.ptrType.registeredClass, r = this.$$.ptr, n = t.$$.ptrType.registeredClass, o = t.$$.ptr; e.baseClass;) {
      r = e.upcast(r),
      e = e.baseClass
    }
    for (; n.baseClass;) {
      o = n.upcast(o),
      n = n.baseClass
    }
    return e === n && r === o
  }

  function Tt(t) {
    vt(`${t.$$.ptrType.registeredClass.name} instance already deleted`)
  }
  let $t = !1

  function Pt(t) {}

  function At(t) {
    t.count.value -= 1,
    t.count.value === 0 && (function (t) {
      t.smartPtr ? t.smartPtrType.rawDestructor(t.smartPtr) : t.ptrType.registeredClass.rawDestructor(t.ptr)
    }(t))
  }

  function Dt(t) {
    return typeof FinalizationRegistry === 'undefined'
      ? (Dt = function (t) {
          return t
        },
        t)
      : ($t = new FinalizationRegistry(((t) => {
          At(t.$$)
        })),
        Dt = function (t) {
          const e = {
            $$: t.$$,
          }
          return $t.register(t, e, t),
          t
        },
        Pt = function (t) {
          $t.unregister(t)
        },
        Dt(t))
  }

  function Ft() {
    if (this.$$.ptr || Tt(this),
    this.$$.preservePointerOnDelete) {
      return this.$$.count.value += 1,
      this
    }
    let t; const e = Dt(Object.create(Object.getPrototypeOf(this), {
      $$: {
        value: (t = this.$$, {
          count: t.count,
          deleteScheduled: t.deleteScheduled,
          preservePointerOnDelete: t.preservePointerOnDelete,
          ptr: t.ptr,
          ptrType: t.ptrType,
          smartPtr: t.smartPtr,
          smartPtrType: t.smartPtrType,
        }),
      },
    }))
    return e.$$.count.value += 1,
    e.$$.deleteScheduled = !1,
    e
  }

  function Et() {
    this.$$.ptr || Tt(this),
    this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && vt('Object already scheduled for deletion'),
    Pt(this),
    At(this.$$),
    this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0,
    this.$$.ptr = void 0)
  }

  function St() {
    return !this.$$.ptr
  }
  let Ot = void 0
  const kt = []

  function Wt() {
    for (; kt.length;) {
      const t = kt.pop()
      t.$$.deleteScheduled = !1,
      t.delete()
    }
  }

  function jt() {
    return this.$$.ptr || Tt(this),
    this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && vt('Object already scheduled for deletion'),
    kt.push(this),
    kt.length === 1 && Ot && Ot(Wt),
    this.$$.deleteScheduled = !0,
    this
  }

  function Rt() {}
  const Mt = {}

  function It(t, e, r) {
    if (void 0 === t[e].overloadTable) {
      const n = t[e]
      t[e] = function () {
        return t[e].overloadTable.hasOwnProperty(arguments.length) || vt(`Function '${r}' called with an invalid number of arguments (${arguments.length}) - expects one of (${t[e].overloadTable})!`),
        t[e].overloadTable[arguments.length].apply(this, arguments)
      },
      t[e].overloadTable = [],
      t[e].overloadTable[n.argCount] = n
    }
  }

  function xt(t, e, r) {
    o.hasOwnProperty(t)
      ? ((void 0 === r || void 0 !== o[t].overloadTable && void 0 !== o[t].overloadTable[r]) && vt(`Cannot register public name '${t}' twice`),
        It(o, t, t),
        o.hasOwnProperty(r) && vt(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`),
        o[t].overloadTable[r] = e)
      : (o[t] = e,
        void 0 !== r && (o[t].numArguments = r))
  }

  function Ut(t, e, r, n, o, i, a, u) {
    this.name = t,
    this.constructor = e,
    this.instancePrototype = r,
    this.rawDestructor = n,
    this.baseClass = o,
    this.getActualType = i,
    this.upcast = a,
    this.downcast = u,
    this.pureVirtualFunctions = []
  }

  function Ht(t, e, r) {
    for (; e !== r;) {
      e.upcast || vt(`Expected null or instance of ${r.name}, got an instance of ${e.name}`),
      t = e.upcast(t),
      e = e.baseClass
    }
    return t
  }

  function Yt(t, e) {
    if (e === null) {
      return this.isReference && vt(`null is not a valid ${this.name}`),
      0
    }
    e.$$ || vt(`Cannot pass "${ge(e)}" as a ${this.name}`),
    e.$$.ptr || vt(`Cannot pass deleted object as a pointer of type ${this.name}`)
    const r = e.$$.ptrType.registeredClass
    return Ht(e.$$.ptr, r, this.registeredClass)
  }

  function Vt(t, e) {
    let r
    if (e === null) {
      return this.isReference && vt(`null is not a valid ${this.name}`),
      this.isSmartPointer
        ? (r = this.rawConstructor(),
          t !== null && t.push(this.rawDestructor, r),
          r)
        : 0
    }
    e.$$ || vt(`Cannot pass "${ge(e)}" as a ${this.name}`),
    e.$$.ptr || vt(`Cannot pass deleted object as a pointer of type ${this.name}`),
    !this.isConst && e.$$.ptrType.isConst && vt(`Cannot convert argument of type ${e.$$.smartPtrType ? e.$$.smartPtrType.name : e.$$.ptrType.name} to parameter type ${this.name}`)
    const n = e.$$.ptrType.registeredClass
    if (r = Ht(e.$$.ptr, n, this.registeredClass),
    this.isSmartPointer) {
      switch (void 0 === e.$$.smartPtr && vt('Passing raw pointer to smart pointer is illegal'),
      this.sharingPolicy) {
        case 0:
          e.$$.smartPtrType === this ? r = e.$$.smartPtr : vt(`Cannot convert argument of type ${e.$$.smartPtrType ? e.$$.smartPtrType.name : e.$$.ptrType.name} to parameter type ${this.name}`)
          break
        case 1:
          r = e.$$.smartPtr
          break
        case 2:
          if (e.$$.smartPtrType === this) { r = e.$$.smartPtr }
          else {
            const o = e.clone()
            r = this.rawShare(r, ve.toHandle((() => {
              o.delete()
            }))),
            t !== null && t.push(this.rawDestructor, r)
          }
          break
        default:
          vt('Unsupporting sharing policy')
      }
    }
    return r
  }

  function zt(t, e) {
    if (e === null) {
      return this.isReference && vt(`null is not a valid ${this.name}`),
      0
    }
    e.$$ || vt(`Cannot pass "${ge(e)}" as a ${this.name}`),
    e.$$.ptr || vt(`Cannot pass deleted object as a pointer of type ${this.name}`),
    e.$$.ptrType.isConst && vt(`Cannot convert argument of type ${e.$$.ptrType.name} to parameter type ${this.name}`)
    const r = e.$$.ptrType.registeredClass
    return Ht(e.$$.ptr, r, this.registeredClass)
  }

  function Bt(t) {
    return this.fromWireType(R[t >> 2])
  }

  function Lt(t) {
    return this.rawGetPointee && (t = this.rawGetPointee(t)),
    t
  }

  function Gt(t) {
    this.rawDestructor && this.rawDestructor(t)
  }

  function Nt(t) {
    t !== null && t.delete()
  }

  function qt(t, e, r) {
    if (e === r)
      return t
    if (void 0 === r.baseClass)
      return null
    const n = qt(t, e, r.baseClass)
    return n === null ? null : r.downcast(n)
  }

  function Jt() {
    return Object.keys(Kt).length
  }

  function Xt() {
    const t = []
    for (const e in Kt)
      Kt.hasOwnProperty(e) && t.push(Kt[e])
    return t
  }

  function Zt(t) {
    Ot = t,
    kt.length && Ot && Ot(Wt)
  }
  var Kt = {}

  function Qt(t, e) {
    return e = (function (t, e) {
      for (void 0 === e && vt('ptr should not be undefined'); t.baseClass;) {
        e = t.upcast(e),
        t = t.baseClass
      }
      return e
    }(t, e)),
    Kt[e]
  }

  function te(t, e) {
    return e.ptrType && e.ptr || wt('makeClassHandle requires ptr and ptrType'),
    !!e.smartPtrType !== !!e.smartPtr && wt('Both smartPtrType and smartPtr must be specified'),
    e.count = {
      value: 1,
    },
    Dt(Object.create(t, {
      $$: {
        value: e,
      },
    }))
  }

  function ee(t) {
    const e = this.getPointee(t)
    if (!e) {
      return this.destructor(t),
      null
    }
    const r = Qt(this.registeredClass, e)
    if (void 0 !== r) {
      if (r.$$.count.value === 0) {
        return r.$$.ptr = e,
        r.$$.smartPtr = t,
        r.clone()
      }
      const n = r.clone()
      return this.destructor(t),
      n
    }

    function o() {
      return this.isSmartPointer
        ? te(this.registeredClass.instancePrototype, {
          ptrType: this.pointeeType,
          ptr: e,
          smartPtrType: this,
          smartPtr: t,
        })
        : te(this.registeredClass.instancePrototype, {
          ptrType: this,
          ptr: t,
        })
    }
    let i; const a = this.registeredClass.getActualType(e)
    const u = Mt[a]
    if (!u)
      return o.call(this)
    i = this.isConst ? u.constPointerType : u.pointerType
    const s = qt(e, this.registeredClass, i.registeredClass)
    return s === null
      ? o.call(this)
      : this.isSmartPointer
        ? te(i.registeredClass.instancePrototype, {
          ptrType: i,
          ptr: s,
          smartPtrType: this,
          smartPtr: t,
        })
        : te(i.registeredClass.instancePrototype, {
          ptrType: i,
          ptr: s,
        })
  }

  function re(t, e, r, n, o, i, a, u, s, c, f) {
    this.name = t,
    this.registeredClass = e,
    this.isReference = r,
    this.isConst = n,
    this.isSmartPointer = o,
    this.pointeeType = i,
    this.sharingPolicy = a,
    this.rawGetPointee = u,
    this.rawConstructor = s,
    this.rawShare = c,
    this.rawDestructor = f,
    o || void 0 !== e.baseClass
      ? this.toWireType = Vt
      : n
        ? (this.toWireType = Yt,
          this.destructorFunction = null)
        : (this.toWireType = zt,
          this.destructorFunction = null)
  }

  function ne(t, e, r) {
    o.hasOwnProperty(t) || wt('Replacing nonexistant public symbol'),
    void 0 !== o[t].overloadTable && void 0 !== r
      ? o[t].overloadTable[r] = e
      : (o[t] = e,
        o[t].argCount = r)
  }

  function oe(t, e, r) {
    return t.includes('j')
      ? (function (t, e, r) {
          const n = o[`dynCall_${t}`]
          return r && r.length ? n.apply(null, [e].concat(r)) : n.call(null, e)
        }(t, e, r))
      : it(e).apply(null, r)
  }

  function ie(t, e) {
    let r; let n; let o; const i = (t = ct(t)).includes('j')
      ? (r = t,
        n = e,
        o = [],
        function () {
          o.length = arguments.length
          for (let t = 0; t < arguments.length; t++)
            o[t] = arguments[t]
          return oe(r, n, o)
        }
        )
      : it(e)
    return typeof i != 'function' && vt(`unknown function pointer with signature ${t}: ${e}`),
    i
  }
  let ae = void 0

  function ue(t) {
    const e = je(t)
    const r = ct(e)
    return We(e),
    r
  }

  function se(t, e) {
    const r = []
    const n = {}
    throw e.forEach((function t(e) {
      n[e] || lt[e] || (pt[e]
        ? pt[e].forEach(t)
        : (r.push(e),
          n[e] = !0))
    })),
    new ae(`${t}: ${r.map(ue).join([', '])}`)
  }

  function ce(t, e) {
    for (var r = [], n = 0; n < t; n++)
      r.push(j[(e >> 2) + n])
    return r
  }

  function fe(t) {
    for (; t.length;) {
      const e = t.pop()
      t.pop()(e)
    }
  }

  function le(t, e, r, n, o) {
    const i = e.length
    i < 2 && vt('argTypes array size mismatch! Must at least get return value and \'this\' types!')
    for (var a = e[1] !== null && r !== null, u = !1, s = 1; s < e.length; ++s) {
      if (e[s] !== null && void 0 === e[s].destructorFunction) {
        u = !0
        break
      }
    }
    const c = e[0].name !== 'void'
    let f = ''
    let l = ''
    for (s = 0; s < i - 2; ++s) {
      f += `${s !== 0 ? ', ' : ''}arg${s}`,
      l += `${s !== 0 ? ', ' : ''}arg${s}Wired`
    }
    let p = `return function ${dt(t)}(${f}) {\nif (arguments.length !== ${i - 2}) {\nthrowBindingError('function ${t} called with ' + arguments.length + ' arguments, expected ${i - 2} args!');\n}\n`
    u && (p += 'var destructors = [];\n')
    const d = u ? 'destructors' : 'null'
    const h = ['throwBindingError', 'invoker', 'fn', 'runDestructors', 'retType', 'classParam']
    const y = [vt, n, o, fe, e[0], e[1]]
    a && (p += `var thisWired = classParam.toWireType(${d}, this);\n`)
    for (s = 0; s < i - 2; ++s) {
      p += `var arg${s}Wired = argType${s}.toWireType(${d}, arg${s}); // ${e[s + 2].name}\n`,
      h.push(`argType${s}`),
      y.push(e[s + 2])
    }
    if (a && (l = `thisWired${l.length > 0 ? ', ' : ''}${l}`),
    p += `${c ? 'var rv = ' : ''}invoker(fn${l.length > 0 ? ', ' : ''}${l});\n`,
    u) { p += 'runDestructors(destructors);\n' }
    else {
      for (s = a ? 1 : 2; s < e.length; ++s) {
        const m = s === 1 ? 'thisWired' : `arg${s - 2}Wired`
        e[s].destructorFunction !== null && (p += `${m}_dtor(${m}); // ${e[s].name}\n`,
        h.push(`${m}_dtor`),
        y.push(e[s].destructorFunction))
      }
    }
    return c && (p += 'var ret = retType.fromWireType(rv);\nreturn ret;\n'),
    p += '}\n',
    h.push(p),
    (function (t, e) {
      if (!(t instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof t} which is not a function`)
      const r = ht(t.name || 'unknownFunctionName', () => {})
      r.prototype = t.prototype
      const n = new r()
      const o = t.apply(n, e)
      return o instanceof Object ? o : n
    }(Function, h)).apply(null, y)
  }
  const pe = []
  const de = [{}, {
    value: void 0,
  }, {
    value: null,
  }, {
    value: !0,
  }, {
    value: !1,
  }]

  function he(t) {
    t > 4 && --de[t].refcount === 0 && (de[t] = void 0,
    pe.push(t))
  }

  function ye() {
    for (var t = 0, e = 5; e < de.length; ++e)
      void 0 !== de[e] && ++t
    return t
  }

  function me() {
    for (let t = 5; t < de.length; ++t) {
      if (void 0 !== de[t])
        return de[t]
    }
    return null
  }
  var ve = {
    toValue(t) {
      return t || vt(`Cannot use deleted val. handle = ${t}`),
      de[t].value
    },
    toHandle(t) {
      switch (t) {
        case void 0:
          return 1
        case null:
          return 2
        case !0:
          return 3
        case !1:
          return 4
        default:
          var e = pe.length ? pe.pop() : de.length
          return de[e] = {
            refcount: 1,
            value: t,
          },
          e
      }
    },
  }

  function ge(t) {
    if (t === null)
      return 'null'
    const e = typeof t
    return e === 'object' || e === 'array' || e === 'function' ? t.toString() : `${t}`
  }

  function we(t, e) {
    switch (e) {
      case 2:
        return function (t) {
          return this.fromWireType(M[t >> 2])
        }
      case 3:
        return function (t) {
          return this.fromWireType(I[t >> 3])
        }
      default:
        throw new TypeError(`Unknown float type: ${t}`)
    }
  }

  function be(t, e, r) {
    switch (e) {
      case 0:
        return r
          ? function (t) {
            return S[t]
          }
          : function (t) {
            return O[t]
          }
      case 1:
        return r
          ? function (t) {
            return k[t >> 1]
          }
          : function (t) {
            return W[t >> 1]
          }
      case 2:
        return r
          ? function (t) {
            return j[t >> 2]
          }
          : function (t) {
            return R[t >> 2]
          }
      default:
        throw new TypeError(`Unknown integer type: ${t}`)
    }
  }
  var Te = {
    mappings: {},
    buffers: [null, [], [],
    ],
    printChar(t, e) {
      const r = Te.buffers[t]
      e === 0 || e === 10
        ? ((t === 1 ? v : g)(UTF8ArrayToString(r, 0)),
          r.length = 0)
        : r.push(e)
    },
    varargs: void 0,
    get() {
      return Te.varargs += 4,
      j[Te.varargs - 4 >> 2]
    },
    getStr(t) {
      return UTF8ToString(t)
    },
    get64(t, e) {
      return t
    },
  }

  function $e(t) {
    return t % 4 === 0 && (t % 100 != 0 || t % 400 === 0)
  }

  function Pe(t, e) {
    for (var r = 0, n = 0; n <= e; r += t[n++])
      ;
    return r
  }
  const Ae = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const De = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  function Fe(t, e) {
    for (var r = new Date(t.getTime()); e > 0;) {
      const n = $e(r.getFullYear())
      const o = r.getMonth()
      const i = (n ? Ae : De)[o]
      if (!(e > i - r.getDate())) {
        return r.setDate(r.getDate() + e),
        r
      }
      e -= i - r.getDate() + 1,
      r.setDate(1),
      o < 11
        ? r.setMonth(o + 1)
        : (r.setMonth(0),
          r.setFullYear(r.getFullYear() + 1))
    }
    return r
  }

  for (var t = Array.from({ length: 256 }), e = 0; e < 256; ++e)
    t[e] = String.fromCharCode(e)
  st = t

  mt = o.BindingError = yt(Error, 'BindingError'),
  gt = o.InternalError = yt(Error, 'InternalError'),
  Rt.prototype.isAliasOf = Ct,
  Rt.prototype.clone = Ft,
  Rt.prototype.delete = Et,
  Rt.prototype.isDeleted = St,
  Rt.prototype.deleteLater = jt,
  re.prototype.getPointee = Lt,
  re.prototype.destructor = Gt,
  re.prototype.argPackAdvance = 8,
  re.prototype.readValueFromPointer = Bt,
  re.prototype.deleteObject = Nt,
  re.prototype.fromWireType = ee,
  o.getInheritedInstanceCount = Jt,
  o.getLiveInheritedInstances = Xt,
  o.flushPendingDeletes = Wt,
  o.setDelayFunction = Zt,
  ae = o.UnboundTypeError = yt(Error, 'UnboundTypeError'),
  o.count_emval_handles = ye,
  o.get_first_emval = me
  let Se; const import_table_impl = {
    d(t, e, r, n) {
      abort(`Assertion failed: ${UTF8ToString(t)}, at: ${[e ? UTF8ToString(e) : 'unknown filename', r, n ? UTF8ToString(n) : 'unknown function']}`)
    },
    g(t) {
      return ke(t + 16) + 16
    },
    f(t, e, r) {
      throw new ExceptionInfo(t).init(e, r), t, t
    },
    p(t, e, r, n, o) {},
    y(t, e, r, n, o) {
      const i = ut(r)
      _t(t, {
        name: e = ct(e),
        fromWireType(t) {
          return !!t
        },
        toWireType(t, e) {
          return e ? n : o
        },
        argPackAdvance: 8,
        readValueFromPointer(t) {
          let n
          if (r === 1) { n = S }
          else if (r === 2) { n = k }
          else {
            if (r !== 4)
              throw new TypeError(`Unknown boolean type size: ${e}`)
            n = j
          }
          return this.fromWireType(n[t >> i])
        },
        destructorFunction: null,
      })
    },
    A(t, e, r, n, o, i, a, u, s, c, f, l, p) {
      f = ct(f),
      i = ie(o, i),
      u && (u = ie(a, u)),
      c && (c = ie(s, c)),
      p = ie(l, p)
      const d = dt(f)
      xt(d, () => {
        se(`Cannot construct ${f} due to unbound types`, [n])
      }),
      bt([t, e, r], n ? [n] : [], (e) => {
        let r, o
        e = e[0],
        o = n ? (r = e.registeredClass).instancePrototype : Rt.prototype
        const a = ht(d, function () {
          if (Object.getPrototypeOf(this) !== s)
            throw new mt(`Use 'new' to construct ${f}`)
          if (void 0 === l.constructor_body)
            throw new mt(`${f} has no accessible constructor`)
          const t = l.constructor_body[arguments.length]
          if (void 0 === t)
            throw new mt(`Tried to invoke ctor of ${f} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(l.constructor_body).toString()}) parameters instead!`)
          return t.apply(this, arguments)
        })
        var s = Object.create(o, {
          constructor: {
            value: a,
          },
        })
        a.prototype = s
        var l = new Ut(f, a, s, p, r, i, u, c)
        const h = new re(f, l, !0, !1, !1)
        const y = new re(`${f}*`, l, !1, !1, !1)
        const m = new re(`${f} const*`, l, !1, !0, !1)
        return Mt[t] = {
          pointerType: y,
          constPointerType: m,
        },
        ne(d, a),
        [h, y, m]
      })
    },
    w(t, e, r, n, o, i) {
      T(e > 0)
      const a = ce(e, r)
      o = ie(n, o),
      bt([], [t], (t) => {
        const r = `constructor ${(t = t[0]).name}`
        if (void 0 === t.registeredClass.constructor_body && (t.registeredClass.constructor_body = []),
        void 0 !== t.registeredClass.constructor_body[e - 1])
          throw new mt(`Cannot register multiple constructors with identical number of parameters (${e - 1}) for class '${t.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`)
        return t.registeredClass.constructor_body[e - 1] = function () {
          se(`Cannot construct ${t.name} due to unbound types`, a)
        },
        bt([], a, (n) => {
          return n.splice(1, 0, null),
          t.registeredClass.constructor_body[e - 1] = le(r, n, null, o, i),
          []
        }),
        []
      })
    },
    c(t, e, r, n, o, i, a, u) {
      const s = ce(r, n)
      e = ct(e),
      i = ie(o, i),
      bt([], [t], (t) => {
        const n = `${(t = t[0]).name}.${e}`

        function o() {
          se(`Cannot call ${n} due to unbound types`, s)
        }
        e.startsWith('@@') && (e = Symbol[e.substring(2)]),
        u && t.registeredClass.pureVirtualFunctions.push(e)
        const c = t.registeredClass.instancePrototype
        const f = c[e]
        return void 0 === f || void 0 === f.overloadTable && f.className !== t.name && f.argCount === r - 2
          ? (o.argCount = r - 2,
            o.className = t.name,
            c[e] = o)
          : (It(c, e, n),
            c[e].overloadTable[r - 2] = o),
        bt([], s, (o) => {
          const u = le(n, o, t, i, a)
          return void 0 === c[e].overloadTable
            ? (u.argCount = r - 2,
              c[e] = u)
            : c[e].overloadTable[r - 2] = u,
          []
        }),
        []
      })
    },
    x(t, e) {
      _t(t, {
        name: e = ct(e),
        fromWireType(t) {
          const e = ve.toValue(t)
          return he(t),
          e
        },
        toWireType(t, e) {
          return ve.toHandle(e)
        },
        argPackAdvance: 8,
        readValueFromPointer: Bt,
        destructorFunction: null,
      })
    },
    j(t, e, r) {
      const n = ut(r)
      _t(t, {
        name: e = ct(e),
        fromWireType(t) {
          return t
        },
        toWireType(t, e) {
          if (typeof e != 'number' && typeof e != 'boolean')
            throw new TypeError(`Cannot convert "${ge(e)}" to ${this.name}`)
          return e
        },
        argPackAdvance: 8,
        readValueFromPointer: we(e, n),
        destructorFunction: null,
      })
    },
    l(t, e, r, n, o, i) {
      // Registering functions from constructor (;204;)
      const a = ce(e, r)
      t = ct(t),
      o = ie(n, o),
      xt(t, () => {
        se(`Cannot call ${t} due to unbound types`, a)
      }, e - 1),
      bt([], a, (r) => {
        const n = [r[0], null].concat(r.slice(1))
        return ne(t, le(t, n, null, o, i), e - 1),
        []
      })
    },
    b(t, e, r, n, o) {
      e = ct(e),
      o === -1 && (o = 4294967295)
      const i = ut(r)
      let a = function (t) {
        return t
      }
      if (n === 0) {
        const u = 32 - 8 * r
        a = function (t) {
          return t << u >>> u
        }
      }
      const s = e.includes('unsigned')
      _t(t, {
        name: e,
        fromWireType: a,
        toWireType(t, r) {
          if (typeof r != 'number' && typeof r != 'boolean')
            throw new TypeError(`Cannot convert "${ge(r)}" to ${this.name}`)
          if (r < n || r > o)
            throw new TypeError(`Passing a number "${ge(r)}" from JS side to C/C++ side to an argument of type "${e}", which is outside the valid range [${n}, ${o}]!`)
          return s ? r >>> 0 : 0 | r
        },
        argPackAdvance: 8,
        readValueFromPointer: be(e, i, n !== 0),
        destructorFunction: null,
      })
    },
    a(t, e, r) {
      const n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][e]

      function o(t) {
        const e = R
        const r = e[t >>= 2]
        const o = e[t + 1]
        return new n(E, o, r)
      }
      _t(t, {
        name: r = ct(r),
        fromWireType: o,
        argPackAdvance: 8,
        readValueFromPointer: o,
      }, {
        ignoreDuplicateRegistrations: !0,
      })
    },
    k(t, e) {
      const r = (e = ct(e)) === 'std::string'
      _t(t, {
        name: e,
        fromWireType(t) {
          let e; const n = R[t >> 2]
          if (r) {
            for (var o = t + 4, i = 0; i <= n; ++i) {
              const a = t + 4 + i
              if (i === n || O[a] === 0) {
                const u = UTF8ToString(o, a - o)
                void 0 === e
                  ? e = u
                  : (e += String.fromCharCode(0),
                    e += u),
                o = a + 1
              }
            }
          }
          else {
            const s = new Array(n)
            for (i = 0; i < n; ++i)
              s[i] = String.fromCharCode(O[t + 4 + i])
            e = s.join('')
          }
          return We(t),
          e
        },
        toWireType(t, e) {
          e instanceof ArrayBuffer && (e = new Uint8Array(e))
          const n = typeof e === 'string'
          n || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array || vt('Cannot pass non-string to std::string')
          const o = (r && n
            ? function () {
              return UTF8CharCount(e)
            }
            : function () {
              return e.length
            }
          )()
          const i = ke(4 + o + 1)
          if (R[i >> 2] = o,
          r && n) { stringToUTF8Array(e, O, i + 4, o + 1) }
          else if (n) {
            for (var a = 0; a < o; ++a) {
              const u = e.charCodeAt(a)
              u > 255 && (We(i),
              vt('String has UTF-16 code units that do not fit in 8 bits')),
              O[i + 4 + a] = u
            }
          }
          else {
            for (a = 0; a < o; ++a)
              O[i + 4 + a] = e[a]
          }
          return t !== null && t.push(We, i),
          i
        },
        argPackAdvance: 8,
        readValueFromPointer: Bt,
        destructorFunction(t) {
          We(t)
        },
      })
    },
    e(t, e, r) {
      let n, o, i, a, u
      r = ct(r),
      e === 2
        ? (n = UTF16ArrayToString,
          o = H,
          a = Y,
          i = function () {
            return W
          },
          u = 1)
        : e === 4 && (n = V,
        o = z,
        a = B,
        i = function () {
          return R
        },
        u = 2),
      _t(t, {
        name: r,
        fromWireType(t) {
          for (var r, o = R[t >> 2], a = i(), s = t + 4, c = 0; c <= o; ++c) {
            const f = t + 4 + c * e
            if (c === o || a[f >> u] === 0) {
              const l = n(s, f - s)
              void 0 === r
                ? r = l
                : (r += String.fromCharCode(0),
                  r += l),
              s = f + e
            }
          }
          return We(t),
          r
        },
        toWireType(t, n) {
          typeof n != 'string' && vt(`Cannot pass non-string to C++ string type ${r}`)
          const i = a(n)
          const s = ke(4 + i + e)
          return R[s >> 2] = i >> u,
          o(n, s + 4, i + e),
          t !== null && t.push(We, s),
          s
        },
        argPackAdvance: 8,
        readValueFromPointer: Bt,
        destructorFunction(t) {
          We(t)
        },
      })
    },
    z(t, e) {
      _t(t, {
        isVoid: !0,
        name: e = ct(e),
        argPackAdvance: 0,
        fromWireType() {},
        toWireType(t, e) {},
      })
    },
    m: he,
    n(t) {
      t > 4 && (de[t].refcount += 1)
    },
    o(t, e) {
      let r, n, o
      n = '_emval_take_value',
      void 0 === (o = lt[r = t]) && vt(`${n} has unknown type ${ue(r)}`)
      const i = (t = o).readValueFromPointer(e)
      return ve.toHandle(i)
    },
    h() {
      abort('')
    },
    r(t, e, r) {
      O.copyWithin(t, e, e + r)
    },
    s(t) {
      O.length,
      abort('OOM')
    },
    u(t, e) {},
    v(t, e) {},
    i(t, e, r, n) {
      for (var o = 0, i = 0; i < r; i++) {
        const a = j[e >> 2]
        const u = j[e + 4 >> 2]
        e += 8
        for (let s = 0; s < u; s++)
          Te.printChar(t, O[a + s])
        o += u
      }
      return j[n >> 2] = o,
      0
    },
    q(t) {
      t
    },
    t(t, e, r, n) {
      return ee(t, e, r, n)
    },
  }
  var ke = ((function () {
    const import_table = {
      a: import_table_impl,
    }

    function updateGlobalBufferAndViews(t, e) {
      let r; let n; const exports = t.exports
      o.asm = exports
      b = o.asm.B // Mem
      r = b.buffer
      E = r
      o.HEAP8 = S = new Int8Array(r),
      o.HEAP16 = k = new Int16Array(r),
      o.HEAP32 = j = new Int32Array(r),
      o.HEAPU8 = O = new Uint8Array(r),
      o.HEAPU16 = W = new Uint16Array(r),
      o.HEAPU32 = R = new Uint32Array(r),
      o.HEAPF32 = M = new Float32Array(r),
      o.HEAPF64 = I = new Float64Array(r),
      L = o.asm.D // Table
      n = o.asm.C // ctor
      N.unshift(n),
      (function (t) {
        if (J--,
        o.monitorRunDependencies && o.monitorRunDependencies(J),
        J === 0 && (X !== null && (clearInterval(X),
        X = null),
        Z)) {
          const e = Z
          Z = null,
          e()
        }
      }())
    }

    function load_wasm(t) {
      updateGlobalBufferAndViews(t.instance)
    }

    function getBinaryPromise(e) {
      return (function () {
        if (!w && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
          if (typeof fetch === 'function' && !isFileURI(Q)) {
            return fetch(Q, {
              credentials: 'same-origin',
            }).then(((t) => {
              if (!t.ok)
                throw `failed to load wasm binary file at '${Q}'`
              return t.arrayBuffer()
            })).catch((() => {
              return getBinary(Q)
            }))
          }
          if (readAsync) {
            return new Promise(((t, e) => {
              readAsync(Q, (e) => {
                t(new Uint8Array(e))
              }, e)
            }))
          }
        }
        return Promise.resolve().then((() => {
          return getBinary(Q)
        }))
      }()).then(((e) => {
        return WebAssembly.instantiate(e, import_table)
      })).then(((t) => {
        return t
      })).then(e, (t) => {
        g(`failed to asynchronously prepare wasm: ${t}`),
        abort(t)
      })
    }
    if (J++,
    o.monitorRunDependencies && o.monitorRunDependencies(J),
    o.instantiateWasm) {
      try {
        return o.instantiateWasm(import_table, updateGlobalBufferAndViews)
      }
      catch (t) {
        return g(`Module.instantiateWasm callback failed with error: ${t}`),
        !1
      }
    }
    w || typeof WebAssembly.instantiate != 'function' || isDataURI(Q) || isFileURI(Q) || getBinaryPromise(load_wasm)
  }()),
  o.___wasm_call_ctors = function () {
    return (o.___wasm_call_ctors = o.asm.C).apply(null, arguments)
  },
  o._malloc = function () {
    return (ke = o._malloc = o.asm.E).apply(null, arguments)
  }
  )
  var We = o._free = function () {
    return (We = o._free = o.asm.F).apply(null, arguments)
  }
  var je = o.___getTypeName = function () {
    return (je = o.___getTypeName = o.asm.G).apply(null, arguments)
  }
  o.___embind_register_native_and_builtin_types = function () {
    return (o.___embind_register_native_and_builtin_types = o.asm.H).apply(null, arguments)
  },
  o.dynCall_jiji = function () {
    return (o.dynCall_jiji = o.asm.I).apply(null, arguments)
  },
  o.dynCall_iiiiij = function () {
    return (o.dynCall_iiiiij = o.asm.J).apply(null, arguments)
  },
  o.dynCall_iiiiijj = function () {
    return (o.dynCall_iiiiijj = o.asm.K).apply(null, arguments)
  },
  o.dynCall_iiiiiijj = function () {
    return (o.dynCall_iiiiiijj = o.asm.L).apply(null, arguments)
  },
  o.dynCall_viijii = function () {
    return (o.dynCall_viijii = o.asm.M).apply(null, arguments)
  }

  function ExitStatus(t) {
    this.name = 'ExitStatus',
    this.message = `Program terminated with exit(${t})`,
    this.status = t
  }

  function doRun(t) {
    function postRun() {
      Se || (Se = !0, o.calledRun = !0, C || (!0,
      callRuntimeCallbacks(N),
      o.onRuntimeInitialized && o.onRuntimeInitialized(),
      (function () {
        if (o.postRun) {
          for (typeof o.postRun === 'function' && (o.postRun = [o.postRun]); o.postRun.length;) {
            t = o.postRun.shift(),
            q.unshift(t)
          }
        }
        let t
        callRuntimeCallbacks(q)
      }())))
    }
    t = t || l
    J > 0 || (!(function preRun() {
      if (o.preRun) {
        for (typeof o.preRun === 'function' && (o.preRun = [o.preRun]); o.preRun.length;) {
          t = o.preRun.shift(),
          G.unshift(t)
        }
      }
      let t
      callRuntimeCallbacks(G)
    }()),
    J > 0 || (o.setStatus
      ? (o.setStatus('Running...'),
        setTimeout(() => {
          setTimeout(() => {
            o.setStatus('')
          }, 1),
          postRun()
        }, 1))
      : postRun()))
  }
  if (Z = function t() {
    Se || doRun(),
    Se || (Z = t)
  },
  o.run = doRun,
  o.preInit) {
    for (typeof o.preInit === 'function' && (o.preInit = [o.preInit]); o.preInit.length > 0;)
      o.preInit.pop()()
  }
  doRun()
  return o
}
let fpRuntime
export function InstantiateRuntime() {
  return new Promise((resolve, reject) => {
    fpRuntime = AudioFingerprintRuntime()
    var monitor = setInterval(() => {
      // Wait for ctor
      if (typeof fpRuntime.ExtractQueryFP === 'function')
        resolve(fpRuntime) || clearInterval(monitor)
    })
  })
}
export function GenerateFP(PCMBuffer) {
  /* Generates audio fingerprint via ShazamV2 algorithm,
      as implmented by afp.wasm

      input : (Float32Array) 8kHz Mono PCM audio sample
      output: (string) Base64 Encoded AFP
  */
  if (typeof fpRuntime.ExtractQueryFP != 'function')
    return console.error('InstantiateRuntime() Must be called first.')

  const fp_vector = fpRuntime.ExtractQueryFP(PCMBuffer.buffer)
  const result_buf = new Uint8Array(fp_vector.size())
  for (let t = 0; t < fp_vector.size(); t++)
    result_buf[t] = fp_vector.get(t)
  return btoa(String.fromCharCode(...result_buf))
}
