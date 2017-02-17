var ffigen = require('../index')

ffigen({
	lib: "process.platform == 'win32' ? 'SDL2_image' : 'libSDL2_image'",
	args: ['-I/Users/zetsin/work/node-sdl2/dep/include'],
	dir: '/Users/zetsin/work/node-sdl2-image/dep/include',
	out: '/Users/zetsin/work/node-sdl2-image/dep'
})