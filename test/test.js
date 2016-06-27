var ffigen = require('../index')

ffigen({
	lib: '/libclang',
	args: ['-I/Users/zetsin/work/node-libclang-bootstrap/lib/include/'],
	dir: '/Users/zetsin/work/node-libclang-bootstrap/lib/include/clang-c/',
	out: '/Users/zetsin/work/node-libclang-bootstrap/lib/'
})