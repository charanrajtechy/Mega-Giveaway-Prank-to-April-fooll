# 🎉 Mega Giveaway – April Fool SaaS Prank Website

A premium SaaS-style prank website built for April Fool’s Day.

This project simulates a high-converting startup giveaway landing page where users can "join" a fake Mega Giveaway. After submitting their name, they are redirected to a dashboard with a live countdown to April 1st midnight — where the site reveals:

> **APRIL FOOL 😄**

🌐 Live Demo  
https://megagiveaway.lovable.app

---

## 🚀 Tech Stack

### Frontend
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Backend
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## ✨ Features

- Modern SaaS-style landing page
- Name submission stored in database
- Participant dashboard UI
- Timezone-based countdown to April 1 (midnight)
- Automatic prank reveal logic
- Confetti animation on reveal
- Fully responsive (mobile + desktop)
- Clean gradients, glassmorphism UI, smooth micro-interactions

---

## 🧠 How It Works

1. User enters their name on the landing page.
2. The name is stored in the `participants` database table.
3. User is redirected to a dashboard.
4. Countdown runs until April 1st 12:00 AM (based on user’s local timezone).
5. When time reaches zero, the countdown is replaced with:

   **APRIL FOOL 😄**  
   _There is no giveaway._

The countdown logic runs on the client side and auto-detects user timezone.

---

## 🗄 Database Schema

**Table: `participants`**

| Field       | Type        | Description            |
|------------|------------|------------------------|
| id         | UUID / ID  | Primary key            |
| name       | String     | Participant name       |
| created_at | Timestamp  | Submission time        |

---

## 🛠 Local Installation

1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
