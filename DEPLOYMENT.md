# Blackridge Website - GitHub Pages Deployment Guide

## Pre-Deployment Checklist

### 1. Form Setup (REQUIRED)

The assessment form needs a backend service to work.

**Recommended: AWS Lambda + SES (~$1/month)**

This is **10-20x cheaper** than third-party services and gives you full control.

**Quick Setup** (20 minutes):
1. See `serverless/SERVERLESS_SETUP.md` for detailed instructions
2. Deploy the Lambda function from `serverless/aws-lambda/`
3. Get your API Gateway endpoint URL
4. Update `assessment.html` line 357 with your endpoint:
   ```javascript
   const API_ENDPOINT = 'https://your-api-gateway-url/submit';
   ```

**Cost Comparison**:
- Third-party services: $10-20/month ($120-240/year)
- AWS Lambda + SES: ~$1/month (~$12/year)
- **Annual savings: $108-228**

See `serverless/COST_COMPARISON.md` for detailed analysis.

**Alternative (if you need it working NOW)**:
- Use Formspree free tier temporarily
- Deploy serverless function later to save money

### 2. Domain Configuration (OPTIONAL)

If using a custom domain:

1. Edit the `CNAME` file and replace the placeholder with your domain:
   ```
   blackridge.yourdomain.com
   ```
   OR
   ```
   www.blackridge.com
   ```

2. Configure DNS with your domain provider:
   - **If using subdomain** (blackridge.yourdomain.com):
     - Add CNAME record pointing to: `yourusername.github.io`

   - **If using apex domain** (blackridge.com):
     - Add A records pointing to GitHub Pages IPs:
       - 185.199.108.153
       - 185.199.109.153
       - 185.199.110.153
       - 185.199.111.153
     - Add CNAME record for www pointing to: `yourusername.github.io`

3. In GitHub repo settings, set custom domain and enable HTTPS

If NOT using a custom domain, delete the `CNAME` file.

### 3. Update URLs in Files

Replace placeholder URLs with your actual domain:

- **robots.txt** (line 4): Update sitemap URL
- **sitemap.xml** (lines 3, 8, 13): Replace `https://yourdomain.com/`

If using GitHub Pages default domain:
```
https://yourusername.github.io/blackridge-website/
```

### 4. Add Favicon (RECOMMENDED)

Create a `favicon.ico` file and place in root directory, or add to each HTML file:
```html
<link rel="icon" type="image/png" href="assets/favicon.png" />
```

### 5. Test Before Deploy

1. Open each HTML file locally in a browser
2. Click all navigation links
3. Test the diagnostic tool on index.html
4. Try submitting the form (after Formspree setup)
5. Check mobile responsiveness

## Deployment Steps

### Option A: Deploy via GitHub UI

1. Commit all changes to your `main` branch
2. Go to repository Settings → Pages
3. Under "Source", select branch: `main` and folder: `/ (root)`
4. Click Save
5. Wait 1-2 minutes for deployment
6. Visit: `https://yourusername.github.io/blackridge-website/`

### Option B: Deploy via Command Line

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

Then enable GitHub Pages in repository settings as above.

## Post-Deployment

1. **Test the live site thoroughly**
   - Check all pages load correctly
   - Verify navigation works
   - Test form submission
   - Check mobile responsiveness

2. **Monitor form submissions**
   - Check Formspree dashboard
   - Ensure email notifications are working

3. **Optional: Analytics**
   - Consider adding Google Analytics or Plausible
   - Add tracking code before `</head>` tag

4. **Optional: SEO**
   - Submit sitemap to Google Search Console
   - Add OpenGraph meta tags for social sharing

## Troubleshooting

### Forms not working
- Verify Formspree ID is correct
- Check browser console for errors
- Ensure form `method="POST"` is set

### 404 errors on navigation
- Check GitHub Pages is serving from correct branch/folder
- Verify file paths are relative (not absolute)
- Clear browser cache

### Custom domain not working
- Wait 24-48 hours for DNS propagation
- Verify CNAME file exists with correct domain
- Check DNS records with your provider
- Enable "Enforce HTTPS" in GitHub Pages settings

### Styling broken
- Check that `assets/styles.css` path is correct
- Verify all files were pushed to repository
- Clear browser cache and hard refresh (Cmd+Shift+R)

## Files Created

- `404.html` - Custom error page (redirects to home)
- `robots.txt` - Search engine crawler instructions
- `sitemap.xml` - Site structure for search engines
- `CNAME` - Custom domain configuration (optional)
- `DEPLOYMENT.md` - This guide

## Support

If you encounter issues:
1. Check GitHub Pages documentation: https://docs.github.com/pages
2. Formspree documentation: https://help.formspree.io
3. Review GitHub Actions tab for deployment errors
