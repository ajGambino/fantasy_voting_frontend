import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Results = () => {
	const [results, setResults] = useState([]);

	useEffect(() => {
		const API_URL = process.env.REACT_APP_API_URL;
		axios
			.get(`${API_URL}/results`)
			.then((response) => {
				console.log('Raw results data:', response.data);
				setResults(response.data);
			})
			.catch((error) => console.error('Error fetching results:', error));
	}, []);

	const normalizeText = (text) => {
		return text.replace('*', '').trim().toLowerCase();
	};

	const calculateTotalVotes = (votes) => {
		return Object.values(votes).reduce((sum, count) => sum + count, 0);
	};

	return (
		<div className='results'>
			<h1>Voting Results</h1>

			{/* Top Table for Preference Questions */}
			<table
				border='1'
				style={{
					width: '100%',
					borderCollapse: 'collapse',
					marginBottom: '20px',
				}}
			>
				<thead>
					<tr>
						<th>Setting</th>
						<th>Option</th>
						<th>Pref.</th>
						<th>Would</th>
						<th>A. Not</th>
					</tr>
				</thead>
				<tbody>
					{results.map((question, index) => {
						if (
							[
								'buy-in (2024)',
								'keepers (2025)',
								'schedule',
								'bench spots',
							].includes(normalizeText(question.question_text))
						) {
							return question.options.map((option, idx) => (
								<tr key={idx}>
									{idx === 0 && (
										<td rowSpan={question.options.length}>
											{question.question_text}
										</td>
									)}
									<td>{option.option_text}</td>
									<td>{option.votes?.preferred || 0}</td>
									<td>{option.votes?.['would do'] || 0}</td>
									<td>{option.votes?.['absolutely not'] || 0}</td>
								</tr>
							));
						}
						return null;
					})}
				</tbody>
			</table>

			{/* Bottom Table for Yes/No Questions and Waivers */}
			<table border='1' style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr>
						<th>Setting</th>
						<th>Option</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{results.map((question, index) => {
						if (
							![
								'buy-in (2024)',
								'keepers (2025)',
								'schedule',
								'bench spots',
							].includes(normalizeText(question.question_text))
						) {
							return question.options.map((option, idx) => {
								const totalVotes = calculateTotalVotes(option.votes);
								return (
									<tr key={idx}>
										{idx === 0 && (
											<td rowSpan={question.options.length}>
												{question.question_text}
											</td>
										)}
										<td>{option.option_text}</td>
										<td>{totalVotes}</td>
									</tr>
								);
							});
						}
						return null;
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Results;
