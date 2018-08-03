// tslint:disable:no-console

import { ChineseWhispers } from '../src/chinese-whispers'

function weightFunc (a: number, b: number): number {
  const dist = Math.abs(a - b)
  return 1 / dist
}

const cw = new ChineseWhispers({
  weightFunc,
})

const dataList = [
  0, 1, 2,
  10, 11, 12,
  20, 21, 22,
]

const clusterIndicesList = cw.cluster(dataList)

for (let i = 0; i < clusterIndicesList.length; i++) {
  const clusterIndices = clusterIndicesList[i]
  const cluster = clusterIndices.map(j => dataList[j])
  console.log('Cluster[' + i + ']: ' + cluster)
}
// Cluster[0]: 0,1,2
// Cluster[1]: 10,11,12
// Cluster[2]: 20,21,22
