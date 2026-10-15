const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { evaluateTyping } = require('./sscEvaluator');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const PASSAGES_FILE = path.join(__dirname, 'passages.json');
const HISTORY_FILE = path.join(__dirname, 'history.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Optional 100% Free MongoDB Atlas Cloud Database Integration
let mongoDb = null;
let mongoUsers = null;
let mongoHistory = null;

if (process.env.MONGODB_URI) {
  try {
    let connectionUri = process.env.MONGODB_URI.trim();
    // Auto-encode special characters like '@' in MongoDB user password if raw
    const match = connectionUri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.+)@([^@]+)$/);
    if (match) {
      const [, proto, user, pass, host] = match;
      connectionUri = `${proto}${user}:${encodeURIComponent(decodeURIComponent(pass))}@${host}`;
    }

    const { MongoClient } = require('mongodb');
    const client = new MongoClient(connectionUri);
    client.connect()
      .then(async () => {
        mongoDb = client.db('ssc_typing_portal');
        mongoUsers = mongoDb.collection('users');
        mongoHistory = mongoDb.collection('history');
        console.log('✅ Successfully connected to MongoDB Atlas Cloud Database!');
        
        // Auto-sync initial users to MongoDB if empty
        const count = await mongoUsers.countDocuments();
        if (count === 0) {
          const initial = readUsers();
          if (initial.length > 0) {
            await mongoUsers.insertMany(initial);
            console.log(`📦 Seeded ${initial.length} initial users to MongoDB Atlas.`);
          }
        }
      })
      .catch(err => {
        console.warn('⚠️ MongoDB Atlas note (falling back to JSON storage):', err.message);
      });
  } catch (e) {
    console.warn('⚠️ MongoDB initialization note (falling back to JSON storage):', e.message);
  }
}

// Ensure history file exists
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
}

// Ensure users file exists with default demo candidates
if (!fs.existsSync(USERS_FILE)) {
  const initialUsers = [
    {
      id: 'user-cgl-1',
      email: 'ashish.cgl@gmail.com',
      password: 'password123',
      name: 'Ashish Kumar',
      rollNo: '2401058392',
      category: 'UR',
      examType: 'SSC_CGL',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-ntpc-2',
      email: 'rahul.ntpc@gmail.com',
      password: 'password123',
      name: 'Rahul Verma',
      rollNo: '2409817263',
      category: 'OBC',
      examType: 'RRB_NTPC_GRAD',
      createdAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2));
}

