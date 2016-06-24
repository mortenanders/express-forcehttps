module.exports = function(req, res, next) {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https' || req.headers['x-arr-ssl']) {
        return next();
    } else {
        if (req.method === 'GET') {
            res.redirect(301, 'https://' + req.headers.host + req.originalUrl);
        } else {
            res.status(403).end();
        }
    }
}