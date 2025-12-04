import apiClient from '../utils/api-client.js';
import Logger from '../utils/logger.js';

const logger = new Logger('SearchModule');

/**
 * Lead Search Module
 * Handles searching for people and organizations using Apollo.io API
 */
class SearchModule {
  /**
   * Search for people based on criteria
   * @param {Object} filters - Search filters
   * @param {string[]} filters.person_titles - Job titles
   * @param {string[]} filters.person_locations - Locations
   * @param {string[]} filters.person_seniorities - Seniority levels
   * @param {string[]} filters.organization_locations - Company locations
   * @param {string[]} filters.organization_num_employees_ranges - Employee count ranges
   * @param {number} filters.page - Page number (default: 1)
   * @param {number} filters.per_page - Results per page (default: 10)
   * @returns {Promise<Object>} Search results
   */
  async searchPeople(filters = {}) {
    try {
      logger.info('Searching for people with filters', filters);

      const params = {
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        ...filters
      };

      const response = await apiClient.post('/mixed_people/search', params);

      logger.success(`Found ${response.people?.length || 0} people`);

      return {
        success: true,
        data: response.people || [],
        pagination: response.pagination || {},
        breadcrumbs: response.breadcrumbs || []
      };
    } catch (error) {
      logger.error('Failed to search people', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Search for organizations based on criteria
   * @param {Object} filters - Search filters
   * @param {string[]} filters.organization_locations - Company locations
   * @param {string[]} filters.organization_num_employees_ranges - Employee count ranges
   * @param {Object} filters.revenue_range - Revenue range {min, max}
   * @param {string[]} filters.currently_using_any_of_technology_uids - Technologies
   * @param {string} filters.q_organization_name - Company name keyword
   * @param {number} filters.page - Page number (default: 1)
   * @param {number} filters.per_page - Results per page (default: 10)
   * @returns {Promise<Object>} Search results
   */
  async searchOrganizations(filters = {}) {
    try {
      logger.info('Searching for organizations with filters', filters);

      const params = {
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        ...filters
      };

      const response = await apiClient.post('/mixed_companies/search', params);

      logger.success(`Found ${response.organizations?.length || 0} organizations`);

      return {
        success: true,
        data: response.organizations || [],
        pagination: response.pagination || {},
        breadcrumbs: response.breadcrumbs || []
      };
    } catch (error) {
      logger.error('Failed to search organizations', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Quick search preset: Decision makers in tech companies
   */
  async searchTechDecisionMakers(location = null, page = 1) {
    return this.searchPeople({
      person_titles: ['CTO', 'VP Engineering', 'Director of Engineering'],
      person_seniorities: ['c_suite', 'vp', 'director'],
      currently_using_any_of_technology_uids: ['salesforce', 'hubspot'],
      ...(location && { person_locations: [location] }),
      page,
      per_page: 25
    });
  }

  /**
   * Quick search preset: Sales leaders
   */
  async searchSalesLeaders(location = null, page = 1) {
    return this.searchPeople({
      person_titles: ['VP Sales', 'Sales Director', 'Head of Sales'],
      person_seniorities: ['vp', 'director', 'head'],
      ...(location && { person_locations: [location] }),
      page,
      per_page: 25
    });
  }

  /**
   * Quick search preset: Growing startups
   */
  async searchGrowingStartups(location = null, page = 1) {
    return this.searchOrganizations({
      organization_num_employees_ranges: ['11,50', '51,200'],
      ...(location && { organization_locations: [location] }),
      page,
      per_page: 25
    });
  }
}

export default new SearchModule();
