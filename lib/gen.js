var path = require('path')

var libclang = require('libclang-bootstrap')

var Index = libclang.Index
var TranslationUnit = libclang.TranslationUnit
var Cursor = libclang.Cursor
var Type = libclang.Type

module.exports = function gen(opts) {
	var Includes = {}
	var Defines = []
	var Enums = {}
	var Types = {}
	var Functions = []
	var Recordings = {}

	opts.args = opts.args || []
	opts.file = path.normalize(opts.file)
	opts.dir = path.normalize(opts.dir)
	opts.lang = opts.lang || 'js'
	var ffitype = require('../templates/' + opts.lang + '/type.js')

	var route = {
		Typedef: Typedef,
		Pointer: Pointer,
		ConstantArray: ConstantArray,
		IncompleteArray: ConstantArray,
		Record: Record,
		Enum: Enum,
		FunctionProto: FunctionProto,
		FunctionNoProto: FunctionProto,
		Unexposed: Unexposed,
		Unknown: Unknown
	}

	index()

	return {
		includes: Object.keys(Includes).map(function (key) {return Includes[key]}),
		enums: Object.keys(Enums).map(function (key) {return Enums[key]}),
		types: Object.keys(Types).map(function (key) {return Types[key]}),
		functions: Functions
	}

	function index() {
		var index = Index(true, true)
		TranslationUnit(
			index, 
			opts.file, 
			opts.args
		).cursor.visitChildren(function (parent) {
			if(this.location.filename == opts.file) {
				var value = parse(this, this.type, parent)
				if(this.kind ==  Cursor.FunctionDecl) {
					if(value) {
						Functions.push(value)
					}
				}
			}
		})
		index.dispose()
	}

	function parse(cursor, type, parent) {

		if(type.canonicalType.kind != Type.Enum) {
			var name = cursor.spelling || cursor.usr.replace(/\W/g, '_')
			var file = cursor.location.filename
			if(file) {
				file = path.normalize(file)
				if(file != opts.file && file.indexOf(opts.dir) == 0) {
					file = path.parse(file).name
					var lib = file + '_lib'
					Includes[file] = {
						type: 'Include',
						name: lib,
						value: file
					}
					Types[name] = {
						type: 'Extern',
						name: name,
						value: lib
					}
					return name
				}
			}

			if(Types[name]) {
				return name
			}
		}

		return (route[Type[type.kind]] || route.Unknown)(cursor, type, parent)
	}
	function Typedef (cursor, type, parent) {
		var name = cursor.spelling || cursor.usr.replace(/\W/g, '_')
		var canonical = type.canonicalType
		var declaration = canonical.typeDeclaration
		var value = parse(declaration, canonical, type.typeDeclaration)

		if(canonical.kind == Type.Enum) {
			if(!declaration.spelling) {
				var usr = declaration.usr.replace(/\W/g, '_')
				Enums[name] = Enums[usr]
				Enums[name].name = name
				delete Enums[usr]
			}

			return value
		}

		if(!Types[name] && !Enums[name]) {
			Types[name] = {
				type: 'Typedef',
				name: name,
				value: value
			}
		}

		if(canonical.kind == Type.Enum) {
			return value
		} else {
			return name
		}
	}
	function Pointer (cursor, type, parent) {
		var name = cursor.spelling || cursor.usr.replace(/\W/g, '_')
		name = name || parent.spelling || parent.usr.replace(/\W/g, '_')

		var pointeeType = type.pointeeType
		var declaration = pointeeType.typeDeclaration


		if(pointeeType.kind == Type.Char_S) {
			name = ffiname('string')
		} 
		else {
			var value = parse(declaration, pointeeType, cursor)
			if(
				pointeeType.kind == Type.FunctionProto ||
				pointeeType.kind == Type.FunctionNoProto
			) {
				Types[name] = {
					type: 'FuncPtr',
					name: name,
					value: value
				}
			} 
			else {
				name = value + '_ptr'
				Types[name] = {
					type: 'Pointer',
					name: name,
					value: value
				}
			}
		}
		return name
	}
	function ConstantArray (cursor, type, parent) {
		var name = cursor.spelling || cursor.usr.replace(/\W/g, '_') || parent.usr.replace(/\W/g, '_')

		var arrayElementType = type.arrayElementType
		var declaration = arrayElementType.typeDeclaration
		var numElements = type.numElements
		var value = parse(declaration, arrayElementType, cursor)

		name = name + '_arr'

		Types[name] = {
			type: 'Array',
			name: name,
			value: value,
			size: numElements > 0 ? numElements : 0
		}
		return name
	}
	function Record (cursor, type, parent) {
		var name = cursor.spelling || cursor.usr.replace(/\W/g, '_')
		if(!name) {
			return
		}
		if(Recordings[name]) {
			return ffiname(Type.Void)
		} 
		else {
			Recordings[name] = true
		}

		var value = {
			type: cursor.kindName.replace('Decl', ''),
			name: name,
			value: []
		}


		cursor.visitChildren(function(parent) {
			if(this.kind == Cursor.FieldDecl) {
				var t =  this.type
				var v = parse(t.typeDeclaration, t, this)
				value.value.push({
					name: this.spelling,
					value: v
				})
			}
		})

		Recordings[name] = undefined
		Types[name] = value
		return name
	}

	function Enum (cursor, type, parent) {
		var name = cursor.spelling || cursor.usr.replace(/\W/g, '_')

		if(!name) {
			return
		}

		var enumTypeSpelling = cursor.enumType.spelling

		if(!Enums[name]) {
			var value = {
				type: 'Enum',
				name: name,
				value: []
			}
			cursor.visitChildren(function(parent) {
				value.value.push({
					name: this.spelling,
					value: enumTypeSpelling[0] == 'U' ? this.enumUValue : this.enumValue
				})
			})
			Enums[name] = value
		}

		return ffiname(Type[enumTypeSpelling])
	}
	function FunctionProto (cursor, type, parent) {
		var name = cursor.spelling || cursor.usr.replace(/\W/g, '_')

		var isFunctionInlined = false
		cursor.visitChildren(function (p) {
			if(this.kind == Cursor.CompoundStmt) {
				isFunctionInlined = true
			}
		})
		if(isFunctionInlined) {
			return
		}
		var resultType = type.resultType
		var value = {
			name: name,
			args: [],
			result: parse(resultType.typeDeclaration, resultType, cursor)
		}

		for (var i = 0; i < type.numArgTypes; i++) {
			var t = type.getArgType(i)
			var declaration = t.typeDeclaration
			var arg = parse(declaration, t, cursor)
			value.args.push(arg)
		}

		return value
	}
	function Unexposed (cursor, type, parent) {
		var declaration = type.typeDeclaration
		return parse(declaration, declaration.type, cursor)
	}
	function Unknown (cursor, type, parent) {
		return ffiname(type.kind)
	}

	function ffiname(kind) {
		var value = ffitype(kind) || ffitype(Type.Void)

		Types[value.name] = {
			type: 'Typedef',
			name: value.name,
			value: value.type
		}
		return value.name
	}
}