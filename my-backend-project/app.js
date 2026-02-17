const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// කලින් download කරගත්ත JSON file එක මෙතනට පාවිච්චි කරන්න
const serviceAccount = require("./apikeys/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) return res.status(401).send('Unauthorized');

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).send('Invalid Token');
  }
};

// Protected Route (ලොග් වුණු අයට විතරයි)
app.get('/api/user-profile', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}!`, user: req.user });
});

app.listen(5000, () => console.log('Server running on port 5000'));