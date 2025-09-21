const { By, until, Key } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class UserPage extends BasePage {
  constructor(driver) {    
    super(driver);

    this.userURL = 'https://m71761.business.ru/users';
    // this.userURL = 'https://cloud5.cloud365.su:81/users';

    // локаторы
    this.searchInput = By.xpath(`//input[@class = "manual-input"]`);
    this.gridLine = By.xpath('//tr[@class = "row"]');
  }

  async goPage() {
    await this.goToPageWithRetry(this.userURL, '/users');
  }

  async search(searchString) {
    const searchInput = await this.driver.findElement(this.searchInput);
    await this.driver.wait(until.elementIsVisible(searchInput), 15000);          
    await this.setText(this.searchInput, searchString);
    await this.setText(this.searchInput, Key.ENTER);
    await this.waitForElementToDisappear(By.xpath('//div[@class="spinner"]'));
    // await this.driver.sleep(200);
  }

}

module.exports = UserPage;
