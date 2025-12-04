import apiClient from '../utils/api-client.js';
import Logger from '../utils/logger.js';

const logger = new Logger('EnrichmentModule');

/**
 * Lead Enrichment Module
 * Handles enriching people and organization data
 */
class EnrichmentModule {
  /**
   * Enrich a single person's data
   * @param {Object} personData - Person identification data
   * @param {string} personData.email - Email address
   * @param {string} personData.first_name - First name
   * @param {string} personData.last_name - Last name
   * @param {string} personData.domain - Company domain
   * @param {string} personData.linkedin_url - LinkedIn URL
   * @param {boolean} revealPersonalEmails - Reveal personal emails (costs credits)
   * @param {boolean} revealPhoneNumber - Reveal phone numbers (costs credits)
   * @returns {Promise<Object>} Enriched person data
   */
  async enrichPerson(personData, revealPersonalEmails = false, revealPhoneNumber = false) {
    try {
      logger.info('Enriching person data', {
        identifier: personData.email || personData.linkedin_url || `${personData.first_name} ${personData.last_name}`
      });

      const params = {
        ...personData,
        reveal_personal_emails: revealPersonalEmails,
        reveal_phone_number: revealPhoneNumber
      };

      const response = await apiClient.get('/people/match', params);

      if (response.person) {
        logger.success('Person enriched successfully', {
          id: response.person.id,
          name: response.person.name
        });
      } else {
        logger.warn('No person found for enrichment');
      }

      return {
        success: true,
        data: response.person || null
      };
    } catch (error) {
      logger.error('Failed to enrich person', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Enrich multiple people in bulk (up to 10)
   * @param {Array<Object>} peopleData - Array of person identification data
   * @param {boolean} revealPersonalEmails - Reveal personal emails (costs credits)
   * @param {boolean} revealPhoneNumber - Reveal phone numbers (costs credits)
   * @returns {Promise<Object>} Enriched people data
   */
  async enrichPeopleBulk(peopleData, revealPersonalEmails = false, revealPhoneNumber = false) {
    try {
      if (peopleData.length > 10) {
        throw new Error('Bulk enrichment supports maximum 10 people per request');
      }

      logger.info(`Enriching ${peopleData.length} people in bulk`);

      const params = {
        details: peopleData,
        reveal_personal_emails: revealPersonalEmails,
        reveal_phone_number: revealPhoneNumber
      };

      const response = await apiClient.post('/people/bulk_match', params);

      const successCount = response.matches?.filter(m => m.person).length || 0;
      logger.success(`Successfully enriched ${successCount}/${peopleData.length} people`);

      return {
        success: true,
        data: response.matches || []
      };
    } catch (error) {
      logger.error('Failed to enrich people in bulk', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Enrich organization data
   * @param {string} domain - Company domain
   * @returns {Promise<Object>} Enriched organization data
   */
  async enrichOrganization(domain) {
    try {
      logger.info('Enriching organization data', { domain });

      const response = await apiClient.get('/organizations/enrich', { domain });

      if (response.organization) {
        logger.success('Organization enriched successfully', {
          id: response.organization.id,
          name: response.organization.name
        });
      } else {
        logger.warn('No organization found for enrichment');
      }

      return {
        success: true,
        data: response.organization || null
      };
    } catch (error) {
      logger.error('Failed to enrich organization', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Enrich multiple organizations in bulk (up to 10)
   * @param {string[]} domains - Array of company domains
   * @returns {Promise<Object>} Enriched organizations data
   */
  async enrichOrganizationsBulk(domains) {
    try {
      if (domains.length > 10) {
        throw new Error('Bulk enrichment supports maximum 10 organizations per request');
      }

      logger.info(`Enriching ${domains.length} organizations in bulk`);

      const params = { domains };
      const response = await apiClient.post('/organizations/bulk_enrich', params);

      const successCount = response.organizations?.filter(o => o).length || 0;
      logger.success(`Successfully enriched ${successCount}/${domains.length} organizations`);

      return {
        success: true,
        data: response.organizations || []
      };
    } catch (error) {
      logger.error('Failed to enrich organizations in bulk', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}

export default new EnrichmentModule();
