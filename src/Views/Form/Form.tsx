import MapBox from '../../components/MapBox/MapBox';
import QuizForm from '../../components/QuizForm/QuizForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form(){
    const [newLat, setNewLat] = useState<number>(0)
    const [newLng, setNewLng] = useState<number>(0)
    const navigate = useNavigate();

    const goToMyProfile = () =>{
        navigate('/UserProfile')
    }
    const goToPlay = ()=>{
        navigate('/game')
    }

    return(
        <section className='form'>
            <header className='form-header'>
                <h1>QUIZTOPIA</h1>
                <div className='form-container--btns'>
                    <button className='form-btn' onClick={goToMyProfile}>Back to profile</button>
                    <button className='form-btn' onClick={goToPlay}>Lets play!</button>
                </div>
            </header>
            <article className='quiz-form-container'>
                <QuizForm newLat= {newLat} newLng={newLng} setNewLng={setNewLng} setNewLat={setNewLat}/>
            </article>
            <aside className='quiz-form-mapbox'>
                <MapBox setNewLng={setNewLng} setNewLat={setNewLat}/>
            </aside>

        </section>
    )
}
export default Form