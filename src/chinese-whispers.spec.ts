#!/usr/bin/env ts-node

const t     = require('tap')  // tslint:disable:no-shadowed-variable

const jsnx  = require('jsnetworkx')

import { ChineseWhispers }  from './chinese-whispers'

// t.only('test', async (t: any) => {
//   const NUMBER_LIST = [
//     0, 1, 2,
//     10, 13, 15,
//     25, 30, 35,
//     160, 170, 180,
//   ]
//   const cw = new ChineseWhispers({
//     weightFunc,
//     threshold: 1 / 6,
//   })

//   const clusterIndicesList = cw.cluster(NUMBER_LIST)

//   // console.log(clusterIndicesList.map(ci => ci.map(i => NUMBER_LIST[i])))

//   t.equal(clusterIndicesList.length, 6, 'should get expect number of clusters')
// })

t.test('Cluster', async (t: any) => {

  const NUMBER_LIST = [
    0, 1, 2,
    10, 13, 15,
    50, 55, 60,
    160, 170, 180,
  ]

  const EXPECTED_NO_THRESHOLD_CLUSTER = {
    0: [
      0, 1, 2,
    ],
    1: [
      10, 13, 15,
    ],
    2: [
      50, 55, 60,
    ],
    3: [
      160, 170, 180,
    ],
  }

  const EXPECTED_THRESHOLD_1_6_CLUSTER = {
    0: [
      0, 1, 2,
    ],
    1: [
      10, 13, 15,
    ],
    2: [
      50, 55, 60,
    ],
    3: [
      160,
    ],
    4: [
     170,
    ],
    5: [
      180,
    ],
  }

  t.test('no threshold', async (t: any) => {
    const cw = new ChineseWhispers({
      weightFunc,
    })
    const clusterIndicesList = cw.cluster(NUMBER_LIST)
    // console.log(clusterIndicesList.map(cluster => cluster.map(node => NUMBER_LIST[node])))

    t.equal(clusterIndicesList.length, Object.keys(EXPECTED_NO_THRESHOLD_CLUSTER).length, 'should get expect number of clusters')
    for (const i in EXPECTED_NO_THRESHOLD_CLUSTER) {
      t.deepEqual(clusterIndicesList[parseInt(i)].map(idx => NUMBER_LIST[idx]),
                  (EXPECTED_NO_THRESHOLD_CLUSTER as any)[i],
                  'should get expected items for cluster ' + i,
                )
    }
  })

  t.test('threshold 1/6', async (t: any) => {
    const cw = new ChineseWhispers({
      weightFunc,
      threshold: 1 / 6,
    })

    const clusterIndicesList = cw.cluster(NUMBER_LIST)

    t.equal(clusterIndicesList.length, Object.keys(EXPECTED_THRESHOLD_1_6_CLUSTER).length, 'should get expect number of clusters')
    for (const i in EXPECTED_THRESHOLD_1_6_CLUSTER) {
      t.deepEqual(clusterIndicesList[parseInt(i)].map(idx => NUMBER_LIST[idx]),
                  (EXPECTED_THRESHOLD_1_6_CLUSTER as any)[i],
                  'should get expected items for cluster ' + i,
                )
    }
  })
})

t.test('buildNetwork()', async (t: any) => {
  const DATA = [
    1, 2, 3,
    10, 20, 30,
    100, 200, 300,
    1000, 2000, 3000,
  ]

  const cw = new ChineseWhispers({
    weightFunc,
  })

  t.test('weight threshold none', async (t: any) => {
    const G = cw.buildNetwork(DATA, weightFunc)
    const nodeList = G.nodes()
    const edgeList = G.edges()
    t.equal(nodeList.length, DATA.length, 'should turn data to nodes')

    const edgeNum = DATA.length * (DATA.length - 1) / 2
    t.equal(edgeList.length, edgeNum, 'should turn data to C(n, 2) edges')
  })

  t.test('weight threshold 1/5', async (t: any) => {
    const G = cw.buildNetwork(DATA, weightFunc, 1 / 5)
    const edgeList = G.edges()
    t.equal(edgeList.length, 3, 'should turn data to 3 edges for threshold 1/5')
  })

  t.test('weight threshold 1/50', async (t: any) => {
    const G = cw.buildNetwork(DATA, weightFunc, 1 / 50)
    const edgeList = G.edges()
    t.equal(edgeList.length, 15, 'should turn data to 15 edges for threshold 1/50')
  })

  t.test('weight threshold 1/500', async (t: any) => {
    const G = cw.buildNetwork(DATA, weightFunc, 1 / 500)
    const edgeList = G.edges()
    t.equal(edgeList.length, 36, 'should turn data to 36 edges for threshold 1/500')
  })

})

t.test('buildClusterList()', async (t: any) => {
  const NODE_LIST = [
    [1, { label: 'a' }],
    [2, { label: 'b' }],
    [3, { label: 'a' }],
    [4, { label: 'b' }],
    [5, { label: 'a' }],
  ]
  const G = new jsnx.Graph()
  G.addNodesFrom(NODE_LIST)

  const cw = new ChineseWhispers({
    weightFunc,
  })
  const clusterList = cw.buildClusterList(G)

  t.equal(clusterList.length, 2, 'should get 2 cluster')
  t.deepEqual(clusterList[0], [1, 3, 5], 'should get cluster for a')
  t.deepEqual(clusterList[1], [2, 4], 'should get cluster for b')
})

function weightFunc(a: number, b: number): number {
  const dist = Math.abs(a - b)
  return 1 / dist
}
