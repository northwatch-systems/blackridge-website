# Northwatch Resource Ingestion Template

Use this template for original Northwatch blog posts, research notes, and whitepaper landing pages. Do not paste third-party whitepaper or article copy into the site. Summarize only from Northwatch-owned notes, public facts we can cite, and original analysis.

## Required Metadata

- `slug`:
- `content_type`: article | research-note | whitepaper-landing | evidence-pack
- `status`: draft | review | approved | published
- `title`:
- `dek`:
- `primary_audience`: finance | platform | security | engineering | founder | mixed
- `topic`: ai-spend-forensics | runtime-economics | evidence-quality | security | deployment | methodology
- `reading_time`:
- `canonical_url`:
- `og_title`:
- `og_description`:

## Source Hygiene

- `northwatch_owned_sources`:
- `public_sources_to_cite`:
- `third_party_material_excluded`:
- `reviewer`:
- `ip_clean`: yes | no

Before publication, `ip_clean` must be `yes`. If any source came from a competitor blog, vendor whitepaper, analyst report, customer deck, private email, or generated document based on those materials, rewrite from first principles or discard it.

## Page Structure

### Hero

- Eyebrow:
- H1:
- Lead paragraph:
- Primary CTA:
- Secondary CTA:

### Featured Claim

State the one useful claim the piece makes. Avoid broad summaries.

```text
Claim:
Evidence:
Reader takeaway:
```

### Body Outline

1. Problem context:
2. Mechanism:
3. Evidence standard:
4. Practical implication:
5. What to do next:

## Card Copy

Use this for `/blog/` cards and Resources mega-menu entries.

- Card label:
- Card title:
- Card summary:
- CTA text:

## Whitepaper Gate Decision

- `ungated_summary_available`: yes | no
- `download_requires_email`: yes | no
- `email_gate_reason`:
- `post_submit_delivery`: browser-download | email-link | founder-followup

Default stance: publish an ungated summary and gate only deeper operational material that is worth the exchange.

## QA Checklist

- [ ] No third-party prose copied or paraphrased too closely.
- [ ] No claims without either source citation, product evidence, or clear framing as Northwatch opinion.
- [ ] No fake customer logos, fake research numbers, or invented benchmarks.
- [ ] Title and meta description are unique.
- [ ] Blog card copy exists.
- [ ] Sitemap and `llms.txt` updated if published.
- [ ] Links tested locally.
