import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VoteForm = () => {
	const [questions, setQuestions] = useState([]);
	const [votes, setVotes] = useState({});
	const navigate = useNavigate();

	const API_URL = process.env.REACT_APP_API_URL;

	useEffect(() => {
		const token = localStorage.getItem('token');

		axios
			.get(`${API_URL}/questions`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setQuestions(response.data);

				const initialVotes = {};
				response.data.forEach((question) => {
					initialVotes[question.id] = {};
				});
				setVotes(initialVotes);
			})
			.catch((error) => console.error('Error fetching questions:', error));
	}, [API_URL]);

	const handleCheckboxChange = (
		questionId,
		optionId,
		optionText,
		isChecked
	) => {
		setVotes((prevVotes) => {
			const newVotes = { ...prevVotes };

			if (isChecked) {
				newVotes[questionId] = {};

				newVotes[questionId][optionId] = optionText.toLowerCase();
			} else {
				delete newVotes[questionId][optionId];
			}

			return newVotes;
		});
	};

	const handleVoteChange = (questionId, optionId, choice) => {
		setVotes((prevVotes) => {
			const newVotes = { ...prevVotes };

			newVotes[questionId][optionId] = choice;

			return newVotes;
		});
	};

	const validateVotes = () => {
		let valid = true;
		let validationErrors = [];

		// Define the options that cannot be selected as "Absolutely Not"
		const forbiddenAbsolutelyNot = [
			'$100*',
			'$100',
			'7*',
			'7',
			'1*',
			'1',
			'14 weeks, 6 playoff teams*',
			'14 weeks, 6 playoff teams',
		];

		Object.keys(votes).forEach((questionId) => {
			const choices = Object.values(votes[questionId]);
			const preferredCount = choices.filter(
				(choice) => choice === 'preferred'
			).length;
			const absolutelyNotCount = choices.filter(
				(choice) => choice === 'absolutely not'
			).length;

			// Prevent "Absolutely Not" for forbidden options
			Object.keys(votes[questionId]).forEach((optionId) => {
				if (
					votes[questionId][optionId] === 'absolutely not' &&
					forbiddenAbsolutelyNot.includes(
						questions
							.find((q) => q.id === parseInt(questionId))
							.options.find((o) => o.id === parseInt(optionId)).text
					)
				) {
					valid = false;
					validationErrors.push(
						`You cannot select "Absolutely Not" for ${
							questions
								.find((q) => q.id === parseInt(questionId))
								.options.find((o) => o.id === parseInt(optionId)).text
						}.`
					);
				}
			});

			if (choices.length === 0) {
				valid = false;
				validationErrors.push(
					`You must make a selection for Question ${questionId}.`
				);
			} else {
				if (preferredCount > 1) {
					valid = false;
					validationErrors.push(
						`You can only select "Preferred" once for Question ${questionId}.`
					);
				}

				if (absolutelyNotCount === choices.length) {
					valid = false;
					validationErrors.push(
						`You cannot select "Absolutely Not" for all options in Question ${questionId}.`
					);
				}
			}
		});

		const totalSelections = Object.values(votes).reduce(
			(total, current) => total + Object.keys(current).length,
			0
		);
		if (totalSelections < 17) {
			valid = false;
			validationErrors.push('You must make a selection for all questions.');
		}

		if (!valid) {
			alert(validationErrors.join('\n'));
		}

		return valid;
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!validateVotes()) {
			return;
		}

		const voteData = [];
		const token = localStorage.getItem('token');

		for (const questionId in votes) {
			for (const optionId in votes[questionId]) {
				voteData.push({
					option_id: optionId,
					choice: votes[questionId][optionId],
				});
			}
		}

		axios
			.post(
				`${API_URL}/vote`,
				{ votes: voteData },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			.then((response) => {
				alert('Votes submitted successfully!');
				navigate('/results');
			})
			.catch((error) => console.error('Error submitting votes:', error));
	};

	return (
		<div className='vote2'>
			<form onSubmit={handleSubmit}>
				<h1>Vote on League Settings</h1>
				<h3>Asterisk* denotes last years settings. </h3>
				<p>
					Waivers Continuous: All signings will be done in batches. Players
					remain on waiver continuously and thus are always subject to offers.
				</p>
				<p>
					FA period: All offers are processed after the league's specified
					waiver period. Players who are not claimed during the waiver process
					will be free agents and can be added on a first come, first served
					basis.
				</p>
				<p>
					2games per week: Top 5 scoring teams receive additional Win and bottom
					5 a Loss. 1game vs the league, 1 head to head matchup. So each week
					you can go 2-0, 1-1, or 0-2.
				</p>
				{questions.map((question) => (
					<div className='vote' key={question.id}>
						<h2>{question.text}</h2>
						{question.type === 'yes-no' || question.type === 'waivers' ? (
							<div>
								{question.options.map((option) => (
									<div key={option.id}>
										<label>
											<input
												type='checkbox'
												checked={
													votes[question.id][option.id] ===
													option.text.toLowerCase()
												}
												onChange={(e) =>
													handleCheckboxChange(
														question.id,
														option.id,
														option.text,
														e.target.checked
													)
												}
											/>
											{option.text}
										</label>
									</div>
								))}
							</div>
						) : (
							question.options.map((option) => (
								<div key={option.id}>
									<label>{option.text}</label>
									<div style={{ paddingLeft: '20px' }}>
										{['Preferred', 'Would Do', 'Absolutely Not'].map(
											(choice) => (
												<div key={choice}>
													<label>
														<input
															type='checkbox'
															checked={
																votes[question.id][option.id] ===
																choice.toLowerCase()
															}
															onChange={() =>
																handleVoteChange(
																	question.id,
																	option.id,
																	choice.toLowerCase()
																)
															}
														/>
														{choice}
													</label>
												</div>
											)
										)}
									</div>
								</div>
							))
						)}
					</div>
				))}
				<div className='btn'>
					<button type='submit'>Submit Votes</button>
				</div>
			</form>
		</div>
	);
};

export default VoteForm;
