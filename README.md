# 🌟 Estiak Ahmed - Full-Stack Portfolio & Admin CMS

> **Frontend:** React.js + Tailwind CSS  
> **Backend:** Node.js + Express.js  
> **Database:** MongoDB (via Mongoose) with automatic resilient local storage fallback  
> **CMS / Admin Panel:** Built-in dynamic management system for Projects, Skills, Timeline, Profile, and Contact Inquiries.

---

## 🇧🇩 বাংলায় সেটআপ গাইড (How to run in VS Code on your Laptop)

আপনি আপনার ল্যাপটপে VS Code-এ এই প্রজেক্টটি খুব সহজেই রান করতে পারবেন:

### ধাপ ১: প্রজেক্টটি VS Code-এ ওপেন করুন
- প্রজেক্ট ফোল্ডারটি আপনার VS Code এ খুলুন।
- নতুন টার্মিনাল ওপেন করুন (`Ctrl + \`` বা `Terminal > New Terminal`)।

### ধাপ ২: ডিপেন্ডেন্সি ইন্সটল করুন
```bash
npm install
```

### ধাপ ৩: Environment Variables কনফিগার করুন
রুট ফোল্ডারে একটি `.env` ফাইল তৈরি করুন (বা `.env.example` কপি করে `.env` নাম দিন):
```env
# MongoDB Connection String (লোকাল MongoDB বা MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/estiak_portfolio

# Admin Panel পাসওয়ার্ড
ADMIN_PASSWORD=admin123

# Port
PORT=3000
```
> **টিপস:** আপনার পিসিতে যদি এই মুহূর্তে MongoDB ইনস্টল নাও থাকে, তাহলেও কোনো চিন্তা নেই! প্রজেক্টটিতে **স্মার্ট অটোমেটিক ফলব্যাক** রয়েছে, যা `./data/portfolio.json` ফাইলে লোকালি সব ডেটা অটো-সেভ করে রাখবে। যখনই আপনি MongoDB চালু করবেন, এটি স্বয়ংক্রিয়ভাবে MongoDB-তে ডেটা কানেক্ট করবে।

### ধাপ ৪: MongoDB চালু করুন (যদি লোকাল MongoDB ব্যবহার করেন)
টার্মিনালে লিখুন:
```bash
mongod
```
*(অথবা MongoDB Compass / MongoDB Atlas ক্লাউড কানেকশন স্ট্রিং ব্যবহার করতে পারেন)*

### ধাপ ৫: প্রজেক্ট রান করুন
টার্মিনালে কমান্ড দিন:
```bash
npm run dev
```

### ধাপ ৬: ব্রাউজারে দেখুন
ব্রাউজারে যান:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 অ্যাডমিন প্যানেল ব্যবহার করার নিয়ম (Admin CMS)

1. ওয়েবসাইটটির উপরে ডানপাশে **Admin** বাটনে ক্লিক করুন (অথবা ব্রাউজারে `http://localhost:3000#admin` লিখুন)।
2. অ্যাডমিন পাসওয়ার্ড দিন: `admin123` (এটি আপনি `.env` ফাইলের `ADMIN_PASSWORD` থেকে পরিবর্তন করতে পারেন)।
3. অ্যাডমিন প্যানেল থেকে আপনি যা যা করতে পারবেন:
   - **Profile Info:** আপনার নাম, বায়ো, টাইটেল, ইমেইল, ফোন, সোশ্যাল মিডিয়া লিংক ও পোর্টফোলিও স্ট্যাটস যেকোনো সময় আপডেট করা।
   - **Projects:** নতুন প্রজেক্ট অ্যাড করা, ছবি লিংক, লাইভ ডেমো লিংক, গিটহাব রেপো লিংক এবং ডেসক্রিপশন এডিট বা ডিলিট করা।
   - **Skills:** নতুন স্কিল যুক্ত করা ও প্রফিসিয়েন্সি পার্সেন্টেজ স্লাইডার দিয়ে পরিবর্তন করা।
   - **Timeline / Experience:** চাকুরির অভিজ্ঞতা ও শিক্ষাগত যোগ্যতার বিবরণ পরিবর্তন করা।
   - **Inquiries / Messages:** পোর্টফোলিওর কন্টাক্ট ফর্ম থেকে আসা সব মেসেজ সরাসরি অ্যাডমিন প্যানেলে পড়া, মার্ক রিড করা এবং রিপ্লাই দেওয়া।
   - **Database & Backup:** সম্পূর্ণ ডেটাবেস এক ক্লিকে JSON আকারে ডাউনলোড বা ব্যাকআপ নেওয়া।

---

## 🇬🇧 English Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Optional: local `mongod` service or MongoDB Atlas cluster URI)
- Visual Studio Code

### Steps to Run:
1. Open the project in VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Set your `MONGODB_URI` in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/estiak_portfolio
   ADMIN_PASSWORD=admin123
   PORT=3000
   ```
5. Start development server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000`.

---

## 📁 Project Structure

```
├── data/                    # Local persistent JSON data storage (resilient fallback)
│   └── portfolio.json
├── server/
│   ├── db.ts               # MongoDB Mongoose connection & storage repository
│   └── models.ts           # Mongoose schemas (Profile, Project, Skill, Experience, Message)
├── src/
│   ├── assets/images/      # Generated high-resolution portfolio imagery & portrait
│   ├── components/
│   │   ├── admin/          # Admin CMS dashboard & management panels
│   │   ├── About.tsx       # Bio & engineering principles
│   │   ├── Contact.tsx     # Working contact form connected to database
│   │   ├── Experience.tsx  # Work & education chronological timeline
│   │   ├── Footer.tsx      # Clean footer & links
│   │   ├── Hero.tsx        # High-impact split hero section
│   │   ├── Navbar.tsx      # 3-Zone top navigation
│   │   ├── ProjectModal.tsx# Project detail lightbox modal
│   │   ├── Projects.tsx    # Filterable project showcase
│   │   ├── ResumeModal.tsx # Printable CV & resume viewer
│   │   ├── Skills.tsx      # Interactive categorized skill matrix
│   │   └── Toast.tsx       # Real-time user action notifications
│   ├── data/
│   │   └── defaultData.ts  # Seed data for initial deployment
│   ├── types/
│   │   └── portfolio.ts    # TypeScript interfaces
│   ├── App.tsx             # Main client application
│   └── main.tsx            # React root mount
├── server.ts               # Express full-stack backend with Vite middleware
├── package.json
└── README.md
```
