var ffigen = require('../index')

ffigen({
	lib: "process.platform == 'win32' ? 'SDL2_gfx' : 'libSDL2_gfx'",
	args: ['-I/Users/zetsin/work/node-sdl2/dep/include'],
	dir: '/Users/zetsin/work/node-sdl2-gfx/dep/include',
	out: '/Users/zetsin/work/node-sdl2-gfx/dep'
})