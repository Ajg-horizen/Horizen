'use client'

import type { InboxItem } from './data'

/**
 * Primær knap "Opret ny opgave" øverst på dashboardet. Den åbner ikke et
 * vindue, men går til siden "Opgaver", hvor de aktive opgaver står, og lægger
 * et nyt opgavekort klar lige under dem (#v=opgaver&ny=1, se OpgaverPanel).
 */
export default function NewTaskButton({ items }: { items: InboxItem[] }) {
	return (
		<div className="flex items-center gap-3">
			<a
				href="#v=opgaver&ny=1"
				className="bg-foreground text-background inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-85"
			>
				<span aria-hidden className="text-base leading-none">
					+
				</span>
				Opret ny opgave
			</a>
			{items.length > 0 && (
				<a
					href="#v=opgaver"
					className="text-foreground/60 hover:text-foreground hidden text-sm font-medium underline underline-offset-2 sm:inline"
				>
					{items.length} {items.length === 1 ? 'åben opgave' : 'åbne opgaver'}
				</a>
			)}
		</div>
	)
}
