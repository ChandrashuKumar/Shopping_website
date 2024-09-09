import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from "./appwrite/auth"
import service from './appwrite/services'
import {login, logout} from "./store/authSlice"
import { setCart } from './store/cartSlice'
import { setAddresses } from './store/addressSlice'
import { Footer, Header } from './components'
import { Outlet, useLocation } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/addresses';

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
          service.getCartItemsByUserId(userData.$id)
            .then((cartItems) => {
              if (cartItems.length > 0) {
                dispatch(setCart(cartItems));
              }
            });

          service.getAllAddresses(userData.$id).then((addresses) => {
            dispatch(setAddresses(addresses));
          });
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);


  return !loading ? (
    <div className="min-h-screen flex flex-col bg-[url('./images/background.jpg')] bg-cover bg-center bg-no-repeat">
      {!isAuthPage && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  ) : null;
}

export default App;
