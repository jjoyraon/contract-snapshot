const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require('request');

const {config} = require('../config-screenshot-slack-uploader');
const token = process.env.SLACK_TESTBOT_TOKEN

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
            token: token,
            channels: config.channels,
            file: imageStream
        }}, function(err, res, body){
        });
}

const shot = (pageUrl, filename) => {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(pageUrl);
        await page.waitFor(1000);
        await page.screenshot({path: filename});

        await uploadImage(filename);
        await browser.close();
        fs.unlink(filename, function(err){});
    })();
}
