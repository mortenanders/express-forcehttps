# express-forcehttps
  Force http requests to express to be redirected to https

## Installation

```bash
$ npm install express-forcehttps
```

## Example

```js
var express = require('express');
var forceHttps = require('express-forcehttps');
var app = express();
app.use(forceHttps);
```
