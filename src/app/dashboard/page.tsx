'use client';

import { logout } from '../actions/auth';

const DashboardPage = () => {
	return (
		<div>
			<p>Dashboard</p>
			<button onClick={logout}>Logout</button>
		</div>
	);
};

export default DashboardPage;
