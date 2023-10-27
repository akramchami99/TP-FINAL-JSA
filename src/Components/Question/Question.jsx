import "./Question.css";
import { nanoid } from "nanoid";
import { decode } from 'html-entities';
import tickIcon from "../../assets/tick.svg";
import crossIcon from "../../assets/cross.svg";

function Question(props){
	const incorrectAnswersElements = props.incorrectAnswers.map(answer => {
		const incorrectAnswerClassName = `
			${props.selectedAnswer === answer ? "question-btn-selected" : "question-btn"}
			${(props.showAnswer && props.selectedAnswer === answer) && "question-btn-incorrect"}
		`;

		return <button
			key={nanoid()}
			className={incorrectAnswerClassName}
			onClick={() => props.handleSelectAnswer(props.id, answer)}
		>
			{ decode(answer) }
		</button>
	});

	const correctAnswerClassName = `
		${props.selectedAnswer === props.correctAnswer ? "question-btn-selected" : "question-btn"}
		${props.showAnswer && "question-btn-correct"}
	`;

	const correctAnswerElement =
		<button
			key={nanoid()}
			className={correctAnswerClassName}
			onClick={() => props.handleSelectAnswer(props.id, props.correctAnswer)}
		>
			{ decode(props.correctAnswer) }
		</button>
	
	incorrectAnswersElements.push(correctAnswerElement);

	const sortedAnswerElements = incorrectAnswersElements.sort();

	return (
		<article className="question-container">
			<div>
				<h3 className="question-text">{ decode(props.question) }</h3>
				{ sortedAnswerElements }
			</div>
			
			{
				props.showAnswer &&
					(props.selectedAnswer === props.correctAnswer
						? <img src={tickIcon} width={35} alt="Tick, Réponse Correcte" />
						: <img src={crossIcon} width={30} alt="Croix, Mauvaise Réponse" />)
			}
		</article>
	);
}

export default Question;