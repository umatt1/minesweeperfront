import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MinesweeperPage from './pages/MinesweeperPage';
import UserPage from './pages/UserPage';
import RegistrationPage from './pages/RegistrationPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MinesweeperPage/>
  },
  {
    path: "/user",
    element: <UserPage/>
  },
  {
    path: "/register",
    element: <RegistrationPage/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
