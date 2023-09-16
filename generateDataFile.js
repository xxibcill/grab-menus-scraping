import fs from 'fs'

const menusFiles = fs.readdirSync('./menus')

let csvString = 'title,imageSrc\n'
let jsonArray = []

menusFiles.forEach((file, fileIndex) => {
  console.log('fileIndex', fileIndex, file)
  const menus = JSON.parse(fs.readFileSync(`./menus/${file}`))

  menus.forEach((menu, menuIndex) => {
    console.log('menuIndex', menuIndex, menu.title)
    csvString = csvString.concat(`${menu.title},${menu.imageSrc}\n`)
    if (menu.imageSrc)
      jsonArray.push({
        shopName: file.replace('.json', ''),
        title: menu.title,
        imageSrc: menu.imageSrc,
      })
  })
})

// fs.writeFileSync(`menu_images.csv`, csvString)
fs.writeFileSync(`menu_images.json`, JSON.stringify(jsonArray))
