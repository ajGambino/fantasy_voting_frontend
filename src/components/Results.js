import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Results = () => {
	const [results, setResults] = useState([]);

	useEffect(() => {
		axios
			.get('/api/results')
			.then((response) => setResults(response.data))
			.catch((error) => console.error('Error fetching results:', error));
	}, []);

	return (
		<div>
			<h1>Voting Results</h1>
			{results.map((question, index) => (
				<div key={index}>
					<h2>{question.question_text}</h2>
					<ul>
						{question.options.map((option, idx) => (
							<li key={idx}>
								{option.option_text}:
								<ul>
									<li>Preferred: {option.votes.preferred || 0}</li>
									<li>Would do: {option.votes['would do'] || 0}</li>
									<li>Absolutely not: {option.votes['absolutely not'] || 0}</li>
								</ul>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default Results;
