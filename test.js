var tape = require('tape');
var express = require('express');
var lib = require('./');
var request = require('request');
var fs = require('fs');
var https = require('https');

tape('0-hypothesis - nothing happens without library', function(t) {
    var app = express();
    app.use(GetOkRoute());
    var port = 8080;
    var server = app.listen(port, function() {
        console.log('Api started on port: ' + port);
        request('http://localhost:' + port, function(error, response, body) {
            t.equal(response.statusCode, 200);
            t.end();
            server.close();
        })
    });
})

tape('Redirect on non https', function(t) {
    var app = express();
    app.use(lib);
    app.use(GetOkRoute())

    var port = 8080;
    var server = app.listen(port, function() {
        request({
            url: 'http://localhost:' + port,
            followRedirect: false
        }, function(error, response, body) {
            console.log(error);
            t.equal(response.statusCode, 301);
            t.end();
            server.close();
        })
    });
})

tape('No redirect on https', function(t) {
    var app = express();
    app.use(GetOkRoute())
    app.use(lib);

    var options = {
        key: fs.readFileSync('self-signed-key.pem'),
        cert: fs.readFileSync('self-signed-cert.pem')
    }
    var server = https.createServer(options, app);

    var port = 8080;
    server.listen(port, function() {
        request({
            url: 'https://localhost:' + port,
            followRedirect: false,
            rejectUnauthorized: false
        }, function(error, response, body) {
            t.equal(response.statusCode, 200);
            t.end();
            server.close();
        })
    });
})

function GetOkRoute() {
    var router = express.Router();
    router.get('/', function(req, res) {
        res.status(200).end();
    });
    return router;
}