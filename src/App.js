import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VoteForm from './components/VoteForm';
import Header from './components/Header';
import Results from './components/Results';
import './App.css';

const App = () => {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/vote' element={<VoteForm />} />{' '}
				<Route path='/results' element={<Results />} />
			</Routes>
		</Router>
	);
};

export default App;
