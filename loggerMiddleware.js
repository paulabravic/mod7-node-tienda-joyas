const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'reporte.log');

const loggerMiddleware = (req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}\n`;
        
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });

    next();
};

module.exports = loggerMiddleware;
