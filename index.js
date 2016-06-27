var fs = require('fs')
var path = require('path')

var Gen = require('./lib/gen')
var Mustache = require('Mustache')

module.exports = function(opts) {
	opts = opts || {}

	opts.lang = opts.lang || 'js'
	opts.lib =  opts.lib || './lib/mylib'
	opts.dir = opts.dir || './'
	opts.out = opts.out || path.join(opts.dir, 'out')


	var mustpath = path.join(__dirname, 'templates', opts.lang)
	var musttemp = {
		array: fs.readFileSync(path.join(mustpath, 'array.mustache'), {encoding: 'utf8'}),
		extern: fs.readFileSync(path.join(mustpath, 'extern.mustache'), {encoding: 'utf8'}),
		funcptr: fs.readFileSync(path.join(mustpath, 'funcptr.mustache'), {encoding: 'utf8'}),
		pointer: fs.readFileSync(path.join(mustpath, 'pointer.mustache'), {encoding: 'utf8'}),
		struct: fs.readFileSync(path.join(mustpath, 'struct.mustache'), {encoding: 'utf8'}),
		typedef: fs.readFileSync(path.join(mustpath, 'typedef.mustache'), {encoding: 'utf8'}),
		union: fs.readFileSync(path.join(mustpath, 'union.mustache'), {encoding: 'utf8'}),
		ffi: fs.readFileSync(path.join(mustpath, 'ffi.mustache'), {encoding: 'utf8'}),
	}

	fs.mkdir(opts.out, function() {
		read(opts.dir).filter(filter).forEach(generate)
	})

	function read(dir) {
		var result = []
		var files = fs.readdirSync(dir)
		files.forEach(function(file) {
			file = path.resolve(dir, file)
			if(fs.statSync(file).isDirectory()) {
				result = result.concat(read(file))
			} else {
				result.push(file)
			}
		})
		return result
	}

	function filter(item) {
		return path.extname(item) == '.h'
	}

	function generate(item, index) {
		var out = path.join(opts.out, path.parse(item).name + '.' + opts.lang)
		console.log('generating file ' + (index + 1) + ' : ' + item + ' => ' + out)
		var gen = Gen({
			file: item,
			dir: opts.dir,
			args: opts.args
		})

		gen.types = gen.types.map(function(item, index) {
			var type = item.type.toLowerCase()
			return Mustache.render(musttemp[type], item)
		})
		gen.library = opts.lib

		gen = Mustache.render(musttemp.ffi, gen)
		fs.writeFileSync(out, gen)
	}
}