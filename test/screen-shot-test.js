const assert = require('assert');
const fs = require('fs');
const puppeteer = require('puppeteer');

describe('Screenshot Test', function(done) {
  it('Capture screenshot from web page', function() {
    // (async () => {
    //   const browser = await puppeteer.launch();
    //   const page = await browser.newPage();
    //   await page.goto('http://localhost:3000/');
    //   await page.screenshot({path: 'result.png'});
    //
    //   await browser.close();
    // })();
    console.log('start');
    puppeteer.launch().then(browser => {
      browser.newPage().then(page => {
        page.goto('http://localhost:3000/').then(()=>{
          page.waitFor(1000).then(()=>{
            page.screenshot({path: 'result.png'}).then(() => {
              browser.close();
            });
          });
        });
      });
    }).catch((err) => console.log(err));

  });
});
