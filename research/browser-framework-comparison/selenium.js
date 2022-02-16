import { Builder, By, Key, until } from "selenium-webdriver"
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
  const driver = await new Builder().forBrowser('chrome').build()

  return driver
}

const goToBing = async (driver) => {
  const url = "https://www.bing.com"

  await driver.get(url)
}

const tab = async (page, amount) => {
  for (let i = 0; i < amount; i++) {
    await page.keyboard.press("Tab")
    await page.waitForTimeout(200)
  }
}

const handleDisclaimer = async (driver) => {
  const acceptButtonSelector = "button[class*='accept']"
  await driver.sleep(1000)

  const button = await driver.wait(until.elementLocated(By.css(acceptButtonSelector)))
  await button.click()
}

const triggerSearch = async (driver) => {
  const inputSelector = "input[id*='form'][type*='search']"
  const searchTerm = "png to webp"

  const input = await driver.wait(until.elementLocated(By.css(inputSelector)))
  await input.click()
  await input.sendKeys(searchTerm)
  await input.sendKeys(Key.RETURN)
}

const scrapeResults = async (driver) => {
  const resultSelector = "li > h2 > a"

  await driver.wait(until.elementLocated(By.css(resultSelector)))

  const elements = await driver.findElements(By.css(resultSelector))
  const results = elements.map(async element => {
    return {
      href: await element.getAttribute("href"),
      text: await element.getText(),
    }
  })

  const resolvedResults = await Promise.all(results)
  return resolvedResults
}

const goToNextPage = async (driver) => {
  const nextPageSelector = "a[href*='/search'][title*='Nächste']"
  const modalSelector = "div[id*='notification'] span[class*='cta2']"

  const button = await driver.wait(until.elementLocated(By.css(nextPageSelector)))
  const modalButtons = await driver.findElements(By.css(modalSelector))

  if (modalButtons.length != 0) {
    await modalButtons[0].click()
  }

  await button.click()
}

const shutdown = async (driver) => {
  await driver.quit()
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

  const driver = await createPage()
  performance.mark(step2)

  await goToBing(driver)
  performance.mark(step3)

  await handleDisclaimer(driver)
  performance.mark(step4)

  await triggerSearch(driver)
  performance.mark(step5)

  let searchResults = []

  for (let i = 0; i < 3; i++) {
    const pageResults = await scrapeResults(driver)

    for (let pageResult of pageResults) {
      searchResults.push(pageResult)
    }

    await goToNextPage(driver)
  }

  console.log(searchResults, searchResults.length)

  performance.mark(step6)

  await shutdown(driver)
  performance.mark(step7)

  measureStepDurations()
}

(async () => {
  try {
    for (let i = 0; i < 30; i++) {
      await scrapeBingResults()
    }
  } catch (e) {
    console.log("exception: ", e)
  }

  console.log("performance results: ", performanceResults)
})()
