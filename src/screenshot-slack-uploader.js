const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require('request');

const {config} = require('../screenshot-config');

module.exports = {
  screenshot: (pageUrl, filename) => {
    shot(pageUrl, filename);
  }
}

const uploadImage = (filename) => {

  const imageStream = fs.createReadStream(filename);
  const uploadApiUrl = 'https://slack.com/api/files.upload';

  console.log('upload image: ' + config.channels);
  request.post({
    url: uploadApiUrl,
    formData: {
      token: config.token,
      channels: config.channels,
      file: imageStream
    }}, function(err, res, body){
    }
  );
}

const shot = (pageUrl, filename) => {
  puppeteer.launch().then(browser => {
    browser.newPage().then(page => {
      page.goto(pageUrl).then(()=>{
        page.waitFor(1000).then(()=>{
          page.screenshot({path: filename}).then(() => {
            uploadImage(filename);
            browser.close();
          });
        });
      });
    });
  }).catch((err) => console.log(err));
}
