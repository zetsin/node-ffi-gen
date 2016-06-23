var FFI = require('ffi')
var ArrayType = require('ref-array')
var Struct = require('ref-struct')
var Union = require('ref-union');
var ref = require('ref')


var A = exports.A = {
	a: 0,
}

var uint32 = exports.uint32 = ref.types.uint32
var c__SA_B = exports.c__SA_B = Struct({
	b: uint32,
})
var B = exports.B = c__SA_B
var voit = exports.voit = ref.types.void
var c = FFI.Function( voit, [ c__SA_B, ] )

FFI.Library(__dirname + '/libclang', {
}, exports)