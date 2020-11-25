const chokidar = require( 'chokidar' )

chokidar.watch( '.', { ignored: /build|node_modules/ } ).on( 'all', ( event, path ) => {
  require( 'esbuild' ).build( {
    entryPoints: [ './static/js/index.js' ],
    bundle: true,
    minify: true,
    sourcemap: true,
    splitting: true,
    format: 'esm',
    outdir: 'build/js',
    // define: { 'process.env.NODE_ENV': '"production"' },
    target: [ 'chrome58', 'firefox57', 'safari11', 'edge16' ],
  } ).catch( () => {
    process.exit( 1 )
  } )
} )

