import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { ShoppingCartWithShipping } from "@/types";
import {
  CreateAddressInput,
  UpdateDeleteAddressInput,
} from "@/lib/validation/cart";
import { getErrorFromAPI } from "../format";

interface CartState {
  data: ShoppingCartWithShipping | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk to fetch cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await fetch("/api/cart");
  if (!response.ok) {
    const message = await getErrorFromAPI(response, "Failed to fetch cart");
    throw new Error(message);
  }
  const data: ShoppingCartWithShipping = await response.json();

  return { ...data, shipping: data.shipping || [] };
});

/**
 * Async thunk to update cart quantity of a product
 * if quantity is not provided, increments the quantity by 1
 */
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, quantity }: { productId: string; quantity?: number }) => {
    const response = await fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) {
      const message = await getErrorFromAPI(response, "Failed to update cart");
      throw new Error(message);
    }
    const data: ShoppingCartWithShipping = await response.json();

    return data;
  }
);

// Async thunk to add shipping address in the cart
export const addShippingAddress = createAsyncThunk(
  "cart/addShippingAddress",
  async (input: CreateAddressInput) => {
    const response = await fetch("/api/cart/shipping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const message = await getErrorFromAPI(
        response,
        "Failed to add shipping address"
      );
      throw new Error(message);
    }
    const data: ShoppingCartWithShipping = await response.json();

    return data;
  }
);

// Async thunk to select or delete shipping address in the cart
export const selectOrDeleteShippingAddress = createAsyncThunk(
  "cart/selectOrDeleteShippingAddress",
  async (
    input: UpdateDeleteAddressInput & { operation: "select" | "delete" }
  ) => {
    const { operation, ...rest } = input;
    const response = await fetch(`/api/cart/shipping?operation=${operation}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rest),
    });
    if (!response.ok) {
      const message = await getErrorFromAPI(
        response,
        "Failed to select shipping address"
      );
      throw new Error(message);
    }
    const data: ShoppingCartWithShipping = await response.json();

    return data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setInitialCart: (
      state,
      action: PayloadAction<ShoppingCartWithShipping | null>
    ) => {
      state.data = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<ShoppingCartWithShipping>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCartQuantity.fulfilled,
        (state, action: PayloadAction<ShoppingCartWithShipping>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update cart quantity";
      })
      .addCase(addShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addShippingAddress.fulfilled,
        (state, action: PayloadAction<ShoppingCartWithShipping>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(addShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add shipping address";
      })
      .addCase(selectOrDeleteShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        selectOrDeleteShippingAddress.fulfilled,
        (state, action: PayloadAction<ShoppingCartWithShipping>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(selectOrDeleteShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to select or delete shipping address";
      });
  },
});

export const { setInitialCart } = cartSlice.actions;
export default cartSlice.reducer;
