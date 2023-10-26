import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import fetchQuestions from "../fetchQuestions";
import Question from "../Question/Question";
import "./QuizScreen.css"
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

function QuizScreen ({ quizOptions, handleQuizStart}){
	const [questionsArray, setQuestionsArray] = useState([]);
    const [checkAnswerBtn, setCheckAnswerBtn] = useState(false);
	const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
	const [isGameOver, setIsGameOver] = useState(false);

    const allQuestionsAnswered = questionsArray.every(question => question.selectedAnswer !== "");
    
	useEffect(() => {
		fetchQuestions(quizOptions).then(questions => {
			if (questions.length === 0) {
                console.log("No questions found")
				return;
			} 

			return setQuestionsArray(questions.map(question => {
				return {
					...question,
					id: nanoid(),
					selectedAnswer: "",
					showAnswer: false
				}
			}));
		});
	}, []);


    console.log(questionsArray);

    useEffect(() => {
		if (questionsArray.length !== 0 && allQuestionsAnswered) {
			let correctAnswers = 0;
			
			questionsArray.forEach(question => {
				if (question.correct_answer === question.selectedAnswer)
					correctAnswers++;
			});

			setCorrectAnswersCount(correctAnswers);
			setCheckAnswerBtn(true);
		}
	}, [questionsArray]);


	function handleSelectAnswer (questionId, answer) {
		if (!isGameOver) {
			setQuestionsArray(prevQuestionsArray => (
				prevQuestionsArray.map(question => (
					question.id === questionId
						? {...question, selectedAnswer: answer }
						: question
				))
			));
		}
	}

	function checkAnswers () {
		if (allQuestionsAnswered) {
			setIsGameOver(true);

			setQuestionsArray(prevQuestionsArray => (
				prevQuestionsArray.map(question => ({...question, showAnswer: true }))
			));
		}
	}

	function resetGame () {
		setCheckAnswerBtn(false);
		setIsGameOver(false);
		handleQuizStart();
	}

	const questionElements = questionsArray.map(question => (
		<Question
			key={question.id}
			id={question.id}
			question={question.question}
			correctAnswer={question.correct_answer}
			incorrectAnswers={question.incorrect_answers}
			difficulty={question.difficulty}
			category={question.category}
			selectedAnswer={question.selectedAnswer}
			showAnswer={question.showAnswer}
			handleSelectAnswer={handleSelectAnswer}
		/>
	));

	const { width, height } = useWindowSize()

	return (
	    <>
			{isGameOver && correctAnswersCount === 5 && <Confetti width={width} height={height}/>}
            <section className="questionList-container">
			{questionElements}

			<div className="bottom-container">
				{isGameOver &&
					<h3 className="correct-answers-text">
						Vous avez obtenu {correctAnswersCount} bonnes réponses sur 5
					</h3>
				}

				<button
					className={`btn-primary ${checkAnswerBtn
												? "btn-check-answers"
												: "btn-check-answers-disabled"}`}
					onClick={isGameOver ? resetGame : checkAnswers}
				>
					{isGameOver ? "Rejouer" : "Vérifier les Réponse"}
				</button>
			</div>
		</section>
        </>
	);
}

export default QuizScreen;