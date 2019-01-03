export default {
  input: 'dist/index.js',
  output: {
    file: 'bundles/chinese-whispers.es6.umd.js',
    format: 'umd',
    name: 'window',
    sourcemap: true,
    banner: '/* chinese-whisper version ' + require('./package.json').version + ' */',
    footer: '/* https://git.io/zixia/ */'
  },
}
