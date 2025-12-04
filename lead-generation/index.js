/**
 * Lead Generation Module - Main Entry Point
 *
 * A modular, minimal lead generation system built on Apollo.io API
 * Following best practices for 2025:
 * - Modular architecture with clear separation of concerns
 * - API-first design with standardized interfaces
 * - Robust error handling and retry logic
 * - Rate limiting to respect API constraints
 * - Environment-based configuration
 */

// Core Modules
export { default as search } from './modules/search.js';
export { default as enrichment } from './modules/enrichment.js';
export { default as contacts } from './modules/contacts.js';
export { default as outreach } from './modules/outreach.js';

// Workflows
export { default as workflow } from './workflows/lead-workflow.js';

// Utilities
export { default as config } from './config/index.js';
export { default as Logger } from './utils/logger.js';
export { default as apiClient } from './utils/api-client.js';

/**
 * Quick Start Example:
 *
 * import { workflow } from './index.js';
 *
 * // Generate leads with a complete workflow
 * const results = await workflow.generateLeads({
 *   searchFilters: {
 *     person_titles: ['CTO', 'VP Engineering'],
 *     person_locations: ['San Francisco'],
 *   },
 *   addToLists: ['Tech Leads'],
 *   maxResults: 25
 * });
 *
 * console.log(`Created ${results.created} new contacts`);
 */

// Default export for convenience
import searchModule from './modules/search.js';
import enrichmentModule from './modules/enrichment.js';
import contactsModule from './modules/contacts.js';
import outreachModule from './modules/outreach.js';
import workflowModule from './workflows/lead-workflow.js';

export default {
  search: searchModule,
  enrichment: enrichmentModule,
  contacts: contactsModule,
  outreach: outreachModule,
  workflow: workflowModule
};
