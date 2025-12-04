import search from '../modules/search.js';
import enrichment from '../modules/enrichment.js';
import contacts from '../modules/contacts.js';
import outreach from '../modules/outreach.js';
import Logger from '../utils/logger.js';

const logger = new Logger('LeadWorkflow');

/**
 * Lead Generation Workflow Orchestration
 * Combines multiple modules to create end-to-end lead generation workflows
 */
class LeadWorkflow {
  /**
   * Complete lead generation workflow:
   * 1. Search for leads based on criteria
   * 2. Enrich lead data
   * 3. Save as contacts in Apollo
   * 4. (Optional) Add to sequence or create tasks
   *
   * @param {Object} config - Workflow configuration
   * @param {Object} config.searchFilters - Search criteria
   * @param {boolean} config.enrichData - Whether to enrich data (costs credits)
   * @param {string[]} config.addToLists - Lists to add contacts to
   * @param {string} config.sequenceId - Optional: Sequence ID to add contacts to
   * @param {string} config.emailAccountId - Required if adding to sequence
   * @param {number} config.maxResults - Maximum number of leads to process
   * @returns {Promise<Object>} Workflow results
   */
  async generateLeads(config) {
    logger.info('Starting lead generation workflow', {
      maxResults: config.maxResults || 25
    });

    const results = {
      searched: 0,
      enriched: 0,
      created: 0,
      addedToSequence: 0,
      errors: []
    };

    try {
      // Step 1: Search for leads
      logger.info('Step 1: Searching for leads');
      const searchResult = await search.searchPeople({
        ...config.searchFilters,
        per_page: Math.min(config.maxResults || 25, 100)
      });

      if (!searchResult.success || !searchResult.data.length) {
        logger.warn('No leads found matching criteria');
        return results;
      }

      results.searched = searchResult.data.length;
      logger.success(`Found ${results.searched} potential leads`);

      // Step 2: Enrich data (optional, costs credits)
      let leadsToProcess = searchResult.data;

      if (config.enrichData) {
        logger.info('Step 2: Enriching lead data');
        const enrichedLeads = [];

        // Enrich in batches of 10 (API limit)
        for (let i = 0; i < leadsToProcess.length; i += 10) {
          const batch = leadsToProcess.slice(i, i + 10);
          const batchData = batch.map(lead => ({
            first_name: lead.first_name,
            last_name: lead.last_name,
            email: lead.email,
            organization_name: lead.organization?.name,
            linkedin_url: lead.linkedin_url
          }));

          const enrichResult = await enrichment.enrichPeopleBulk(batchData);
          if (enrichResult.success) {
            enrichedLeads.push(...enrichResult.data.map(m => m.person).filter(Boolean));
          }
        }

        results.enriched = enrichedLeads.length;
        leadsToProcess = enrichedLeads;
        logger.success(`Enriched ${results.enriched} leads`);
      }

      // Step 3: Create contacts in Apollo
      logger.info('Step 3: Creating contacts in Apollo');
      const createdContacts = [];

      for (const lead of leadsToProcess) {
        const contactData = {
          first_name: lead.first_name,
          last_name: lead.last_name,
          email: lead.email,
          title: lead.title,
          organization_name: lead.organization?.name || lead.organization_name,
          website_url: lead.organization?.website_url,
          ...(config.addToLists && { label_names: config.addToLists })
        };

        const createResult = await contacts.createContact(contactData);
        if (createResult.success && createResult.data) {
          createdContacts.push(createResult.data);
          results.created++;
        } else {
          results.errors.push({
            lead: `${lead.first_name} ${lead.last_name}`,
            error: createResult.error
          });
        }
      }

      logger.success(`Created ${results.created} contacts`);

      // Step 4: Add to sequence (optional)
      if (config.sequenceId && config.emailAccountId && createdContacts.length > 0) {
        logger.info('Step 4: Adding contacts to sequence');

        const contactIds = createdContacts.map(c => c.id);
        const sequenceResult = await outreach.addContactsToSequence(
          config.sequenceId,
          contactIds,
          config.emailAccountId
        );

        if (sequenceResult.success) {
          results.addedToSequence = contactIds.length;
          logger.success(`Added ${results.addedToSequence} contacts to sequence`);
        } else {
          results.errors.push({
            step: 'sequence',
            error: sequenceResult.error
          });
        }
      }

      logger.success('Lead generation workflow completed', results);
      return results;

    } catch (error) {
      logger.error('Lead generation workflow failed', error);
      return {
        ...results,
        error: error.message
      };
    }
  }

  /**
   * Quick workflow: Find and save decision makers
   */
  async findDecisionMakers(location = null, addToLists = ['Decision Makers'], maxResults = 25) {
    logger.info('Running decision makers workflow');

    return this.generateLeads({
      searchFilters: {
        person_titles: ['CEO', 'CTO', 'VP', 'Director'],
        person_seniorities: ['c_suite', 'vp', 'director'],
        ...(location && { person_locations: [location] })
      },
      enrichData: false, // Save credits
      addToLists,
      maxResults
    });
  }

  /**
   * Quick workflow: Find companies with job openings
   */
  async findHiringCompanies(jobTitle, location = null, maxResults = 25) {
    logger.info('Running hiring companies workflow');

    const orgResult = await search.searchOrganizations({
      q_organization_job_titles: [jobTitle],
      ...(location && { organization_locations: [location] }),
      per_page: maxResults
    });

    if (!orgResult.success) {
      return { error: orgResult.error };
    }

    logger.success(`Found ${orgResult.data.length} companies hiring for ${jobTitle}`);
    return {
      companies: orgResult.data,
      count: orgResult.data.length
    };
  }

  /**
   * Export leads to JSON file
   */
  async exportToJSON(leads, filename = 'leads-export.json') {
    const fs = await import('fs');
    const data = JSON.stringify(leads, null, 2);
    fs.default.writeFileSync(filename, data);
    logger.success(`Exported ${leads.length} leads to ${filename}`);
  }
}

export default new LeadWorkflow();
