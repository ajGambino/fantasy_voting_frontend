import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Results = () => {
	const [results, setResults] = useState([]);

	useEffect(() => {
		const API_URL = process.env.REACT_APP_API_URL;
		axios
			.get(`${API_URL}/results`)
			.then((response) => {
				setResults(response.data);
			})
			.catch((error) => console.error('Error fetching results:', error));
	}, []);

	return (
		<div className='results'>
			<h1>Voting Results</h1>

			<table border='1' style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr>
						<th>Setting</th>
						<th>Option</th>
						<th>Pref.</th>
						<th>Would</th>
						<th>A. Not</th>
						<th>Yes</th>
						<th>No</th>
						<th>Cont.</th>
						<th>FA</th>
					</tr>
				</thead>
				<tbody>
					{results.map((question, index) => (
						<React.Fragment key={index}>
							{question.options.map((option, idx) => (
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
									<td>
										{option.option_text.toLowerCase() === 'yes'
											? option.votes?.yes || 0
											: ''}
									</td>
									<td>
										{option.option_text.toLowerCase() === 'no'
											? option.votes?.no || 0
											: ''}
									</td>
									<td>
										{option.option_text.toLowerCase() === 'continuous'
											? option.votes?.continuous || 0
											: ''}
									</td>
									<td>
										{option.option_text.toLowerCase() === 'fa period'
											? option.votes?.['fa period'] || 0
											: ''}
									</td>
								</tr>
							))}
						</React.Fragment>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Results;
