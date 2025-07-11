# AI Website Summarizer

A modern, beautiful web application that generates intelligent summaries of any website using AI. Built with Next.js, TypeScript, and OpenAI's GPT-4o-mini model with a sleek, ChatGPT-inspired interface.

## ✨ Features

- **⚡ Lightning Fast**: Get comprehensive summaries in seconds
- **🧠 AI Powered**: Advanced language models for accurate, intelligent analysis
- **🎨 Modern Interface**: Clean, ChatGPT-style input with integrated send button
- **📱 Responsive Design**: Beautiful UI that works perfectly on all devices
- **✨ Glass Morphism**: Modern backdrop blur effects and smooth animations
- **🔒 Secure**: Server-side processing keeps your API keys safe
- **📋 Copy Function**: Easy one-click copying of generated summaries

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-web-summariser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   **Option A: Automated Setup (Recommended)**
   ```bash
   # Run the setup script for guided configuration
   ./setup.sh
   ```
   
   **Option B: Manual Setup**
   ```bash
   # Copy the environment template
   cp env.template .env.local
   # Edit .env.local and add your OpenAI API key
   ```
   
   **To get an OpenAI API key:**
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Sign up or log in to your account
   - Create a new API key
   - Copy and paste it into your `.env.local` file

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Enter a URL**: Type any HTTPS website URL into the modern input field
2. **Click Send**: Use the integrated send button (🚀) or press Enter
3. **AI Analysis**: Watch the sophisticated loading animation while AI processes the content
4. **View Results**: Read the markdown-formatted summary with one-click copy functionality

## 🛠 Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **AI**: OpenAI GPT-4o-mini
- **HTTP Client**: Axios
- **HTML Parsing**: Cheerio
- **Markdown Rendering**: react-markdown
- **Icons**: Lucide React

## 📁 Project Structure

```
ai-web-summariser/
├── pages/
│   ├── index.tsx               # Main landing page with modern UI
│   ├── _app.tsx               # Next.js app wrapper
│   └── api/
│       └── summarize.ts        # API endpoint for summarization
├── components/
│   ├── UI/                     # Modern UI components
│   │   ├── UrlInput.tsx       # ChatGPT-style input with integrated button
│   │   └── Loader.tsx         # Sophisticated loading animation
│   └── SummaryDisplay.tsx      # Clean summary display component
├── styles/
│   └── globals.css             # Modern styles and animations
├── env.template                # Environment variables template
├── .env.local                  # Your environment variables (create from template)
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔧 Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ Yes | Your OpenAI API key | None |
| `OPENAI_ORG_ID` | ❌ No | OpenAI organization ID | None |
| `OPENAI_MODEL` | ❌ No | AI model to use | `gpt-4o-mini` |
| `FETCH_TIMEOUT` | ❌ No | Website fetch timeout (ms) | `10000` |
| `MAX_CONTENT_LENGTH` | ❌ No | Max content to analyze | `8000` |

**Quick Setup:**
```bash
cp env.template .env.local
# Edit .env.local with your OpenAI API key
npm run dev
```

## 🔧 API Endpoints

### POST `/api/summarize`

Analyzes a website and returns an AI-generated summary.

**Request Body:**
```json
{
  "url": "https://example.com",
  "isFunny": false
}
```

**Response:**
```json
{
  "success": true,
  "summary": "# Summary\n\nThis website provides...",
  "websiteTitle": "Example Website"
}
```

## 🎨 Customization

### Changing the AI Model

Edit `pages/api/summarize.ts` and modify the model parameter:

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o', // Available: gpt-4o-mini, gpt-4o, gpt-4-turbo
  // ... other parameters
});
```

### Modifying System Prompts

Update the prompts in `pages/api/summarize.ts`:

```typescript
const DEFAULT_SYSTEM_PROMPT = `Your custom prompt here...`;
```

### Styling

The project uses Tailwind CSS with modern glass morphism effects:
- `styles/globals.css` - Modern animations and custom styles
- `tailwind.config.js` - Custom gradients and animations
- Components use backdrop-blur and gradient effects for a premium feel

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your `OPENAI_API_KEY` to Vercel's environment variables
4. Deploy!

### Other Platforms

This Next.js app can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🔒 Security Notes

- API keys are stored server-side and never exposed to the client
- URL validation prevents malicious inputs
- HTTPS-only URL enforcement for security
- Rate limiting recommended for production use
- Consider implementing user authentication for production

## 🐛 Troubleshooting

### Common Issues

1. **"OpenAI API key is not configured"**
   - Copy `env.template` to `.env.local`
   - Add your actual OpenAI API key
   - Restart your development server

2. **Environment setup issues**
   ```bash
   # Quick fix
   cp env.template .env.local
   # Edit .env.local with your API key
   npm run dev
   ```

3. **Website not loading/parsing**
   - Some websites block automated requests
   - Try with different websites
   - Ensure the URL uses HTTPS

4. **Styling issues**
   - Clear browser cache
   - Restart development server
   - Ensure Tailwind CSS is properly configured

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure your environment variables are set correctly
3. Verify your OpenAI API key is valid and has sufficient credits
4. Open an issue on GitHub for additional help 