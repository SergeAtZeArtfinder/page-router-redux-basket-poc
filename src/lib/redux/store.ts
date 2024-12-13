import { useMemo } from "react";

import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import exampleReducer from "./exampleSlice";

let store;

export function initializeStore(preloadedState?: PreloadedState<RootState>) {
  let _store =
    store ??
    configureStore({
      reducer: {
        example: exampleReducer,
      },
      preloadedState,
    });

  // After navigating to a page with an initial Redux state, merge that state with the current state in the store
  if (preloadedState && store) {
    _store = configureStore({
      reducer: {
        example: exampleReducer,
      },
      preloadedState: {
        ...store.getState(),
        ...preloadedState, // the server fetched state will override the client state
        // IF we want client state to override server state, we can swap the order of the spread operators
      },
    });
    store = _store;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}

export function useStore(initialState: PreloadedState<RootState>) {
  const storeMemo = useMemo(
    () => initializeStore(initialState),
    [initialState]
  );
  return storeMemo;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;