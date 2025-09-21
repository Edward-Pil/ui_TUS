const { By, until, Key } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class GoodsPage extends BasePage {
  constructor(driver) {    
    super(driver);

    this.goodsURL = 'https://m71761.business.ru/goods';
    // this.goodsURL = 'https://cloud5.cloud365.su:81//goods';

    // локаторы
    this.searchInput = By.xpath(`//input[@class = "manual-input"]`);
    this.gridSettings = By.id('organization-Index-Grid-system');
    this.gridSettingsSearchCheckBoxFullName = By.xpath('//*[@id= "organization-Index-Grid-SysWin-GridSearchCheckBox-c_name_full_cb-field"]');
    this.gridSettingsOK = By.id("organization-Index-Grid-SysWin-Ok-button");
  }

  async goPage() {
    await this.driver.get(this.goodsURL);
  }

  async checkGridSettings(expectedState = true) {
    const grid = await this.driver.wait(
      until.elementLocated(this.gridSettings),
      10000
    );
    await this.driver.wait(until.elementIsVisible(grid), 15000);
    await this.click(this.gridSettings);
    // await this.driver.sleep(5000);

    const checkbox = await this.driver.wait(
      until.elementLocated(this.gridSettingsSearchCheckBoxFullName),
      5000
    );
    await this.driver.sleep(100);
    const element = await this.driver.findElement(By.xpath('//*[@id= "organization-Index-Grid-SysWin-GridSearchCheckBox-c_name_full_cb-field"]//..'));
    await this.highlight(element, 'blue');
    
    const isChecked = await checkbox.isSelected();
    if (isChecked !== expectedState) {
      throw new Error(
        `Ожидалось, что чекбокс будет ${expectedState ? "отмечен" : "снят"}, но он ${isChecked ? "отмечен" : "снят"}`
      );
    }
    await this.unhighlight(checkbox);
    await this.click(this.gridSettingsOK);
    const setingWindow = await this.driver.wait(until.elementLocated(By.xpath('//*[@class="gridfilter-loading hide"]')));
    await this.driver.wait(async () => {
        const visible = await setingWindow.isDisplayed().catch(() => false);
        return !visible;
      }, 10000);
    console.log(`Насткройки грида верны`);
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

module.exports = GoodsPage;
