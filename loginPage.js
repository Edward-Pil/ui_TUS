const { By, until } = require('selenium-webdriver');
const BasePage = require('./BasePage');


class LoginPage extends BasePage {
  constructor(driver) {    
    super(driver);

    this.loginURL = 'https://id.business.ru/';
    this.login = 'e.pilipko+3@mail.business.ru';
    this.pass = 'p5rmzuhmQ';

    // локаторы
    this.loginInput = By.name('login');
    this.passInput = By.name('password');
    this.loginButton = By.xpath('//*[@class="sc-gueYoa cRcZUn im-btn im-btn--type-success im-btn--size-big im-btn--rounding-normal im-btn--shadow im-btn--weight-bold"]');
  }

    async loginUser(username = this.login, password = this.pass) {
    
    await this.driver.get(this.loginURL);
    const loginBtn = await this.driver.findElement(this.loginButton);
    await this.driver.wait(until.elementIsVisible(loginBtn), 10000);

    await this.setText(this.loginInput, username);
    await this.setText(this.passInput, password);
    await this.click(this.loginButton);
    }
}

module.exports = LoginPage;
