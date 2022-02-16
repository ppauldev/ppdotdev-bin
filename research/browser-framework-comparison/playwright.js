import playwright from "playwright"

import { performance, PerformanceObserver } from "perf_hooks"

const step1 = "begin"
const step2 = "launch_page"
const step3 = "goto"
const step4 = "disclaimer"
const step5 = "search"
const step6 = "scrape"
const step7 = "close_browser"

const performanceResults = {
  "Launch page": [],
  "Go to URL": [],
  "Handle disclaimer": [],
  "Trigger search": [],
  "Scrape results": [],
  "Close browser": [],
}

const average = (list) => list.reduce((prev, curr) => prev + curr) / list.length

const obs = new PerformanceObserver((list, observer) => {
  const measureResults = list.getEntriesByType('measure');

  for (const measureResult of measureResults) {
    const name = measureResult.name
    const duration = +measureResult.duration.toFixed(2)

    performanceResults[name].push(duration)
    performanceResults[name] = Array(1).fill(average(performanceResults[name]))
  }
});
obs.observe({ entryTypes: ['measure'], buffered: true });

const createPage = async () => {
  const chromium = await playwright.chromium.launch({ headless: false, args: ["--window-position=0,0"] })
  const browser = await chromium.newContext({ viewport: { height: 1024, width: 1440 } })
  const page = await browser.newPage()

  return [page, browser]
}

const goToBing = async (page) => {
  const url = "https://www.bing.com"

  await page.goto(url)
}

const handleDisclaimer = async (page) => {
  const acceptButtonSelector = "button[class*='accept']"

  await page.waitForTimeout(1000)
  await page.click(acceptButtonSelector)
}

const triggerSearch = async (page) => {
  const inputSelector = "input[id*='form'][type*='search']"
  const searchTerm = "png to webp"

  await page.click(inputSelector)
  await page.keyboard.type(searchTerm)
  await page.keyboard.press("Enter")
  await page.waitForNavigation()
}

const scrapeResults = async (page) => {
  const resultSelector = "li > h2 > a"

  await page.waitForSelector(resultSelector, { visible: true })

  const elements = await page.$$(resultSelector)
  const results = elements.map(async element => {
    return {
      href: await element.evaluate(a => a.href),
      text: await element.evaluate(a => a.textContent),
    }
  })

  const resolvedResults = await Promise.all(results)
  return resolvedResults
}

const goToNextPage = async (page) => {
  const nextPageSelector = "a[href*='/search'][title*='Nächste']"
  const modalSelector = "div[id*='notification'] span[class*='cta2']"
  const modalVisible = (await page.$(modalSelector)) !== null

  if (modalVisible) {
    await page.click(modalSelector)
  }

  await page.click(nextPageSelector)
}

const shutdown = async (browser) => {
  await browser.close()
}

const measureStepDurations = () => {
  performance.measure("Launch page", step1, step2)
  performance.measure("Go to URL", step2, step3)
  performance.measure("Handle disclaimer", step3, step4)
  performance.measure("Trigger search", step4, step5)
  performance.measure("Scrape results", step5, step6)
  performance.measure("Close browser", step6, step7)
}

const scrapeBingResults = async () => {
  performance.mark(step1)

  const [page, browser] = await createPage()
  performance.mark(step2)

  await goToBing(page)
  performance.mark(step3)

  await handleDisclaimer(page)
  performance.mark(step4)

  await triggerSearch(page)
  performance.mark(step5)

  let searchResults = []

  for (let i = 0; i < 3; i++) {
    const pageResults = await scrapeResults(page)

    for (let pageResult of pageResults) {
      searchResults.push(pageResult)
    }

    await goToNextPage(page)
  }

  performance.mark(step6)

  await shutdown(browser)
  performance.mark(step7)

  measureStepDurations()
}

(async () => {
  for (let i = 0; i < 30; i++) {
    await scrapeBingResults()
  }

  console.log("performance results: ", performanceResults)
})()
