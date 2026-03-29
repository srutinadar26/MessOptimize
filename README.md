<h1 align="center">🌱 MessOptimize</h1>
<p align="center">
 - Eat Smart. Waste Less. Feed More -
</p>

<p align="center">
  <b>Smart Food Waste Reduction Platform for College Hostels</b>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/srutinadar26/MessOptimize?style=for-the-badge" />
  <img src="https://img.shields.io/github/forks/srutinadar26/MessOptimize?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Expo-React%20Native-black?style=for-the-badge&logo=expo" />
  <img src="https://img.shields.io/badge/Firebase-Backend-orange?style=for-the-badge&logo=firebase" />
</p>

---

## 🚀 Overview

MessOptimize is a smart, role-based food management platform designed to reduce food waste in college hostels using predictive meal tracking, real-time analytics, and surplus food redistribution.

It transforms traditional mess systems from **guesswork-based cooking** to **data-driven optimization**, ensuring minimal waste and maximum impact.

---

## 🧠 Problem

- Hostel kitchens rely on estimation for food preparation  
- Students don’t communicate meal preferences  
- Leads to overproduction and food wastage  
- No structured way to redistribute surplus food  
- Environmental and financial losses  

---

## 💡 Solution

MessOptimize creates a **closed-loop ecosystem**:

1. Students mark meals in advance  
2. System predicts demand  
3. Staff prepares optimized quantities  
4. Surplus food is listed in marketplace  
5. NGOs claim food in real-time  
6. Impact is tracked and visualized  

---

## 👥 User Roles

| User Type | Features |
|----------|----------|
| 👩‍🎓 **Students** | • Meal marking with real-time countdown timers <br> • Savings tracking (₹) <br> • Streak system 🔥 <br> • Menu voting system <br> • Personal impact dashboard |
| 👨‍🍳 **Mess Staff** | • Live headcount tracking <br> • Auto food quantity calculation <br> • Waste prediction alerts (>20% overproduction) <br> • Historical trend analysis <br> • Post surplus food to marketplace |
| 🤝 **NGOs** | • View surplus food listings <br> • Claim food via WhatsApp integration <br> • Activity tracking and verified badge system |

---

## ✨ Features

### 🏠 Home Dashboard
- Role-based UI (Student / Staff / NGO)  
- Savings card and impact stats  
- Streak tracking with calendar  
- Meal marking with countdown timers  
- Real-time updates  

---

### 🍽️ Menu System
- Weekly 7-day menu  
- Categories: Breakfast, Lunch, Dinner, Fast Food, Beverages, Desserts  
- Voting system (upvote/downvote)  
- Dish tags: Veg / Non-veg / Vegan / Spice level  
- Meal Priority unlock (gamification feature)  

---

### 🏆 Leaderboard & Gamification
- Top rankings based on activity  
- Streak tracking system 🔥  
- Achievements:
  - 7-day streak  
  - 30-day streak  
  - 100 meals milestone  
  - Waste Warrior badge  
- Progress tracking with animations  

---

### 🛒 Marketplace
- Surplus food listings with expiry timers ⏳  
- Claim system via WhatsApp  
- NGO activity feed with verified badges  
- Impact counter:
  - People fed  
  - CO₂ saved 🌍  
- Staff posting system  

---

## 📊 Analytics Dashboard

| Category | Features |
|----------|----------|
| 📉 **Core Metrics** | • Waste reduced (kg) <br> • Money saved (₹) <br> • CO₂ reduced <br> • People fed |
| 📈 **Charts & Visualizations** | • Line chart (weekly trends) <br> • Bar chart (meal distribution) <br> • Pie chart (category analysis) |
| ⚙️ **Additional Features** | • Mess bill calculator <br> • PDF report generation <br> • WhatsApp sharing |

---

### 👨‍🍳 Mess Staff Dashboard
- Live meal headcount tracking  
- Auto-calculated food quantities  
- Waste prediction alerts  
- Historical comparison charts  
- Report export (PDF + WhatsApp)  

---

### 🔔 Notifications System
- Meal deadline reminders  
- Streak alerts  
- Marketplace notifications  
- Toast notification system:
  - Success ✅  
  - Error ❌  
  - Info ℹ️  
  - Warning ⚠️  

---

### 📡 Offline Support
- Meal marking works offline  
- Syncs automatically when online  
- Uses AsyncStorage  

---

### 🎨 UI/UX Design
- Minimal, premium interface  
- No neon colors  
- Glassmorphism card design  
- Smooth animations and transitions  
- Light / Dark / System theme support  
- Fully responsive (web + mobile)  


## 🏗️ Architecture

MessOptimize follows a modular architecture:

- **Presentation Layer** → React Native UI components  
- **State Management** → React Context API  
- **Data Layer** → Firebase + AsyncStorage  
- **Services Layer** → Notifications, PDF generation, WhatsApp integration  

---

---

## 🧱 Tech Stack

| Category        | Technology |
|----------------|------------|
| Frontend       | React Native (Expo) + TypeScript |
| Navigation     | Expo Router |
| Styling        | NativeWind (Tailwind CSS) |
| State Mgmt     | React Context API |
| Backend/Auth   | Firebase |
| Storage        | AsyncStorage |
| Charts         | Victory Native / Custom Charts |
| Notifications  | Expo Notifications |
| PDF Generation | jsPDF |
| Integration    | WhatsApp API |

---

## ⚙️ Setup & Installation

```bash
git clone https://github.com/srutinadar26/MessOptimize.git
cd MessOptimize
npm install
npx expo start --web --port 8081
```

----

### 🌍 Impact
MessOptimize converts food waste into measurable impact:
- Reduces overproduction
- Saves money for students
- Feeds people in need
- Reduces carbon footprint

---

### 👩‍💻 Authors
Sruti Nadar & Team
