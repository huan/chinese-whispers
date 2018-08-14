# CHINESE-WHISPERS

[![Build Status](https://travis-ci.org/zixia/chinese-whispers.svg?branch=master)](https://travis-ci.org/zixia/chinese-whispers) [![NPM Version](https://badge.fury.io/js/chinese-whispers.svg)](https://badge.fury.io/js/chinese-whispers) [![Downloads](http://img.shields.io/npm/dm/chinese-whispers.svg?style=flat-square)](https://npmjs.org/package/chinese-whispers) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/) [![Greenkeeper badge](https://badges.greenkeeper.io/zixia/chinese-whispers.svg)](https://greenkeeper.io/)

An Efficient Graph Clustering Algorithm for JavaScript/Node.js

![Chinese Whispers](https://zixia.github.io/chinese-whispers/images/chinese-whispers.gif)
> Picture credit: http://www.wikihow.com/Play-Chinese-Whispers

## ALGORITHM

Chinese Whispers - _an Efficient Graph Clustering Algorithm and its Application to Natural Language Processing Problems_
> Author: Chris Biemann, University of Leipzig, NLP-Dept. Leipzig, Germany

1. [Wikipedia](https://en.wikipedia.org/wiki/Chinese_Whispers_(clustering_method))
2. [Slide](https://www.lt.informatik.tu-darmstadt.de/fileadmin/user_upload/Group_LangTech/publications/pre-langtech/BiemannTextgraphs06.ppt) - 2006 TextGraphs 06, NYC, USA
3. [Paper](https://pdfs.semanticscholar.org/3e71/0251cb01ba6e1c0c735591776a212edc461f.pdf)

## INSTALL

```shell
npm install chinese-whispers
```

## EXAMPLE

Talk is cheap, show me the code!

```ts
import { ChineseWhispers } from 'chinese-whispers'

function weightFunc(a, b) {
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

for (const i in clusterIndicesList) {
  const clusterIndices = clusterIndicesList[i]
  const cluster = clusterIndices.map(j => dataList[j])
  console.log('Cluster[' + i + ']: ' + cluster)
}
// Cluster[0]: 0,1,2
// Cluster[1]: 10,11,12
// Cluster[2]: 20,21,22
```

Source code can be found at: <https://github.com/zixia/chinese-whispers/blob/master/examples/demo.ts>

API
---

The `ChineseWhispers` class is all you need to run the Chinese Whispers Algorithm.

### 1. `constructor(options: ChineseWhisperOptions)`

```ts
interface ChineseWhispersOptions<T> {
  weightFunc: WeightFunc<T>,
  epochs?:    number,
  threshold?: number,
}
```

* `options`
  - `weightFunc`:  a function that takes two data item, calculate the weight between them and return the value.
  - `epochs`:    how many epoches to run the algorithm, default 15.
  - `threshold`: minimum weight required for a edge. default 0.

```ts
const nj = require('numjs') // a Javascript implementation of numpy in Python

// calculate the distance between vectors
function weightFunc(v1, v2) {
  const njV1 = nj.array(v1)
  const njV2 = nj.array(v2)
  const l2 = njV1.subtract(njV2)
                .pow(2)
                .sum()
  const dist = Math.sqrt(l2)
  return 1 / dist
}

const cw = new ChineseWhispers({
  weightFunc,
})
```

### 2. `cluster(dataList): number[][]`

Process `dataList` which is an array of data, returns the cluster results as an array, each array item is a cluster, and each cluster is an array which includes the indices of dataList that belongs to this cluster.

```ts
const clusterIndicesList = cw.cluster(dataList)

for (const i in clusterIndicesList) {
  // get the cluster, which stores the array index dataList
  const clusterIndices = clusterIndicesList[i]
  // map the array index of dataList to the actual dataList data
  const cluster = clusterIndices.map(j => dataList[j])
  console.log('Cluster[' + i + ']: ' + cluster)
}
```

## INSPIRATION

The code is heavily inspired by the following implementation:

* [facenet chinese whispers(face cluster) in Python - zhly0](http://blog.csdn.net/liyuan123zhouhui/article/details/70312716)
* [Chinese Whispers Graph Clustering in Python - Alex Loveless](http://alexloveless.co.uk/data/chinese-whispers-graph-clustering-in-python/)
* [A Python implementation of Chris Biemann's algorithm for graph clustering](https://github.com/sanmayaj/ChineseWhispers)
* [Implementation of the Chinese Whispers graph clustering algorithm in Java](https://github.com/uhh-lt/chinese-whispers)
* [Chinese Whispers Graph Clustering Algorithm in Javascript](https://github.com/anvaka/ngraph.cw)

## SEE ALSO

* [The meaning and origin of the expression: Chinese whispers](http://www.phrases.org.uk/meanings/chinese-whispers.html)
* [TensorFlow backed FaceNet implementation for Node.js](https://github.com/zixia/node-facenet) - Face verification, face recognition and face clustering.

## CHANGELOG

### v0.2 master

1. Upgrade TypeScript to 3.0
2. DevOps to npm@next

### v0.1 Sep 2017

1. `ChineseWhispers` class
1. `cluster()` class method
1. Unit test cases
1. Travis CI & CD(publish to NPM automatically)

## AUTHOR

Huan LI \<zixia@zixia.net\> (http://linkedin.com/in/zixia)

<a href="http://stackoverflow.com/users/1123955/zixia">
  <img src="http://stackoverflow.com/users/flair/1123955.png" width="208" height="58" alt="profile for zixia at Stack Overflow, Q&amp;A for professional and enthusiast programmers" title="profile for zixia at Stack Overflow, Q&amp;A for professional and enthusiast programmers">
</a>

## COPYRIGHT & LICENSE

* Code & Docs © 2017 Huan LI \<zixia@zixia.net\>
* Code released under the Apache-2.0 License
* Docs released under Creative Commons
