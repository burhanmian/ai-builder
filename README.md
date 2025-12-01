# CodeMe - AI-Powered App Builder

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</p>

**Build Apps with CodeMe** - Your one-stop solution for creating production-ready web and mobile apps. Perfect for beginners and professionals alike. Works like Replit and Lovable with advanced features for building MVPs and full-stack projects.

## ✨ Features

### 🤖 CodeMe AI & Multi-Model Support
- **CodeMe AI**: Our proprietary AI trained for optimal code generation
- **10+ AI Models**: GPT-4, Claude 3, Gemini Pro, DeepSeek, Perplexity, Qwen
- **GitHub Copilot Pro**: Connect your Copilot subscription for enhanced suggestions
- **Natural Language Prompts**: Describe features in plain English
- **Smart Fallback**: Automatically uses the best available AI when APIs aren't configured

### 🎓 Beginner Friendly
- **Video Tutorials**: Step-by-step guides for building your first app
- **Interactive Docs**: Learn by doing with code playgrounds
- **AI Explainer**: Get explanations for any code in simple terms
- **Guided Workflows**: Follow wizards to build complete apps

### 🎨 Figma to Code
- Import Figma designs via URL
- Automatic conversion to React or React Native components
- Preserve layout and styling

### 💻 Monaco Code Editor
- Full-featured code editor (same as VS Code)
- Syntax highlighting for TypeScript, JavaScript, CSS, Dart
- File tree sidebar with folder navigation
- Multiple file tabs

### 👁️ Live Preview
- Real-time preview of your app
- Responsive viewports (Desktop, Tablet, Mobile)
- Hot reload on code changes

### 📦 Project Management
- Create Web Apps (React, Next.js)
- Create Android Apps (React Native, Flutter)
- Export projects as ZIP
- User dashboard with all projects

### 🚀 Pro Features
- **Starter Templates**: Pre-built templates for SaaS, e-commerce, dashboards
- **Database Integration**: Auto-generate Prisma schemas and API routes
- **Version Control**: Built-in Git integration with automatic commits
- **Real-time Collaboration**: Work with your team in real-time
- **Integrated Terminal**: Run npm commands in the browser

### ☁️ One-Click Deployment
Deploy to any platform with a single click:
- **Cloud Providers**: AWS (EC2, Lambda, Amplify), Google Cloud (Cloud Run, Firebase), DigitalOcean
- **Serverless**: Vercel, Netlify, Railway, Render
- **Traditional Hosting**: cPanel, DirectAdmin (FTP/SFTP)

### 🔐 Authentication
- OAuth login with GitHub and Google
- Secure session management with NextAuth.js
- User-specific project storage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- GitHub and/or Google OAuth credentials
- (Optional) API keys for AI providers - app works in demo mode without them

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/codeme.git
   cd codeme
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials:
   ```env
   DATABASE_URL="postgresql://..."
   AUTH_SECRET="your-secret"
   GITHUB_CLIENT_ID="..."
   GITHUB_CLIENT_SECRET="..."
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   OPENAI_API_KEY="sk-..."
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000**

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── api/
│   │   ├── auth/
│   │   ├── ai/
│   │   ├── figma/
│   │   └── projects/
│   ├── dashboard/
│   ├── project/[id]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── ai-chat-panel.tsx
│   ├── code-editor-pane.tsx
│   ├── file-tree.tsx
│   ├── figma-import-dialog.tsx
│   ├── live-preview.tsx
│   ├── project-editor.tsx
│   └── ...
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   ├── utils.ts         # Utility functions
│   └── export.ts        # ZIP export
├── types/
│   └── index.ts         # TypeScript types
└── prisma/
    └── schema.prisma    # Database schema
```

## 🗄️ Database Schema

- **User**: User accounts with OAuth integration
- **Account**: OAuth account connections
- **Session**: User sessions
- **Project**: User projects with files stored as JSON
- **Message**: Chat history with AI
- **Template**: Starter templates (coming soon)

## 🔧 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui + Radix UI |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js v5 |
| Editor | Monaco Editor |
| AI | OpenAI, Anthropic, Google AI |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Prisma](https://prisma.io) - Database ORM
- [Tailwind CSS](https://tailwindcss.com) - CSS framework

---

<p align="center">
  Built with ❤️ using AI
</p>
