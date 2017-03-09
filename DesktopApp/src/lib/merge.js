export default function m (i, x) {
  let h = {}
  let n = []

  for (let a = 2; a--; i = x) {
    i.forEach(b => {
      h[b] = h[b] || n.push(b)
    })
  }
  return n
}
