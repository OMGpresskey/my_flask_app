const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 10000;  // Render에서 사용되는 포트

// Firebase Admin SDK 초기화
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://myflaskapp-37e05.asia-northeast3.firebasedatabase.app'
});

const db = admin.firestore();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the chat logger server!');
});

app.post('/log', async (req, res) => {
    const { PlayerName, Message } = req.body;
    const logEntry = { Player: PlayerName, Message: Message };

    try {
        await db.collection('chat-logs').add(logEntry);
        console.log('Log entry recorded:', logEntry);
        res.status(200).send('Log entry recorded');
    } catch (error) {
        console.error('Failed to save log to Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
