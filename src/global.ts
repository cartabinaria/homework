import type { Ban } from './stores';

const apiEndpoint = 'http://localhost:3000/api';

export async function getBans(): Promise<Ban[]> {
    const response = await fetch(`${apiEndpoint}/getBans`);
    if (!response.ok) throw new Error('Failed to fetch bans');
    return response.json();
}

export async function addBan(ban: Omit<Ban, 'approved'>): Promise<Ban> {
    const response = await fetch(`${apiEndpoint}/addBan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ban)
    });
    if (!response.ok) throw new Error('Failed to add ban');
    const data = await response.json();
    return data.ban;
}

export async function approveBan(name: string, description: string): Promise<Ban> {
    const response = await fetch(`${apiEndpoint}/approveBan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
    });
    if (!response.ok) throw new Error('Failed to approve ban');
    const data = await response.json();
    return data.ban;
}

export async function rejectBan(name: string, description: string): Promise<void> {
    const response = await fetch(`${apiEndpoint}/rejectBan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
    });
    if (!response.ok) throw new Error('Failed to reject ban');
}