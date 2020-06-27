require('colors')
var links = require('../utils/links.js')
var fs = require('fs-extra')
const chokidar = require('chokidar')
const path = require('path')

const start = (id) => {
  if (id) {
    links.load()
    const link = links.data[id]
    if (!link) {
      console.error(`Error: could not find link ${id}`)
    } else {
      chokidar.watch(link.src).on('all', (event, eventPath) => {
        if (isAllowedThisPath(eventPath, link))
          switch (event) {
            case 'change':
              addOrChange(eventPath, link)
              break
            case 'add':
              addOrChange(eventPath, link)
              break
            case 'addDir':
              addDir(eventPath, link)
              break
            case 'unlink':
              unlinkOrUnlinkDir(eventPath, link)
              break
            case 'unlinkDir':
              unlinkOrUnlinkDir(eventPath, link)
              break
          }
      })
    }
  } else {
    console.log('Please specfic id of link which you want to start'.red)
  }
}

const checkIsParentOrSubDir=(parent, dir)=>{
  if(parent===dir) return true;
  const relative = path.relative(parent, dir);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

const isAllowedThisPath = (eventPath, link) => {
  try {
    const sourceRelativePath = path.relative(link.src, eventPath)
    const mtslconfigFilePath = path.resolve(link.src, '.mtslconfig.json')
    if (fs.existsSync(mtslconfigFilePath)) {
      const mtslconfigFile = fs.readFileSync(mtslconfigFilePath, 'utf8')
      const mtslconfigFileJson = JSON.parse(mtslconfigFile)
      const ignore_dirs = mtslconfigFileJson.ignore_dirs
      if (ignore_dirs) {
        if (ignore_dirs.length > 0) {
          for (let i = 0; i < ignore_dirs.length; i++) {
            if (checkIsParentOrSubDir(ignore_dirs[i],sourceRelativePath)) {
              return false
            }
          }
        } else {
          return true
        }
      } else {
        return true
      }
    } else {
      return true
    }
  } catch (error) {
    return true;
  }
  return true;
}

const logSrcDest = (src, dest) => {
  console.log(src.green, '-->', dest.green)
}

const getDestinationPath = (eventPath, link) => {
  const sourceRelativePath = path.relative(link.src, eventPath)
  const destinationAbsolutePath = path.resolve(link.dest, sourceRelativePath)
  return destinationAbsolutePath
}

const addOrChange = (eventPath, link) => {
  const destinationPath = getDestinationPath(eventPath, link)
  fs.copySync(eventPath, destinationPath)
  logSrcDest(eventPath, destinationPath)
}

const addDir = (eventPath, link) => {
  const destinationPath = getDestinationPath(eventPath, link)
  fs.mkdirsSync(destinationPath)
  logSrcDest(eventPath, destinationPath)
}

const unlinkOrUnlinkDir = (eventPath, link) => {
  const destinationPath = getDestinationPath(eventPath, link)
  fs.removeSync(destinationPath)
  logSrcDest(eventPath, destinationPath)
}

export { start }
