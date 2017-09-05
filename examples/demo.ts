import ChineseWhispers from '../' // chinese-whispers'

function weightFunc(a: number, b: number): number {
  const dist = Math.abs(a - b)
  // console.log('a: ', a, ' b: ', b, ' dist: ', dist)
  return 1 / dist
}

const cw = new ChineseWhispers({
  weightFunc,
  epochs: 10,
  threshold: 1 / 10,
})

const array = [
  0,
  1,
  2,

  10,
  11,
  12,

  20,
  21,
  22,
]

const clusterIndicesList = cw.cluster(array)
console.log(clusterIndicesList)
// for (const i in clusterIndicesList) {
//   console.log('Cluster[' + i + ']: ' + clusterIndicesList[i])
// }
// Cluster[0]: [0, 1, 2]
// Cluster[1]: [10, 11, 12]
// Cluster[2]: [20, 21, 22]
