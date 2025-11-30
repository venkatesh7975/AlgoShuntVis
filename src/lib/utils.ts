import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let idCounter = 0;
export function uniqueId(prefix: string = 'id'): string {
  idCounter += 1;
  return `${prefix}${idCounter}`;
}
