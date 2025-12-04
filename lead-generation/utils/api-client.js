import axios from 'axios';
import config from '../config/index.js';
import Logger from './logger.js';

const logger = new Logger('APIClient');

/**
 * API Client with error handling and retry logic
 * Provides a robust wrapper around Apollo.io API calls
 */
class APIClient {
  constructor() {
    this.baseURL = config.apolloDirectUrl;
    this.apiKey = config.apolloApiKey;
    this.rateLimit = config.rateLimit;
    this.lastRequestTime = 0;
  }

  /**
   * Rate limiting to avoid hitting API limits
   */
  async _rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = (60 * 1000) / this.rateLimit; // Convert rate limit to ms interval

    if (timeSinceLastRequest < minInterval) {
      const delay = minInterval - timeSinceLastRequest;
      logger.debug(`Rate limiting: waiting ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Make API request with error handling and retry logic
   */
  async request(method, endpoint, data = null, retries = 3) {
    await this._rateLimit();

    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': this.apiKey
      }
    };

    if (data) {
      if (method === 'GET') {
        config.params = data;
      } else {
        config.data = data;
      }
    }

    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        logger.debug(`API Request [${method}] ${endpoint}`, attempt > 0 ? { attempt: attempt + 1 } : null);
        const response = await axios(config);
        return response.data;
      } catch (error) {
        lastError = error;

        // Don't retry on client errors (4xx)
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          logger.error(`API client error [${error.response.status}]: ${endpoint}`, error);
          throw error;
        }

        // Retry on server errors (5xx) or network errors
        if (attempt < retries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          logger.warn(`API request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`, {
            endpoint,
            error: error.message
          });
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    logger.error(`API request failed after ${retries} attempts: ${endpoint}`, lastError);
    throw lastError;
  }

  // Convenience methods
  async get(endpoint, params = null) {
    return this.request('GET', endpoint, params);
  }

  async post(endpoint, data = null) {
    return this.request('POST', endpoint, data);
  }

  async put(endpoint, data = null) {
    return this.request('PUT', endpoint, data);
  }
}

export default new APIClient();
