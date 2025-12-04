/**
 * Simple logging utility for the lead generation system
 * Provides consistent logging across all modules
 */
class Logger {
  constructor(moduleName) {
    this.moduleName = moduleName;
  }

  _formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}] [${this.moduleName}]`;

    if (data) {
      return `${prefix} ${message}\n${JSON.stringify(data, null, 2)}`;
    }
    return `${prefix} ${message}`;
  }

  info(message, data = null) {
    console.log(this._formatMessage('INFO', message, data));
  }

  success(message, data = null) {
    console.log(this._formatMessage('SUCCESS', message, data));
  }

  warn(message, data = null) {
    console.warn(this._formatMessage('WARN', message, data));
  }

  error(message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      ...(error.response?.data && { apiError: error.response.data })
    } : null;

    console.error(this._formatMessage('ERROR', message, errorData));
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this._formatMessage('DEBUG', message, data));
    }
  }
}

export default Logger;
