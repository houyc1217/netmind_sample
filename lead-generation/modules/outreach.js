import apiClient from '../utils/api-client.js';
import Logger from '../utils/logger.js';

const logger = new Logger('OutreachModule');

/**
 * Outreach Automation Module
 * Handles sequences, tasks, and outreach campaigns
 */
class OutreachModule {
  /**
   * Search for sequences in your Apollo account
   * @param {Object} filters - Search filters
   * @param {string} filters.q_name - Sequence name keyword
   * @param {number} filters.page - Page number
   * @param {number} filters.per_page - Results per page
   * @returns {Promise<Object>} Search results
   */
  async searchSequences(filters = {}) {
    try {
      logger.info('Searching sequences', filters);

      const params = {
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        ...filters
      };

      const response = await apiClient.get('/emailer_campaigns/search', params);

      logger.success(`Found ${response.emailer_campaigns?.length || 0} sequences`);

      return {
        success: true,
        data: response.emailer_campaigns || [],
        pagination: response.pagination || {}
      };
    } catch (error) {
      logger.error('Failed to search sequences', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Add contacts to a sequence
   * @param {string} sequenceId - Sequence ID
   * @param {string[]} contactIds - Array of contact IDs
   * @param {string} emailAccountId - Email account ID for sending
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Result
   */
  async addContactsToSequence(sequenceId, contactIds, emailAccountId, options = {}) {
    try {
      logger.info('Adding contacts to sequence', {
        sequenceId,
        contactCount: contactIds.length
      });

      const params = {
        emailer_campaign_id: sequenceId,
        contact_ids: contactIds,
        send_email_from_email_account_id: emailAccountId,
        sequence_no_email: options.allowNoEmail || false,
        sequence_unverified_email: options.allowUnverifiedEmail || false,
        sequence_job_change: options.allowJobChange || false,
        sequence_active_in_other_campaigns: options.allowActiveInOther || false,
        sequence_finished_in_other_campaigns: options.allowFinishedInOther || false,
        ...(options.userId && { user_id: options.userId })
      };

      const response = await apiClient.post(`/emailer_campaigns/${sequenceId}/add_contact_ids`, params);

      logger.success(`Successfully added ${contactIds.length} contacts to sequence`);

      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('Failed to add contacts to sequence', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Create a task for follow-up
   * @param {Object} taskData - Task information
   * @param {string} taskData.user_id - Task owner user ID
   * @param {string[]} taskData.contact_ids - Contact IDs
   * @param {string} taskData.priority - Priority (high/medium/low)
   * @param {string} taskData.due_at - Due date (ISO 8601 format)
   * @param {string} taskData.type - Task type (call, outreach_manual_email, etc.)
   * @param {string} taskData.note - Task note/description
   * @returns {Promise<Object>} Created task
   */
  async createTask(taskData) {
    try {
      logger.info('Creating task', {
        type: taskData.type,
        contactCount: taskData.contact_ids.length
      });

      const params = {
        user_id: taskData.user_id,
        contact_ids: taskData.contact_ids,
        priority: taskData.priority || 'medium',
        due_at: taskData.due_at,
        type: taskData.type,
        status: 'scheduled',
        ...(taskData.note && { note: taskData.note })
      };

      const response = await apiClient.post('/tasks', params);

      logger.success('Task created successfully');

      return {
        success: true,
        data: response
      };
    } catch (error) {
      logger.error('Failed to create task', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Search for tasks
   * @param {Object} filters - Search filters
   * @param {string} filters.sort_by_field - Sort field (task_due_at, task_priority)
   * @param {number} filters.page - Page number
   * @param {number} filters.per_page - Results per page
   * @returns {Promise<Object>} Search results
   */
  async searchTasks(filters = {}) {
    try {
      logger.info('Searching tasks', filters);

      const params = {
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        ...filters
      };

      const response = await apiClient.post('/tasks/search', params);

      logger.success(`Found ${response.tasks?.length || 0} tasks`);

      return {
        success: true,
        data: response.tasks || [],
        pagination: response.pagination || {}
      };
    } catch (error) {
      logger.error('Failed to search tasks', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}

export default new OutreachModule();
