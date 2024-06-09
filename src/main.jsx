import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MinesweeperPage from './pages/MinesweeperPage';
import UserPage from './pages/UserPage';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>
  },
  {
    path: "/play",
    element: <PlayPage/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
