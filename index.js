// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:' + port + '/parse',
  liveQuery: {
    classNames: ["ForumChanel", "ForumChanelComments", "ForumChanelComments2"],
   // redisURL: process.env.REDIS_URL
  }
});


// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


var port = process.env.PORT || 1337;
app.listen(port, function() {
    console.log('parse-server-example running on port 1337.');
});

var httpServer = require('http').createServer(app);
httpServer.listen(4040, function() {
});

var parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);
