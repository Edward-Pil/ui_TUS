const { Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { startRecording, stopRecording } = require("./recorder");

const BasePage = require('./BasePage');
const LoginPage = require('./loginPage');
const LKPage = require('./lkPage');
const UserPage = require('./userPage');
const account_settingsPage = require('./account_settingsPage');
const OrganizationPage = require('./OrganizationPage');
const GoodsPage = require('./GoodsPage');

(async function testLogin() {  
    let options = new chrome.Options();

    // options.addArguments("--headless=new"); // для новых версий Chrome
    // options.addArguments("--disable-gpu");   // для стабильности на Windows
    // options.addArguments("--window-size=1920,1080");
    // options.addArguments("--no-sandbox");
    // options.addArguments("--disable-dev-shm-usage");
    // options.addArguments("--start-fullscreen");
    // options.addArguments("--window-position=-1920,0"); // не нужен в headless
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    let basePage = new BasePage(driver);
    let loginPage = new LoginPage(driver);
    let lkPage = new LKPage(driver);
    let userPage = new UserPage(driver);
    let account_settings = new account_settingsPage(driver);
    let organizationPage = new OrganizationPage(driver);
    let goodsPage = new GoodsPage(driver);

  function timer(label) {
    const start = Date.now();
    console.log("Начало: " + start);
    return () => {
        const end = Date.now();
        console.log("Конец: " + end);

      console.log(`${label}: ${(end - start) / 1000} сек.`);
    };
  }
    // await driver.sleep(2000);
    // startRecording("test_run.mkv");

  try {

    let t_all = timer("Всё");
    
    let t = timer("Логин");
    await loginPage.loginUser();
    await lkPage.loginOnSub('m71761');
    t();

    await userPage.goPage();
    await userPage.search("e.pilipko+3@mail.business.ru");
    await basePage.checkText(By.xpath('//*[@title="e.pilipko+3@mail.business.ru"]'), "e.pilipko+3@mail.business.ru");
    console.log(`Пользователь найден, продолжаем тест`);

    await account_settings.goPage();
    await basePage.checkText(By.xpath(`(//div[@class="atomic select-input-div"])[3]`), 'Переходить в режим "Просмотр"');
    await account_settings.saveSetings();
    console.log(`Насткройки аккаунта верны`);

    await organizationPage.goPage();
    await organizationPage.checkGridSettings();
    await organizationPage.search('ТестОрганизацияТест');
    await basePage.click(By.xpath('//*[text()="ТестОрганизацияТест"]/../..'));
    await basePage.click(By.id("organization-Popup1-ActionsEdit-button"));
    await basePage.checkHiddenText(By.xpath('//*[text()="ДемонстрационныйТипЦеныЗакупкаДефолт"]'), 'ДемонстрационныйТипЦеныЗакупкаДефолт');
    await basePage.click(By.id("organization-Popup1-Save-button"));


    t = timer('Создани товара');
    await goodsPage.goPage(); //Создание товара
    await basePage.click(By.xpath('(//*[@data-map="goods-Index-Tree-TreeItem"]/..)[2]'));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await basePage.click(By.xpath('(//*[@data-map="goods-Index-Tree-TreeItem"]/..)[1]'));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await basePage.click(By.xpath('//*[@id="goods-Index-Grid-Filter-archived_filter-field"]//input/..'));
    await basePage.click(By.xpath('//*[@id="goods-Index-Grid-Filter-archived_filter-field"]//span[text()="Все"]'));
    await basePage.click(By.xpath('//span[text()="Создать группу"]/..'));
    await basePage.setText(By.id('groupgoods-Popup1-c_name-field'), 'ТестГруппаДляCO-18577');
    await basePage.click(By.id('groupgoods-Popup1-Save-button'));
    await basePage.waitForElementToDisappear(By.id('groupgoods-Popup1'));
    await basePage.click(By.xpath('(//*[@data-map="goods-Index-Tree-TreeItem"]/..)[2]'));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await basePage.click(By.xpath('(//*[@data-map="goods-Index-Tree-TreeItem"]/..)[1]'));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await basePage.click(By.xpath('//*[@id="goods-Index-Grid-Filter-archived_filter-field"]//input/..'));
    await basePage.click(By.xpath('//*[@id="goods-Index-Grid-Filter-archived_filter-field"]//span[text()="Все"]'));
    await basePage.click(By.id('goods-Index-Grid-Add-button'));
    await basePage.setText(By.id('goods-Popup1-c_name-field'), "ТестТовар3 CO-18577");
    await basePage.searchAndTakeInSelect(By.xpath('//*[@id="goods-Popup1-group_goods_ref-field"]//input'), "ТестГруппаДляCO-18577")
    await basePage.click(By.id('goods-Popup1-Save-button'));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
     //Назначение цены товару
    await basePage.click(By.id('goods-Popup1-Accordions-Prices-PricesWrap-prices-PriceBuyAdd-button'));
    await basePage.searchAndTakeInSelect(By.xpath('//div[@id="pricesbuy-PopupNewOnePriceFromGoods"]//input[@class="atomic select-input"]'), "ТестОрганизацияТест")
    await basePage.click(By.xpath('(//div[@id="pricesbuy-PopupNewOnePriceFromGoods"]//input[@class="atomic select-input"])[3]'));
    await basePage.searchAndTakeInSelect(By.xpath('(//div[@id="pricesbuy-PopupNewOnePriceFromGoods"]//input[@class="atomic select-input"])[3]'), "ДемонстрационныйТипЦеныЗакупкаДефолт")
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await basePage.setText(By.id('pricesbuy-PopupNewOnePriceFromGoods-price-field'), "100");
    await basePage.click(By.id('pricesbuy-PopupNewOnePriceFromGoods-SaveObj-button'));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    t();

    await driver.get("https://m71761.business.ru/posting");
    await basePage.click(By.id('posting-Index-Grid-Add-button'));
    await basePage.searchAndTakeInSelect(By.xpath("//div[@id='posting-Popup1-organization_ref-field']//*[@class='atomic select-input']"), "ТестОрганизацияТест")
    await basePage.searchAndTakeInSelect(By.xpath("//div[@id='posting-Popup1-store_ref-field']//*[@class='atomic select-input']"), "ТестСкладДляCO-18577")
    await basePage.click(By.id('posting-Popup1-Tabs-tab-Grid-Add-button'));
    await basePage.searchAndTakeInSelect(By.xpath("//div[@id='posting-PopupGoods-goods_ref-field']//*[@class='atomic select-input']"), "ТестТовар3 CO-18577")
    await basePage.click(By.id("posting-PopupGoods-amount-amount-field"));
    await basePage.setText(By.id("posting-PopupGoods-amount-amount-field"), '1');
    await basePage.checkText(By.xpath("//div[@id='posting-PopupGoods-price-price_list_ref']//span/span"), "ДемонстрационныйТипЦеныЗакупкаДефолт");
    await basePage.checkText(By.id("posting-PopupGoods-price-price-field"), "100");
    await basePage.click(By.id("posting-PopupGoods-SaveObj-button"));
    await basePage.click(By.xpath("//div[@id='posting-PopupGoods']//div[@class='popUp-Close close sprites-close']"));
    await basePage.click(By.id("posting-Popup1-Save-button"));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await basePage.checkText(By.xpath('//*[@class="no-caption has-value disabled visible no-cap-context  ui-input grid_goods_price disabled-edit ui-select price_ui_obj value-100"]/div/div'), "100.00");
    await basePage.checkText(By.xpath("//*[@id='posting-Popup1-Tabs-tab-Grid-0-GridRowUiObjects-sum_ui_obj']//span[@class='disabled-content']"), "100.00");
    //Опять товар
    await basePage.click(By.xpath("//*[@id='posting-Popup1-Tabs-tab-Grid-0-GridRowUiObjects-goods_name_ui_obj']//span[@class='onclick select-disabled-link']"));
    await basePage.click(By.id("goodsadd-Popup1-ActionsEdit-button"));   
    await basePage.click(By.id("goodsadd-Popup1-Accordions-Prices-PricesWrap-prices-PriceBuyAdd-button"));
    await basePage.searchAndTakeInSelect(By.xpath('//div[@id="pricesbuy-PopupNewOnePriceFromGoods"]//input[@class="atomic select-input"]'), "ТестОрганизацияТест")
    await basePage.click(By.xpath('(//div[@id="pricesbuy-PopupNewOnePriceFromGoods"]//input[@class="atomic select-input"])[3]'));
    await basePage.searchAndTakeInSelect(By.xpath('(//div[@id="pricesbuy-PopupNewOnePriceFromGoods"]//input[@class="atomic select-input"])[3]'), "ДемонстрационныйТипЦеныЗакупкаДефолт")
    await basePage.setTextWihtClear(By.id('pricesbuy-PopupNewOnePriceFromGoods-price-field'), "155");
    await basePage.click(By.id('pricesbuy-PopupNewOnePriceFromGoods-SaveObj-button'));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await basePage.waitForElementToDisappear(By.id("pricesbuy-PopupNewOnePriceFromGoods"));
    await basePage.click(By.id('goodsadd-Popup1-Save-button'));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await basePage.click(By.xpath("//div[@id='goodsadd-Popup1']//*[@class='popUp-Close close sprites-close']"));

    //Возвращаемтся к документу
    await basePage.click(By.id("posting-Popup1-ActionsEdit-button"));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await basePage.click(By.xpath("//td[@class='td_show_edit_popup']"));
    await basePage.checkText(By.xpath("//div[@id='posting-PopupGoods-goods_ref-field']//*[@class='atomic select-input']"), "ТестТовар3 CO-18577");
    await basePage.checkText(By.id("posting-PopupGoods-price-price-field"), "100");
    await basePage.click(By.xpath("//div[@id='posting-PopupGoods']//div[@class='popUp-Close close sprites-close']"));

    //Удаление всего
    await basePage.click(By.xpath("//*[@id='posting-Popup1-Actions-field']//div[@class='select-switcher']"));
    await basePage.click(By.xpath("//*[@id='posting-Popup1-Actions-field']//div[@class='select-list-container']/div"));
    await basePage.click(By.id("posting-Index-Grid-DeleteConfirm-Ok-button"));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await goodsPage.goPage();
    await basePage.click(By.xpath("//*[@class = 'onclick tree-item' and text()='ТестГруппаДляCO-18577']"));
    await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await driver.executeScript("window.scrollTo(0, 0);");
    await goodsPage.search("CO-18577");
    await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));    
    await basePage.click(By.xpath("//*[@class='grid-thead']//th//*[@type='checkbox']//.."));
    await basePage.click(By.xpath("//*[@class='atomic select-input-div']/span"));
    await basePage.click(By.xpath("//*[@data-id='ja_Delete']"));
    await basePage.click(By.xpath("//*[@data-map='goods-Index-Grid-deleteRowLinks']"));
    await basePage.click(By.id("goods-Index-Grid-deleteRowLinksConfirm-Ok-button"));
    await basePage.click(By.id("goods-Index-Grid-DeleteConfirm-Ok-button"));
//await basePage.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
    await basePage.hoverAndClick( By.xpath("//div//*[text()='ТестГруппаДляCO-18577']"),By.xpath('//*[text()="ТестГруппаДляCO-18577"]//..//button[@data-map="goods-Index-Tree-DeleteTreeItem"]'));
    // await driver.sleep(20000)
    t_all();    
  } catch (err) {
  console.error("Ёбаный рот:", err);
  } finally {
    await stopRecording();
    await driver.quit();
  }
})();