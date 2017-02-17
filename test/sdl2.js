var ffigen = require('../index')

ffigen({
	lib: "process.platform == 'win32' ? 'SDL2' : 'libSDL2'",
	args: [],
	dir: '/Users/zetsin/work/node-sdl2/dep/include',
	out: '/Users/zetsin/work/node-sdl2/dep'
})