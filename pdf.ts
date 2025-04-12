import puppeteer from 'puppeteer'

const headless = process.argv[2] === '--headless' || false
const browser = await puppeteer.launch({headless})
const pages = await browser.pages()
const page = pages[0]

if (headless) {
  await page.goto(`file://${__dirname}/README.md`)
  await page.pdf({
    path: 'cv.pdf',
  })
  await Bun.$`open ./cv.pdf`.quiet()
} else {
  await page.goto('https://github.com/jellyninjadev/cv.pdf/releases/download/v1.0.0/cv.pdf')
  await new Promise(() => {})
}

await browser.close()
