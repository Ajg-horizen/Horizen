import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './dashboard.css'

/**
 * Rod-layout for /dashboard (internt værktøj).
 *
 * BEVIDST selvstændigt: /dashboard ligger uden for (frontend)-gruppen og har sit
 * eget <html>/<body> + sin egen stylesheet (./dashboard.css). Det arver derfor
 * hverken sitets header/footer eller det offentlige tema. Adgang gates i
 * src/proxy.ts (login med Sanity, kode som reserve), og siden holdes ude af søgning via
 * robots (index:false her + disallow i src/app/robots.ts).
 */

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
})

// Internt værktøj — aldrig indekseret.
export const metadata: Metadata = {
	title: 'SEO-overblik · Horizen',
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: { index: false, follow: false },
	},
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang="da"
			className={`${inter.variable} antialiased`}
			suppressHydrationWarning
		>
			<head>
				{/* Lys/mørk tilstand sættes før første tegning, så siden ikke blinker.
				    Valget huskes pr. browser (ThemeToggle i DashboardShell); mørk er standard. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `var t='dark';try{if(localStorage.getItem('dash-theme')==='light')t='light'}catch(e){}document.documentElement.dataset.theme=t`,
					}}
				/>
			</head>
			<body className="bg-background text-foreground" style={{ margin: 0 }}>
				{children}
			</body>
		</html>
	)
}
