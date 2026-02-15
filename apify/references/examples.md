# Apify Code Examples

Kumpulan contoh kode untuk berbagai use case dengan Apify.

## Running Actors

### Run Actor and Get Results (Python)

```python
from apify_client import ApifyClient
import json

client = ApifyClient("your-api-token")

# Run web scraper
run = client.actor("apify/web-scraper").call(
    run_input={
        "startUrls": [{"url": "https://news.ycombinator.com"}],
        "linkSelector": "a",
        "globPatterns": ["https://news.ycombinator.com/*"],
        "pageFunction": """
        async function pageFunction(context) {
            const { request, $ } = context;
            const results = [];
            
            $('.athing').each((i, el) => {
                const $el = $(el);
                results.push({
                    title: $el.find('.titleline a').first().text(),
                    url: $el.find('.titleline a').first().attr('href'),
                    points: $el.next().find('.score').text(),
                });
            });
            
            return results;
        }
        """,
        "maxPagesPerScan": 1,
    }
)

# Print results
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)
```

### Run Actor Async (JavaScript)

```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'your-token' });

async function scrapeWebsite(url) {
  // Start actor run
  const run = await client.actor('apify/cheerio-scraper').start({
    startUrls: [{ url }],
    linkSelector: null, // Don't follow links
    pageFunction: `
      async function pageFunction({ $, request }) {
        return {
          url: request.url,
          title: $('title').text(),
          meta: $('meta[name="description"]').attr('content'),
          h1: $('h1').first().text(),
          links: $('a').map((i, el) => $(el).attr('href')).get().slice(0, 10),
        };
      }
    `,
  });

  // Wait for completion
  await client.actor('apify/cheerio-scraper').waitForFinish(run.id);

  // Get results
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items;
}

// Usage
const results = await scrapeWebsite('https://example.com');
console.log(results);
```

### Run Instagram Scraper

```python
from apify_client import ApifyClient

client = ApifyClient("your-token")

run = client.actor("apify/instagram-scraper").call(
    run_input={
        "directUrls": ["https://www.instagram.com/username/"],
        "resultsType": "posts",
        "resultsLimit": 20,
    }
)

for post in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(f"Caption: {post.get('caption', '')[:100]}")
    print(f"Likes: {post.get('likesCount')}")
    print(f"Comments: {post.get('commentsCount')}")
    print("---")
```

### Run Google Search Scraper

```python
run = client.actor("apify/google-search-scraper").call(
    run_input={
        "queries": ["web scraping python", "playwright tutorial"],
        "maxPagesPerQuery": 1,
        "countryCode": "us",
        "languageCode": "en",
    }
)

for result in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(f"Query: {result['query']}")
    for organic in result.get('organicResults', [])[:5]:
        print(f"  - {organic['title']}: {organic['url']}")
```

## Building Actors

### Complete Web Scraper Actor

```javascript
// src/main.js
import { Actor } from 'apify';
import { CheerioCrawler, Dataset } from 'crawlee';

await Actor.init();

const input = await Actor.getInput() || {};
const {
  startUrls = ['https://example.com'],
  linkSelector = 'a[href]',
  globPatterns = ['**'],
  maxRequestsPerCrawl = 100,
  requestTimeout = 30000,
} = input;

const crawler = new CheerioCrawler({
  maxRequestsPerCrawl,
  requestHandlerTimeoutSecs: requestTimeout / 1000,
  
  async requestHandler({ request, $, enqueueLinks, pushData }) {
    // Log progress
    Actor.log.info(`Scraping: ${request.url}`);

    // Extract page data
    const pageData = {
      url: request.url,
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content'),
      h1: $('h1').first().text().trim(),
      bodyText: $('body').text().replace(/\s+/g, ' ').trim().slice(0, 1000),
      links: [],
      images: [],
    };

    // Extract links
    $('a[href]').each((i, el) => {
      pageData.links.push({
        text: $(el).text().trim(),
        href: $(el).attr('href'),
      });
    });

    // Extract images
    $('img[src]').each((i, el) => {
      pageData.images.push({
        alt: $(el).attr('alt'),
        src: $(el).attr('src'),
      });
    });

    // Save data
    await pushData(pageData);

    // Follow links
    await enqueueLinks({
      selector: linkSelector,
      glob: globPatterns,
    });
  },

  failedRequestHandler({ request, error }) {
    Actor.log.error(`Failed to scrape ${request.url}: ${error.message}`);
  },
});

await crawler.run(startUrls);

await Actor.exit();
```

