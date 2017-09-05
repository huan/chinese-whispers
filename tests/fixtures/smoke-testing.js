const { ChineseWhispers } = require('chinese-whispers')

function weightFunc(a, b) {
  const dist = Math.abs(a - b)
  // console.log('a: ', a, ' b: ', b, ' dist: ', dist)
  return 1 / dist
}

const cw = new ChineseWhispers({
  weightFunc,
})

const data = [
  0, 1, 2,
  10, 11, 12,
  20, 21, 22,
]

const clusterIndicesList = cw.cluster(data)

for (const i in clusterIndicesList) {
  const clusterIndices = clusterIndicesList[i]
  const cluster = clusterIndices.map(j => data[j])
  console.log('Cluster[' + i + ']: ' + cluster)
}
// Cluster[0]: 0,1,2
// Cluster[1]: 10,11,12
// Cluster[2]: 20,21,22
