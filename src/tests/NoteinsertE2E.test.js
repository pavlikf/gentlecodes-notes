const puppeteer = require('puppeteer');

const note = {
    text: "Test note text"
};

describe('Insert form', () => {
    test('insert form loads correctly', async () => {
        let browser = await puppeteer.launch({
            headless: false
        });
        let page = await browser.newPage();

        await page.goto('http://localhost:3000/');
        await page.waitForSelector('[data-test=link-create-note]');
        await page.click('[data-test=link-create-note]');
        await page.waitForSelector('[data-test=textarea-note]');

        const noteTest = await page.$eval('[data-test=textarea-note]', e => e.innerHTML);
        expect(noteTest).toBe("");

        browser.close();
    }, 16000);
});