import { legacy_createStore as createStore, StoreEnhancer } from 'redux';
import { rootReducer, RootState } from './rootReducer';

// Extend Window interface for Redux DevTools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer;
  }
}

// Create the Redux store with DevTools support
const enhancer =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

// Store factory function for SSR compatibility
export const initializeStore = () => createStore(rootReducer, undefined, enhancer);

// Create and export the store instance
export const store = initializeStore();

// Export types for TypeScript
export type AppDispatch = typeof store.dispatch;
export type { RootState };
