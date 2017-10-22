var assert = require('assert');

describe('Slack', function() {
  // describe('Slack post message', function() {
  //   it('should success post message by slack bot.', function() {
  //     const token = 'xoxb-'
  //     const Slack = require('slack')
  //     const bot = new Slack({token})
  //
  //     bot.chat.postMessage({token: token , channel: 'te-private', text: 'hello'})
  //     .then(console.log)
  //     .catch(console.log);
  //
  //   });
  // });

  describe('Slack upload image', function() {
    it('should success upload image by slack bot.', function() {
      const token = 'xoxb-';

      const fs = require('fs');
      const fileName = 'result.png';
      const imageStream = fs.createReadStream(fileName);
      const uploadApiUrl = 'https://slack.com/api/files.upload';

      const request = require('request');
      request.post({
        url: uploadApiUrl,
        formData: {
          token: token,
          channels: 'te-private',
          file: imageStream
        }}, function(err, res, body){
          console.log(res);
          console.log(err);
        });

      });
   });
 });