### E-commerce Scraper Actor

```javascript
import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

await Actor.init();

const input = await Actor.getInput();
const { startUrl, maxProducts = 50 } = input;

const products = [];

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, request, enqueueLinks, addRequests }) {
    const url = new URL(request.url);

    // Check if this is a product page
    if (url.pathname.includes('/product/')) {
      await page.waitForSelector('.product-details', { timeout: 10000 });

      const product = await page.evaluate(() => {
        return {
          name: document.querySelector('h1')?.textContent?.trim(),
          price: document.querySelector('.price')?.textContent?.trim(),
          description: document.querySelector('.description')?.textContent?.trim(),
          image: document.querySelector('.product-image img')?.src,
          availability: document.querySelector('.stock-status')?.textContent?.trim(),
          specs: {},
        };
      });

      // Get specifications if available
      product.specs = await page.evaluate(() => {
        const specs = {};
        document.querySelectorAll('.spec-row').forEach(row => {
          const key = row.querySelector('.spec-label')?.textContent?.trim();
          const value = row.querySelector('.spec-value')?.textContent?.trim();
          if (key && value) specs[key] = value;
        });
        return specs;
      });

      await Actor.pushData(product);
      Actor.log.info(`Scraped product: ${product.name}`);
    } else {
      // Category/listing page - find product links and pagination
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Enqueue product pages
      await enqueueLinks({
        selector: '.product-card a',
        label: 'product',
      });

      // Follow pagination
      const nextButton = await page.$('.pagination-next');
      if (nextButton && products.length < maxProducts) {
        await enqueueLinks({
          selector: '.pagination-next',
        });
      }
    }
  },

  maxRequestsPerCrawl: maxProducts + 10, // Allow some extra for category pages
});

await crawler.run([startUrl]);

await Actor.exit();
```

### News Article Scraper (Python)

```python
import asyncio
from apify import Actor
from crawlee.beautifulsoup_crawler import BeautifulSoupCrawler, BeautifulSoupCrawlingContext

async def main():
    async with Actor:
        actor_input = await Actor.get_input()
        start_urls = actor_input.get('startUrls', ['https://news.ycombinator.com'])
        max_articles = actor_input.get('maxArticles', 20)
        
        articles = []
        
        async def handler(context: BeautifulSoupCrawlingContext):
            url = context.request.url
            
            # Check if article limit reached
            if len(articles) >= max_articles:
                return
            
            # Extract article data
            article = {
                'url': url,
                'title': context.soup.find('title').text if context.soup.find('title') else None,
                'content': None,
                'author': None,
                'date': None,
            }
            
            # Try common article selectors
            content = context.soup.find('article') or context.soup.find(class_='content')
            if content:
                article['content'] = content.get_text(strip=True)[:5000]
            
            # Try to find author
            author_el = context.soup.find(class_='author') or context.soup.find(rel='author')
            if author_el:
                article['author'] = author_el.get_text(strip=True)
            
            # Try to find date
            date_el = context.soup.find('time') or context.soup.find(class_='date')
            if date_el:
                article['date'] = date_el.get('datetime') or date_el.get_text(strip=True)
            
            articles.append(article)
            await Actor.push_data(article)
            
            # Log progress
            Actor.log.info(f"Scraped article {len(articles)}: {article['title']}")
        
        crawler = BeautifulSoupCrawler(
            request_handler=handler,
            max_requests_per_crawl=max_articles + 10,
        )
        
        await crawler.run(start_urls)
        
        Actor.log.info(f"Total articles scraped: {len(articles)}")

if __name__ == '__main__':
    asyncio.run(main())
```

### Screenshot Actor

