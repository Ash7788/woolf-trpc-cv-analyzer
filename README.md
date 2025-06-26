
# Woolf tRPC CV Analyzer

An AI-powered Node.js app using tRPC and Gemini 1.5 Flash to analyze a candidate’s CV against a job description. It highlights strengths, weaknesses, and alignment, delivering results in a structured Markdown format.

---

## ⚙️ Features

- **PDF Upload**: Upload both resume and job description (PDF).
- **AI-Powered Matching**:
  - Extracts key skills and responsibilities.
  - Analyzes overlaps between JD and resume.
  - Highlights strengths, weaknesses, and gives a score (1–10).
  - Suggests improvements.
- **Structured Output**: Analysis displayed as readable Markdown in browser.
- **tRPC API**: Type-safe backend logic using `tRPC`.
- **Clean UI**: Built with EJS + Tailwind CSS.
- **Secure File Handling**: Uploaded files are deleted after processing.

---

## 🛠 Technologies

### Backend
- **Node.js**, **Express.js**, **TypeScript**
- **tRPC**, **Zod**, **dotenv**
- **Multer** (for file uploads), **pdf-parse** (for PDF text extraction)
- **axios** (for Gemini API calls)

### Frontend (Templating)
- **EJS**, **Tailwind CSS**, **marked.js** (Markdown rendering)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
git clone <your-repo-link>
cd woolf-trpc-cv-analyzer
npm install     # or yarn install
```

### Environment Setup

Create a `.env` file:

```env
GEMINI_API_KEY=your_actual_key_here
PORT=4000  # optional, defaults to 4000
```

> 🔐 Use raw key **without** "Bearer" prefix.  
> Endpoint used: `https://intertest.woolf.engineering/invoke`

---

## 🧪 Usage

### Start the Server

```bash
npm run dev
```

Access the web UI at [http://localhost:4000](http://localhost:4000)

### Analyze Resume

1. Upload your **Resume (PDF)**.
2. Upload **Job Description (PDF)**.
3. Click **"Analyze with AI"**.
4. View the structured AI analysis in Markdown.

---

## 📡 API Access (Optional)

Call `tRPC` directly:

- **Endpoint**: `POST http://localhost:4000/trpc/analyze`
- **Body**:

```json
{
  "json": {
    "jdPath": "/path/to/job_description.pdf",
    "cvPath": "/path/to/resume.pdf"
  }
}
```

> ⚠️ Use this only if you're managing files manually on server-side.

---

## 📁 Project Structure

```
.
├── src/
│   ├── routes/          # tRPC procedures
│   ├── types/           # Custom TypeScript declarations
│   ├── utils/           # AI client and PDF parsing
│   ├── views/           # EJS templates (upload form & results)
│   ├── server.ts        # Main Express + tRPC server
│   └── trpc.ts          # Router setup
├── uploads/             # Temp uploaded PDFs (auto-deleted)
├── public/              # Static assets (optional)
├── .env                 # API key and config
├── package.json         
├── tsconfig.json        
└── README.md
```

---

## 🧯 Troubleshooting

### 🔹 `Cannot read properties of undefined (reading 'input')`
> Likely a circular import between `trpc.ts` and `analyze.ts`.

**Fix**: Export `publicProcedure` and `router` **before** importing any routes in `trpc.ts`.

---

### 🔹 `Error: Failed to lookup view "index"`
**Fix**: Ensure this line exists and points correctly:
```ts
app.set("views", path.join(__dirname, "views"));
```

---

### 🔹 `401 Unauthorized from Gemini API`
**Fix**:
- Confirm your `.env` has the correct `GEMINI_API_KEY`
- Ensure you don’t use `"Bearer "` prefix in the Authorization header

---

### 🔹 `400 Invalid Argument / Missing role: "user"`
**Fix**:
- Ensure `role: "user"` is in `contents` array of the AI request.
- Trim excessively large PDF inputs.
- Validate that `pdf-parse` returns readable text.

---

### 🔹 TypeScript Error: Cannot find module 'pdf-parse'
**Fix**:
- Add a custom type in `src/types/pdf-parse.d.ts`
- Example:
```ts
declare module 'pdf-parse' {
  function pdf(buffer: Buffer): Promise<{ text: string }>;
  export default pdf;
}
```

---

## 📌 Future Improvements

- Better UI error display
- Loading spinner during analysis
- File validation (type, size)
- API rate-limit handling
- Enhanced UI/UX with React/Vue
- PDF previews
- Downloadable reports
- Store analysis history
- Multi-turn AI conversation

---

## 📄 License

MIT License  
© [2025] [Woolf University]
# woolf-trpc-cv-analyzer
