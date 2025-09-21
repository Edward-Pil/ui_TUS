const { until, By, Actions } = require('selenium-webdriver');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async goToPageWithRetry(url, expectedUrlPart, timeout = 30000) {
    const interval = 5000; // повторная попытка каждые 5 секунд
    const startTime = Date.now();

    while (true) {
      await this.driver.get(url); // пробуем зайти на страницу
      const currentUrl = await this.driver.getCurrentUrl();

      if (currentUrl.includes(expectedUrlPart)) {
        console.log(`Страница загружена: ${currentUrl}`);
        return;
      }

      if (Date.now() - startTime > timeout) {
        throw new Error(`Не удалось открыть страницу "${expectedUrlPart}" за ${timeout / 1000} секунд. Текущий URL: ${currentUrl}`);
      }

      console.log(`Открылась неверная страница "${currentUrl}", повтор через 5 секунд...`);
      await this.driver.sleep(interval);
    }
  }


  // подсветка элемента
  async highlight(element, color = 'red') {
    try {
      await this.driver.executeScript(`arguments[0].style.border='3px solid ${color}';`, element);
    } catch (e) {
      console.warn("[DEBUG]Не удалось покрасить элемнт");
    }
  };
  async unhighlight(element) {
    try {
      await this.driver.executeScript(
        "arguments[0].style.border='';",
        element
      );
    } catch (e) {
      console.warn("[DEBUG]Не удалось снять подсветку");
    }
  };

  async setText(locator, text) {
    const element = await this.driver.wait(until.elementLocated(locator), 10000);
    await this.driver.wait(until.elementIsVisible(element), 5500);

    await this.highlight(element);
    await element.sendKeys(text);
    await this.unhighlight(element);

  }

  async setTextWihtClear(locator, text) {
    const element = await this.driver.wait(until.elementLocated(locator), 10000);
    await this.driver.wait(until.elementIsVisible(element), 5500);

    await this.highlight(element);
    await element.clear();
    await element.sendKeys(text);
    // await this.driver.sleep(500);
    await this.unhighlight(element);

  }

  async click(locator, retries = 3) {
    // const element = await this.driver.wait(until.elementLocated(locator), 10000);
    // await this.driver.wait(until.elementIsVisible(element), 6000);

    // await this.highlight(element);
    // await element.click();
    // await this.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));

    // await this.unhighlight(element);

    for (let i = 0; i < retries; i++) {
      try {
        const element = await this.driver.wait(until.elementLocated(locator), 10000);
        await this.driver.wait(until.elementIsVisible(element), 6000);

        await this.highlight(element);
        await (await this.driver.findElement(locator)).click();
        await this.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));

        await this.unhighlight(element);
        return;
      } catch (err) {
        if (err.name === "StaleElementReferenceError" && i < retries - 1) {
          console.warn(`StaleElementReferenceError, пробуем снова (${i + 1}/${retries})`);
          await this.driver.sleep(100);
        } else {
          throw err;
        }
      }
    }
  };

  async hoverAndClick(hoverLocator, buttonLocator, timeout = 10000) {
    // ждём элемент для наведения
    const hoverElem = await this.driver.wait(
      until.elementLocated(hoverLocator),
      timeout,
      `Элемент для наведения не найден: ${hoverLocator}`
    );
    await this.driver.wait(until.elementIsVisible(hoverElem), timeout);

    // наводим мышку
    const actions = this.driver.actions({ async: true });
    await actions.move({ origin: hoverElem }).perform();

    // ждём появления кнопки
    const buttonElem = await this.driver.wait(
      until.elementLocated(buttonLocator),
      timeout,
      `Кнопка не появилась после наведения: ${buttonLocator}`
    );
    await this.driver.wait(until.elementIsVisible(buttonElem), timeout);

    // кликаем по кнопке
    await this.click(buttonLocator);
  }

  async checkText(locator, expectedText) {
    let lastActualText = null;

    const elem = await this.driver.wait(until.elementLocated(locator),10000,`Элемент по локатору ${locator} не найден`);
    await this.driver.wait(until.elementIsVisible(elem),5000,`Элемент ${locator} не стал видимым`);

    await this.driver.wait(async () => {
      try {
        this.highlight(elem, 'blue');

        let actualText = (await elem.getAttribute("textContent"))?.trim();

        if (!actualText) {
          actualText = (await elem.getAttribute("value"))?.trim();
        }

        lastActualText = actualText;
        const ok = actualText === expectedText.trim();

        if (ok) {
          this.unhighlight(elem);
        }

        return ok;
      } catch (err) {
        if (err.name === "StaleElementReferenceError") return false;
        throw err;
      }
    }, 10000, () => `Ожидали текст "${expectedText}", получили: "${lastActualText}"`);

    console.log(`Совпадает! Найдено: "${expectedText}"`);
  }

  async checkHiddenText(locator, expectedText) {
  let lastActualText = null;

  await this.driver.wait(async () => {
    try {
      const elem = await this.driver.findElement(locator);

      let actualText = (await elem.getAttribute("textContent"))?.trim();

      lastActualText = actualText;
      return actualText === expectedText.trim();
    } catch (err) {
      if (err.name === "StaleElementReferenceError") return false;
      throw err;
    }
  }, 10000, () => `Ожидали текст "${expectedText}", получили: "${lastActualText}"`);
    console.log(`Совпадает! Найдено: "${expectedText}"`);
  };


    async waitForElementToDisappear(locator, appearTimeout = 500, disappearTimeout = 10000) {
    // Фаза 1: коротко ждём, станет ли элемент видимым
    try {
      await this.driver.wait(async () => {
        const elems = await this.driver.findElements(locator);
        if (elems.length === 0) return false;
        try {
          return await elems[0].isDisplayed();
        } catch (e) {
          if (e && e.name === 'StaleElementReferenceError') return false;
          throw e;
        }
      }, appearTimeout);
    } catch (err) {
      if (err && err.name === 'TimeoutError') return false;
      throw err;
    }

    // Фаза 2: если появился — ждём пока станет невидимым или удалится
    try {
      await this.driver.wait(async () => {
        const elems = await this.driver.findElements(locator);
        if (elems.length === 0) return true;
        try {
          return !(await elems[0].isDisplayed());
        } catch (e) {
          if (e && e.name === 'StaleElementReferenceError') return true;
          throw e;
        }
      }, disappearTimeout);
      return true;
    } catch (err) {
      if (err && err.name === 'TimeoutError') {
        throw new Error(`Элемент ${String(locator)} не исчез за ${disappearTimeout} ms`);
      }
      throw err;
    }
  }

  async searchAndTakeInSelect(inputLocator, searchText, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Попытка ${i + 1} из ${retries} — ищем "${searchText}"`);

      // ждём появления поля ввода
      const input = await this.driver.wait(
        until.elementLocated(inputLocator),
        5000,
        `Поле селекта по локатору ${inputLocator} не найдено`
      );
      await this.driver.wait(until.elementIsVisible(input), 5000);

      // очищаем и вводим текст
      await this.setTextWihtClear(inputLocator, searchText);

      // локатор для опции
      const optionLocator = By.xpath(`//div[@class="select-list-container"]//div/span[normalize-space(text())="${searchText}"]/..`);

      // ждём появления пункта
      const option = await this.driver.wait(
        until.elementLocated(optionLocator),
        3000
      );
      await this.driver.wait(until.elementIsVisible(option), 5000);

      // кликаем по найденному пункту
      await this.click(optionLocator);
      await this.driver.sleep(200);

      console.log(`Выбрали значение "${searchText}"`);
      return; // успех
    } catch (err) {
      if (
        (err.name === "StaleElementReferenceError" || err.name === "TimeoutError") &&
        i < retries - 1
      ) {
        console.warn(
          `${err.name} при выборе "${searchText}", пробуем снова (${i + 1}/${retries})`
        );
        await this.driver.sleep(300);
        continue;
      }
      throw err; // если все ретраи кончились или ошибка другая
    }
  }
}


  // async scrollElementToMiddle(locator, timeout = 10000) {
  // // Ждём появления элемента
  // const element = await this.driver.wait(
  //   until.elementLocated(locator),
  //   timeout,
  //   `Элемент по локатору ${locator} не найден`
  // );

  // // Ждём, пока элемент станет видимым
  // await this.driver.wait(until.elementIsVisible(element), timeout);

  // // Получаем координаты элемента относительно документа
  // const y = await this.driver.executeScript(
  //   'const elem = arguments[0]; return elem.getBoundingClientRect().top + window.scrollY;',
  //   element
  // );

  // // Скроллим так, чтобы элемент оказался примерно в середине окна
  // await this.driver.executeScript(
  //   'window.scrollTo(0, arguments[0] - window.innerHeight / 2);',
  //   y
  // );

  // return element;
  // }
 
}


module.exports = BasePage;
