import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { LogIn, registerNewUser } from "../../api/UserFunctions";
import { useNavigate } from 'react-router-dom';
import { LoginSuccessful } from "../../interfaces";
import { getPosition } from "../../api/Geolocation";

function AuthPage() {
  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

// Creating User to the sign up.
  const createUser = async () => {
  const success = await registerNewUser(username, password);

      if (success) {
        // Registration successful
        setSuccess(true);
        sessionStorage.setItem('username', username);
        setIsRegistering(false); // Switch to login mode
        console.log('Successful Registration!!')
      } else {
        setError("Failed to register user. Username may be in use.");
        console.log('Ooops something went wrong.')
      }
    }

    // To make sure you have your locations turned on before login in.
    useEffect(()=>{
      const fetchUserCoords = async () => {
        try {
          await getPosition();
        } catch (error) {
          console.error('Error:', error);
          setError('To be able to create quizzes in this app, please enable location services.')
        }
      }
      fetchUserCoords();
    },[])

        const logIn = async () => {
      // Login logic
      const data: LoginSuccessful = await LogIn(username, password);

      if (data.success) {
        sessionStorage.setItem("username", username);
        navigate('/UserProfile');
      } if (data.token) {
        setToken(data.token);
        sessionStorage.setItem('token', data.token);
        console.log(token)
      } else {
        setError('This username does not exist, go to sign in if u do not already have an account.')
      }
    }

    // Handeling create a user or login.
      const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isRegistering) {
          createUser();
        } else {
          logIn();
        }
      };
    
      const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
      };
    
      const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
      };
    

      return (
        <section className="auth-form-container">
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Your Username :3"
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="********"
              required
            />
            <button type="submit">
              {isRegistering ? "Sign Up" : "Log In"}
            </button>
          </form>
          <p className="error-message">{error}</p>
          <button
            className="toggle-auth-button"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Login here."
              : "Don't have an account? Register here."}
          </button>
        </section>
      );
    }
    
    export default AuthPage;