#!/usr/bin/env ts-node

const t = require('tap')  // tslint:disable:no-shadowed-variable

import { ChineseWhispers }  from '../'

t.test('ChineseWhispers', async (t: any) => {

  const cw = new ChineseWhispers({
    distance:  distanceFunc,
    threshold: 5,
    epochs: 10,
  })

  const numberList = [
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

  const clusterIndicesList = cw.cluster(numberList)

  t.equal(clusterIndicesList.length, 3, 'should get 3 clusters')
  t.deepEqual(clusterIndicesList[0].map(i => numberList[i]), [0, 1, 2], 'should get [0 1 2] for cluster 0')
  t.deepEqual(clusterIndicesList[1].map(i => numberList[i]), [10, 11, 12], 'should get [10 11 12] for cluster 1')
  t.deepEqual(clusterIndicesList[2].map(i => numberList[i]), [20, 21, 22], 'should get [20 21 22] for cluster 2')
})

function distanceFunc(a: number, b: number): number {
  const dist = Math.abs(a - b)
  // console.log('a: ', a, ' b: ', b, ' dist: ', dist)
  return dist
}
