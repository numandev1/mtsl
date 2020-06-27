var links = require('../utils/links.js')

const removeall = () => {
  links.load()
  Object.keys(links.data).forEach((linkId) => {
    var link = links.data[linkId]
    delete links.data[linkId]
    console.log(`Discarded link: (${linkId}) ${link.src} -> ${link.dest}`)
  })
  links.save()
}

export { removeall }
