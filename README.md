<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Creator Boost AI - YouTube Consultant

An AI-powered assistant for YouTube creators, providing data-driven insights for content strategy, keyword analysis, and channel growth.

## 🚀 Features

- **Keyword Analyzer**: Generate viral video ideas from keywords using AI
- **Channel Analyzer**: Comprehensive YouTube channel analysis with growth opportunities
- **Chat Consultant**: Interactive AI consultant for YouTube strategy
- **One Million Views Consultant**: Advanced video optimization with benchmark analysis, script generation, and storyboard visualization
- **Multi-language Support**: Korean, English, Japanese, Chinese

## 🛠 Local Development

**Prerequisites:** Node.js 18+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🚀 Deploy to Production

This project is ready for deployment on **Netlify** or **Vercel**. Simply push to GitHub and connect your repository.

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/your-repo)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo)

### Manual Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Netlify or Vercel:**
   - Connect your GitHub repository
   - Build settings are automatically detected
   - Set environment variable: `GEMINI_API_KEY`

3. **Post-deployment:**
   - Users can set YouTube API keys through the app's settings

📖 **Detailed deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔧 Configuration

- **Netlify**: `netlify.toml` - Handles SPA routing and build settings
- **Vercel**: `vercel.json` - Configures build and rewrite rules
- **Vite**: `vite.config.ts` - Development and build configuration

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Development guidance for Claude Code
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment guide

## 🌐 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini AI
- **APIs**: YouTube Data API v3
- **Deployment**: Netlify/Vercel ready
