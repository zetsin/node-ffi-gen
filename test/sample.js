var FFI = require('ffi')
var ArrayType = require('ref-array')
var Struct = require('ref-struct')
var Union = require('ref-union');
var ref = require('ref')



var voit = exports.voit = ref.types.void
var a = exports.a = voit
var b = exports.b = voit
var b_ptr = exports.b_ptr = ref.refType(b)
var a = exports.a = Struct({
	xx: b_ptr,
})
var a_ptr = exports.a_ptr = ref.refType(a)
var int32 = exports.int32 = ref.types.int32
var b = exports.b = Struct({
	yy: a_ptr,
	c: int32,
})

FFI.Library(test, {
}, exports)