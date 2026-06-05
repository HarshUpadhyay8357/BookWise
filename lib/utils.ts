import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials=(name:string):string=>name
  .split(' ')
  .map((part)=>part[0])
  .join('')
  .toUpperCase()
  .slice(0,2);

export const getMediaUrl = (urlOrPath?: string) => {
  const raw = urlOrPath?.trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.replace(/\/+$/, '') ?? '';
  const path = raw.replace(/^\/+/, '');
  return base ? `${base}/${path}` : raw;
};
