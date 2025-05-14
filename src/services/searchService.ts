/**
 * Search Service
 * 
 * This file re-exports the modular search service components.
 * The actual implementation has been split into smaller, more maintainable files
 * in the search directory.
 */

// Re-export everything from the search module
export * from './search';

// For backward compatibility
import { commands } from './search/commands';
export { commands };
