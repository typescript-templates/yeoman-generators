'use strict';
const BuildMode = require('./tools/gulp/gulpBuildMode');

const Paths = {
  // source
  sourcePath: 'src',

  // target
  targetPath: 'generators',
  
  // test
  testPath: 'test',

  // docs
  docsPath: 'docs'
}

const GulpConfig =  {

  buildMode: BuildMode.dev,

  // Root path
  rootPath: __dirname,

  // source
  sourcePath: Paths.sourcePath,
  tsSourceFiles: Paths.sourcePath + '/**/*.ts',

  // test
  testPath: Paths.testPath,
  testFiles: `${Paths.testPath}/**/*.ts`,

  // target
  targetPath: Paths.targetPath,

  // docs
  docsPath: Paths.docsPath,
  docsFiles: Paths.docsPath + '/**/*',

  // Static files
  statics: [
    {
      sourcePath: `${Paths.sourcePath}/**/templates/**/*`,
      targetPath: `${Paths.targetPath}`
    }
  ],

  npmLink: [
    // {
    //   name: 'module-name1',
    //   path: '../'
    // },
    // {
    //   name: 'module-name2',
    //   path: '../'
    // }
  ]

}

module.exports = GulpConfig;
