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
    path: "/minesweeper",
    element: <MinesweeperPage/>
  },
  {
    path: "/play",
    element: <PlayPage/>
  },
  {
    path: "/user",
    element: <UserPage/>
  },
  {
    path: "/about",
    element: <AboutPage/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
