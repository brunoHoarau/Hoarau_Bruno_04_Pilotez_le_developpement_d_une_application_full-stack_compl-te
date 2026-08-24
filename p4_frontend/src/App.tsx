import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Navbar from './components/navbar/Navbar'
import Home from './pages/Home/Home'
import MySpace from './pages/MySpace/MySpace'
import GuestRoute from './routes/GuestRoute'
import PrivateRoute from './routes/PrivateRoute'

function App() {

  return (
    <>
        <Navbar />
        <Routes>
            <Route element={<GuestRoute />}>
                <Route path='/' element={ <Home /> } />
                <Route path='/login' element={ <Login /> } />
                <Route path='/register' element={ <Register /> } />
            </Route>

            <Route element={<PrivateRoute />}>
                <Route path='/myspace' element={ <MySpace /> } />
            </Route>
        </Routes>
    </>
  )
}

export default App
