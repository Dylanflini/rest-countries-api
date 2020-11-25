const chokidar = require( 'chokidar' )

chokidar.watch( '.', { ignored: /build|node_modules/ } ).on( 'all', ( event, path ) => {
  require( 'esbuild' ).build( {
    entryPoints: [ './static/css/index.css', './static/css/layout.css', './static/css/defer.css' ],
    bundle: true,
    minify: true,
    outdir: 'build/css',
    target: [ 'chrome58', 'firefox57', 'safari11', 'edge16' ],
  } ).catch( () => {
    process.exit( 1 )
  } )
} )

