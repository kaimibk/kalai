import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

try {
	const output = execSync('npx supabase status -o json', { encoding: 'utf-8' });
	const jsonStr = output.substring(output.indexOf('{'));
	const json = JSON.parse(jsonStr);
	const key = json.ANON_KEY || json.PUBLISHABLE_KEY;

	const envContent = `# Supabase API Settings (Local Development via Supabase CLI)
VITE_SUPABASE_URL=${json.API_URL || 'http://127.0.0.1:54321'}
VITE_SUPABASE_ANON_KEY=${key}
`;

	writeFileSync(envPath, envContent);
	console.log('✓ Successfully synced .env with local Supabase keys!');
} catch (e) {
	console.error('Failed to sync .env from Supabase status:', e.message);
}
