export default {
  entry: 'dist/index.js',
  dest: 'bundles/chinese-whispers.es6.umd.js',
  sourceMap: true,
  format: 'umd',
  moduleName: 'window',
  banner: '/* chinese-whisper version ' + require('./package.json').version + ' */',
  footer: '/* https://git.io/zixia/ */'
}