```javascript
import { Actor } from 'apify';
import { chromium } from 'playwright';

await Actor.init();

const input = await Actor.getInput();
const { urls, viewport = { width: 1920, height: 1080 }, fullPage = true } = input;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport });
const page = await context.newPage();

const kvStore = await Actor.openKeyValueStore();

for (const url of urls) {
  try {
    Actor.log.info(`Taking screenshot of ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    const screenshot = await page.screenshot({ fullPage });
    const key = new URL(url).hostname + '_' + Date.now();
    
    await kvStore.setValue(`${key}.png`, screenshot, { contentType: 'image/png' });
    
    await Actor.pushData({
      url,
      screenshotKey: `${key}.png`,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    Actor.log.error(`Failed to screenshot ${url}: ${error.message}`);
  }
}

await browser.close();
await Actor.exit();
```

### Form Submission Actor

```javascript
import { Actor } from 'apify';
import { chromium } from 'playwright';

await Actor.init();

const input = await Actor.getInput();
const {
  formUrl,
  formData,
  submitSelector = 'button[type="submit"]',
  successUrl,
} = input;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  // Navigate to form
  await page.goto(formUrl);
  await page.waitForLoadState('networkidle');

  // Fill form fields
  for (const [selector, value] of Object.entries(formData)) {
    const element = await page.$(selector);
    if (element) {
      const tagName = await element.evaluate(el => el.tagName.toLowerCase());
      const type = await element.getAttribute('type');
      
      if (tagName === 'select') {
        await page.selectOption(selector, value);
      } else if (type === 'checkbox') {
        await page.setChecked(selector, value);
      } else if (type === 'radio') {
        await page.check(selector);
      } else {
        await page.fill(selector, value);
      }
    }
  }

  // Submit form
  await page.click(submitSelector);

  // Wait for navigation or success indicator
  if (successUrl) {
    await page.waitForURL(`**/${successUrl}**`);
  } else {
    await page.waitForLoadState('networkidle');
  }

  const result = {
    success: true,
    submittedAt: new Date().toISOString(),
    finalUrl: page.url(),
  };

  await Actor.pushData(result);
  Actor.log.info('Form submitted successfully');

} catch (error) {
  await Actor.pushData({
    success: false,
    error: error.message,
  });
  Actor.log.error(`Form submission failed: ${error.message}`);
}

await browser.close();
await Actor.exit();
```

## API Client Usage

### Get Dataset Items

```python
from apify_client import ApifyClient

client = ApifyClient("your-token")

# List items with pagination
dataset = client.dataset("dataset-id")

page = 0
while True:
    result = dataset.list_items(offset=page * 1000, limit=1000)
    items = result.items
    
    if not items:
        break
    
    for item in items:
        process(item)
    
    page += 1
```

### Export Dataset to File

```python
# Export to JSON
items = list(client.dataset("dataset-id").iterate_items())
with open("output.json", "w") as f:
    json.dump(items, f, indent=2)

# Export to CSV
import csv
items = list(client.dataset("dataset-id").iterate_items())
if items:
    with open("output.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=items[0].keys())
        writer.writeheader()
        writer.writerows(items)
```

### Manage Key-Value Store

```python
kv_store = client.key_value_store("kv-store-id")

# Set value
kv_store.set_record("config", {"setting": "value"})

# Get value
record = kv_store.get_record("config")
print(record["value"])

# Set file
with open("image.png", "rb") as f:
    kv_store.set_record("image.png", f.read(), content_type="image/png")

# Get file
record = kv_store.get_record("image.png")
with open("downloaded.png", "wb") as f:
    f.write(record["value"])
```

### Manage Request Queue

```python
queue = client.request_queue("queue-id")

# Add requests
queue.add_request({"url": "https://example.com/page/1"})
queue.add_request({"url": "https://example.com/page/2", "userData": {"depth": 1}})

# Process queue
request = queue.fetch_next_request()
if request:
    # Process request
    print(f"Processing: {request['url']}")
    
    # Mark as handled
    queue.mark_request_finished(request)
```

## Webhooks

### Flask Webhook Handler

```python
from flask import Flask, request, jsonify
import hashlib
import hmac
import json

app = Flask(__name__)
WEBHOOK_SECRET = "your-webhook-secret"

def verify_signature(payload, signature):
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)

