# Quick Start - Deploy in 10 Minutes

## Step 1: Form Setup (5 min)
1. Go to https://formspree.io
2. Sign up (free)
3. Create a form, copy the ID (e.g., `xvgprkbn`)
4. Edit `assessment.html` line 254:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   Replace `YOUR_FORM_ID` with your actual ID

## Step 2: Domain Setup (2 min)
Choose one:
- **Using custom domain**: Edit `CNAME` file with your domain
- **Using GitHub Pages default**: Delete the `CNAME` file

Then update URLs in:
- `robots.txt` (line 4)
- `sitemap.xml` (lines 3, 8, 13)

## Step 3: Deploy (3 min)
```bash
git add .
git commit -m "Production ready"
git push origin main
```

Then:
1. Go to GitHub repo → Settings → Pages
2. Source: Deploy from branch `main`, folder `/ (root)`
3. Save
4. Wait 2 minutes
5. Visit your site!

## Step 4: Test
- [ ] All pages load
- [ ] Navigation works
- [ ] Submit test form
- [ ] Check mobile view

Done! 🚀

---

**Need more details?** See DEPLOYMENT.md
**Review findings?** See PRODUCTION_REVIEW_SUMMARY.md
