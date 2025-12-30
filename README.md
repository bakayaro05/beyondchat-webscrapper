📰 Article Scraping & Enrichment Pipeline

A full-stack application that scrapes blog articles, stores them locally, and enriches them using external sources + an LLM, exposed through REST APIs and consumed by a modern frontend.
This project demonstrates web scraping, backend API design, database handling, LLM integration, and frontend consumption in a single cohesive pipeline.

📌 Features
Automatic article scraping when database is empty
SQLite-based local persistence
REST APIs for reading & enriching articles
Google search–based external content discovery
Puppeteer-based scraping of external blogs
LLM-powered content structuring & enrichment
Frontend to view and trigger enrichment

🛠️ Tech Stack

Backend
Node.js
Express.js
SQLite
Puppeteer
Google Custom Search API
LLM (Groq API in this case)

Frontend

Vite + React
Fetch API

📁 Project Structure
.
├── database/
│   └── db.js                  # SQLite DB connection
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── routes/
│   └── articleRoute.js        # Article APIs (Route endpoints Where CRUDS are Defined)
│
├── scrappers/
│   ├── beyondChatsScrapper.js # Initial site scraper
│   └── minimalScrapper.js     # External content scraper
│
├── services/
│   ├── enrichArticles.js      # Enrichment pipeline logic
│   └── llm_structurer.js      # LLM structuring logic (The one that makes connection to the LLM)
│
├── server.js                  # Express server entry
├── .env
├── package.json
└── README.md


⚙️ Local Setup Instructions

1️⃣Clone the Repository
  git clone <your-repo-url>
  cd <repo-name>

2️⃣ Backend Setup
Install dependencies:
  npm install

Create a .env file in the root directory:
  GOOGLE_API_KEY=your_google_api_key
  GOOGLE_CSE_ID=your_custom_search_engine_id
  OPENAI_API_KEY=your_llm_api_key
  
Start the backend server:
  node server.js
Backend runs on:
  http://localhost:5000

3️⃣ Frontend Setup

  cd frontend
  npm install
  npm run dev

Frontend runs on:
http://localhost:5173


Data Flow / Architecture Diagram

  High-Level Architecture

  +----------------------+
|   React Frontend     |
|  (Vite + React)      |
+----------+-----------+
           |
           | REST API Calls
           | (/articles, /articles/:id/enrich)
           v
+----------------------+
|   Express Server     |
|    (server.js)       |
+----------+-----------+
           |
           |
           v
+----------------------+
|   SQLite Database    |
|   (articles table)   |
+----------+-----------+
           |
           |
           v
+----------------------+
|   Enrichment Service |
| (enrichArticles.js)  |
+----------+-----------+
           |
           |
           v
+----------------------+
| Google Search API    |
| (External Sources)   |
+----------+-----------+
           |
           |
           v
+----------------------+
| Puppeteer Scrapers   |
|  - minimalScrapper   |
+----------+-----------+
           |
           |
           v
+----------------------+
|   LLM Structurer     |
| (llm_structurer.js)  |
+----------+-----------+
           |
           |
           v
+----------------------+
|   SQLite Database    |
| (Updated Enrichment) |
+----------------------+


Detailed Data Flow

🟢 1. Frontend → Backend Interaction
The React frontend never accesses the database directly
All interactions happen via Express APIs

Frontend uses:
GET /articles
POST /articles/:id/enrich

🟢 2. Fetching Articles (Read Flow)
Step-by-step:
React frontend calls GET /articles
Express server receives the request
Server queries SQLite via db.js

If articles exist:
They are returned directly to frontend
If database is empty:
beyondChatsScrapper is triggered
Articles are scraped and stored
Stored articles are returned

📌 Frontend only sees clean JSON — no scraping logic exposed

🟢 3. Enrichment Trigger (User Action)
User clicks Enrich on an article
React frontend sends:
POST /articles/:id/enrich
Express server becomes the orchestrator

🟢 4. Backend Orchestration (Core Logic)
The Express server performs the following internally:

a) Article Lookup
Fetch article by ID from SQLite
Extract article title

b) External Discovery
Use article title to query Google Custom Search API
Filter relevant blog/article URLs

c) External Scraping
Pass selected URLs to minimalScrapper
Puppeteer extracts readable main content

d) LLM Structuring
Scraped content is passed to llm_structurer.js
LLM:
Summarizes content
Removes redundancy
Structures insights coherently

🟢 5. Database Update
Enriched content is written back to SQLite
Article row is updated with:
Enriched text
Source references (if stored)
Timestamp (optional)

🟢 6. Backend → Frontend Response
Express server returns the updated article object
React frontend re-renders the enriched content
No enrichment logic exists in frontend


🧠 How Enrichment Works Internally

The enrichment pipeline is designed as a step-by-step orchestration of search, scraping, and LLM processing, ensuring the final content is structured, relevant, and stored reliably.

🔹 Step 1: Enrichment Trigger
User clicks Enrich in the frontend
Frontend sends a request to:
POST /articles/:id/enrich

🔹 Step 2: Article Retrieval
Backend fetches the article using its ID from SQLite
The article’s title is extracted and used as the enrichment query
If the article does not exist, the request is rejected

🔹 Step 3: External Content Discovery (Google Search)
The article title is searched using Google Custom Search API
Search results are filtered to:
Blog / article-type websites
Non-duplicate domains
Top relevant links (usually first 1–2) are selected

Purpose:
To gather independent external perspectives on the same topic

🔹 Step 4: External Content Scraping
Each selected URL is passed to minimalScrapper
Puppeteer:
Loads the page
Extracts the main readable content
Removes navigation, ads, and irrelevant elements
Clean text is returned for further processing

🔹 Step 5: LLM-Based Structuring
Scraped raw text is passed to llm_structurer.js
The LLM:
Identifies key points
Removes redundancy
Structures the content into readable sections
Aligns it with the context of the original article

Output example:
Summary
Key insights
Additional context

🔹 Step 6: Database Update
Structured enriched content is saved back into SQLite
The article row is updated with:
Enriched text
Metadata (sources, timestamps if applicable)

🔹 Step 7: Response to Frontend
Backend returns the updated article object
Frontend re-renders the article with enriched content

Internal Enrichment Flow Diagram

React UI
   |
   v
Express API
   |
   v
SQLite (Fetch Article)
   |
   v
Google Search
   |
   v
Puppeteer Scraping
   |
   v
LLM Structuring
   |
   v
SQLite (Update)
   |
   v
Express Response
   |
   v
React UI

