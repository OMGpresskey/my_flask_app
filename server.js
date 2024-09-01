const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// 환경 변수에서 Firebase 서비스 계정 키를 가져옵니다.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = express();
const PORT = process.env.PORT || 10000; // Render에서 포트는 10000으로 설정됨

// Firebase Admin 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://myflaskapp-37e05-default-rtdb.firebaseio.com/' // 자신의 Firebase Realtime Database URL
});

const db = admin.database();

app.use(bodyParser.json());

// Handle GET requests to the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the chat logger server!');
});

// Handle POST requests to /log
app.post('/log', (req, res) => {
    const { PlayerName, Message } = req.body;
    const logEntry = {
        PlayerName: PlayerName,
        Message: Message
    };

    // Firebase Realtime Database에 로그 저장
    db.ref('logs').push(logEntry)
        .then(() => res.status(200).send('Log entry recorded'))
        .catch(error => {
            console.error('Failed to write log:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
