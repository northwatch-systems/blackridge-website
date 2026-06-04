# Form Processing Cost Comparison

## Third-Party Services

### Formspree
- **Free tier**: 50 submissions/month
- **Paid**: $10/month (1,000 submissions) → $19/month (10,000 submissions)
- **Pros**: Zero setup, works immediately
- **Cons**: Limited free tier, recurring cost, vendor lock-in

### Basin
- **Free tier**: 100 submissions/month
- **Paid**: $9/month (unlimited)
- **Pros**: Developer-friendly, good documentation
- **Cons**: Recurring cost, less features than Formspree

### Web3Forms
- **Free**: 250 submissions/month (with branding)
- **Paid**: $5/month (unlimited, no branding)
- **Pros**: Cheapest paid option
- **Cons**: Newer service, less battle-tested

---

## Serverless Solutions

### AWS Lambda + SES

**Setup Time**: 15-20 minutes

**Monthly Cost**:
- Lambda: FREE (1M requests/month free tier)
  - After free tier: $0.20 per 1M requests
- SES: $0.10 per 1,000 emails
  - First 62,000 emails/month: FREE (if sending from EC2)
- API Gateway: $1.00 per million requests (HTTP API)
- **Total for 100 submissions/month**: ~$0.01
- **Total for 1,000 submissions/month**: ~$0.11
- **Total for 10,000 submissions/month**: ~$1.01

**Annual Cost**: ~$12/year (vs $120-240 for third-party)

**Pros**:
- Almost free forever
- Full control and ownership
- Can add DynamoDB tracking
- Professional domain email sending
- Scales automatically
- No vendor lock-in

**Cons**:
- Requires AWS account
- SES production access takes 24-48 hours
- Need to manage infrastructure (minimal)

---

### GCP Cloud Functions + Gmail

**Setup Time**: 10-15 minutes

**Monthly Cost**:
- Cloud Functions: FREE (2M invocations/month)
  - After free tier: $0.40 per 1M invocations
- Gmail: FREE (through app password)
- **Total for any typical traffic**: $0

**Annual Cost**: $0

**Pros**:
- Completely free
- Fastest setup (if you have Gmail)
- No approval process
- Simple deployment

**Cons**:
- Gmail has daily sending limits (~500/day)
- Less professional than domain email
- Not suitable for high volume

---

### Cloudflare Workers + SendGrid

**Setup Time**: 10 minutes

**Monthly Cost**:
- Cloudflare Workers: $5/month (unlimited requests)
  - Free tier: 100,000 requests/day
- SendGrid: FREE (100 emails/day)
  - Paid: $15/month (40,000 emails)
- **Total**: $0 (free tier) or $5/month (unlimited)

**Pros**:
- Global edge network
- Extremely fast
- Simple deployment
- Good free tier

**Cons**:
- $5/month minimum for production use
- SendGrid free tier has daily limit

---

## Recommendation for Blackridge

**Use AWS Lambda + SES** for these reasons:

1. **Cost**: ~$1/month vs $10-20/month → **Save $108-228/year**
2. **Professional**: Send from your domain (`noreply@blackridge.com`)
3. **Control**: Own your data, can add analytics
4. **Scalable**: Handles any traffic spike automatically
5. **Integration**: Easy to add DynamoDB, S3, etc. later

**Setup Time**: 20 minutes once, then forget about it

**Break-even**: You save money after the first month

---

## Real Numbers for Blackridge

Assuming 50 assessment requests per month (realistic for early-stage):

| Solution | Monthly Cost | Annual Cost | 3-Year Cost |
|----------|-------------|-------------|-------------|
| Formspree | $10 | $120 | $360 |
| Basin | $9 | $108 | $324 |
| **AWS Lambda** | **$0.05** | **$0.60** | **$1.80** |
| GCP Cloud Fn | $0 | $0 | $0 |

**Savings with AWS**: $119.40/year or $358.20 over 3 years

Even accounting for your time (20 min @ $200/hr = $67), you break even in 7 months and save money forever after.

---

## Decision Matrix

Choose **AWS Lambda** if:
- You want professional domain email
- You might add features later (database, analytics)
- You're already on AWS
- Cost optimization matters

Choose **GCP Cloud Functions** if:
- You want the absolute cheapest option
- You need it working in 10 minutes
- Low volume is acceptable with Gmail

Choose **Third-party service** if:
- You need it working in 2 minutes
- You have no technical resources
- You're pre-revenue and every hour matters

---

## Bottom Line

For a professional B2B SaaS company like Northwatch/Blackridge:

**Use AWS Lambda + SES**

- Costs $1/month instead of $10-20/month
- Takes 20 minutes to set up
- Gives you professional email from your domain
- Scales automatically
- You own the infrastructure

The setup time pays for itself in the first month through savings.
