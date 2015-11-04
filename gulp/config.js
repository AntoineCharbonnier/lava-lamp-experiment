var srcPath = 'app/'
var dstPath = 'public/'

module.exports = {
  global: {
    javascript_compiler: 'babel' // es6 or coffee
  },

  html: {
    src:   dstPath + '*.html',
    opts: {
      cwd: dstPath
    }
  },

  watch: {
    files: [
      dstPath + '**/*.{js,css,html,frag,vert}'
    ]
  },

  babel: {
    src:      srcPath + 'scripts/**/*.{es,es6,js,babel}',
    dst:     dstPath + 'scripts/',
    options: {
      dev: {
        modules: "common"
      },
      dist: {
        modules: "common",
        compact: true,
        comments: false
      }
    }
  },

  sass: {
    src:      srcPath + 'styles/**/*.{scss,sass}',
    srcPath: srcPath + 'styles/',
    dstPath: dstPath + 'styles/',
    options: {
      dev: {
        sourcemap: true
      },
      dist: {
        sourcemap: false,
        style: "compressed"
      }
    }
  },

  browserSync: {
    open:          false,
    watchOptions: {
      debounceDelay: 1000
    },
    // proxy: "http://localhost:3000",
    // port: 7000,
    server: { baseDir: './public' }
  },

  // browserSync.init(null, {
  //   proxy: "http://localhost:5000",
  //       files: ["public/**/*.*"],
  //       browser: "google chrome",
  //       port: 7000,
  // });

  browserify: {
    opts: {
      debug: true,
      entries: [srcPath + 'scripts/main.js'],
      paths     : [srcPath + 'scripts'],
      extensions: ['.js', '.es']
    },
    modulePath:  srcPath + 'scripts/modules/',
    extensions: ['.js'],
    source:     'main.js',
    dstPath:    dstPath + 'scripts/'
  },

  vendor: {
    scripts: {
      source:   'vendors.js',
      dstPath: dstPath + 'scripts/'
    }
  }
}
