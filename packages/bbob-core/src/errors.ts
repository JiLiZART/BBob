
let C1 = 'C1'
let C2 = 'C2'

if (process.env.NODE_ENV !== 'production') {
  C1 = '"parser" is not a function, please pass to "process(input, { parser })" right function'
  C2 =  '"render" function not defined, please pass to "process(input, { render })"'
}

export { C1, C2 }
