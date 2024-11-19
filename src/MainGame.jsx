import { useState, useEffect } from "react";
import he from "he";
import "./App.css";
import { nanoid } from "nanoid";
import translate from "translate";

function MainGame({appLang}) {
  translate.engine = "google";
  translate.key = null; // No API key needed for basic usage.
  const [english, setEnglish] = useState(!appLang);

  const [questions, setQuestions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  let correctAnswers = 0;

 

  const fetchData = async () => {
    setGameOver(false);
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
      );
      const data = await response.json();

      if (data.results) {
        // Process questions with translations
        const translatedQuestions = await Promise.all(
          data.results.map(async (question) => {
            const questionId = nanoid();
            const enQuestion = he.decode(question.question);
           
            

            const roQuestion = english ? enQuestion : await translate(enQuestion, "ro");

            const incorrectAnswers = question.incorrect_answers.map((ans, index) => ({
              id: `${questionId}-wrong-${index}`,
              text: he.decode(ans),
              isCorrect: false,
              isSelected: false,
              isFinal: false,
              status: "unselected",
            }));

            const correctAnswer = {
              id: `${questionId}-correct`,
              text: he.decode(question.correct_answer),
              isCorrect: true,
              isSelected: false,
              isFinal: false,
              status: "unselected",
            };

            const allAnswers = [...incorrectAnswers, correctAnswer].sort(
              () => Math.random() - 0.5
            );

            return {
              id: questionId,
              question: roQuestion, // Use the translated question
              allAnswers,
            };
          })
        );

        setQuestions(translatedQuestions);
      }
    } catch (error) {
      console.error("Error fetching trivia questions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function selectAnswer(answerId) {
    if (gameOver) return;

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.allAnswers.some((answer) => answer.id === answerId)
          ? {
              ...question,
              allAnswers: question.allAnswers.map((answer) => ({
                ...answer,
                isSelected: answer.id === answerId,
                status: answer.id === answerId ? "selected" : "unselected",
              })),
            }
          : question
      )
    );
  }

  function checkAnswers() {
    setGameOver(true);
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => ({
        ...question,
        allAnswers: question.allAnswers.map((answer) => ({
          ...answer,
          isFinal: true,
          status: answer.isSelected
            ? answer.isCorrect
              ? "finalCorrect"
              : "finalIncorrect"
            : answer.isCorrect
            ? "correct"
            : "unselected",
        })),
      }))
    );
  }

  function checkAnswerClass(answer) {
    switch (answer.status) {
      case "finalCorrect":
        correctAnswers++;
        return "correct";
      case "finalIncorrect":
        return "incorrect";
      case "selected":
        return "selected";
      case "correct":
        return "correct";
      default:
        return "unselected";
    }
  }

  const allQuestions = questions.map((question) => (
    <div key={question.id}>
      <h3>{question.question}</h3>
      <div className="answers">
        {question.allAnswers.map((answer) => (
          <div
            key={answer.id}
            type="button"
            cursor="pointer"
            onClick={() => selectAnswer(answer.id)}
            className={checkAnswerClass(answer)}
          >
            {answer.text}
          </div>
        ))}
      </div>
    </div>
  ));

  return (
    <div className="mainDiv">
     
      <h1>Trivia Game</h1>
      {allQuestions}
      {!gameOver && <button className="checkAnswers" onClick={checkAnswers}>
        Check Answers
      </button>}
      {gameOver && <button className="checkAnswers" onClick={fetchData}>New Game</button>}
      {gameOver && (
        <div>
          You scored {correctAnswers} out of {questions.length} questions
        </div>
      )}
    </div>
  );
}

export default MainGame;
