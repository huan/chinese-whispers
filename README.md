# chinese-whispers
An Efficient Graph Clustering Algorithm for Node.js

# Insall

```shell
npm install chinese-whispers
```

# Example

```ts
import ChineseWhispers from 'chinese-whispers'

function distanceFunc(a, b) {
  return Math.abs(a - b)
}

const cw = new ChineseWhispers({
  distance:  distanceFunc,
  threshold: 5,
  epochs: 10,
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

const indicesList = cw.fit(array)

console.log(indics.length)  // 3
console.log(indics[0])      //  [0, 1, 2]
console.log(indics[1])      //  [10, 11, 12]
console.log(indics[2])      //  [20, 21, 22]
```

### Links

* [facenet chinese whispers(face cluster)](http://blog.csdn.net/liyuan123zhouhui/article/details/70312716)
* [Chinese Whispers Graph Clustering in Python](http://alexloveless.co.uk/data/chinese-whispers-graph-clustering-in-python/)
* Wikipedia: [Chinese Whispers (clustering method)](https://en.wikipedia.org/wiki/Chinese_Whispers_(clustering_method))
* Paper: [Chinese Whispers - an Efficient Graph Clustering Algorithm and its Application to Natural Language Processing Problems](https://pdfs.semanticscholar.org/3e71/0251cb01ba6e1c0c735591776a212edc461f.pdf)
* [The meaning and origin of the expression: Chinese whispers](http://www.phrases.org.uk/meanings/chinese-whispers.html)
