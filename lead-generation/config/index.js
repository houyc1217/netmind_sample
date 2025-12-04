import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

/**
 * Configuration module for lead generation system
 * Centralizes all environment-based configuration
 */
class Config {
  constructor() {
    this.validateConfig();
  }

  // Apollo.io API Configuration
  get apolloApiKey() {
    return process.env.APOLLO_API_KEY;
  }

  get netmindApiToken() {
    return process.env.NETMIND_API_TOKEN;
  }

  // MCP Server Configuration
  get mcpServerUrl() {
    return process.env.MCP_SERVER_URL || 'https://mcp.netmind.ai/sse';
  }

  get apolloApiUrl() {
    return `${this.mcpServerUrl}/${this.netmindApiToken}/apollo-io/sse?APOLLO_API_KEY=${this.apolloApiKey}`;
  }

  // Apollo API Direct URL (fallback)
  get apolloDirectUrl() {
    return 'https://api.apollo.io/v1';
  }

  // Optional Configuration
  get webhookUrl() {
    return process.env.WEBHOOK_URL || '';
  }

  get rateLimit() {
    return parseInt(process.env.RATE_LIMIT) || 10;
  }

  // Validate required configuration
  validateConfig() {
    const required = ['APOLLO_API_KEY', 'NETMIND_API_TOKEN'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

export default new Config();
