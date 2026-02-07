# 🌿 CalmCove

> Your personal sanctuary for mental clarity. Find peace, track your wellness, and nurture your mind with AI-powered insights.

![CalmCove Banner](https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&auto=format&fit=crop)

## 🚀 Tech Stack

### Frontend
<p align="left">
  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk Auth" />
</p>

### Backend
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Groq_AI-F05032?style=for-the-badge&logo=groq&logoColor=white" alt="Groq AI" />
</p>

### Deployment
<p align="left">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
</p>

## ✨ Features

-   **🧠 Smart Wellness Check**: Interactive quiz to assess your stress levels and mental well-being.
-   **🤖 AI Companion**: Chat with an empathetic AI assistant (powered by Groq/Llama 3) for immediate support and guidance.
-   **💡 Daily Wisdom**: Get AI-generated "Tip of the Day" personalized for mental wellness.
-   **📚 Smart Resources**: Curated reading materials and resources tailored to your specific stress profile.
-   **✍️ Appointment Booking**: Seamlessly book sessions with mental health professionals.
-   **🔐 Secure Authentication**: Robust user management and protection via Clerk.

## 🛠️ Getting Started

### Prerequisites

-   Node.js (v18+)
-   npm or yarn
-   Supabase Account
-   Clerk Account
-   Groq API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/calmcove.git
    cd calmcove
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in `backend/`:
    ```env
    PORT=5000
    DATABASE_URL=your_supabase_postgres_url
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    GROQ_API_KEY=your_groq_api_key
    ```
    Start the server:
    ```bash
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    ```
    Create a `.env.local` file in `frontend/`:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```
    Start the client:
    ```bash
    npm run dev
    ```

4.  **Visit the App**
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📂 Project Structure

```
calmcove/
├── backend/            # Express.js Server
│   ├── src/
│   │   ├── routes/     # API Endpoints (Chat, Quiz, Tips)
│   │   └── index.ts    # Entry point
│   └── package.json
│
└── frontend/           # Next.js Client
    ├── src/
    │   ├── app/        # App Router Pages
    │   ├── components/ # Reusable UI Components
    │   └── lib/        # API Utilities
    └── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
