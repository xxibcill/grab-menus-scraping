import puppeteer from 'puppeteer'
import fs from 'fs'

const links = JSON.parse(fs.readFileSync('./grablink.json'))

let page

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const autoScroll = async () => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0
      var distance = 1000
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 3000)
    })
  })
}

const getShopName = async () => {
  await page.waitForSelector(`[class*='name']`)

  const shopNameEl = await page.$(`[class*='name']`)

  const shopName = await page.evaluate((el) => el.textContent, shopNameEl)
  console.log(shopName)
}

const getAllMenu = async (restaurantName) => {
  const root = await page.$(`[class*='contentWrapper']`)

  await page.waitForSelector(`[class*='name']`)

  await page.waitForSelector(`[class*='menuItem'].ant-col-md-24`)

  await autoScroll()

  await sleep(5000)

  const menus = await page.evaluate((el) => {
    const temp = []
    let menuItems = Array.from(el.querySelectorAll(`[class*='menuItem'].ant-col-md-24`))

    menuItems.forEach((menuItem) => {
      const title = menuItem.querySelector(`[class*='itemNameTitle']`).textContent
      const description = menuItem.querySelector(`[class*='itemDescription']`)
      const imageSrc = menuItem.querySelector(`[class*='menuItemPhoto'] img`)
      const price = menuItem.querySelector(`[class*='discountedPrice']`).textContent

      temp.push({
        title,
        description: description ? description.textContent : '',
        imageSrc: imageSrc ? imageSrc.src : '',
        price,
      })
    })

    return temp
  }, root)

  console.log(menus.length)
  fs.writeFileSync(`menus/${restaurantName}.json`, JSON.stringify(menus))
}

const scrap = async (link) => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: [`--window-size=1920,1080`],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  })

  page = await browser.newPage()
  await page.goto(link.url)

  await getAllMenu(link.name)

  await browser.close()
}

;(async () => {
  for (let index = 0; index < links.length; ) {
    const link = links[index]
    console.log('scrap index : ', index)
    try {
      await scrap(link)
      index = index + 1
    } catch (error) {
      console.log(error)
    }
  }
})()
