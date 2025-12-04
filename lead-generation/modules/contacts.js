import apiClient from '../utils/api-client.js';
import Logger from '../utils/logger.js';

const logger = new Logger('ContactsModule');

/**
 * Contact Management Module
 * Handles creating and managing contacts and accounts
 */
class ContactsModule {
  /**
   * Create a new contact in Apollo
   * @param {Object} contactData - Contact information
   * @param {string} contactData.first_name - First name
   * @param {string} contactData.last_name - Last name
   * @param {string} contactData.email - Email address
   * @param {string} contactData.title - Job title
   * @param {string} contactData.organization_name - Company name
   * @param {string} contactData.website_url - Company website
   * @param {string[]} contactData.label_names - Lists to add contact to
   * @returns {Promise<Object>} Created contact
   */
  async createContact(contactData) {
    try {
      logger.info('Creating contact', {
        name: `${contactData.first_name} ${contactData.last_name}`,
        email: contactData.email
      });

      const response = await apiClient.post('/contacts', contactData);

      if (response.contact) {
        logger.success('Contact created successfully', {
          id: response.contact.id,
          name: response.contact.name
        });
      }

      return {
        success: true,
        data: response.contact || null
      };
    } catch (error) {
      logger.error('Failed to create contact', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Update an existing contact
   * @param {string} contactId - Contact ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated contact
   */
  async updateContact(contactId, updates) {
    try {
      logger.info('Updating contact', { contactId });

      const response = await apiClient.put(`/contacts/${contactId}`, updates);

      logger.success('Contact updated successfully');

      return {
        success: true,
        data: response.contact || null
      };
    } catch (error) {
      logger.error('Failed to update contact', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Search for contacts in your Apollo account
   * @param {Object} filters - Search filters
   * @param {string} filters.q_keywords - Keywords (name, title, email)
   * @param {string[]} filters.contact_stage_ids - Contact stages
   * @param {number} filters.page - Page number
   * @param {number} filters.per_page - Results per page
   * @returns {Promise<Object>} Search results
   */
  async searchContacts(filters = {}) {
    try {
      logger.info('Searching contacts', filters);

      const params = {
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        ...filters
      };

      const response = await apiClient.post('/contacts/search', params);

      logger.success(`Found ${response.contacts?.length || 0} contacts`);

      return {
        success: true,
        data: response.contacts || [],
        pagination: response.pagination || {}
      };
    } catch (error) {
      logger.error('Failed to search contacts', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Create a new account (company) in Apollo
   * @param {Object} accountData - Account information
   * @param {string} accountData.name - Company name
   * @param {string} accountData.domain - Company domain
   * @param {string} accountData.phone - Phone number
   * @param {string} accountData.raw_address - Address
   * @returns {Promise<Object>} Created account
   */
  async createAccount(accountData) {
    try {
      logger.info('Creating account', { name: accountData.name });

      const response = await apiClient.post('/accounts', accountData);

      if (response.account) {
        logger.success('Account created successfully', {
          id: response.account.id,
          name: response.account.name
        });
      }

      return {
        success: true,
        data: response.account || null
      };
    } catch (error) {
      logger.error('Failed to create account', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Search for accounts in your Apollo instance
   * @param {Object} filters - Search filters
   * @param {string} filters.q_organization_name - Organization name keyword
   * @param {string[]} filters.account_stage_ids - Account stages
   * @param {number} filters.page - Page number
   * @param {number} filters.per_page - Results per page
   * @returns {Promise<Object>} Search results
   */
  async searchAccounts(filters = {}) {
    try {
      logger.info('Searching accounts', filters);

      const params = {
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        ...filters
      };

      const response = await apiClient.post('/accounts/search', params);

      logger.success(`Found ${response.accounts?.length || 0} accounts`);

      return {
        success: true,
        data: response.accounts || [],
        pagination: response.pagination || {}
      };
    } catch (error) {
      logger.error('Failed to search accounts', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}

export default new ContactsModule();
