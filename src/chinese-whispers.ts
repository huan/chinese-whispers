/**
 * Chinese Whispers Algorithm for Node.js
 *
 * https://github.com/zixia/chinese-whispers
 * License: Apache-2.0
 * Author: Huan LI <zixia@zixia.net>
 *
 * Inspired by:
 *  - http://blog.csdn.net/liyuan123zhouhui/article/details/70312716
 *  - http://alexloveless.co.uk/data/chinese-whispers-graph-clustering-in-python/
 *  - https://github.com/uhh-lt/chinese-whispers
 *  - https://github.com/anvaka/ngraph.cw
 *
 */
import { EventEmitter }   from 'events'

const jsnx              = require('jsnetworkx')
const { knuthShuffle }  = require('knuth-shuffle')

export type WeightFunc<T> =  (a: T, b: T) => number

export type CWNode = number  // Node value/identifier is the indice of data

export type CWEdge = [
  number,
  number,
  {
    weight: number,
  }
]

export type Cluster = number[] // indices of the orignal data array

export interface ChineseWhispersOptions<T> {
  weightFunc: WeightFunc<T>,
  epochs?:    number,
  threshold?: number,
}

export type CWEventName = 'edge'
                        | 'epoch'
                        | 'change'

export class ChineseWhispers<T> extends EventEmitter {
  private weightFunc: WeightFunc<T>
  private epochs:     number
  private threshold?: number

  private graph: any  // jsnetworkx instance
  private data:  T[]

  private changeCounter: number

  constructor(
    options: ChineseWhispersOptions<T>,
  ) {
    super()

    this.weightFunc = options.weightFunc
    this.epochs     = options.epochs  || 15
    this.threshold  = options.threshold

    this.on('change', () => this.changeCounter++)
  }

  public on(event: 'edge',    listener: (edge: CWEdge) => void):                                     this
  public on(event: 'change',  listener: (node: CWNode, oldLabel: string, newLabel: string) => void): this
  public on(event: 'epoch',   listener: (graph: any, changeCounter: number) => void):                this

  public on(event: never,       listener: any):                      this
  public on(event: CWEventName, listener: (...args: any[]) => void): this {
    super.on(event, listener)
    return this
  }

  public emit(event: 'edge',    edge?:  CWEdge):                                     boolean
  public emit(event: 'change',  node:   CWNode, oldLabel: string, newLabel: string): boolean
  public emit(event: 'epoch',   graph:  any, changeCounter: number):                 boolean

  public emit(event: never,       ...args: any[]): boolean
  public emit(event: CWEventName, ...args: any[]): boolean {
    return super.emit(event, ...args)
  }

  public cluster(data: T[]): Cluster[] {
    this.data  = data
    this.graph = this.buildNetwork(data, this.weightFunc, this.threshold)

    // initial epoch
    this.emit('epoch', this.graph, -1)

    // run Chinese Whispers
    // I default to 10 iterations. This number is usually low.
    // After a certain number (individual to the data set) no further clustering occurs
    let epochs = this.epochs
    while (epochs--) {
      this.changeCounter = 0
      this.iterate()
      this.emit('epoch', this.graph, this.changeCounter)
    }
    const clusterList = this.buildClusterList(this.graph)
    return clusterList
  }

  public iterate() {
    const nodeList = this.graph.nodes()
    // I randomize the nodes to give me an arbitrary start point
    knuthShuffle(nodeList)  // orignal array modified
    for (const node of nodeList) {
      this.relabelNode(node)
    }
  }

  public relabelNode(node: CWNode): void {
    const newLabel = this.recalcLabel(node)

    const nodeAttr = this.graph.node.get(node)
    if (nodeAttr['label'] !== newLabel) {
      // set the label of target node to the winning local label
      this.emit('change', node, nodeAttr['label'], newLabel)
      nodeAttr['label'] = newLabel
      // console.log('set node ' + this.data[node] + ' label to ' + this.data[parseInt(newLabel)])
    }
  }

  public recalcLabel(node: CWNode): string {
    const nxNode       = this.graph.get(node)
    const neighborList = this.graph.neighbors(node)

    if (neighborList.length === 0) {
      const attr = this.graph.node.get(node)
      return attr['label']  // return self label if no neighbors
    }

    // console.log('neighbors of node ' + this.data[node]
    //     + ' is: ', neighborList.map((i: number) => this.data[i]))

    const labelWeightMap = {} as {
      [key: string]: number,
    }
    // do an inventory of the given nodes neighbours and edge weights
    for (const neighbor of neighborList) {
      const neighborAttr = this.graph.node.get(neighbor)
      const label        = neighborAttr['label']
      if (!(label in labelWeightMap)) {
        labelWeightMap[label] = 0
      }
      const edgeAttr = nxNode.get(neighbor)
      const weight   = edgeAttr['weight']

      // console.log('### ', weight, ' ###')
      labelWeightMap[label] += weight
    }
    // find the label with the highest edge weight sum
    let max = 0
    // In javascript the keys of object can only be strings
    //  - https://stackoverflow.com/a/41870625/1123955
    let maxLabel = '-1'

    // for (const label in labelWeightMap) {
    //   console.log('labelWeight node: ' + this.data[node] + ' - '
    //       + this.data[parseInt(label)] + ' is: ', labelWeightMap[label])
    // }

    for (const label in labelWeightMap) {
      if (labelWeightMap[label] > max) {
        max = labelWeightMap[label]
        maxLabel = label
      }
    }
    return maxLabel
  }

  public buildClusterList(G: any): Cluster[] {
    const clusterList: Cluster[] = []
    const labelIndexMap: {[key: string]: number} = {}
    let index = 0

    for (const node of G.nodes()) {
      const label = G.node.get(node)['label']
      if (!(label in labelIndexMap)) {
        labelIndexMap[label] = index++
      }

      const labelIndex = labelIndexMap[label]
      if (!(labelIndex in clusterList)) {
        clusterList[labelIndex] = []
      }

      clusterList[labelIndex].push(node)
    }
    return clusterList
  }

  public buildNetwork(
    data:       T[],
    weightFunc: WeightFunc<T>,
    threshold?: number,
  ) {
    const nodeList: CWNode[] = [...data.keys()] // [0, 1, 2, ..., data.length - 1]
    const edgeList: CWEdge[] = []

    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const weight = weightFunc(data[i], data[j])
        if (threshold && threshold > weight) {
          // console.log('threshold: ', threshold, ' weight: ', weight)
          // skip this edge because it's weight is below threshold
          this.emit('edge')
        } else {
          const edge: CWEdge = [i, j, { weight }]
          edgeList.push(edge)

          this.emit('edge', edge)
        }
      }
    }
    // initialize the graph
    const G = new jsnx.Graph()

    // Add nodes
    G.addNodesFrom(nodeList)
    // CW needs an arbitrary, unique label for each node before initialisation
    // Here I use the ID of the node since I know it's unique
    // You could use a random number or a counter or anything really
    for (const n of G.nodes()) {
      const nodeAttr = G.node.get(n)
      nodeAttr['label'] = n
    }
    // add edges
    G.addEdgesFrom(edgeList)

    // console.log(edgeList)

    return G
  }

}

export default ChineseWhispers
