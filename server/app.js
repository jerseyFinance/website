// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

var router = express.Router();

router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        console.log(req);
        res.send(req);
    });

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use('/api', router);


// Always return the main index.html, so react-router render the route in the client
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
// });

app.get(' /p', function(req, res) {
  res.send("tagId is set to " + req.query.tagId);
});
module.exports = app;
