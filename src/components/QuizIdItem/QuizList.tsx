import React, { useState, useEffect } from 'react';
import { Quiz } from '../../interfaces';
import { getQuizzes, deleteQuizById, newQuestion } from '../../api/QuizFunctions';
import './QuizList.css'


interface ExtendedQuiz extends Quiz {
  showQuestionForm: boolean;
}

function QuizList() {

  const username = sessionStorage.getItem('username');

  const [myQuizzes, setMyQuizzes] = useState<ExtendedQuiz[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string>('');

  // Fetch quizzes for the logged-in user when the component starts
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getQuizzes();
        const quizzes = data.quizzes;

        console.log('All quizzes:', quizzes);
        // Filter quizzes to include only those created by the logged-in user
        const filteredQuizzes = quizzes.filter((quiz) => quiz.username === username);

        setMyQuizzes(
          filteredQuizzes.map((quiz) => ({ ...quiz, showQuestionForm: false }))
        );
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    }

    fetchData();
  }, [username]);

  // Function to delete a user's quiz by quizId
  const deleteUserQuiz = async (selectedQuizId: string) => {
    try {
      const success = await deleteQuizById(selectedQuizId);

      if (success) {
        // Remove the deleted quiz from the state
        setMyQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.quizId !== selectedQuizId));
        setDeleteMessage('Quiz is now deleted');
      } else {
        setDeleteMessage('Failed to delete this quiz.');
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  // Function to toggle the visibility of the question form for a quiz
  const toggleQuestionForm = (quizId: string) => {
    setMyQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) => {
        if (quiz.quizId === quizId) {
          return { ...quiz, showQuestionForm: !quiz.showQuestionForm };
        }
        return quiz;
      })
    );
  };

  // Function to add a new question to a quiz
  const addQuestionToQuiz = async (quizId: string, question: string, answer: string) => {
    try {

      await newQuestion(quizId, question, answer, 'longitude', 'latitude');

      toggleQuestionForm(quizId);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <section className="quizzes">
      <h3 className="quizzes__subtitle">Quiz List:</h3>
      {myQuizzes.map((quiz, index) => (
        <div className="quizzes__container" key={index}>
          <p className="quizzes__title">Quiz name: {quiz.quizId}</p>
          <button className="quizzes__delete-btn" onClick={() => deleteUserQuiz(quiz.quizId)}>
            Delete
          </button>
          <button
            className="quizzes__add-question-btn"
            onClick={() => toggleQuestionForm(quiz.quizId)}
          >
            {quiz.showQuestionForm ? 'Hide Form' : 'Add Question'}
          </button>
          {quiz.showQuestionForm && (
            <div className="question-form">
              <input type="text" placeholder="Question" />
              <input type="text" placeholder="Answer" />
              <button onClick={() => addQuestionToQuiz(quiz.quizId, 'question', 'answer')}>
                Add Question
              </button>
            </div>
          )}
        </div>
      ))}
      <p className="my-quizzes__delete">{deleteMessage}</p>
    </section>
  );
}

export default QuizList;
