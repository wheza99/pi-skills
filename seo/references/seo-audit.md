# SEO Audit Checklist

## Technical SEO

### Site Architecture
- [ ] Clean URL structure (no query parameters)
- [ ] Logical hierarchy (category > subcategory > page)
- [ ] Sitemap.xml exists and submitted
- [ ] Robots.txt configured correctly
- [ ] Internal linking structure
- [ ] Navigation is crawlable
- [ ] No orphan pages

### Indexability
- [ ] Noindex on duplicate/low-value pages
- [ ] Canonical tags implemented
- [ ] No redirect chains
- [ ] No broken links (404s)
- [ ] XML sitemap includes all important pages
- [ ] Hreflang tags (if multilingual)

### Performance
- [ ] Page load time < 3 seconds
- [ ] Core Web Vitals pass
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Images optimized (WebP, lazy loading)
- [ ] CSS/JS minified
- [ ] Gzip/Brotli compression enabled
- [ ] CDN configured

### Mobile
- [ ] Responsive design
- [ ] Mobile-friendly (Google test pass)
- [ ] Touch targets sized correctly
- [ ] No horizontal scrolling
- [ ] Font size readable

### Security
- [ ] HTTPS everywhere
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] Security headers configured

## On-Page SEO

### Title Tags
- [ ] Unique for each page
- [ ] 50-60 characters
- [ ] Contains primary keyword
- [ ] Compelling for clicks
- [ ] Brand name included (when appropriate)

### Meta Descriptions
- [ ] Unique for each page
- [ ] 140-160 characters
- [ ] Contains keyword naturally
- [ ] Includes call-to-action
- [ ] Accurately describes content

### Headings
- [ ] One H1 per page
- [ ] H1 contains primary keyword
- [ ] Logical hierarchy (H1 > H2 > H3)
- [ ] Keywords in subheadings
- [ ] Not skipping heading levels

### Content
- [ ] Original and valuable
- [ ] Keyword in first 100 words
- [ ] Sufficient length (topic-dependent)
- [ ] Keyword density 1-2%
- [ ] Related keywords/LSI included
- [ ] No duplicate content
- [ ] Grammar and spelling correct
- [ ] Readable (Flesch-Kincaid score)

### Images
- [ ] Descriptive file names
- [ ] Alt text with keywords
- [ ] Compressed file size
- [ ] Responsive images (srcset)
- [ ] Next-gen formats (WebP)
- [ ] Lazy loading implemented

### Links
- [ ] Internal links to related content
- [ ] External links to authoritative sources
- [ ] Descriptive anchor text
- [ ] No broken links
- [ ] Nofollow on sponsored/ugc links

### URL
- [ ] Short and descriptive
- [ ] Contains keyword
- [ ] No special characters
- [ ] Lowercase
- [ ] Hyphens, not underscores

## Off-Page SEO

### Backlinks
- [ ] Quality over quantity
- [ ] Diverse anchor text
- [ ] From relevant websites
- [ ] Mix of dofollow/nofollow
- [ ] No toxic/spammy links
- [ ] Regular monitoring

### Brand Signals
- [ ] Brand mentions online
- [ ] Social media presence
- [ ] Google Business Profile (local)
- [ ] Reviews and ratings
- [ ] NAP consistency (local)

## Local SEO (if applicable)

### Google Business Profile
- [ ] Claimed and verified
- [ ] Complete information
- [ ] Accurate NAP
- [ ] Business hours
- [ ] Photos uploaded
- [ ] Posts regularly
- [ ] Reviews responded to

### Local Citations
- [ ] Consistent NAP across web
- [ ] Listed in relevant directories
- [ ] Industry-specific directories
- [ ] Local chamber of commerce

## GEO (Generative Engine Optimization)

### Structured Data
- [ ] Organization schema
- [ ] Website schema
- [ ] Breadcrumb schema
- [ ] Article schema
- [ ] FAQ schema (if applicable)
- [ ] HowTo schema (if applicable)
- [ ] Author schema

### Content for AI
- [ ] Direct answers at top
- [ ] Question-answer format
- [ ] Clear definitions
- [ ] Step-by-step instructions
- [ ] Tables and lists
- [ ] Fresh/updated content

### E-E-A-T Signals
- [ ] Author credentials visible
- [ ] Author expertise demonstrated
- [ ] Citations and references
- [ ] Contact information
- [ ] About page complete
- [ ] Privacy policy
- [ ] Terms of service

## Tools for Audit

### Free Tools
- Google Search Console
- Google PageSpeed Insights
- Google Mobile-Friendly Test
- Google Rich Results Test
- Bing Webmaster Tools
- Screaming Frog SEO Spider (free version)
- Ubersuggest
- AnswerThePublic

### Paid Tools
- Ahrefs
- SEMrush
- Moz Pro
- Surfer SEO
- Screaming Frog SEO Spider (paid)
- DeepCrawl

### Testing Tools
```
# Page Speed
https://pagespeed.web.dev/

# Mobile Friendly
https://search.google.com/test/mobile-friendly

# Rich Results
https://search.google.com/test/rich-results

# Robots.txt
https://www.google.com/webmasters/tools/robots-testing-tool

# Structured Data Validator
https://validator.schema.org/

# Core Web Vitals
chrome://devtools > Lighthouse
```

## Audit Score Template

| Category | Weight | Score (0-100) | Weighted |
|----------|--------|---------------|----------|
| Technical SEO | 20% | | |
| On-Page SEO | 25% | | |
| Content Quality | 25% | | |
| User Experience | 15% | | |
| Off-Page/Authority | 15% | | |
| **Total** | **100%** | | |

## Priority Levels

### Critical (Fix Immediately)
- Noindex on important pages
- Broken critical pages
- Security issues
- Major performance problems
- Duplicate content

### High (Fix Within 1 Week)
- Missing meta descriptions
- Missing alt text
- Broken links
- Slow page speed
- Missing structured data

### Medium (Fix Within 1 Month)
- Content optimization
- Internal linking
- Image optimization
- Mobile improvements
- Local SEO setup

### Low (Ongoing)
- Backlink building
- Content expansion
- Social signals
- Brand mentions
- Review generation

## Regular Audit Schedule

| Frequency | Tasks |
|-----------|-------|
| Weekly | Check for 404s, monitor rankings, review GSC |
| Monthly | Backlink audit, content audit, competitor analysis |
| Quarterly | Full technical audit, keyword research update |
| Annually | Complete site audit, strategy review |

## Common Issues & Solutions

### Issue: Low Crawl Budget
**Solution:** 
- Fix redirect chains
- Update sitemap
- Block low-value pages in robots.txt

### Issue: Keyword Cannibalization
**Solution:**
- Identify competing pages
- Consolidate or differentiate content
- Update internal links

### Issue: Thin Content
**Solution:**
- Expand content depth
- Add multimedia
- Include user value

### Issue: Slow Page Speed
**Solution:**
- Optimize images
- Minimize CSS/JS
- Enable caching
- Use CDN

### Issue: No Structured Data
**Solution:**
- Implement JSON-LD
- Test with Rich Results Test
- Monitor in GSC
