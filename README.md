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

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Configure API keys:**
   - Open the app and click the settings (⚙️) button
   - Add your **Gemini API Key** for AI features
   - Add your **YouTube Data API Key** for channel analysis (optional)

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🚀 Deploy to Production

This project is ready for deployment on **Netlify** or **Vercel**. Simply push to GitHub and connect your repository.

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Lrinvl1203/youtube_consultant)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lrinvl1203/youtube_consultant)

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
   - **No environment variables needed!** ✨

3. **Post-deployment:**
   - Users configure API keys directly in the app settings
   - All API keys are stored locally in the browser

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
