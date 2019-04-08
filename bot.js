const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
var bot = new Bot(token, { polling: true });
var request = require('request');


if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.onText(/\/start/, message => {
  const fromId = message.from.id;
  const response = 'Instructions: \n/repo - used to get the issues from a specific repository. For example </repo catapult-rest>\n/git - Used to get all the issues from all the repositories in NEMTECH organisation. For example </git repos>';
  return bot.sendMessage(fromId, response);
});

bot.onText(/\/repo (.+)/, function (msg, match) {
  var chatID = msg.chat.id;
  var repo = match[1];
  var options = {
      url: `https://api.github.com/repos/nemtech/${repo}/issues`,
      headers: {
          'User-Agent': 'request'
      }
  };
  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          bot.sendMessage(chatID, "_the issues in _" + repo + ' _are_ ...', { parse_mode: 'Markdown' })
              .then(function (msg) {
                  var res = JSON.parse(body);
                  for (var i = 0; i < res.length; i++) {
                      var counter = res[i]
                      bot.sendMessage(chatID, '\nTitle: ' + counter.title + '\nURL: ' + counter.html_url + '\nIssue Number: ' + counter.number + '\nAuthor: ' + counter.user.login+'\nNumber of Comments: '+counter.comments+'\nDate Created: '+counter.created_at.slice(0, -10));
                  }
              })
      } else if (response.statusCode != 200) {
          bot.sendMessage(chatID, 'repo not availble in Nemtech Organisation');
      } else {
          bot.sendMessage(chatID, 'Encountered an error' + error);
      }
  }
  request(options, callback);
});

// get issues from all repositories
bot.onText(/\/git (.+)/, function (msg) {
  var chatID = msg.chat.id;
  var option = {
      url: "https://api.github.com/repos/nemtech/nem2-sdk-typescript-javascript/issues",
      headers: {
          'User-Agent': 'request'
      }
  };
  var option1 = {
      url: "https://api.github.com/repos/nemtech/catapult-rest/issues",
      headers: {
          'User-Agent': 'request'
      }
  };
  var option2 = {
      url: "https://api.github.com/repos/nemtech/nem2-sdk-java/issues",
      headers: {
          'User-Agent': 'request'
      }
  };
  var option3 = {
      url: "https://api.github.com/repos/nemtech/nem2-scenarios/issues",
      headers: {
          'User-Agent': 'request'
      }
  };
  var option4 = {
      url: "https://api.github.com/repos/nemtech/catbuffer/issues",
      headers: {
          'User-Agent': 'request'
      }
  };
  var option5 = {
      url: "https://api.github.com/repos/nemtech/nem2-library-js/issues",
      headers: {
          'User-Agent': 'request'
      }
  };
  var option6 = {
      url: "https://api.github.com/repos/nemtech/catapult-server/issues",
      headers: {
          'User-Agent': 'request'
      }
  };
  var option7 = {
      url: "https://api.github.com/repos/nemtech/catapult-service-bootstrap/issues"
      ,
      headers: {
          'User-Agent': 'request'
      }
  };
  var option8 = {
      url: "https://api.github.com/repos/nemtech/nem2-sdk-csharp/issues",
      headers: {
          'User-Agent': 'request'
      }
  };
  var option9 = {
      url: "https://api.github.com/repos/nemtech/nem2-sdk-python/issues"
      ,
      headers: {
          'User-Agent': 'request'
      }
  };
  var option10 = {
      url: "https://api.github.com/repos/nemtech/nem2-camel/issues",
      headers: {
          'User-Agent': 'request'
      }
  };
  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          var res = JSON.parse(body);
          var table = '';
          var URL1 = '';
          var x = '', y = ''; 

          for (var i = 0; i < res.length; i++) {

              var counter = res[i];
              //Getting repo name
              URL1 = counter.repository_url;
              var URL = counter.html_url;
              //Filter through the issues
              if (counter.milestone == null && counter.assignee == null && URL.includes("/issues/")) {
                  x = '\nTitle: ' + counter.title + '\nURL: ' + counter.html_url + '\nIssue Number: ' + counter.number + '\nAuthor: ' + counter.user.login+'\nNumber of Comments: '+counter.comments+'\nDate Created: '+counter.created_at.slice(0, -10);
                  //prevent repetetion
                  if (x != null && x != y) {
                      var m = 0;
                      table = table + "\n" + x;
                      y = x;
                  }
              }
          }
          //Making sure bot doesnt send empty message
          if (table.includes("Title")) {
              bot.sendMessage(chatID, 'Repository Name: '+URL1.substring(37)+''+table);
          }
      } else if (response.statusCode != 200) {
          bot.sendMessage(chatID, 'Response error: ' + response.statusCode);
      } else {
          bot.sendMessage(chatID, 'Error: ' + error);
      }
  }
  request(option, callback);
  request(option1, callback);
  request(option2, callback);
  request(option3, callback);
  request(option4, callback);
  request(option5, callback);
  request(option6, callback);
  request(option7, callback);
  request(option8, callback);
  request(option9, callback);
  request(option10, callback);
});

module.exports = bot;
