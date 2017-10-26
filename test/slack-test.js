var assert = require('assert');

describe('Slack', function() {

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
          channels: 'joy-private',
          file: imageStream
        }}, function(err, res, body){
          console.log(res);
          console.log(err);
        });

      });
   });
 });
