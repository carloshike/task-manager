import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('Gerenciado de tarefas', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Deve mostrar o título da aplicação', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Gerenciador de Tarefas');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
