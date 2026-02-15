---
name: apify
description: Skill untuk web scraping dan automation dengan Apify platform. Gunakan untuk menjalankan Actors, web scraping, browser automation, proxy rotation, dan data extraction.
---

# Apify Platform Skill

Apify adalah platform web scraping dan automation yang memungkinkan menjalankan Actors (serverless microapps) untuk scraping, crawling, dan automation di cloud.

## Quick Start

### Setup

1. Daftar di [apify.com](https://apify.com)
2. Buat API token di [console.apify.com/account#/integrations](https://console.apify.com/account#/integrations)
3. Set environment variable:

```bash
export APIFY_API_TOKEN="your-token-here"
```

### Install CLI

```bash
# npm
npm install -g apify-cli

# Atau menggunakan npx tanpa install
npx apify-cli
```

### Install SDK

```bash
# JavaScript/Node.js
npm install apify

# Python
pip install apify
```

### Install API Client

```bash
# JavaScript/Node.js
npm install apify-client

# Python
pip install apify-client
```

## Actors

### Apa itu Actor?

Actor adalah serverless microapp yang berjalan di cloud Apify. Bisa:
- Web scraper
- Browser automation script
- API endpoint
- Data processor
- Any automation task

### Run Actor via Console

1. Buka [console.apify.com](https://console.apify.com)
2. Pilih Actor dari Store atau buat baru
3. Set input parameters
4. Klik "Start"

### Run Actor via API (Python)

```python
from apify_client import ApifyClient

client = ApifyClient("your-api-token")

# Run actor and wait for completion
run = client.actor("apify/web-scraper").call(
    run_input={
        "startUrls": [{"url": "https://example.com"}],
        "linkSelector": "a[href]",
        "pageFunction": """
            async function pageFunction(context) {
                const { request, $ } = context;
                return {
                    url: request.url,
                    title: $('title').text(),
                };
            }
        """,
    }
)

# Get results
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)
```

### Run Actor via API (JavaScript)

```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'your-api-token' });

const run = await client.actor('apify/web-scraper').call({
  startUrls: [{ url: 'https://example.com' }],
  linkSelector: 'a[href]',
  pageFunction: `
    async function pageFunction(context) {
      const { request, $ } = context;
      return {
        url: request.url,
        title: $('title').text(),
      };
    }
  `,
});

// Get results
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items);
```

### Run Actor via CLI

```bash
# Run actor with input
apify call apify/web-scraper --input='{"startUrls":[{"url":"https://example.com"}]}'

# Run with input file
apify call apify/web-scraper --input-file=input.json

# Run and wait
apify call apify/web-scraper --wait-for-finish
```

## Popular Actors

| Actor | Description |
|-------|-------------|
| `apify/web-scraper` | Configurable web scraper |
| `apify/cheerio-scraper` | Fast HTML scraper with Cheerio |
| `apify/puppeteer-scraper` | Browser-based scraper with Puppeteer |
| `apify/playwright-scraper` | Browser-based scraper with Playwright |
| `apify/instagram-scraper` | Scrape Instagram profiles |
| `apify/website-content-crawler` | Crawl websites for content |
| `apify/google-search-scraper` | Scrape Google search results |
| `apify/telegram-scraper` | Scrape Telegram messages |
| `apify/youtube-scraper` | Scrape YouTube data |

## Developing Actors

### Create New Actor

```bash
# Create from template
apify create my-actor

# Pilih template:
# - JavaScript with Cheerio
# - TypeScript with Cheerio
# - JavaScript with Puppeteer
# - TypeScript with Playwright
# - Python with Beautiful Soup
# - Python with Selenium
```

### Actor Structure

```
my-actor/
├── .actor/
│   ├── actor.json      # Actor configuration
│   └── Dockerfile      # Custom Docker image (optional)
├── src/
│   └── main.js         # Main entry point
├── package.json
├── INPUT_SCHEMA.json   # Input schema (optional)
└── README.md
```

### actor.json

```json
{
  "actorSpecification": 1,
  "name": "my-actor",
  "version": "1.0.0",
  "buildTag": "latest",
  "environmentVariables": {},
  "dockerfile": "./Dockerfile"
}
```

### Basic Actor (JavaScript/Cheerio)

```javascript
import { Actor } from 'apify';

await Actor.init();

// Get input
const input = await Actor.getInput();
const { url, selector } = input;

// Make HTTP request
const response = await fetch(url);
const html = await response.text();

// Parse with Cheerio
const $ = cheerio.load(html);
const results = [];

$(selector).each((i, el) => {
  results.push({
    text: $(el).text(),
    href: $(el).attr('href'),
  });
});

// Save results
await Actor.pushData(results);

await Actor.exit();
```

### Basic Actor (Playwright)

```javascript
import { Actor } from 'apify';
import { chromium } from 'playwright';

await Actor.init();

const input = await Actor.getInput();
const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(input.url);

// Extract data
const results = await page.evaluate(() => {
  const items = [];
  document.querySelectorAll('article').forEach(el => {
    items.push({
      title: el.querySelector('h2')?.textContent,
      link: el.querySelector('a')?.href,
    });
  });
  return items;
});

await Actor.pushData(results);

await browser.close();
await Actor.exit();
```

### Basic Actor (Python/BeautifulSoup)

```python
from apify import Actor
import httpx
from bs4 import BeautifulSoup

async def main():
    async with Actor:
        # Get input
        actor_input = await Actor.get_input()
        url = actor_input.get('url')
        
        # Fetch page
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        results = []
        
        for item in soup.select('article'):
            results.append({
                'title': item.select_one('h2').text if item.select_one('h2') else None,
                'link': item.select_one('a')['href'] if item.select_one('a') else None,
            })
        
        # Push results
        await Actor.push_data(results)

# Run
import asyncio
asyncio.run(main())
```

### Input Schema (INPUT_SCHEMA.json)

```json
{
  "title": "My Actor Input",
  "type": "object",
  "schemaVersion": 1,
  "properties": {
    "url": {
      "title": "Start URL",
      "type": "string",
      "description": "The URL to start scraping from",
      "editor": "textfield",
      "prefill": "https://example.com"
    },
    "selector": {
      "title": "CSS Selector",
      "type": "string",
      "description": "CSS selector for items",
      "editor": "textfield",
      "default": "a"
    },
    "maxPages": {
      "title": "Max Pages",
      "type": "integer",
      "description": "Maximum pages to scrape",
      "default": 10,
      "minimum": 1,
      "maximum": 1000
    }
  },
  "required": ["url"]
}
```

### Push to Apify

```bash
# Login
apify login

# Push actor to platform
apify push

# Run actor
apify run

# Run remotely
apify call my-username/my-actor
```

## Storage

### Dataset

Store structured results from scraping.

```javascript
// Push data to dataset
await Actor.pushData({ title: 'Hello', url: 'https://example.com' });

// Get dataset
const dataset = await Actor.openDataset();
await dataset.pushData([{ item: 1 }, { item: 2 }]);

// Get data
const { items } = await dataset.listItems();
```

```python
# Push data
await Actor.push_data({'title': 'Hello'})

# Open dataset
dataset = await Actor.open_dataset()
await dataset.push_data([{'item': 1}, {'item': 2}])

# Get data
items = await dataset.list_items()
```

### Key-Value Store

Store files and key-value data.

```javascript
// Save file
const kvStore = await Actor.openKeyValueStore();
await kvStore.setValue('screenshot.png', buffer, { contentType: 'image/png' });
await kvStore.setValue('config.json', { key: 'value' });

// Get file
const value = await kvStore.getValue('config.json');
```

```python
# Save file
kv_store = await Actor.open_key_value_store()
await kv_store.set_value('screenshot.png', buffer, content_type='image/png')

# Get file
value = await kv_store.get_value('config.json')
```

### Request Queue

Manage URLs to be scraped.

```javascript
const queue = await Actor.openRequestQueue();
await queue.addRequest({ url: 'https://example.com' });
await queue.addRequest({ url: 'https://example.com/page/2' });

const request = await queue.fetchNextRequest();
await queue.markRequestHandled(request);
```

## Proxy

### Use Proxy in Actor

```javascript
// Get proxy URL
const proxyUrl = Actor.getApifyProxyUrl({
  groups: ['RESIDENTIAL'],
  country: 'US',
});

// Use with Puppeteer
const browser = await puppeteer.launch({
  args: [`--proxy-server=${proxyUrl}`],
});

// Use with Playwright
const browser = await chromium.launch({
  proxy: { server: proxyUrl },
});
```

```python
# Get proxy URL
proxy_url = Actor.get_apify_proxy_url(
    groups=['RESIDENTIAL'],
    country='US',
)
```

### Proxy Groups

| Group | Description |
|-------|-------------|
| `SHADER` | Datacenter proxies (default) |
| `RESIDENTIAL` | Residential IPs |
| `GOOGLE_SERP` | For Google search |
| `BUYPROXIES94952` | Premium datacenter |

## API Client

### Python Client

```python
from apify_client import ApifyClient

client = ApifyClient("your-token")

# Run actor
run = client.actor("actor-id").call(run_input={"key": "value"})

# Get dataset
dataset = client.dataset("dataset-id")
items = dataset.list_items().items

# Get key-value store
kv = client.key_value_store("kv-store-id")
value = kv.get_record("key")

# Get request queue
queue = client.request_queue("queue-id")
queue.add_request({"url": "https://example.com"})
```

### JavaScript Client

```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'your-token' });

// Run actor
const run = await client.actor('actor-id').call({ key: 'value' });

// Get dataset
const dataset = client.dataset('dataset-id');
const { items } = await dataset.listItems();

// Get key-value store
const kv = client.keyValueStore('kv-store-id');
const value = await kv.getRecord('key');
```

## CLI Commands

```bash
# Authentication
apify login
apify logout

# Actor management
apify create [name]          # Create new actor
apify pull [actor-id]        # Pull actor from platform
apify push [actor-id]        # Push actor to platform
apify run                    # Run actor locally
apify call [actor-id]        # Run actor on platform

# Storage
apify dataset ls             # List datasets
apify dataset get [id]       # Get dataset items
apify kv-store ls            # List key-value stores
apify kv-store get [id]      # Get value from store

# Proxy
apify proxy-status           # Check proxy status

# Info
apify info                   # Show account info
apify actors                 # List your actors
```

## Webhooks

### Create Webhook

```python
client.webhooks().create(
    event_types=["ACTOR.RUN.SUCCEEDED"],
    condition={
        "actorId": "actor-id",
    },
    request_url="https://your-server.com/webhook",
)
```

### Webhook Payload

```json
{
  "eventType": "ACTOR.RUN.SUCCEEDED",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "data": {
    "actorId": "actor-id",
    "actorRunId": "run-id",
    "status": "SUCCEEDED",
    "defaultDatasetId": "dataset-id"
  }
}
```

## Schedules

```python
# Create schedule via API
client.schedules().create(
    name="Daily scrape",
    cron_expression="0 8 * * *",  # Every day at 8 AM
    actions=[
        {
            "type": "RUN_ACTOR",
            "actorId": "actor-id",
            "runInput": {"url": "https://example.com"}
        }
    ]
)
```

## MCP (Model Context Protocol)

Apify mendukung MCP untuk integrasi dengan AI agents.

### Use Apify MCP

```bash
# Install MCP CLI
npm install -g @apify/mcp-cli

# Start MCP server
apify-mcp start

# List available Actors
apify-mcp actors

# Run Actor via MCP
apify-mcp run apify/web-scraper --input='{"startUrls":[{"url":"https://example.com"}]}'
```

## Crawlee Integration

Crawlee adalah library scraping open-source dari Apify.

### Install Crawlee

```bash
npm install crawlee
# atau
pip install crawlee
```

### Basic Crawler

```javascript
import { CheerioCrawler } from 'crawlee';

const crawler = new CheerioCrawler({
  async requestHandler({ request, $ }) {
    const title = $('title').text();
    await Actor.pushData({ url: request.url, title });
  },
});

await crawler.run(['https://example.com']);
```

### Playwright Crawler

```javascript
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, request }) {
    await page.waitForSelector('article');
    const title = await page.title();
    await Actor.pushData({ url: request.url, title });
  },
});

await crawler.run(['https://example.com']);
```

## Best Practices

1. **Rate Limiting**: Gunakan `autoscaledPool` untuk mengatur concurrency
2. **Proxy Rotation**: Gunakan Apify Proxy untuk menghindari blocking
3. **Session Management**: Maintain sessions untuk dynamic content
4. **Error Handling**: Handle errors gracefully dengan retry logic
5. **Data Validation**: Validasi data sebelum push ke dataset
6. **Cost Optimization**: Set memory dan timeout yang sesuai

## Common Patterns

### Handle Pagination

```javascript
const crawler = new CheerioCrawler({
  async requestHandler({ request, $, enqueueLinks }) {
    // Extract data
    const items = [];
    $('article').each((i, el) => {
      items.push({ title: $(el).find('h2').text() });
    });
    await Actor.pushData(items);
    
    // Find next page
    await enqueueLinks({
      selector: 'a.next',
    });
  },
});
```

### Handle Dynamic Content

```javascript
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
  async requestHandler({ page, request }) {
    // Wait for content
    await page.waitForSelector('.item', { timeout: 10000 });
    
    // Scroll to load more
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
    
    // Extract
    const items = await page.$$eval('.item', els => 
      els.map(el => ({ text: el.textContent }))
    );
    await Actor.pushData(items);
  },
});
```

## Resources

- [Official Docs](https://docs.apify.com/)
- [API Reference](https://docs.apify.com/api/v2)
- [SDK JavaScript](https://docs.apify.com/sdk/js)
- [SDK Python](https://docs.apify.com/sdk/python)
- [CLI Docs](https://docs.apify.com/cli)
- [Crawlee](https://crawlee.dev/)
- [Discord Community](https://discord.com/invite/jyEM2PRvMU)
- [Actor Templates](https://apify.com/templates)
