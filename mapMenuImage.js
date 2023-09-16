import fs from 'fs'

const raw_menus = JSON.parse(fs.readFileSync('./raw_menu.json'))
const menu_images = JSON.parse(fs.readFileSync('./menu_images.json'))

const result = []

raw_menus.forEach((menu) => {
  const rawShopName = menu['Restaurant name']
  const name = menu['Menu name']
  menu_images.forEach(({ shopName, title, imageSrc }) => {
    if ((rawShopName == shopName && title.includes(name)) || title.includes(name)) {
      console.log('shopName', shopName)
      console.log('title', title)
      console.log('name', name)
      result.push({
        shopName,
        name,
        imageSrc,
      })
    }
  })
})

fs.writeFileSync(`imagesUrlMap.json`, JSON.stringify(result))
