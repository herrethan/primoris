// # Ghost Startup
// Orchestrates the startup of Ghost when run from command line.
var express,
    ghost,
    parentApp,
    errors;

// Make sure dependencies are installed and file system permissions are correct.
require('./core/server/utils/startup-check').check();

// Proceed with startup
express = require('express');
ghost = require('./core');
errors = require('./core/server/errors');

// Create our parent express app instance.
parentApp = express();

// Call Ghost to get an instance of GhostServer
ghost().then(function (ghostServer) {
    // Mount our Ghost instance on our desired subdirectory path if it exists.
    parentApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);

    // Let Ghost handle starting our server instance.
    ghostServer.start(parentApp);

}).catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});


parentApp.get('/milky/', function (req, res) {
  // res.status(200);
  // res.send('eggs!');
});


// var nodemailer = require('nodemailer');
// var mg = require('nodemailer-mailgun-transport');

// // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
// var auth = {
//   auth: {
//     api_key: 'key-9c766144476a73ceab130da35bb8f080',
//     domain: 'app3d6bf474137f4dcab1b2bd05a9ff89f7.mailgun.org'
//   }
// }

// var nodemailerMailgun = nodemailer.createTransport(mg(auth));

// nodemailerMailgun.sendMail({
//   from: 'myemail@example.com',
//   to: 'herrethan@gmail.com', // An array if you have multiple recipients.
//   // cc:'second@domain.com',
//   // bcc:'secretagent@company.gov',
//   subject: 'Hey you, awesome!',
//   // 'h:Reply-To': 'reply2this@company.com',
//   //You can use "html:" to send HTML email content. It's magic!
//   html: '<b>Wow Big powerful letters</b>'
//   //You can use "text:" to send plain-text content. It's oldschool!
//   // text: 'Mailgun rocks, pow pow!'
// }, function (err, info) {
//   if (err) {
//     console.log('bad eggs: ' + err);
//   }
//   else {
//     console.log('good eggs: ' + info);
//   }
// });