# 💍 Personal Wedding Invitation Website

A mobile-first, interactive digital wedding invitation website built with [Astro](https://astro.build), TypeScript, CSS3 animations, and deployed to **GitHub Pages** with zero hosting costs (₹0).

## ✨ Features

- **3D Envelope & Ribbon Opening**: Interactive realistic envelope reveal with gold wax seal and satin ribbon that smoothly unveils the wedding invitation.
- **Background Music Player**: Floating audio disc with smooth play/pause control (auto-initializes smoothly on envelope interaction to comply with modern mobile browser autoplay restrictions).
- **Couple Details**: Dedicated profiles for Bride & Groom with parent blessings and monogram crest.
- **Real-Time Countdown**: Live countdown timer calculating Days, Hours, Minutes, and Seconds until the auspicious muhurtham.
- **Event Schedule Timeline**: Detailed celebration itinerary (Mehendi, Sangeet, Muhurtham, Reception) with dates, times, venues, and direct **Google Maps** navigation buttons.
- **Couple's Story**: Editorial narrative recounting the couple's journey.
- **Photo Gallery**: Responsive touch-friendly photography showcase with interactive full-screen lightbox modal.
- **No RSVP Bloat**: Excluded RSVP forms and databases as requested, keeping the invitation purely experiential and informational.
- **100% Data-Driven**: Modify `src/data/wedding.json` to customize names, dates, events, addresses, photos, and music without touching HTML or CSS.

## 🚀 How to Run Locally

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:4321` in your browser.

## 📦 How to Deploy to GitHub Pages (₹0 Free Hosting)

1. Create a new public repository on GitHub (e.g. `wedding-invitation`).
2. Link your local project and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial wedding invitation release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/wedding-invitation.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and publish your site!
   Your live invitation URL will be:
   `https://<your-username>.github.io/wedding-invitation/`
   and
   `https://<your-username>.github.io/wedding-invitation/invite/priya-and-rohit/`

## 🎨 Changing Details

Edit `src/data/wedding.json`:
- `couple`: Bride and Groom full names, bio, parent names.
- `weddingDate`: ISO 8601 wedding date & time for the countdown.
- `events`: Array of celebration ceremonies with addresses and Google Maps links.
- `story`: Paragraphs and quote for your love story.
- `gallery`: Photos and captions.
- `music`: Audio stream or MP3 URL.