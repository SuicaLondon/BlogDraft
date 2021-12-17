// all way to traverse should iterate 1000000 times
const initialList = Array.from(Array(1000000).keys())

function performanceTest(label, list, callback) {
  let newList = [...list]
  console.time(label)
  callback(newList)
  console.timeEnd(label)
}

function forTest(list) {
  performanceTest("for", list, (list) => {
    let sum = 0
    for (let i = 0; i < list.length; i++) {
      sum += list[i]
    }
  })
}
function forInTest(list) {
  performanceTest("for-in", list, (list) => {
    let sum = 0
    for (let index in list) {
      sum += list[index]
    }
  })
}
function forOfTest(list) {
  performanceTest("for-of", list, (list) => {
    let sum = 0
    for (let item of list) {
      sum += item
    }
  })
}

function forEachTest(list) {
  performanceTest("forEach", list, (list) => {
    let sum = 0
    list.forEach((item) => {
      sum += item
    })
  })
}

function mapTest(list) {
  performanceTest("map", list, (list) => {
    let sum = 0
    list.map((item) => {
      sum += item
    })
  })
}

forTest(initialList)
forInTest(initialList)
forOfTest(initialList)
forEachTest(initialList)
mapTest(initialList)
