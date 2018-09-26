const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const app = express();

// where to find the reusable bits of code to use in different view files
hbs.registerPartials(__dirname + '/views/partials')
// views is default view files folder for express
// save files in views as .hbs
// .set allows us to set express configs
app.set('view engine', 'hbs');

// app.use registers middleware to express
// next is called when middleware function is done
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`
  console.log(log)
  // first argument = file to append to
  // second argument = object to append
  // third argument = error handling callback REQUIRED
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  })
  next();
});

// // not using next can be used in a case when the site is undergoing maintainence
// // and you do not want to render further templates
// app.use((req, res, next) => {
//   res.render('maintainence.hbs', {
//     pageTitle: 'Site is down!'
//   })
// });

// __dirname stores path to project directory
app.use(express.static(__dirname + '/public'));

// allows you to run functions inside of your handlebar templates
// first argument = name of helper
// second = function
// if helper is called inside of handlbar, function it is set with will be called
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Hey! Welcome'
  })
});

app.get('/about', (req, res) => {
  // allows you to render any of the view engine static templates
  // express is already configured find static view templates in folder called view
  // specify dynamic data to serve in second argument as an object
  res.render('about.hbs', {
    pageTitle: 'About Page',
  })
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to fulfill this request'
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
