import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const API_URL = process.env.REACT_APP_API_URL;

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post(`${API_URL}/login`, {
				username,
				password,
			});
			localStorage.setItem('token', response.data.access_token);
			alert('Login successful!');
			navigate('/vote');
		} catch (error) {
			console.error('Error logging in:', error);
			alert('Invalid credentials');
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
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
				<button type='submit'>Login</button>
			</form>
			<p>
				Don't have an account? <a href='/signup'>Sign up</a>
			</p>
		</div>
	);
};

export default Login;
