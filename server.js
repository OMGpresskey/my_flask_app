// server.js (Node.js)
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/log', (req, res) => {
    const logEntry = req.body;
    const logFile = path.join(__dirname, 'chatLogs.json');

    fs.readFile(logFile, 'utf8', (err, data) => {
        let logs = [];
        if (!err) {
            logs = JSON.parse(data);
        }
        logs.push(logEntry);
        fs.writeFile(logFile, JSON.stringify(logs, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Failed to write log:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).send('Log recorded');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
