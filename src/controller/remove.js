
var links = require('../utils/links.js')

const remove=(id)=>{
  links.load()
      var link = links.data[id]
      if (!link) {
        console.error(`Error: could not find link ${id}`)
      }
      else
      {
        delete links.data[id]
        console.log(`Discarded link: (${id}) ${link.src} -> ${link.dest}`)
      links.save()
      }
      
}

export {remove}