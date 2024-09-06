import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from "./appwrite/auth"
import service from './appwrite/services'
import {login, logout} from "./store/authSlice"
import { setCart } from './store/cartSlice'
import { Footer, Header } from './components'
import { Outlet, useLocation } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
        service.getCartItemsByUserId(userData.$id)
        .then((cartItems) => {
          if(cartItems.length>0){
            dispatch(setCart(cartItems));
        }
        })
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-[url('./images/background.jpg')] bg-cover bg-center bg-no-repeat" >
      <div className='w-full block'>
      {!isAuthPage && <Header />}
        <main>
          <Outlet />
        </main>
      {!isAuthPage && <Footer />}
      </div>
    </div>
  ) : null
}

export default App