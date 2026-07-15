# Portfolio AI

## Project overview

This is a personal portfolio website for Suhrob Teshazoda, built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui. It includes an AI chat assistant powered by Google Gemini that answers questions about skills, experience, and projects, and detects project requests to generate technical specifications.

## Local development

Use your preferred IDE and Node.js to work on the project locally.

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd portfolio-ai

# Copy environment file and update with your keys
cp .env.example .env

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open the local URL shown in the terminal (typically `http://localhost:8080`).

## Environment Setup

Before running locally or deploying, you need to configure these environment variables in `.env`:

**Frontend:**
- `VITE_SUPABASE_URL` — Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Your Supabase anonymous/public key

**Backend (Supabase Edge Functions):**
- `GEMINI_API_KEY` — Get from [Google AI Studio](https://aistudio.google.com/app/apikeys)
- `TELEGRAM_BOT_TOKEN` — Get from [@BotFather](https://t.me/BotFather) on Telegram
- `TELEGRAM_CHAT_ID` — Your Telegram chat ID (where project leads will be notified)
- `ALLOWED_ORIGIN` — Set to your domain (e.g., `https://portfolio.suhrob.dev`) or `http://localhost:8080` for dev

### Security Note

Never commit `.env` to version control. It is already in `.gitignore`. Keep your API keys safe.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — build the production bundle
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint checks

## Technologies used

- **Frontend:** Vite, React, TypeScript, Tailwind CSS, shadcn-ui
- **Backend:** Supabase Edge Functions (Deno)
- **LLM:** Google Gemini API
- **Database:** Supabase (PostgreSQL)
- **Notifications:** Telegram Bot API

## Features

- **AI Chat Assistant** — Ask about portfolio, skills, and experience
- **Project Lead Detection** — Generates technical specifications when users describe projects
- **Dark/Light Theme Toggle** — Theme preference persisted via context
- **Multi-language Support** — Russian and English
- **Responsive Design** — Optimized for mobile and desktop

## Deployment

### Frontend (Static Site)

Build and deploy the `dist` folder:

```sh
npm run build
```

Then deploy with:
- Vercel, Netlify, Firebase Hosting, or your own CDN
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables

### Backend (Supabase Edge Functions)

Deploy the Edge Function manually or via Supabase CLI:

```sh
supabase functions deploy portfolio-chat \
  --env-file .env
```

Ensure these environment variables are set in Supabase project settings:
- `GEMINI_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `ALLOWED_ORIGIN`

## Security & Rate Limiting

- **CORS** is restricted to your domain (configurable via `ALLOWED_ORIGIN`)
- **Rate Limiting** — 5 requests per 60 seconds per IP to prevent abuse and bill runup
- **Input Validation** — All API inputs are validated to prevent injection attacks
- **API Keys** — Backend keys are server-side only, not exposed to frontend

## Architecture

```
portfolio-ai/
├── src/                          # Frontend source
│   ├── components/
│   │   ├── portfolio/           # Portfolio sections
│   │   ├── chat/                # Chat interface
│   │   ├── layout/              # Header/Footer
│   │   └── ui/                  # UI components (shadcn)
│   ├── lib/
│   │   └── portfolioData.ts     # Portfolio content & translations
│   ├── contexts/
│   │   └── ThemeLanguageContext # Theme & language state
│   ├── integrations/
│   │   └── supabase/            # Supabase client setup
│   └── pages/                    # Route pages
├── supabase/
│   └── functions/
│       └── portfolio-chat/      # Edge Function (chat handler)
├── public/                       # Static assets
└── .env.example                 # Environment variables template
```

## License

This project is personal and for portfolio purposes.

## Support

For questions or issues, contact via Telegram [Suhrob](https://t.me/suhrobdev).