// Helpers
function readPassages() {
  try {
    const data = fs.readFileSync(PASSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writePassages(data) {
  fs.writeFileSync(PASSAGES_FILE, JSON.stringify(data, null, 2));
}

function readHistory() {
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeHistory(data) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}

function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// Permanent Cloud + Local Hybrid Storage Helpers
async function getAllUsers() {
  if (mongoUsers) {
    try {
      const dbUsers = await mongoUsers.find({}).toArray();
      if (dbUsers && dbUsers.length > 0) return dbUsers;
    } catch (err) {
      console.warn('MongoDB read users error:', err.message);
    }
  }
  return readUsers();
}

async function saveUser(user) {
  if (mongoUsers) {
    try {
      await mongoUsers.updateOne(
        { email: user.email.toLowerCase() },
        { $set: user },
        { upsert: true }
      );
    } catch (err) {
      console.warn('MongoDB save user error:', err.message);
    }
  }
  const users = readUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  writeUsers(users);
}

async function getAllHistory(filter = {}) {
  if (mongoHistory) {
    try {
      const query = {};
      if (filter.userEmail) query.userEmail = new RegExp(`^${filter.userEmail}$`, 'i');
      if (filter.rollNo) query.rollNo = filter.rollNo;
      const dbHistory = await mongoHistory.find(query).sort({ timestamp: -1 }).limit(200).toArray();
      if (dbHistory && dbHistory.length > 0) return dbHistory;
    } catch (err) {
      console.warn('MongoDB read history error:', err.message);
    }
  }
  const history = readHistory();
  let filtered = history;
  if (filter.userEmail) {
    filtered = filtered.filter(h => h.userEmail && h.userEmail.toLowerCase() === filter.userEmail.toLowerCase());
  } else if (filter.rollNo) {
    filtered = filtered.filter(h => h.rollNo === filter.rollNo);
  }
  return filtered;
}

async function saveHistoryAttempt(attempt) {
  if (mongoHistory) {
    try {
      await mongoHistory.insertOne({ ...attempt });
    } catch (err) {
      console.warn('MongoDB save attempt error:', err.message);
    }
  }
  const history = readHistory();
  history.unshift(attempt);
  writeHistory(history.slice(0, 200));
}

// 1. Get all passages
app.get('/api/passages', (req, res) => {
  const passages = readPassages();
  const { category, language } = req.query;
  let filtered = passages;

  if (category && category !== 'ALL') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (language && language !== 'ALL') {
    filtered = filtered.filter(p => p.language.toLowerCase() === language.toLowerCase());
  }

  res.json({ success: true, passages: filtered });
});

// 2. Get single passage by id
app.get('/api/passages/:id', (req, res) => {
  const passages = readPassages();
  const passage = passages.find(p => p.id === req.params.id);
  if (!passage) {
    return res.status(404).json({ success: false, message: 'Passage not found' });
  }
  res.json({ success: true, passage });
});

// 3. Add custom passage
app.post('/api/passages', (req, res) => {
  const { title, text, category, language, durationMinutes } = req.body;
  if (!text || !title) {
    return res.status(400).json({ success: false, message: 'Title and text are required.' });
  }

  const passages = readPassages();
  const newPassage = {
    id: 'custom-' + Date.now(),
    title: title.trim(),
    text: text.trim(),
    category: category || 'Custom Practice',
    language: language || 'English',
    difficulty: 'Moderate',
    targetKeystrokes: text.trim().length,
    durationMinutes: Number(durationMinutes) || 10
  };

  passages.unshift(newPassage);
  writePassages(passages);

  res.status(201).json({ success: true, passage: newPassage });
});

// 3.5 Authentication Endpoints (Gmail & Password)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, rollNo, category, examType } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Gmail/Email, Password, and Full Name are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = await getAllUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this Gmail/Email already exists. Please Sign In.' });
    }

    const newUser = {
      id: 'user-' + Date.now(),
      email: cleanEmail,
      password: password,
      name: name.trim(),
      rollNo: rollNo?.trim() || 'SSC-' + Math.floor(1000000000 + Math.random() * 9000000000),
      category: category || 'UR',
      examType: examType || 'SSC_CGL',
      createdAt: new Date().toISOString()
    };

    await saveUser(newUser);

    const { password: _, ...userSafe } = newUser;
    res.status(201).json({ success: true, user: userSafe, message: 'Account registered successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = await getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid Gmail/Email or Password. Please check your credentials.' });
    }

    const { password: _, ...userSafe } = user;
    res.json({ success: true, user: userSafe, message: 'Signed in successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
});

app.post('/api/auth/demo', async (req, res) => {
  try {
    const { accountType } = req.body; // 'cgl' or 'ntpc'
    const users = await getAllUsers();
    let targetUser = users.find(u => accountType === 'ntpc' ? u.email.includes('ntpc') : u.email.includes('cgl'));
    if (!targetUser && users.length > 0) targetUser = users[0];

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Demo account unavailable.' });
    }

    const { password: _, ...userSafe } = targetUser;
    res.json({ success: true, user: userSafe, message: 'Demo login successful!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Demo login failed' });
  }
});

// 4. Official SSC / Railway Evaluation Endpoint
app.post('/api/evaluate', async (req, res) => {
  try {
    const {
      originalText,
      typedText,
      timeTakenSeconds,
      testDurationMinutes,
      backspaceCount,
      examType,
      category,
      candidateInfo,
      passageTitle
    } = req.body;

    if (originalText === undefined || typedText === undefined) {
      return res.status(400).json({ success: false, message: 'originalText and typedText are required.' });
    }

    const evaluation = evaluateTyping({
      originalText,
      typedText,
      timeTakenSeconds: Number(timeTakenSeconds) || 60,
      testDurationMinutes: Number(testDurationMinutes) || 10,
      backspaceCount: Number(backspaceCount) || 0,
      examType: examType || candidateInfo?.examType || 'SSC_CHSL',
      category: category || candidateInfo?.category || 'UR'
    });

    const resultRecord = {
      id: 'attempt-' + Date.now(),
      timestamp: new Date().toISOString(),
      passageTitle: passageTitle || 'Typing Practice',
      candidateName: candidateInfo?.name || 'Candidate',
      rollNo: candidateInfo?.rollNo || 'SSC-2026-X',
      userEmail: candidateInfo?.email || 'ashish.cgl@gmail.com',
      userId: candidateInfo?.id || candidateInfo?.userId || 'guest',
      category: category || candidateInfo?.category || 'UR',
      examType: examType || candidateInfo?.examType || 'SSC_CGL',
      ...evaluation
    };

    // Save to history (cloud + local)
    await saveHistoryAttempt(resultRecord);

    res.json({ success: true, result: resultRecord });
  } catch (err) {
    console.error('Evaluation error:', err);
    res.status(500).json({ success: false, message: 'Evaluation failed', error: err.message });
  }
});

// 5. Get History (Filtered by user email or roll number if logged in)
app.get('/api/history', async (req, res) => {
  try {
    const { email, rollNo } = req.query;
    const history = await getAllHistory({ userEmail: email, rollNo });
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch history', error: err.message });
  }
});

