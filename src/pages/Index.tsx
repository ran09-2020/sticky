import { useEffect, useState } from 'react';

// Pre-generation placeholder. A freshly provisioned project renders this until the agent
// replaces the file, so it must read as "still building" — never as a finished site.

const STATUS_LINES = [
	'Setting up your preview…',
	'Almost ready…',
	'Warming things up…',
	'Syncing project files…',
];

const STATUS_INTERVAL_MS = 3500;

export default function Index() {
	const [currentLine, setCurrentLine] = useState(0);

	useEffect(() => {
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (media.matches) {
			return;
		}

		const interval = setInterval(() => {
			setCurrentLine((prev) => (prev + 1) % STATUS_LINES.length);
		}, STATUS_INTERVAL_MS);
		return () => clearInterval(interval);
	}, []);

	return (
		<div
			className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center overflow-hidden relative font-sans"
			role="status"
			aria-label="Loading preview"
		>
			<div className="w-48 flex flex-col gap-2.5 mb-7" aria-hidden="true">
				<div className="h-2 rounded-md bg-[#E8E6E3] skeleton-block" style={{ animationDelay: '0ms' }} />
				<div className="flex gap-2.5">
					<div className="flex-1 h-14 rounded-md bg-[#E8E6E3] skeleton-block" style={{ animationDelay: '180ms' }} />
					<div className="flex-1 h-14 rounded-md bg-[#E8E6E3] skeleton-block" style={{ animationDelay: '360ms' }} />
				</div>
				<div className="h-10 rounded-md bg-[#E8E6E3] skeleton-block" style={{ animationDelay: '540ms' }} />
			</div>
			<p key={currentLine} className="status-text text-sm text-[#8a8a8a]" aria-hidden="true">
				{STATUS_LINES[currentLine]}
			</p>
			<style>{`
				@keyframes skeletonAssemble {
					0% { opacity: 0; transform: translateY(6px); }
					12% { opacity: 1; transform: translateY(0); }
					75% { opacity: 1; transform: translateY(0); }
					88% { opacity: 0; transform: translateY(6px); }
					100% { opacity: 0; transform: translateY(6px); }
				}
				@keyframes statusFade {
					from { opacity: 0; transform: translateY(4px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.skeleton-block {
					opacity: 0;
					animation: skeletonAssemble 4s ease-out infinite;
				}
				.status-text {
					animation: statusFade 0.5s ease-out;
				}
				@media (prefers-reduced-motion: reduce) {
					.skeleton-block {
						opacity: 1;
						animation: none;
						transform: none;
					}
					.status-text {
						animation: none;
					}
				}
			`}</style>
		</div>
	);
}
