const { By, until } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LKPage extends BasePage {
  constructor(driver) {    
    super(driver);

    // локаторы
    this.subButton = By.xpath(`//div[@class="subscription__itegration-title"]//span[text()="cloud5"]//..//..//..//..`);
  }

    async loginOnSub(sub = 'cloud5') {
    
    this.subButton = By.xpath(`//div[@class="subscription__itegration-title"]//span[text()="${sub}"]//..//..//..//..`);

    await this.driver.wait(until.elementLocated(this.subButton),30000);
    await this.click(this.subButton);
    }
}

module.exports = LKPage;
