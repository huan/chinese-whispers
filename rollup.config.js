export default {
  input: 'dist/index.js',
  output: {
    file: 'bundles/chinese-whispers.es6.umd.js',
    format: 'umd',
  },
  sourcemap: true,
  name: 'window',
  banner: '/* chinese-whisper version ' + require('./package.json').version + ' */',
  footer: '/* https://git.io/zixia/ */'
}
