# 🚀 100% Free Hosting Guide (Students Ko Live Link Dene Ke Liye)

Yeh guide follow karke aap is platform ko **100% FREE** internet par live kar sakte hain aur uska link apne Telegram channel **@quizlauncherssc** par share kar sakte hain.

---

## 🌟 Method 1: Render.com Par 1-Click Free Hosting (Recommended)

### Step 1: Code Ko GitHub Par Dalein
1. [GitHub.com](https://github.com) par free account banayein (agar pehle se nahi hai).
2. Ek new **Public** ya **Private Repository** banayein, jaise: `quizlauncher-typing`.
3. Is `typing-platform` folder ke saare files ko us repository me push/upload kar dein.

---

### Step 2: Render.com Par Free Account Banayein
1. [Render.com](https://render.com) par jayein aur **"Get Started for Free"** par click karein.
2. Apne **GitHub account se Login** karein.

---

### Step 3: Web Service Create Karein
1. Render Dashboard par **"New +"** button dabayein aur **"Web Service"** select karein.
2. Apni GitHub repository (`quizlauncher-typing`) select karein.
3. Neeche yeh settings verify karein:
   - **Name:** `quizlauncher-typing` (ya jo aap chahein)
   - **Region:** `Singapore` (India ke liye sabse fast speed)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Plan:** **Free ($0/month)**
4. **"Deploy Web Service"** button par click kar dein!

---

### Step 4: Aapka Live Link Ready! 🎉
Render 2-3 minute me project build karke aapko ek secure **`https://...`** URL de dega:
> **Jaise:** `https://quizlauncher-typing.onrender.com`

Ab yeh link aap apne students aur Telegram channel **@quizlauncherssc** par share kar sakte hain. Students apne mobile/laptop par link kholenge aur direct login karke test de sakenge!

---

## 🗄️ Optional: Free MongoDB Atlas Cloud Database (1,000+ Students Ke Liye)

Platform default me bina kisi database ke bhi chalega. Par agar aap chahte hain ki 1,000+ students ka data cloud me 100% safe rahe:

1. [MongoDB.com](https://www.mongodb.com/cloud/atlas) par jayein aur free account banayein.
2. **"Create a Free Cluster (M0 Sandbox - 512MB Free Forever)"** select karein.
3. Database User aur Password banayein.
4. **"Connect"** par click karke connection string copy karein:
   `mongodb+srv://username:password@cluster0.mongodb.net/?retryWrites=true&w=majority`
5. Render Dashboard par jayein -> Apni Web Service -> **Environment Variables** me ek new variable add karein:
   - **Key:** `MONGODB_URI`
   - **Value:** `mongodb+srv://...` (Aapka copy kiya hua link)
6. Bas! Platform automatically cloud database se connect ho jayega.

---

## 🌐 Custom Domain (Optional)
Agar aap chahein toh apna domain (jaise `quizlauncherssc.com` ya `typing.quizlauncher.in`) bhi connect kar sakte hain:
- Render Dashboard -> **Settings** -> **Custom Domains** -> Apna domain daalein.
- Yeh bhi 100% free hai!
