let list = [1, 2, 3, 4, 5]
let sum = list.reduce((total, value) => {
  return total + value
}, 5)

console.log(sum)