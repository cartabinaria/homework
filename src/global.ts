import { serverURL } from './const';
import type { Ban } from './stores';

export async function getBans(): Promise<Ban[]> {
  try {
    const response = await fetch(serverURL + '/getBans', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Error fetching bans');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error while fetching /getBans:', error);
    return [];
  }
}
