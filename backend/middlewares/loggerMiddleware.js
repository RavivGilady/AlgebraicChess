const logger = require('../utils/logger')

const requests = function(req, res, next)  {
    logger.trace(`Incoming request - ${req.method} ${req.url}`);
    res.on('finish', () => {
        logger.trace(`Finish request - ${req.method} ${req.url}. Returned status code - ${res.statusCode}`);
        });
    next()
}



module.exports = {
    logHttpRequests:requests
}