import puppeteer from 'puppeteer'

const headless = process.argv[2] === '--headless' || false
const browser = await puppeteer.launch({headless})
const pages = await browser.pages()
let page = pages[0]

if (headless) {
  page = await browser.newPage()
  await page.goto(`file://${__dirname}/README.md`)
  await Bun.$`./md2pdf README.md cv.pdf`.quiet()
  await Bun.$`open ./cv.pdf`.quiet()
} else {
  const res = await fetch('https://github.com/jellyninjadev/cv.pdf/releases/download/v1.0.0/cv.pdf')
  await Bun.write('cv.pdf', new Uint8Array(await res.arrayBuffer()))
  await page.goto(`file://${__dirname}/cv.pdf`)
  await page.waitForTimeout(25000)
  await page.pdf({
    path: 'cv.pdf',
  })
}

// await browser.close()
