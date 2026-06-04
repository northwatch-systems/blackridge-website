# Quick Start - Deploy in 10 Minutes

## Step 1: Form Setup

**Option A: Quick (but costs $10-20/month later)**
1. Go to https://formspree.io and use free tier temporarily
2. Deploy proper serverless solution later

**Option B: Proper Setup (20 min, then $1/month forever)**
1. Deploy AWS Lambda from `serverless/aws-lambda/`
2. Follow `serverless/SERVERLESS_SETUP.md`
3. Update `assessment.html` line 357 with your API endpoint
4. **Saves $108-228/year vs third-party services**

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
