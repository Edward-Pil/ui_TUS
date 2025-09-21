const { By, until } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const { error } = require('console');

class account_settingsPage extends BasePage {
  constructor(driver) {    
    super(driver);

    // this.userURL = 'https://cloud5.cloud365.su:81//account_settings';
    this.userURL = 'https://m71761.business.ru/account_settings';


    // локаторы
    this.saveButton = By.id(`accountsettings-Index-SaveSettings-button`);
    this.ActionAfterSaving = By.xpath(`(//div[@class="atomic select-input-div"])[3]`);
    // this.setingOk = By.id(`accountsettings-Index-alert-Ok-button`);
  }

  async goPage() {
    await this.driver.get(this.userURL);
  }

  async checkActionAfterSaving(action) { //дописать или убрать
    const elemActionAfterSaving = await this.driver.findElement(this.ActionAfterSaving);
    await this.driver.wait(until.elementIsVisible(elemActionAfterSaving), 15000);
    const text = (await elemActionAfterSaving.getText()).trim();

    if (action !== text) {
      throw new Error(`Ожидалось: "${action}", но получили: "${text}"`);
    }

    console.log("Насткройки аккаунта совпадают");
  }
  
  async saveSetings(){
    const saveButton = await this.driver.findElement(this.saveButton);
    await this.driver.wait(until.elementIsVisible(saveButton), 15000);
    await this.click(this.saveButton);
    // await this.click(this.setingOk);
  }
}

module.exports = account_settingsPage;
