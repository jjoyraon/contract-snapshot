const assert = require('assert');
const fs = require('fs');
const puppeteer = require('puppeteer');

describe('Screenshot Test', function(done) {
  it('Capture screenshot from web page', function() {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('http://localhost:3000/');
      await page.waitFor(1000);
      await page.screenshot({path: 'result.png'});

      await browser.close();
    //   fs.unlink('result.png', function(err){
    //       console.log();
    //   });
    })();
  });
});