@app.route("/webhook", methods=["POST"])
def webhook():
    signature = request.headers.get("X-Apify-Signature", "")
    
    if not verify_signature(request.data, signature):
        return jsonify({"error": "Invalid signature"}), 401
    
    data = request.json
    event_type = data.get("eventType")
    
    if event_type == "ACTOR.RUN.SUCCEEDED":
        run_id = data["data"]["actorRunId"]
        dataset_id = data["data"]["defaultDatasetId"]
        # Process successful run
        print(f"Run {run_id} succeeded. Dataset: {dataset_id}")
        
    elif event_type == "ACTOR.RUN.FAILED":
        run_id = data["data"]["actorRunId"]
        error = data["data"].get("errorMessage")
        print(f"Run {run_id} failed: {error}")
    
    return jsonify({"received": True})

if __name__ == "__main__":
    app.run(port=5000)
```

### Create Webhook Programmatically

```python
from apify_client import ApifyClient

client = ApifyClient("your-token")

webhook = client.webhooks().create(
    event_types=["ACTOR.RUN.SUCCEEDED"],
    condition={
        "actorId": "your-actor-id",
    },
    request_url="https://your-server.com/webhook",
    payload_template=json.dumps({
        "runId": "{{resource.id}}",
        "status": "{{resource.status}}",
        "datasetId": "{{resource.defaultDatasetId}}",
    }),
)

print(f"Created webhook: {webhook['id']}")
```

## Schedule Management

### Create Daily Schedule

```python
from apify_client import ApifyClient

client = ApifyClient("your-token")

schedule = client.schedules().create(
    name="Daily News Scraping",
    cron_expression="0 8 * * *",  # Every day at 8:00 AM UTC
    is_enabled=True,
    actions=[
        {
            "type": "RUN_ACTOR",
            "actorId": "your-actor-id",
            "runInput": {
                "startUrls": [{"url": "https://news.ycombinator.com"}],
                "maxPages": 5,
            },
        }
    ],
)

print(f"Created schedule: {schedule['id']}")
```

### List and Manage Schedules

```python
# List all schedules
schedules = client.schedules().list()
for schedule in schedules:
    print(f"{schedule['name']}: {schedule['cronExpression']}")

# Update schedule
client.schedules().update("schedule-id", is_enabled=False)

# Delete schedule
client.schedules().delete("schedule-id")
```

## Integration Examples

### Next.js API Route

```typescript
// app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN! });

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    const run = await client.actor('apify/cheerio-scraper').call({
      startUrls: [{ url }],
      pageFunction: `
        async function pageFunction({ $, request }) {
          return {
            url: request.url,
            title: $('title').text(),
            meta: $('meta[name="description"]').attr('content'),
          };
        }
      `,
    });
    
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    return NextResponse.json({ data: items[0] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Scraping failed' },
      { status: 500 }
    );
  }
}
```

### React Hook for Apify

```typescript
import { useState } from 'react';
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.NEXT_PUBLIC_APIFY_TOKEN! });

export function useScraper() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const scrape = async (url: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const run = await client.actor('apify/cheerio-scraper').call({
        startUrls: [{ url }],
        pageFunction: `
          async function pageFunction({ $ }) {
            return { title: $('title').text() };
          }
        `,
      });
      
      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      setData(items[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { scrape, loading, data, error };
}

// Usage in component
function ScraperComponent() {
  const { scrape, loading, data, error } = useScraper();

  return (
    <div>
      <button onClick={() => scrape('https://example.com')} disabled={loading}>
        {loading ? 'Scraping...' : 'Scrape'}
      </button>
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

## CLI Examples

```bash
# Create new project
apify create my-scraper --template python-beautifulsoup

# Run locally with input
apify run --input-file=input.json

# Deploy to platform
apify push

# Call actor remotely
apify call username/my-actor --input='{"url": "https://example.com"}'

# Get dataset
apify dataset get DATASET_ID --format json > results.json

# List key-value stores
apify kv-store ls

# View logs
apify logs RUN_ID

# Check proxy status
apify proxy-status
```
