import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const logger = <D>(value: D) => {
  if (typeof window === "undefined") {
    console.log("SERVER SIDE: ", value);
  } else {
    console.log("CLIENT SIDE: ", value);
  }
};
