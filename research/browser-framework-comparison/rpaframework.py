from RPA.Browser.Selenium import Selenium
from timeit import default_timer as timer
from time import sleep

performance_results = {
    "Launch page": [],
    "Go to URL": [],
    "Handle disclaimer": [],
    "Trigger search": [],
    "Scrape results": [],
    "Close browser": [],
}


def create_page():
    browser = Selenium()
    browser.open_chrome_browser(url="about:blank")

    return browser


def go_to_bing(browser):
    url = "https://www.bing.com"
    browser.go_to(url)


def handle_disclaimer(browser):
    accept_button_selector = "css:button[class*='accept']"
    sleep(1)

    browser.wait_until_element_is_visible(locator=accept_button_selector)
    browser.click_element(locator=accept_button_selector)


def trigger_search(browser):
    input_selector = "css:input[id*='form'][type*='search']"
    search_term = "png to webp"

    browser.click_element_when_visible(locator=input_selector)
    browser.input_text(locator=input_selector, text=search_term, clear=True)
    browser.press_keys(None, "RETURN")


def scrape_results(browser):
    result_selector = "css:li > h2 > a"

    browser.wait_until_element_is_visible(locator=result_selector)
    elements = browser.get_webelements(locator=result_selector)

    results = [
        {
            "href": browser.get_element_attribute(locator=element, attribute="href"),
            "text": browser.get_text(locator=result_selector)
        }
        for element in elements
    ]

    return results


def go_to_next_page(browser):
    next_page_selector = "css:a[href*='/search'][title*='Nächste']"

    browser.wait_until_element_is_visible(locator=next_page_selector)

    modal_selector = "css:div[id*='notification'] span[class*='cta2']"
    modal_visible = browser.is_element_visible(locator=modal_selector)

    if modal_visible:
        browser.click_element(locator=modal_selector)

    browser.click_element(locator=next_page_selector)


def shutdown(browser):
    browser.close_browser()


def scrape_bing_results():
    step1 = timer()

    browser = create_page()

    step2 = timer()
    performance_results["Launch page"].append(step2-step1)

    go_to_bing(browser)

    step3 = timer()
    performance_results["Go to URL"].append(step3-step2)

    handle_disclaimer(browser)

    step4 = timer()
    performance_results["Handle disclaimer"].append(step4-step3)

    trigger_search(browser)

    step5 = timer()
    performance_results["Trigger search"].append(step5-step4)

    search_results = []

    for i in range(0, 3):
        results = scrape_results(browser)

        for result in results:
            search_results.append(result)

        go_to_next_page(browser)

    print(search_results, len(search_results))

    step6 = timer()
    performance_results["Scrape results"].append(step6-step5)

    shutdown(browser)

    step7 = timer()
    performance_results["Close browser"].append(step7-step6)


if __name__ == "__main__":
    for i in range(0, 30):
        scrape_bing_results()

    print("\n\n")

    lp_values = performance_results["Launch page"]
    gtu_values = performance_results["Go to URL"]
    hd_values = performance_results["Handle disclaimer"]
    ts_values = performance_results["Trigger search"]
    sr_values = performance_results["Scrape results"]
    cb_values = performance_results["Close browser"]

    avg_performance_results = {
        "Launch page": sum(lp_values) / len(lp_values),
        "Go to URL": sum(gtu_values) / len(gtu_values),
        "Handle disclaimer": sum(hd_values) / len(hd_values),
        "Trigger search": sum(ts_values) / len(ts_values),
        "Scrape result": sum(sr_values) / len(sr_values),
        "Close browser": sum(cb_values) / len(cb_values)
    }

    print("avg performance_results: ", avg_performance_results)
