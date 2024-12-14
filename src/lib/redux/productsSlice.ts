import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { Product } from "@/types";
import { getErrorFromAPI } from "../format";

interface ProductsState {
  data: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ skip, take }: { skip: number; take: number }) => {
    const response = await fetch(`/api/products?skip=${skip}&take=${take}`);
    if (!response.ok) {
      const message = await getErrorFromAPI(
        response,
        "Failed to fetch products"
      );
      throw new Error(message);
    }
    const data: Product[] = await response.json();

    return data;
  }
);

// Async thunk to fetch product details
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id: string) => {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      const message = await getErrorFromAPI(
        response,
        "Failed to fetch product details"
      );
      throw new Error(message);
    }
    const data: Product = await response.json();
    return data;
  }
);

// Async thunk to update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, product }: { id: string; product: Partial<Product> }) => {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const message = await getErrorFromAPI(
        response,
        "Failed to update product"
      );
      throw new Error(message);
    }
    const data: Product = await response.json();
    return data;
  }
);

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string) => {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const message = await getErrorFromAPI(
        response,
        "Failed to delete product"
      );
      throw new Error(message);
    }
    const data: { id: string } = await response.json();
    return data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setInitialProducts: (state, action: PayloadAction<Product[]>) => {
      state.data = action.payload;
    },
    setInitialProduct: (state, action: PayloadAction<Product>) => {
      let isFound = false;
      let newProducts = state.data.map((product) => {
        if (product.id === action.payload.id) {
          isFound = true;
          return action.payload;
        }
        return product;
      });
      if (!isFound) {
        newProducts = [...newProducts, action.payload];
      }

      state.data = newProducts;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        let isFound = false;
        let newProducts = state.data.map((product) => {
          if (product.id === action.payload.id) {
            isFound = true;
            return action.payload;
          }
          return product;
        });
        if (!isFound) {
          newProducts = [...newProducts, action.payload];
        }

        state.data = newProducts;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product details";
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.map((product) =>
          product.id === action.payload.id ? action.payload : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(
          (product) => product.id !== action.payload.id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export const { setInitialProducts, setInitialProduct } = productsSlice.actions;
export default productsSlice.reducer;
