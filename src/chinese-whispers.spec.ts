#!/usr/bin/env ts-node

const t     = require('tap')  // tslint:disable:no-shadowed-variable

const jsnx  = require('jsnetworkx')

import { ChineseWhispers }  from './chinese-whispers'

t.only('Cluster', async (t: any) => {

  const NUMBER_LIST = [
    0, 1, 2,
    10, 11, 12,

    20, 30, 40,
    60, 70, 80,

    100, 200, 300,
    500, 600, 700,
  ]

  t.test('no threshold', async (t: any) => {
    const cw = new ChineseWhispers({
      weightFunc,
    })
    const clusterIndicesList = cw.cluster(NUMBER_LIST)
    console.log(clusterIndicesList.map(cluster => cluster.map(node => NUMBER_LIST[node])))

    t.equal(clusterIndicesList.length, 2, 'should get 2 clusters')
    // t.deepEqual(clusterIndicesList[0].length, 15, 'should get 15 items for cluster 0')
    // t.deepEqual(clusterIndicesList[1].map(i => NUMBER_LIST[i]), [500, 600, 700], 'should get [500 600 700] for cluster 1')
  })

  // t.test('threshold 1/5', async (t: any) => {
  //   const cw = new ChineseWhispers({
  //     weightFunc,
  //     threshold: 1/50,
  //   })

  //   const clusterIndicesList = cw.cluster(NUMBER_LIST)

  //   t.equal(clusterIndicesList.length, 3, 'should get 3 clusters')
  //   t.deepEqual(clusterIndicesList[0].map(i => NUMBER_LIST[i]), [0, 1, 2], 'should get [0 1 2] for cluster 0')
  //   t.deepEqual(clusterIndicesList[1].map(i => NUMBER_LIST[i]), [10, 11, 12], 'should get [10 11 12] for cluster 1')
  //   t.deepEqual(clusterIndicesList[2].map(i => NUMBER_LIST[i]), [20, 21, 22], 'should get [20 21 22] for cluster 2')
  // })
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

  t.test('weight threshold 1/50', async (t: any) => {
    const G = cw.buildNetwork(DATA, weightFunc, 1 / 500)
    const edgeList = G.edges()
    t.equal(edgeList.length, 36, 'should turn data to 36 edges for threshold 1/500')
  })

})

t.test('buildClusterList()', async (t: any) => {
  const NODE_LIST = [
    [1, { class: 'a' }],
    [2, { class: 'b' }],
    [3, { class: 'a' }],
    [4, { class: 'b' }],
    [5, { class: 'a' }],
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
