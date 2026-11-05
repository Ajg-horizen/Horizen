import 'server-only'
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './env'

/**
 * Server-only write-client. Må ALDRIG importeres i en client component.
 * Bruger SANITY_API_WRITE_TOKEN (uden NEXT_PUBLIC_-prefix), så tokenen kun
 * findes i serverens miljø. Kræver et Editor-token sat i .env.local OG i Vercel.
 */
export const writeClient = createClient({
	projectId,
	dataset,
	apiVersion,
	token: process.env.SANITY_API_WRITE_TOKEN,
	useCdn: false,
})
