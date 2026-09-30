# Resume Checker Backend

A Node.js + Express backend for evaluating whether a candidate's resume matches a job description. The app uploads a PDF resume, extracts text from it, compares the content against the job description using Google Gemini, and stores the analysis result in MongoDB.

## Features

- Upload a resume in PDF format
- Extract text from the uploaded PDF
- Compare resume content against a job description
- Generate ATS-style insights such as:
  - match score
  - strengths
  - missing skills
  - feedback
- Store user and resume analysis records in MongoDB
- Support user registration / login-style upsert flow

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file upload handling
- pdf-parse for PDF text extraction
- Google Gemini API for AI-based resume analysis
- dotenv for environment configuration

## Project Structure

```text
backend_ai/
├── Controllers/
│   ├── resume.js
│   └── user.js
├── Models/
│   ├── resume.js
│   └── user.js
├── Routes/
│   ├── resume.js
│   └── user.js
├── utils/
│   └── multer.js
├── uploads/
├── conn.js
├── index.js
├── index.html
├── package.json
├── .env
└── README.md
```

## Prerequisites

Before running this project, make sure you have:

- Node.js installed
- npm installed
- MongoDB connection available
- A Google Gemini API key

## Installation

1. Open a terminal in the project folder.
2. Install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root with the following variable:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

> Note: this project currently initializes MongoDB directly in `conn.js`, so the database connection is not fully externalized yet. If you want cleaner configuration, move the MongoDB URI into an environment variable as well.

## Run the App

Start the server:

```bash
npm start
```

By default, the app runs on:

```text
http://localhost:4000
```

## API Endpoints

### 1) Register or log in a user

**Endpoint**

```http
POST /api/user
```

**Request body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "photoUrl": "https://example.com/avatar.jpg"
}
```

**Behavior**
- Creates a user if one does not exist
- Returns the existing user if already present

---

### 2) Upload resume and analyze it against a job description

**Endpoint**

```http
POST /api/resume
```

**Request format**
- `multipart/form-data`
- Required fields:
  - `resume`: PDF file
  - `user`: user ID
  - `job_desc`: job description text

**Example using curl**

```bash
curl -X POST http://localhost:4000/api/resume \
  -F "resume=@/path/to/resume.pdf" \
  -F "user=64d0d1f7e4c4d6a3b7f45678" \
  -F "job_desc=We are looking for a frontend developer with React, JavaScript, TypeScript, and Next.js experience."
```

**Response**

```json
{
  "success": true,
  "data": {
    "user": "64d0d1f7e4c4d6a3b7f45678",
    "job_desc": "We are looking for a frontend developer with React, JavaScript, TypeScript, and Next.js experience.",
    "resume_name": "resume.pdf",
    "score": "88",
    "strengths": ["React", "JavaScript", "Next.js"],
    "missing_skills": ["TypeScript"],
    "feedback": "Strong candidate fit with a few missing skills.",
    "_id": "..."
  }
}
```

## How It Works

1. A user is registered through `/api/user`.
2. A PDF resume is uploaded through `/api/resume`.
3. The app reads the PDF and extracts text using `pdf-parse`.
4. The extracted resume text and job description are sent to Gemini in a structured JSON prompt.
5. Gemini returns an ATS-style evaluation.
6. The results are saved to MongoDB and returned to the client.

## Notes

- Only PDF files are accepted.
- File size limit is set to 5MB in the upload middleware.
- The uploaded PDF is deleted after analysis to keep the server storage clean.
- MongoDB and Gemini credentials must be valid or requests will fail.

## License

This project is licensed under the ISC license.

## Contributing

Pull requests and improvements are welcome. For major changes, please open an issue first to discuss the proposed changes.
