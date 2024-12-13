"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  increment,
  decrement,
  incrementByAmount,
} from "@/lib/redux/exampleSlice";
import { Button } from "../ui/button";

const Counter = (): JSX.Element => {
  const value = useSelector((state: RootState) => state.example.value);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-2 bg-slate-300 rounded-lg text-lg font-semibold">
      <h2 className="text-3xl font-bold">Redux Toolkit Example</h2>
      <p>Value: {value}</p>
      <Button
        onClick={() => dispatch(increment())}
        className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 active:bg-red-700"
      >
        + Increment
      </Button>
      <Button
        onClick={() => dispatch(decrement())}
        className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 active:bg-red-700"
      >
        - Decrement
      </Button>
      <Button
        onClick={() => dispatch(incrementByAmount(5))}
        className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 active:bg-red-700"
      >
        Increment by 5
      </Button>
    </div>
  );
};

export default Counter;