// 6. Reset History (Per user or global)
app.delete('/api/history', (req, res) => {
  const { email } = req.query;
  if (email) {
    let history = readHistory();
    history = history.filter(h => !h.userEmail || h.userEmail.toLowerCase() !== email.trim().toLowerCase());
    writeHistory(history);
    return res.json({ success: true, message: `History cleared for ${email}` });
  }
  writeHistory([]);
  res.json({ success: true, message: 'History cleared' });
});

// 6.5 Admin Student Analytics (See all students, logins, and test usage)
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const users = await getAllUsers();
    const history = await getAllHistory({});

    const totalStudents = users.length;
    const totalTestsTaken = history.length;
    const qualifiedCount = history.filter(h => h.isQualified).length;
    const overallPassRate = totalTestsTaken > 0 ? Math.round((qualifiedCount / totalTestsTaken) * 100) : 0;
    const avgNetWPM = totalTestsTaken > 0 ? Math.round(history.reduce((a, b) => a + (b.netWPM || 0), 0) / totalTestsTaken) : 0;

    // Student summary with activity stats
    const studentStats = users.map(u => {
      const userAttempts = history.filter(h => h.userEmail && h.userEmail.toLowerCase() === u.email.toLowerCase());
      const bestWPM = userAttempts.length > 0 ? Math.max(...userAttempts.map(h => h.netWPM || 0)) : 0;
      const lastActive = userAttempts.length > 0 ? userAttempts[0].timestamp : u.createdAt || null;
      const passCount = userAttempts.filter(h => h.isQualified).length;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        rollNo: u.rollNo,
        category: u.category || 'UR',
        examType: u.examType || 'SSC_CGL',
        joinedAt: u.createdAt,
        totalAttempts: userAttempts.length,
        bestWPM,
        passCount,
        lastActive
      };
    });

    // Recent 100 tests activity stream
    const recentActivity = history.slice(0, 100).map(h => ({
      id: h.id,
      candidateName: h.candidateName || 'Candidate',
      userEmail: h.userEmail || '—',
      rollNo: h.rollNo || '—',
      passageTitle: h.passageTitle || 'Typing Practice',
      timestamp: h.timestamp,
      netWPM: h.netWPM || 0,
      accuracy: h.accuracy || 0,
      errorPercentage: h.errorPercentage || 0,
      isQualified: !!h.isQualified,
      examType: h.examType || 'SSC_CGL',
      category: h.category || 'UR'
    }));

    res.json({
      success: true,
      analytics: {
        totalStudents,
        totalTestsTaken,
        overallPassRate,
        avgNetWPM,
        students: studentStats,
        recentActivity
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch admin analytics' });
  }
});

// 7. Exam Guidelines / Rules info
app.get('/api/exam-rules', (req, res) => {
  res.json({
    success: true,
    rules: {
      SSC_CGL: {
        name: "SSC CGL (DEST - Data Entry Skill Test)",
        qualifyingWPM: 27,
        targetKeystrokes: 2000,
        standardDurationMinutes: 15,
        allowedMistakes: {
          UR: "5%",
          OBC_EWS: "7%",
          SC_ST_ESM: "10%"
        },
        backspace: "Allowed without deduction",
        calculation: "Formula: Net WPM = Gross WPM - (Total Mistakes / Time)"
      },
      SSC_CHSL: {
        name: "SSC CHSL (LDC / JSA / DEO)",
        qualifyingWPM: 35, // English
        targetKeystrokes: 1750, // for 10 min
        standardDurationMinutes: 10,
        allowedMistakes: {
          UR: "7%",
          OBC_EWS: "10%",
          SC_ST: "10%"
        },
        backspace: "Allowed without restriction",
        calculation: "Formula: Net WPM = Gross WPM - (Total Mistakes / Time)"
      },
      RRB_NTPC: {
        name: "Railway RRB NTPC Typing Skill Test",
        qualifyingWPM: 30, // English (25 Hindi)
        targetKeystrokes: 1500,
        standardDurationMinutes: 10,
        allowedMistakes: {
          AllCategories: "5% mistakes ignored. Excess mistakes deducted @ 5 words per mistake."
        },
        backspace: "Allowed without penalty",
        calculation: "Formula: Net Words = Gross Typed Words - (Excess Mistakes * 5)"
      }
    }
  });
});

// Health check endpoint for Render
app.get('/healthz', (req, res) => res.status(200).send('OK'));

// 8. Serve Production Client Build (1-Click Free Deployment)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving production client build from ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/healthz')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  console.warn(`⚠️ Warning: ${clientDistPath} not found.`);
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/healthz')) {
      return next();
    }
    res.send('<h3>Server is active. Client build in progress, please refresh in 30 seconds.</h3>');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SSC / Railway Typing Platform Server running on port ${PORT} (0.0.0.0)`);
});
