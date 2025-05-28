# SmartTest AI

SmartTest AI is a web-based application for AI-powered automatic question generation and quiz taking. It allows users to upload documents, generate questions using AI, and test their knowledge with quizzes.

## Features

- Upload documents (.pdf, .docx, .txt)
- Generate questions using AI (NLP and LLM models)
- Take quizzes based on generated questions
- Instant scoring and feedback
- Maintain a question bank
- View basic performance history

## Tech Stack

- Next.js (React framework)
- TypeScript
- Tailwind CSS
- OpenAI API (for AI-powered question generation)

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/erenxcolakx/SmartTestAI.git
cd SmartTestAI
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

- `/app`: Main application code and components
  - `/components`: Reusable UI components
  - `/api`: API route handlers
- `/lib`: Utility functions and helpers
- `/public`: Static assets
- `/styles`: Global styles

## Usage

1. **Upload a Document**: Navigate to the upload page and select a document (.pdf, .docx, or .txt)
2. **Generate Questions**: The AI will automatically analyze the content and generate relevant questions
3. **Take Quiz**: Answer the generated questions
4. **View Results**: Get instant feedback and see your score
5. **Track Performance**: View your quiz history and performance statistics

## Limitations

- Maximum file size: 10MB
- Supported formats: .pdf, .docx, .txt
- Maximum of 10 questions per document
- Performance data stored for 30 days

## License

This project is licensed under the ISC License - see the LICENSE file for details. 