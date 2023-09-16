import csv from 'csv-parser'
import fs from 'fs'

const replaceNameSpaceWithHiphen = (array) => {
  return results.map((el) => {
    return {
      name: el.name.replace(/ /g, '-'),
      url: el.url,
    }
  })
}

const getRestaurantUrl = () => {
  const results = []
  fs.createReadStream('raw_menu.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      fs.writeFileSync('raw_menu.json', JSON.stringify(results))
    })
}

getRestaurantUrl()
