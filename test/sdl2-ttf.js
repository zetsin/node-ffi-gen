var ffigen = require('../index')

ffigen({
	lib: "process.platform == 'win32' ? 'SDL2_ttf' : 'libSDL2_ttf'",
	args: ['-I/Users/zetsin/work/node-sdl2/dep/include'],
	dir: '/Users/zetsin/work/node-sdl2-ttf/dep/include',
	out: '/Users/zetsin/work/node-sdl2-ttf/dep'
})