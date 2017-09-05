# chinese-whispers
An Efficient Graph Clustering Algorithm for Node.js

ALGORITHM
---------
* Wikipedia: [Chinese Whispers (clustering method)](https://en.wikipedia.org/wiki/Chinese_Whispers_(clustering_method))
* Slide: [Chinese Whispers - an Efficient Graph Clustering Algorithm and its Application to Natural Language Processing Problems](http://wortschatz.uni-leipzig.de/~cbiemann/pub/2006/BiemannTextGraph06.pdf)
* Paper: [Chinese Whispers - an Efficient Graph Clustering Algorithm and its Application to Natural Language Processing Problems](https://pdfs.semanticscholar.org/3e71/0251cb01ba6e1c0c735591776a212edc461f.pdf)

INSTALL
-------

```shell
npm install chinese-whispers
```

EXAMPLE
-------

```ts
import { ChineseWhispers } from '../src/chinese-whispers'

function weightFunc(a: number, b: number): number {
  const dist = Math.abs(a - b)
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
```

Source code can be found at: <https://github.com/zixia/chinese-whispers/blob/master/examples/demo.ts>

CREDITS
-------

This project is inspired by:

* [facenet chinese whispers(face cluster) in Python - zhly0](http://blog.csdn.net/liyuan123zhouhui/article/details/70312716)
* [Chinese Whispers Graph Clustering in Python - Alex Loveless](http://alexloveless.co.uk/data/chinese-whispers-graph-clustering-in-python/)
* [Implementation of the Chinese Whispers graph clustering algorithm in Java](https://github.com/uhh-lt/chinese-whispers)
* [Chinese Whispers Graph Clustering Algorithm in Javascript](https://github.com/anvaka/ngraph.cw)

SEE ALSO
---------

* [The meaning and origin of the expression: Chinese whispers](http://www.phrases.org.uk/meanings/chinese-whispers.html)

AUTHOR
------
Huan LI \<zixia@zixia.net\> (http://linkedin.com/in/zixia)

<a href="http://stackoverflow.com/users/1123955/zixia">
  <img src="http://stackoverflow.com/users/flair/1123955.png" width="208" height="58" alt="profile for zixia at Stack Overflow, Q&amp;A for professional and enthusiast programmers" title="profile for zixia at Stack Overflow, Q&amp;A for professional and enthusiast programmers">
</a>

COPYRIGHT & LICENSE
-------------------
* Code & Docs © 2017 Huan LI \<zixia@zixia.net\>
* Code released under the Apache-2.0 License
* Docs released under Creative Commons
