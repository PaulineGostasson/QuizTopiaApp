import './App.css'
import {RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthPage from './Views/AuthPage/AuthPage'
import UserProfile from './Views/UserProfile/Userprofile'
import Game from './Views/Game/Game'
import Form from './Views/Form/Form'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AuthPage/>
    },
    {
      path: '/userprofile',
      element: <UserProfile/>
    },
    {
      path:'/game',
      element: <Game/>
    },
    {
      path:'/form',
      element:<Form/>
    }

  ])

  return (
    <div className='App'>
      <RouterProvider router = { router }/>
    </div>
  )
}

export default App
