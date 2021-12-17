let list = [1, 2, 3]
let hasEven = list.some((item) => {
  return item % 2 === 0;
})

console.log(hasEven)