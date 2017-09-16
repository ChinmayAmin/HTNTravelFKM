const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.post('/', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

/* For Facebook Validation */
app.get('/', (req, res) => {
    res.status(200).send(req.query['hub.challenge']);
});

const request = require('request');

function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: 'EAAIEcQ2mGc0BAKZBAqZC7v2yP3pl3wxaDtF4VZAUku0MuQDSr1vC67p22dSsl0P0KAOee8SWwVvIPa3TbZBW0I9uKAntGyqvZBkl2YczrcdquLFukbHNp5fAQsFBd5DtIf32ykl2i9SmmXrJvMeZC6JVLxgZBZA7V8Ejs1igLQtZARgZDZD'},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}

//EAAIEcQ2mGc0BAKZBAqZC7v2yP3pl3wxaDtF4VZAUku0MuQDSr1vC67p22dSsl0P0KAOee8SWwVvIPa3TbZBW0I9uKAntGyqvZBkl2YczrcdquLFukbHNp5fAQsFBd5DtIf32ykl2i9SmmXrJvMeZC6JVLxgZBZA7V8Ejs1igLQtZARgZDZD