import './Quizzes.css';

import { useState, useEffect, useRef } from 'react';
import mapboxgl, { Map as MapGl } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Quiz, QuizList } from '../../interfaces';
import { getQuizzes } from '../../api/QuizFunctions';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [coordinates, setSelectedCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [markers, setMarkers] = useState<mapboxgl.LngLat[]>([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorShown, setErrorShown] = useState<boolean>(false);
  const [quizzesVisible, setQuizzesVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[] | null>(quizzes);

  const mapRef = useRef<MapGl | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  // Fetch quizzes from the API when the component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data: QuizList = await getQuizzes();
        setQuizzes(data.quizzes);
      } catch (error) {
        // Handle API fetch error
        fetchError(error);
      }
    };

    fetchQuizzes();
  }, []);

  // Initialize the map and markers when selectedCoords change
  useEffect(() => {
    if (!mapContainer.current || coordinates.length === 0) return;
    mapRef.current = new MapGl({
      container: mapContainer.current,
      style: 'mapbox://styles/paopao98/clmsa1af202fa01r739c31p87',
      center: [coordinates[0].longitude, coordinates[0].latitude],
      zoom: 11,
    });

    if (markerRef.current) {
      markerRef.current.remove();
    }

    coordinates.forEach((coords) => {
      new mapboxgl.Marker({ color: '#fffff' })
        .setLngLat([coords.longitude, coords.latitude])
        .addTo(mapRef.current as MapGl);
        setMarkers(markers)
    });
  }, [coordinates]);

  // Handle quiz selection and show the map
  const handleQuiz = (quiz: Quiz) => {
    if (errorShown) {
      setErrorShown(false);
    }
    const coords = quiz.questions.map((question) => ({
      latitude: parseFloat(question.location.latitude),
      longitude: parseFloat(question.location.longitude),
    }));
    let hasInvalidCoords = false;

    coords.forEach((coord) => {
      if (
        isNaN(coord.latitude) ||
        isNaN(coord.longitude) ||
        coord.longitude < -100 ||
        coord.longitude > 100
      ) {
        hasInvalidCoords = true;
      }
    });

    if (hasInvalidCoords) {
      // Handle invalid coordinates
      handleInvalidCoordinates();
    } else {
      setSelectedCoords(coords);
      setShowMap(true);
      setErrorMessage('');
      setErrorShown(false);
    }
  };

  // Toggle visibility of quizzes
  const toggleQuizzes = () => {
    setQuizzesVisible(!quizzesVisible);
  };

  // Filter quizzes based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredQuizzes(quizzes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = quizzes?.filter((quiz) => {
        const quizName = (quiz.quizId || '').toLowerCase();
        const username = (quiz.username || '').toLowerCase();

        return quizName.includes(query) || username.includes(query);
      });
      setFilteredQuizzes(filtered);
    }
  }, [searchQuery, quizzes]);

  // Handle API fetch errors
  const fetchError = (error: any) => {
    console.error('Error while fetching quizzes:', error);
    setErrorMessage('Something went wrong. Please try again later.');
    setErrorShown(true);
  };

  // Handle invalid coordinates error
  const handleInvalidCoordinates = () => {
    setErrorMessage('Invalid coordinates. Please select another quiz.');
    setErrorShown(true);
    setSelectedCoords([]);
    setShowMap(false);
  };

  return (
    <div className='quizzes__container'>
      <h2 className='quizzes__header'>All quizzes</h2>
      <input
        type="text"
        className="quizzes__search-input"
        placeholder="Search by quiz name or username"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={toggleQuizzes}>Toggle</button>
      {errorMessage && (
        <div>
          <h3 className="error">{errorMessage}</h3>
        </div>
      )}
      {showMap && (
        <div className='map' ref={mapContainer}></div>
      )}
      {quizzesVisible ? (
        <div className='quizzes-container'>
          {filteredQuizzes ? (
            filteredQuizzes.map((quiz, index) => (
              <aside
                className={'quizzes'}
                key={index}
                onClick={() => handleQuiz(quiz)}
              >
                <p className='quizzes__body-text'>Username: {quiz.username}</p>
                <p className='quizzes__body-text'>Quiz name: {quiz.quizId}</p>
              </aside>
            ))
          ) : (
            <p>No Quizzes found.</p>
          )}
        </div>
      ) : (
        <p>Quizzes are hidden. Press the toggle button to display them.</p>
      )}
    </div>
  );
}

export default Quizzes;
