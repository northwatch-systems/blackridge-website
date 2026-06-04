# Serverless Form Processing Setup

## Cost Comparison

**Formspree/Basin/etc**: $20-50/month for production features

**AWS Lambda + SES**:
- Lambda: FREE (1M requests/month free tier, then $0.20 per 1M)
- SES: $0.10 per 1,000 emails
- **Estimated cost**: ~$1-2/month for typical startup traffic

**GCP Cloud Functions**:
- Cloud Functions: FREE (2M invocations/month)
- Gmail API or SendGrid: FREE tier available
- **Estimated cost**: $0-1/month for typical startup traffic

**Recommendation**: Use serverless. Much cheaper and you own the infrastructure.

---

## Option 1: AWS Lambda + SES (Recommended for AWS users)

### Prerequisites
- AWS account
- AWS CLI installed and configured
- Domain verified in AWS SES (for sending from your domain)

### Step 1: Verify Email in AWS SES

1. Go to AWS SES Console → Verified Identities
2. Click "Create Identity"
3. Choose "Email address"
4. Enter your support email (e.g., `hello@northwatch.systems`)
5. Check your email and click verification link
6. **Optional**: Verify your domain to send from `noreply@yourdomain.com`
7. Request production access (SES starts in sandbox mode)
   - In SES Console → Account Dashboard → Request production access
   - Fill out the form (takes 24-48 hours to approve)

### Step 2: Create Lambda Function

```bash
cd serverless/aws-lambda
npm install
npm run package  # Creates function.zip
```

1. Go to AWS Lambda Console
2. Click "Create function"
3. Name: `blackridge-form-handler`
4. Runtime: Node.js 18.x
5. Create function
6. Upload `function.zip`
7. Set environment variables:
   - `TO_EMAIL`: Your email address
   - `FROM_EMAIL`: Verified SES email
   - `ALLOWED_ORIGINS`: Your website URL
8. Increase timeout to 10 seconds (Configuration → General)
9. Add SES permissions to execution role:
   - Go to Configuration → Permissions
   - Click role name
   - Add policy: `AmazonSESFullAccess` (or create custom with just `ses:SendEmail`)

### Step 3: Create API Gateway

1. Go to API Gateway Console
2. Create "HTTP API" (cheaper than REST API)
3. Add integration: Lambda → Select your function
4. Route: `POST /submit`
5. Configure CORS:
   - Allow origins: Your website URL
   - Allow methods: POST, OPTIONS
   - Allow headers: Content-Type
6. Deploy
7. Copy your API endpoint URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com`)

### Step 4: Update Website Form

Edit `assessment.html`:

```javascript
<script>
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const button = e.target.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.textContent = 'Sending...';
  button.disabled = true;

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('https://YOUR-API-GATEWAY-URL/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Thank you! We will contact you within 2 business days.');
      e.target.reset();
    } else {
      alert('Error: ' + (result.error || 'Please try again'));
    }
  } catch (error) {
    alert('Network error. Please email us directly at hello@yourdomain.com');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
});
</script>
```

### Monthly Cost Estimate
- First 1M Lambda requests: FREE
- SES: $0.10 per 1,000 emails
- API Gateway: $1 per million requests
- **Total**: ~$1/month for 100 submissions

---

## Option 2: GCP Cloud Functions + Gmail

### Prerequisites
- Google Cloud account with billing enabled
- gcloud CLI installed

### Step 1: Set Up Gmail App Password

1. Enable 2-Step Verification on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Save the password (16 characters)

### Step 2: Deploy Cloud Function

```bash
cd serverless/gcp-cloud-function
npm install

gcloud functions deploy handleFormSubmission \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars TO_EMAIL=your-email@example.com,GMAIL_USER=your-gmail@gmail.com,GMAIL_APP_PASSWORD=your-app-password,ALLOWED_ORIGINS=https://yourdomain.com \
  --region us-central1
```

3. Copy the trigger URL from output

### Step 3: Update Website Form

Same as AWS option, but use your Cloud Function URL:

```javascript
const response = await fetch('https://REGION-PROJECT.cloudfunctions.net/handleFormSubmission', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

### Monthly Cost Estimate
- First 2M invocations: FREE
- Gmail: FREE
- **Total**: $0/month for typical traffic

---

## Option 3: Cloudflare Workers (Cheapest)

If you're using Cloudflare for DNS:

```javascript
// Cloudflare Worker
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const formData = await request.json()

  // Send to your email via SendGrid API or Mailgun
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: 'your@email.com' }] }],
      from: { email: 'noreply@yourdomain.com' },
      subject: 'New Assessment Request',
      content: [{ type: 'text/plain', value: JSON.stringify(formData, null, 2) }]
    })
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
```

**Cost**: $5/month for unlimited requests (Workers Paid plan)

---

## Recommendation

**For Northwatch Systems / Blackridge**:

I'd recommend **AWS Lambda + SES** because:
1. You're likely already using AWS infrastructure
2. Professional email sending from your domain
3. Can easily add DynamoDB to track submissions
4. Scales automatically
5. ~$1/month cost
6. Full control and visibility

**Quick Start**: Use the AWS option. Takes 15-20 minutes to set up, then costs almost nothing.

---

## Testing

Before going live, test with curl:

```bash
curl -X POST https://your-api-gateway-url/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Co",
    "role": "CTO",
    "usage": "Production Workloads",
    "concern": "Cost Visibility"
  }'
```

You should receive an email within seconds.

---

## Troubleshooting

**SES emails not arriving**:
- Check SES is out of sandbox mode
- Verify sender email in SES
- Check spam folder
- Review CloudWatch logs

**CORS errors**:
- Ensure ALLOWED_ORIGINS matches your domain exactly (including https://)
- Check API Gateway CORS configuration
- Test with browser dev tools network tab

**Lambda timeout**:
- Increase timeout in Lambda configuration
- Check execution role has SES permissions
- Review CloudWatch logs for errors
