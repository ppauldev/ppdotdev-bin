export const concat_solution_1 = (len) => {
  let text = ""

  for (let i = 1; i <= len; i++) {
    text += `,${i}`
  }

  return text//.replace(",", "") // replaces only 1st occurence
}

export const concat_solution_2 = (len) => {
  return Array.from(Array(len + 1).keys()).slice(1).join(",")
}

export const concat_solution_3 = (len) => {
  return [...Array(len + 1).keys()].slice(1).join(",")
}

export const concat_solution_4 = (len) => {
  return [...Array(len + 1).keys()].slice(1)
}

export const concat_solution_5 = (len) => {
  return Array.from({ length: len }, (_, i) => i + 1)
}

export const concat_solution_6 = (len) => {
  return [...Array(len)].map((_, i) => ++i)
  //return Array.from(Array(len)).map((_, i) => ++i) // no difference in performance
}