import { useMemo } from "react";

import {
  configureStore,
  EnhancedStore,
  Dispatch,
  PayloadAction,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import productsSlice from "./productsSlice";
import locationSlice from "./locationSlice";
import cartSlice from "./cartSlice";

type ReduxState = {
  products: ReturnType<typeof productsSlice>;
  cart: ReturnType<typeof cartSlice>;
  location: ReturnType<typeof locationSlice>;
};
let store: EnhancedStore<ReduxState>;

export function initializeStore(preloadedState?: RootState) {
  let _store =
    store ??
    configureStore({
      reducer: {
        products: productsSlice,
        cart: cartSlice,
        location: locationSlice,
      },
      preloadedState,
    });

  // After navigating to a page with an initial Redux state, merge that state with the current state in the store
  if (preloadedState && store) {
    _store = configureStore({
      reducer: {
        products: productsSlice,
        cart: cartSlice,
        location: locationSlice,
      },
      preloadedState: {
        ...(store.getState() as object),
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

export function useStore(initialState?: RootState) {
  const storeMemo = useMemo(
    () => initializeStore(initialState),
    [initialState]
  );
  return storeMemo;
}

export type RootState = ReturnType<typeof store.getState>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppDispatch = Dispatch<PayloadAction<any>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAppDispatch = (): Dispatch<any> => useDispatch<AppDispatch>();
