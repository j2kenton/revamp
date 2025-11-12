// 😁 Excuse the naming here. I admit that my point may be just a tiny bit subjective but I have Josh Comeau on my side so there! 🤪
import {
  legacy_createStore as classicTimelessOriginalAndStillTheBestPatternCreateStore,
  StoreEnhancer,
  Reducer,
  AnyAction,
} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { rootReducer, RootState } from './rootReducer';

// Extend Window interface for Redux DevTools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer;
  }
}

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter', 'auth'], // Specify which reducers to persist
  // blacklist: [], // Specify which reducers NOT to persist
};

// Wrap the root reducer with persistReducer
// Double type assertion needed due to redux-persist TypeScript limitations with combineReducers
const persistedReducer = persistReducer(
  persistConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootReducer as any,
) as unknown as Reducer<RootState, AnyAction>;

// Create the Redux store with DevTools support (development only)
const enhancer =
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' &&
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

// Store factory function for SSR compatibility.
// See comment on first line of this file 😏
export const initializeStore = () =>
  classicTimelessOriginalAndStillTheBestPatternCreateStore(
    persistedReducer,
    undefined,
    enhancer,
  );

// Create and export the store instance
export const store = initializeStore();

// Create and export the persistor
export const persistor = persistStore(store);

// Export types for TypeScript
export type AppDispatch = typeof store.dispatch;
export type { RootState };
