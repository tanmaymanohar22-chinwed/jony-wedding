# 💍 Personal Wedding Invitation Website

A mobile-first, interactive digital wedding invitation website built with [Astro](https://astro.build), TypeScript, CSS3 animations, and deployed to **GitHub Pages** with zero hosting costs (₹0).

- **GitHub Repository**: [https://github.com/tanmaymanohar22-chinwed/jony-wedding](https://github.com/tanmaymanohar22-chinwed/jony-wedding)
- **Live Invitation URL**: [https://tanmaymanohar22-chinwed.github.io/jony-wedding/](https://tanmaymanohar22-chinwed.github.io/jony-wedding/)
- **Direct Guest Link**: [https://tanmaymanohar22-chinwed.github.io/jony-wedding/invite/priya-and-rohit/](https://tanmaymanohar22-chinwed.github.io/jony-wedding/invite/priya-and-rohit/)

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
# Start local development server
npm run dev
```

Visit `http://localhost:4321/jony-wedding/` in your browser.

## 📦 How to Push & Deploy to GitHub Pages

The repository remote `origin` is already linked to:
`https://github.com/tanmaymanohar22-chinwed/jony-wedding.git`

To push changes to GitHub:
```bash
git add .
git commit -m "Update wedding invitation configuration"
git branch -M main
git push -u origin main
```

### GitHub Pages Setup (One-time)
1. In your GitHub repository: [https://github.com/tanmaymanohar22-chinwed/jony-wedding](https://github.com/tanmaymanohar22-chinwed/jony-wedding)
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow will automatically build and publish your site!