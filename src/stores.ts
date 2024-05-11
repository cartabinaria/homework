import { writable } from "svelte/store";

export interface Ban {
  name: string;
  description: string;
  approved: number
}

export const bans = writable<Ban[]>([]);
