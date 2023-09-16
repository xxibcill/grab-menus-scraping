import fs from 'fs'

const jsonObjArray = JSON.parse(fs.readFileSync('./imagesUrlMap.json'))

const keys = Object.keys(jsonObjArray[0])

let csvString = keys.reduce((acc, key, index) => acc + (index ? ',' : '') + key, '') + '\n'

jsonObjArray.forEach((obj) => {
  csvString = csvString.concat(
    keys.reduce((acc, key, index) => acc + (index ? ',' : '') + obj[key], '') + '\n'
  )
})

fs.writeFileSync(`imagesUrlMap.csv`, csvString)
