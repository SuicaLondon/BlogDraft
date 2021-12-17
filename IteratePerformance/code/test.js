let list = [1, 2, 3, 4, 5]
let list2 = list.filter((item) => {
  return item % 2 === 0;
})

console.log(list)
console.log(list2)