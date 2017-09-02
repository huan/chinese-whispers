/**
 * Chinese Whispers Algorithm for Node.js
 *
 * https://github.com/zixia/chinese-whispers
 * License: Apache-2.0
 * Author: Huan LI <zixia@zixia.net>
 *
 * Inspired by:
 *  - @zhly0 http://blog.csdn.net/liyuan123zhouhui/article/details/70312716
 *  - Alex Loveless http://alexloveless.co.uk/data/chinese-whispers-graph-clustering-in-python/
 *
 * Inputs:
 *   encoding_list: a list of facial encodings from face_recognition
 *   threshold: facial match threshold,default 0.6
 *   iterations: since chinese whispers is an iterative algorithm, number of times to iterate
 *
 * Outputs:
 *   sorted_clusters: a list of clusters, a cluster being a list of imagepaths,
 *   sorted by largest cluster to smallest
 *
 */
const jsnx              = require('jsnetworkx')
const { knuthShuffle }  = require('knuth-shuffle')

export type DistanceFunc<T> =  (a: T, b: T) => number

type CWNode = number  // Node value/identifier is the indice of data

type CWEdge = [
  number,
  number,
  {
    weight: number,
  }
]

export type Cluster = number[] // indices of the orignal data array

export interface ChineseWhispersOptions<T> {
  distance:  DistanceFunc<T>,
  epochs?:   number,
  threshold: number,
}

export class ChineseWhispers<T> {
  private distance:  DistanceFunc<T>
  private epochs:    number
  private threshold: number

  constructor(options: ChineseWhispersOptions<T>) {
    this.distance  = options.distance
    this.threshold = options.threshold
    this.epochs    = options.epochs     || 10
  }

  public fit(data: T[], options?: ChineseWhispersOptions<T>): Cluster[] {
    let distance  = this.distance
    let epochs    = this.epochs
    let threshold = this.threshold

    if (options) {
      distance  = options.distance
      threshold = options.threshold
      epochs    = options.epochs || epochs
    }

    const G = this.buildNetwork(data, distance)

    // run Chinese Whispers
    // I default to 10 iterations. This number is usually low.
    // After a certain number (individual to the data set) no further clustering occurs
    while (epochs--) {
      const nodeList = G.nodes()
      // I randomize the nodes to give me an arbitrary start point
      knuthShuffle(nodeList)  // orignal array modified
      for (const node of nodeList) {
        const neighborList = G.neighbors(node)
        const classes: any = {}
        // do an inventory of the given nodes neighbours and edge weights
        // console.log(neighs)
        for (const neighbor of neighborList) {
          // console.log('ne', ne)
          if (typeof neighbor === 'number') {
            // console.log(classes)
            // console.log('class: ', G.node.get(ne)['class'])
            if (G.node.get(neighbor)['class'] in classes) {
              classes[G.node.get(neighbor)['class']] += G.get(node).get(neighbor)['weight']
            } else {
              classes[G.node.get(neighbor)['class']] = G.get(node).get(neighbor)['weight']
              // console.log('else: ', G.node.get(ne)['class'], G.get(node).get(ne)['weight'])
            }
          }
        }
        // find the class with the highest edge weight sum
        let max = 0
        let maxclass = 0
        Object.keys(classes).forEach(c => {
          if (classes[c] > max) {
            max = classes[c]
            maxclass = c as any
          }
        })
        // set the class of target node to the winning local class
        G.node.get(node)['class'] = maxclass
      }
    }

    for (const node of G.nodes()) {
      console.log(node, G.node.get(node)['class'])
    }
    return [[1, 2]]
  }

  private buildNetwork(data: T[], distance: DistanceFunc<T>) {
    const nodeList: CWNode[] = [...data.keys()] // [0, 1, 2, ..., data.length - 1]
    const edgeList: CWEdge[] = []

    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const dist = distance(data[i], data[j])
        const edge: CWEdge = [i, j, { weight: dist }]
        edgeList.push(edge)
      }
    }

    console.log('nodeList: ', nodeList)
    console.log('edgeList: ', edgeList)

    // initialize the graph
    const G = new jsnx.Graph()

    // Add nodes
    G.addNodesFrom(nodeList)
    // CW needs an arbitrary, unique class for each node before initialisation
    // Here I use the ID of the node since I know it's unique
    // You could use a random number or a counter or anything really
    for (const n of G.nodes()) {
      G.node.get(n)['class'] = n
    }

    // add edges
    G.addEdgesFrom(edgeList)

    return G
  }

}

export default ChineseWhispers
