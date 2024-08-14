import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const navigate = useNavigate();
	const API_URL = process.env.REACT_APP_API_URL;

	const handleSignup = async (event) => {
		event.preventDefault();

		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		try {
			await axios.post(
				`${API_URL}/register`,
				{ username, password },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			alert('Signup successful! Please log in.');
			navigate('/login');
		} catch (error) {
			console.error('Error signing up:', error);
			alert('Failed to sign up');
		}
	};

	return (
		<div className='signup'>
			<h2>Sign Up</h2>
			<form onSubmit={handleSignup}>
				<div>
					<label>Username:</label>
					<input
						type='text'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Confirm Password:</label>
					<input
						type='password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>
				<button type='submit'>Sign Up</button>
			</form>
			<p>
				Already have an account? <a href='/login'>Log in</a>
			</p>
		</div>
	);
};

export default Signup;
