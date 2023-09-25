
import { useState } from 'react';
import { newQuestion } from '../../api/QuizFunctions';

interface QuizFormProps{
    newLng: number;
    newLat: number;
    setNewLat: React.Dispatch<React.SetStateAction<number>>;
    setNewLng: React.Dispatch<React.SetStateAction<number>>;
}
function QuizForm({newLng,newLat}: QuizFormProps){
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [message, setMessage] =useState<string>('');

    const handleQuestion = async () => {
        console.log('handleQuestion called'); 
        try {
          const quizId = sessionStorage.getItem('quizId');
          const newLatString = newLat.toString();
          const newLngString = newLng.toString();
          
          if (question && answer && newLatString && newLngString && quizId) {
              sessionStorage.setItem('question', question);
              sessionStorage.setItem('answer', answer)
              await newQuestion(quizId, question, answer,newLngString, newLatString);
              setMessage('Question created successfully!');
              setQuestion(''); 
              setAnswer('');
              
            } else {
                setMessage('Requires input from question, location & answer')
            }
        } catch (error) {
             console.log('Error:' , error)
    }
};

    return(
        <section className='quiz-form'>
            <aside className='quiz-form__text-title'>
                <h3 className='create-user__title'>Add Questions!</h3>
            </aside>
            <div className='quizForm-container'>
                <input className='quiz-form__input'type="text" value={question} placeholder='Question:'
                onChange={(e) => setQuestion(e.target.value)} />
                <input className='quiz-form__input' type="text" value={answer} placeholder='Answer:'
                onChange={(e) => setAnswer(e.target.value)} />
                <button className='quiz-form__btn'onClick={handleQuestion}>Save </button>
                {message && <p className='quiz-form__message'>{message}</p>}
            </div>
        </section>
    )
}
export default QuizForm;