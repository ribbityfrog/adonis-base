// import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

import puppeteer from 'puppeteer-core'
import { createWorker } from 'tesseract.js'
import logger from '@adonisjs/core/services/logger'

export default class SandboxesController {
  async inaric() {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1080, height: 1024 })

    await page.goto('https://inaric.fr/accueil/index.php', {
      waitUntil: 'load',
    })
    await page.type('#txtutilisateur', env.get('CFTC_INARIC_USERNAME'))
    await page.type('#txtpassword', env.get('CFTC_INARIC_PASSWORD'))
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])
    await page.goto('https://inaric.fr/mars/forms.php', {
      waitUntil: 'networkidle0',
    })
  }

  async mars() {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    })
    const page = await browser.newPage()

    await page.setViewport({ width: 1080, height: 1024 })

    logger.info('Browser ready')

    await page.goto('https://www.elections-professionnelles.travail.gouv.fr/web/guest/login', {
      waitUntil: 'load',
    })
    await page.type('input[id*="login"]', env.get('CFTC_MARS_USERNAME'))
    await page.type('input[id*="password"]', env.get('CFTC_MARS_PASSWORD'))

    logger.info('Connected to account')

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])
    await page.goto(
      'https://www.elections-professionnelles.travail.gouv.fr/web/guest/liste-des-pv',
      {
        waitUntil: 'networkidle0',
      }
    )
    await page.type('input[placeholder="000 000 000 (00000)"]', '50413998100048')

    logger.info('Company found')

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])

    await Promise.all([
      page.click('.ui-commandlink'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])

    logger.info('Data chosen')

    let ite = 0
    page.on('response', async (response) => {
      const url = response.url()
      const param = url.split('/').slice(-1)[0]
      if (
        response.request().resourceType() === 'image' &&
        !param.includes('-') &&
        !param.includes('_') &&
        !param.includes('.png')
      ) {
        const nameExt = ite
        ite++
        response.buffer().then((file) => {
          const filePath = path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            `name-${nameExt}.png`
          )
          const writeStream = fs.createWriteStream(filePath)
          writeStream.write(file)
        })
      }
    })

    logger.info('Collecting')

    await Promise.all([
      page.evaluate(() => {
        document.getElementsByClassName('ui-commandlink')[0].click()
      }),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])
    //   const linkPV = await page.$('.ui-commandlink')
    //   if (linkPV !== null)
    //     await Promise.all([linkPV?.click(), page.waitForNavigation({ waitUntil: 'networkidle0' })])

    //   const linkTour = await page.$$('.ui-commandlink')
    //   console.log(linkTour)
    //   if (linkTour !== null)
    //     await Promise.all([
    //       linkTour?.[0].click(),
    //       page.waitForNavigation({ waitUntil: 'networkidle0' }),
    //     ])
  }

  async tesseract() {
    const imgPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'name-1.png')
    // 'C:\\Users\\pierr\\Downloads\\img3.png'

    const worker = await createWorker('fra')
    const pl = await worker.recognize(imgPath)
    console.log(pl.data.text)
    await worker.terminate()
  }
}
