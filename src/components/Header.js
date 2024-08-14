import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<nav>
			<ul>
				{/* <li>
					<Link to='/login' className='nav-link'>
						Log In
					</Link>
				</li> */}
				<li>
					<Link to='/vote' className='nav-link'>
						Vote
					</Link>
				</li>
				<li>
					<Link to='/results' className='nav-link'>
						Results
					</Link>
				</li>
				<li>
					<Link to='/' className='nav-link'>
						Log Out
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Header;
