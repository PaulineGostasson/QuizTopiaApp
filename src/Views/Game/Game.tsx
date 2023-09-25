import Quizzes from '../../components/Quizzes/Quizzes';
import './Game.css';
import { useNavigate } from 'react-router-dom';

function Game(){
    const navigate = useNavigate()
    
    const goBack = () => {
        navigate('/UserProfile')
      };
    return(
        <section className='game'>
            <header className='game-container'>
                <div>
                    <button onClick={goBack} className='game-backBtn'>Back to Profile</button>
                </div>
                <h1 className='game-title'>QUIZTOPIA</h1>
            </header>
            <Quizzes/>
        </section>

    )
}
export default Game;