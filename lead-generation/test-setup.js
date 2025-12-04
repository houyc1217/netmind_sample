/**
 * Test Setup Script
 * Verifies that the lead generation module is properly configured
 */

import config from './config/index.js';
import Logger from './utils/logger.js';

const logger = new Logger('Setup');

async function testSetup() {
  console.log('=== Lead Generation Module - Setup Test ===\n');

  try {
    // Test 1: Configuration
    logger.info('Testing configuration...');
    console.log('✓ Apollo API Key:', config.apolloApiKey ? 'Configured' : 'Missing');
    console.log('✓ Netmind API Token:', config.netmindApiToken ? 'Configured' : 'Missing');
    console.log('✓ Rate Limit:', `${config.rateLimit} requests/minute`);
    console.log('✓ Apollo Direct URL:', config.apolloDirectUrl);

    if (!config.apolloApiKey || !config.netmindApiToken) {
      throw new Error('Missing required API credentials. Please check your .env file.');
    }

    // Test 2: Modules
    logger.info('\nTesting module imports...');
    const { search, enrichment, contacts, outreach, workflow } = await import('./index.js');
    console.log('✓ Search module loaded');
    console.log('✓ Enrichment module loaded');
    console.log('✓ Contacts module loaded');
    console.log('✓ Outreach module loaded');
    console.log('✓ Workflow module loaded');

    // Test 3: API Connection (optional - commented to avoid credit usage)
    /*
    logger.info('\nTesting API connection...');
    const testResult = await search.searchPeople({
      person_locations: ['San Francisco'],
      per_page: 1
    });

    if (testResult.success) {
      console.log('✓ API connection successful');
      console.log(`✓ Test search returned ${testResult.data.length} result(s)`);
    } else {
      console.log('✗ API connection failed:', testResult.error);
    }
    */

    logger.success('\n=== Setup Complete! ===');
    console.log('\nYou can now use the lead generation module.');
    console.log('Try running: npm run example:search\n');

  } catch (error) {
    logger.error('Setup test failed', error);
    console.log('\nPlease check:');
    console.log('1. .env file exists with valid credentials');
    console.log('2. npm install completed successfully');
    console.log('3. API keys have correct permissions\n');
    process.exit(1);
  }
}

testSetup();
