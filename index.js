// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var S3Adapter = require('@parse/s3-files-adapter');
var client = require('redis').createClient(process.env.REDIS_URL);
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var s3Adapter = new S3Adapter(
                  process.env.S3_ACCESS_KEY,
                  process.env.S3_SECRET_KEY,
                  process.env.S3_BUCKET, {
                    region: 'eu-central-1',
                    directAccess: true,
                    signatureVersion: 'v4',
                    globalCacheControl: 'public, max-age=86400'  // 24 hrs Cache-Control.
                  });


var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://localhost:' + port + '/parse',
  javascriptKey: process.env.JS_KEY || '',
  liveQuery: {
    classNames: ["ForumChanel", "ForumChanelComments", "ForumChanelComments2", "PushNotifications", "Friends", "Message"],
    redisURL: process.env.REDIS_URL
  },
 filesAdapter: s3Adapter,
 verifyUserEmails: true,
  appName: process.env.APP_ID,
  publicServerURL: process.env.SERVER_URL,
  emailAdapter: {
    module:'@parse/simple-mailgun-adapter',
    options: {
      // The address that your emails come from 
      fromAddress: process.env.EMAIL_FROM,
      // Your domain from mailgun.com 
      domain: process.env.MAILGUN_DOMAIN,
      // Your API key from mailgun.com 
      apiKey: process.env.MAILGUN_API_KEY
    }
  }
});

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});
// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);


