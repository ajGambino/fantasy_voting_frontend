import React, { useState } from 'react';
import axios from 'axios';

const Draft = () => {
	const dates = [
		'August 25',
		'August 26',
		'August 27',
		'August 28',
		'August 29',
		'August 30',
		'August 31',
		'September 1',
		'September 2',
		'September 3',
		'September 4',
	];

	const API_URL = process.env.REACT_APP_API_URL;

	const initialState = dates.reduce((acc, date) => {
		acc[date] = 'unavailable';
		return acc;
	}, {});

	const [availability, setAvailability] = useState(initialState);

	const handleSelection = (date, status) => {
		setAvailability((prevState) => ({
			...prevState,
			[date]: status,
		}));
	};

	const handleSubmit = async () => {
		const token = localStorage.getItem('token');

		try {
			const response = await axios.post(
				`${API_URL}/availability`,
				{ availability },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log('Availability submitted successfully:', response.data);
			alert('Your availability has been submitted successfully!');
		} catch (error) {
			console.error('Error submitting availability:', error);
			alert(
				'There was an error submitting your availability. Please try again.'
			);
		}
	};

	return (
		<div style={styles.container}>
			<h2>Pick Your Draft Night Availability</h2>
			<div style={styles.flexContainer}>
				{dates.map((date) => (
					<div key={date} style={styles.flexItem}>
						<h3>{date}</h3>
						<div>
							<label>
								<input
									type='radio'
									value='available'
									checked={availability[date] === 'available'}
									onChange={() => handleSelection(date, 'available')}
								/>
								Available
							</label>
						</div>
						<div>
							<label>
								<input
									type='radio'
									value='maybe'
									checked={availability[date] === 'maybe'}
									onChange={() => handleSelection(date, 'maybe')}
								/>
								Maybe
							</label>
						</div>
						<div>
							<label>
								<input
									type='radio'
									value='unavailable'
									checked={availability[date] === 'unavailable'}
									onChange={() => handleSelection(date, 'unavailable')}
								/>
								Unavailable
							</label>
						</div>
					</div>
				))}
			</div>
			<button onClick={handleSubmit} style={styles.button}>
				Submit Availability
			</button>
		</div>
	);
};

const styles = {
	container: {
		padding: '20px',
		maxWidth: '100%',
		boxSizing: 'border-box',
	},
	flexContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
	},
	flexItem: {
		flex: '1 0 45%',
		border: '1px solid black',
		margin: '10px',
		padding: '10px',
		boxSizing: 'border-box',
	},
	button: {
		marginTop: '20px',
		padding: '10px 20px',
		backgroundColor: '#007bff',
		color: 'white',
		border: 'none',
		cursor: 'pointer',
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
};

export default Draft;
