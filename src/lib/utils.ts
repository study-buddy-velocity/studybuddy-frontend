import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface UserData {
  dob: string;
  name: string;
  phoneno: string;
  schoolName: string;
  class: string;
  subjects: string[];
  profileImage ?: string;
}

export function getFirstWord(name: string) {
  if (typeof name !== "string") return "";

  const words = name.trim().split(" ");
  return words.length > 1 ? words[0] : name;
}

export function capitalizeFirstLetter(name: string) {
  if (typeof name !== "string") return "";
  const letter = name.charAt(0).toUpperCase() + name.slice(1);
  return letter
}

export const subjectOptions = [
  "English",
  "Mathematics",
"Geometry",
  "Algebra",
  "Numerical",
  "Science",
"Chemistry",
  "Biology",
  "Physics",
  "Social Science", 
"Geography",
  "Economics",
  "Political Science",
  "History",
  "Computer Science",
  "Electronics",
  "Electricals",
  "Statistics"
];

export function getNonRepeatingValues(array1: string[], array2: string[]): string[] {
  const uniqueValues = new Set<string>();

  array1.forEach((value) => {
    if (!array2.includes(value)) {
      uniqueValues.add(value);
    }
  });

  array2.forEach((value) => {
    if (!array1.includes(value)) {
      uniqueValues.add(value);
    }
  });

  return Array.from(uniqueValues);
}

