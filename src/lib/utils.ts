import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}
