# LearnAble AI – Teaching Copilot for Dyslexia

**LearnAble AI** is an AI-powered learning assistant designed to support individuals with dyslexia by simplifying content, providing audio narration with emotional tone, generating visual aids, and creating personalized lesson plans. It enables an inclusive, multisensory learning experience through reading, listening, visualizing, and interacting — all in one unified platform.

## 🧠 How It Works

Below is the complete user journey inside LearnAble AI:

![LearnAble AI Flowchart](./Screenshot%202025-07-17%20103606.png)

### Flow Description:

1. **User Uploads Input**
   - Accepts Text, PDF, or Docx files

2. **AI Preprocessing**
   - OCR for PDFs
   - Language detection
   - Chunking for better processing

3. **Content Transformation**
   - Simplifies text using Gemini (LLM)
   - Generates glossaries
   - Summarizes & rephrases

4. **Dyslexia-Friendly Formatting**
   - Uses OpenDyslexic font
   - Custom spacing and color adjustments
   - Highlights tricky words

5. **Audio Output (TTS)**
   - Emotion/tone control (calm, fun)
   - Word-by-word sync via ElevenLabs

6. **Teaching Plan & Quiz Creation**
   - Breaks content into sessions
   - Generates interactive quizzes
   - Suggests suitable teaching methods

7. **Adaptive Feedback Loop**
   - Tracks reading time, quiz scores, and attention
   - Refines difficulty and teaching methods

8. **Additional: Visual Aid**
   - Uses Pexels for diagrams, mind maps, scenes

## 🚀 Features

- ✏️ **Text Simplification** using Gemini for easier comprehension
- 🔊 **Emotion-rich Text-to-Speech** via ElevenLabs
- 📸 **Visual Aid Generation** from Pexels API
- 📄 **PDF/Text Upload** and extraction using PDF2MD
- 📚 **Personalized Lesson Plans & Interactive Quizzes** based on user level

## 💡 Innovation & Uniqueness

- Combines AI-based simplification, emotional voice modulation, and visual support.
- Supports adaptive teaching strategies based on user pace and needs.
- Promotes accessibility through multi-sensory learning experiences.
- Scalable to support other learning disabilities (ADHD, autism).

## 👨‍💻 Tech Stack

- **Frontend and Backend**: React, Tailwind CSS, Vite, TypeScript, ShadCN UI
- **AI Services**:
  - Gemini API – Text simplification
  - ElevenLabs – Text-to-Speech
  - Pexels API – Visuals for conceptual aid
  - PDF2MD – PDF text extraction

## 🧠 How It Works

1. Upload educational content (PDF/text).
2. The system simplifies the content for dyslexic learners using Gemini.
3. Narration is generated with emotion-aware voice synthesis.
4. Visual aids are fetched to enhance conceptual clarity.
5. Personalized lesson plans and interactive quizzes are generated.

## 📦 Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
