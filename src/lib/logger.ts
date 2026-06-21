export const logger = {
  error: (message: string, ...optionalParams: unknown[]) => {
    // Suppress logs in test environment to keep output clean,
    // but retain them for production server and development diagnostics.
    if (process.env.NODE_ENV !== 'test') {
      console.error(message, ...optionalParams);
    }
  },
  warn: (message: string, ...optionalParams: unknown[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(message, ...optionalParams);
    }
  }
};
