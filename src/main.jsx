import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './components/HomePage.jsx'
import Login from './components/Login.jsx'
import Signup from './components/SignUp.jsx'
import { AuthLayout } from './components/index.js'
import {ProductPage} from './components/index.js'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path:"/",
                element: <HomePage/>,
            },
            {
                path: "/login",
                element:(
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                ),
            },
            {
                path: "/signup",
                element: (
                    <AuthLayout authentication={false}>
                        <Signup />
                    </AuthLayout>
                )
            },
            {
                path: "/product/:id",
                element: <ProductPage/>
            },
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <Provider store = {store}>
        <RouterProvider router={router}/>
    </Provider>
)
