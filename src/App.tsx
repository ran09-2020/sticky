/**
 * ⚠️ ROUTING RULES:
 * - Router is in main.tsx. Do NOT add another <BrowserRouter> here or anywhere.
 * - Use <Routes> + <Route> components ONLY. Do NOT use useRoutes().
 * - STATIC IMPORTS ONLY — no React.lazy() or dynamic import().
 * - Import from 'react-router' — NOT 'react-router-dom' (does not exist).
 */
import { Routes, Route, Navigate } from 'react-router';
import Board from '@/pages/Board';

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/public" replace />} />
			<Route path="/:slug" element={<Board />} />
		</Routes>
	);
}
