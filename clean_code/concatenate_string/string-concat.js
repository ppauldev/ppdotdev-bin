export const concat_v1 = (len) => {
  let text = ""

  for (let i = 1; i <= len; i++) {
    text += `,${i}`
  }

  return text.replace(",", "") // replaces only 1st occurence
}

export const concat_v2 = (len) => {
  return Array.from({ length: len }, (_, i) => i + 1)
}

export const concat_v3 = (len) => {
  return Array.from(Array(len + 1).keys()).slice(1)
}

export const concat_v4 = (len) => {
  return [...Array(len + 1).keys()].slice(1)
}

export const concat_v5 = (len) => {
  return [...Array(len)].map((_, i) => ++i)
  //return Array.from(Array(len)).map((_, i) => ++i) // no difference in performance
}

export const concat_v6 = (len) => {
  return [...Array(len + 1).keys()].slice(1).join(",")
}
