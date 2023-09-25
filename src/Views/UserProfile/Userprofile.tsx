
import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../../api/QuizFunctions';
import QuizList from '../../components/QuizIdItem/QuizList'
import './UserProfile.css'


function UserProfile(){
    const [quizName, setQuizName] = useState<string>('');
    const [showQuizList, setQuizList] = useState(false);

    const navigate = useNavigate();
    const name = sessionStorage.getItem('username')

    const getQuizName = (event: ChangeEvent<HTMLInputElement>)=>{
        setQuizName(event.target.value)
    }

    const playGame = () =>{
      navigate('/game')
    }

    const addNewQuiz = () => {
        createQuiz(quizName);
        sessionStorage.setItem('quizId', quizName);
        navigate('/form')
      };

      const signOut = () => {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('question');
        sessionStorage.removeItem('answer');
        sessionStorage.removeItem('longitude');
        sessionStorage.removeItem('latitude');
        sessionStorage.removeItem('quizId');
        navigate('/')
      };

    return(
        <div className="UserProfile">
          <header className='UserProfile-msg'>
            <h1>Quiztopia</h1>
            <div className='UserProfile-container'>
                <h3 className='UserProfile-txt'>Welcome to your QuizTopia Profile {name}!</h3>
            </div>
          </header>
            <div className='UserProfile-container'>
              <button onClick={playGame}>Game</button>
                <button onClick={() => setQuizList(!showQuizList)}>My Quiz List</button>
                <button onClick={signOut}>Sign Out</button>
            </div>
              <article className='UserProfile-quiz'>
                <p className='UserProfile-rules'>Follow these steps to create a quiz:</p>
                <ol>
                  <li className='UserProfile-ruleList'>First you create a name for your Quiz.</li>
                  <li className='UserProfile-ruleList'>Secondly you add a Question and answer.</li>
                  <li className='UserProfile-ruleList'>And Lastly you pick a location that you wish your Question to appear.</li>
                  <li className='UserProfile-ruleList'>Then you are done its that easy! Have fun quizzing away!</li>
                </ol>
                <div className='UserProfile-add'>
                  <input type="text" placeholder='Quiz name:'
                  value={quizName}
                  onChange={getQuizName} />
                  <button onClick={addNewQuiz}>ADD QUIZ</button>
                </div>
              </article>
              <div className='UserProfile-quizList'>
                {showQuizList && <QuizList/>}
            </div>
        </div>
    )
}
export default UserProfile;