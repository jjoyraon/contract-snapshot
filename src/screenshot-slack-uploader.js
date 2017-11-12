const fs = require('fs');
const puppeteer = require('puppeteer');
const slackFileUpload = require('slack-file-upload');

const {config} = require('../config-screenshot-slack-uploader');

module.exports = {
    screenshot: (pageUrl, filename) => {
        shot(pageUrl, filename);
    }
}

const shot = (pageUrl, filename) => {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(pageUrl);
        await page.waitFor(1000);
        await page.screenshot({path: filename});

        await upload(filename);
        await browser.close();
        fs.unlink(filename, function(err){});
    })();
}

const upload = (filename) => {
    slackFileUpload.upload({
        token : process.env.SLACK_TESTBOT_TOKEN,
        channels : config.channels,
        filename : filename
    });
}
