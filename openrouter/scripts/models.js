#!/usr/bin/env node
/**
 * OpenRouter Models List Script
 * 
 * Usage: node models.js [options]
 * 
 * Options:
 *   --search=<term>     Filter by name
 *   --provider=<name>   Filter by provider (openai, anthropic, google, etc)
 *   --free=true         Show only free models
 *   --tools=true        Show only models with tool support
 *   --json=true         Output as JSON
 */

const API_URL = 'https://openrouter.ai/api/v1/models';

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    search: args.find(a => a.startsWith('--search='))?.split('=')[1]?.toLowerCase(),
    provider: args.find(a => a.startsWith('--provider='))?.split('=')[1]?.toLowerCase(),
    free: args.includes('--free=true'),
    tools: args.includes('--tools=true'),
    json: args.includes('--json=true'),
  };
}

async function listModels(options) {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      console.error('API Error:', await response.text());
      process.exit(1);
    }

    const data = await response.json();
    let models = data.data;

    // Apply filters
    if (options.search) {
      models = models.filter(m => 
        m.name.toLowerCase().includes(options.search) ||
        m.id.toLowerCase().includes(options.search)
      );
    }

    if (options.provider) {
      models = models.filter(m => 
        m.id.toLowerCase().startsWith(options.provider + '/')
      );
    }

    if (options.free) {
      models = models.filter(m => 
        m.pricing?.prompt === '0' && m.pricing?.completion === '0'
      );
    }

    if (options.tools) {
      models = models.filter(m => 
        m.supported_parameters?.includes('tools')
      );
    }

    if (options.json) {
      console.log(JSON.stringify(models, null, 2));
      return;
    }

    console.log(`\nFound ${models.length} models:\n`);
    console.log('ID'.padEnd(50) + 'Name'.padEnd(35) + 'Context');
    console.log('-'.repeat(100));

    for (const model of models.slice(0, 50)) {
      const id = model.id.substring(0, 48);
      const name = (model.name || model.id.split('/')[1] || '').substring(0, 33);
      const context = model.context_length ? (model.context_length / 1000).toFixed(0) + 'k' : 'N/A';
      console.log(id.padEnd(50) + name.padEnd(35) + context);
    }

    if (models.length > 50) {
      console.log(`\n... and ${models.length - 50} more models`);
      console.log('Use --json=true to see all models');
    }

    console.log('\n--- Pricing Sample ---');
    const sampleModels = models.slice(0, 5);
    for (const model of sampleModels) {
      if (model.pricing) {
        console.log(`\n${model.id}:`);
        console.log(`  Prompt: $${parseFloat(model.pricing.prompt || 0).toFixed(6)}/token`);
        console.log(`  Completion: $${parseFloat(model.pricing.completion || 0).toFixed(6)}/token`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

const options = parseArgs();
listModels(options);
