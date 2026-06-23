# Blackridge Website

Production-ready website for Blackridge, deployed on GitHub Pages. Public positioning: Blackridge is a Token Forensics Engine / Gateway for enterprise inference spend; the one-workflow assessment is the entry motion for evaluating Blackridge deployment.

**Recent Update**: Site consolidated from 3 pages to 2 streamlined pages:
- **index.html** - Complete landing page with problem, solution, product UI artifact, and assessment CTA
- **compare.html** - Competitive positioning vs 5 adjacent tool categories

## 🚀 Quick Deploy (10 minutes)

```bash
# 1. Set up form backend (choose one):
# - See serverless/SERVERLESS_SETUP.md for AWS/GCP
# - Or use Formspree temporarily (free tier)

# 2. Update your API endpoint in index.html (search for "assessment-form")

# 3. Deploy
git add .
git commit -m "Deploy to production"
git push origin main

# 4. Enable GitHub Pages in repo settings
# Settings → Pages → Source: main branch, / (root)
```

See **QUICK_START.md** for details.

---

## 📁 Project Structure

```
blackridge-website/
├── index.html              # Main landing page
│                          # - Problem statement & value prop
│                          # - Product UI screenshot artifact
│                          # - How it works (forensic evidence path)
│                          # - Blackridge AI Spend Assessment details
│                          # - Contact form
│                          # - Deployment & trust section
│
├── compare.html           # Competitive positioning
│                          # - vs Provider dashboards
│                          # - vs Generic API gateways
│                          # - vs Cloud cost/FinOps tools
│                          # - vs LLM routers & OSS proxies
│                          # - vs Agentic AI platforms
│                          # - Layer stack diagram
│
├── serverless/            # Form processing backend (saves $100-200/year!)
│   ├── SERVERLESS_SETUP.md
│   ├── COST_COMPARISON.md
│   ├── aws-lambda/        # AWS Lambda + SES (~$1/month)
│   └── gcp-cloud-function/  # Google Cloud Function (free)
│
└── Documentation/
    ├── QUICK_START.md           # 10-minute deployment
    ├── DEPLOYMENT.md            # Comprehensive guide
    ├── UPDATED_SUMMARY.md       # Latest changes & recommendations
    └── PRODUCTION_REVIEW_SUMMARY.md  # Full site assessment
```

---

## 💰 Cost Optimization

### Form Processing Options:

| Option | Setup | Cost/Year | Control |
|--------|-------|-----------|---------|
| **AWS Lambda + SES** | 20 min | ~$12 | Full |
| **GCP Cloud Function** | 10 min | $0 | Full |
| Formspree | 2 min | $120 | Limited |
| Basin | 2 min | $108 | Limited |

**Recommendation**: Use serverless (AWS or GCP) to save $100-200/year.

See **serverless/COST_COMPARISON.md** for detailed analysis.

---

## ✅ Production Checklist

- [x] Site consolidated to 2 pages (index.html, compare.html)
- [x] Navigation working correctly between pages
- [x] Interactive diagnostic tool functional
- [x] Contact form integrated into index.html
- [x] All links updated to new structure
- [x] Mobile responsive design
- [x] Serverless backend options provided
- [ ] Deploy form backend (AWS/GCP)
- [ ] Update API endpoint in index.html
- [ ] Add form submission handler JavaScript
- [ ] Configure custom domain (optional)
- [ ] Test form submission
- [ ] Deploy to GitHub Pages

---

## 🛠️ Technology Stack

- **Frontend**: Semantic HTML5, CSS3 (inline), Vanilla JavaScript
- **Hosting**: GitHub Pages (free)
- **Backend**: AWS Lambda or GCP Cloud Function (serverless)
- **Email**: AWS SES or Gmail (via app password)
- **Design**: Custom dark theme design system
- **Fonts**: IBM Plex Mono, IBM Plex Sans, Space Grotesk (Google Fonts)

---

## 📚 Documentation

Start here based on your needs:

1. **Quick deploy**: Read **QUICK_START.md** (10 min)
2. **Form backend setup**: Read **serverless/SERVERLESS_SETUP.md** (20 min)
3. **Cost analysis**: Read **serverless/COST_COMPARISON.md**
4. **Full deployment guide**: Read **DEPLOYMENT.md**
5. **Assessment findings**: Read **PRODUCTION_REVIEW_SUMMARY.md**

---

## 🎯 Key Features

- ✨ Interactive economic forensics diagnostic tool (6-question self-assessment)
- 🎯 Clear problem/solution narrative with competitive positioning
- 📝 Integrated contact form for focused workflow assessment requests
- 🔄 Competitive comparison page (vs 5 adjacent tool categories)
- 🎨 Professional B2B SaaS design with custom dark theme
- 📱 Fully responsive mobile design
- ⚡ Fast load times (self-contained, minimal dependencies)
- 🔍 SEO optimized

---

## 🚦 Next Steps

1. **Deploy form backend** (choose AWS or GCP)
   ```bash
   cd serverless/aws-lambda
   # Follow SERVERLESS_SETUP.md
   ```

2. **Update index.html** with your API endpoint
   - Find the `<form class="assessment-form">` section
   - Add form submission handler with your API endpoint
   ```javascript
   const API_ENDPOINT = 'https://your-api-gateway-url/submit';
   ```

3. **Deploy to GitHub Pages**
   ```bash
   git push origin main
   # Then enable Pages in repo settings
   ```

4. **Test everything**
   - Both pages load (index.html, compare.html)
   - Navigation between pages works
   - All anchor links work (#assessment, #contact-form, etc.)
   - Form submits successfully
   - Mobile view looks good on both pages

---

## 💡 Tips

- **Domain**: Edit `CNAME` file if using custom domain
- **Analytics**: Add Google Analytics or Plausible if needed
- **Monitoring**: Check AWS CloudWatch logs for Lambda
- **Updates**: Just push to main branch, GitHub Pages auto-deploys

---

## 🎓 What Makes This Special

1. **Cost-Optimized**: Serverless backend saves $100-200/year
2. **Professional**: Enterprise-grade design and messaging
3. **Performant**: Static site, sub-millisecond backend
4. **Scalable**: Handles any traffic automatically
5. **Maintainable**: Clean code, comprehensive docs

---

## 📞 Support

- **Backend issues**: See `serverless/SERVERLESS_SETUP.md`
- **Deployment issues**: See `DEPLOYMENT.md`
- **Cost questions**: See `serverless/COST_COMPARISON.md`

---

**Built by platform engineers who operated distributed systems at scale.**
