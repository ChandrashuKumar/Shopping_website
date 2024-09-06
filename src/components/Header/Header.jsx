import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MagnifyingGlassIcon, ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../../images/icon.svg";
import { logout } from "../../store/authSlice";
import { setCart } from '../../store/cartSlice';
import authService from '../../appwrite/auth';

function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const userEmail = useSelector((state) => state.auth.userData?.email || '');
    const cartItems = useSelector((state) => state.cart.items || []); // Ensure cartItems is always an array
    const cartItemsCount = cartItems.length; // Use this for counting items safely
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    
    const handleLogout = () => {
        authService.logout().then(() => {
            dispatch(logout())
            dispatch(setCart([]));
        })
        navigate('/'); // Redirect to the homepage
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    return (
        <header className="min-w-[1000px]">
            {/* Main Navbar */}
            <div className="fixed top-0 left-0 right-0 bg-amazonclone text-white h-[60px] z-50">
                <div className="flex items-center justify-between h-full">
                    {/* left */}
                    <div className="flex items-center m-4">
                        <Link to="/">
                            <img src={logo} alt="logo" className="h-10 w-20" />
                        </Link>
                        <div className="pr-4 pl-4">
                            <div className="text-xs xl:text-sm cursor-pointer">Deliver to</div>
                            <div className="text-sm xl:text-base font-bold cursor-pointer">INDIA</div>
                        </div>
                    </div>
                    {/* middle */}
                    <div className="flex grow relative items-center">
                        <div className="w-full">
                            <div className="flex items-center h-10 bg-amazonclone-yellow rounded">
                                <select className="p-2 bg-gray-300 text-black border text-xs xl:text-sm">
                                    <option>All</option>
                                    <option>Deals</option>
                                    <option>Amazon</option>
                                    <option>Fashion</option>
                                    <option>Computers</option>
                                    <option>Home</option>
                                    <option>Mobiles</option>
                                </select>
                                <input
                                    className="flex px-2 grow items-center h-full rounded-l text-black"
                                    type="text"
                                    placeholder='Search'
                                />
                                <button className="w-[45px]">
                                    <MagnifyingGlassIcon className="h-[27px] m-auto stroke-slate-900" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* right */}
                    <div className="flex items-center m-4">
                        <div className="pr-4 pl-4">
                            {authStatus ? (
                                <div>
                                    <div className="text-xs xl:text-sm">Hello, {userEmail}</div>
                                    <div className="text-sm xl:text-base font-bold cursor-pointer" onClick={handleLogout}>
                                        Sign Out
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login">
                                    <div>
                                        <div className="text-xs xl:text-sm cursor-pointer">Hello, sign in</div>
                                        <div className="text-sm xl:text-base font-bold cursor-pointer">
                                            Accounts & Lists
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                        <div className="pr-4 pl-4">
                            <div className="text-xs xl:text-sm cursor-pointer">Returns</div>
                            <div className="text-sm xl:text-base font-bold cursor-pointer">& Orders</div>
                        </div>
                            <div className="flex pr-3 pl-3">
                                <ShoppingCartIcon className="h-[48px]" />
                                <div className="relative">
                                    <div className="absolute right-[9px] font-bold m-2 text-orange-400">
                                        {cartItemsCount}
                                    </div>
                                </div>
                                <div className="mt-7 text-xs xl:text-sm font-bold">Cart</div>
                            </div>
                        <Bars3Icon className="h-[24px] ml-4 cursor-pointer" onClick={toggleSidebar} />
                    </div>
                </div>
            </div>

            {/* Sub Navbar */}
            <div className="flex bg-amazonclone-light_blue text-white space-x-3 text-xs xl:text-sm p-2 pl-6 mt-[60px] w-full ">
                <div className="flex justify-start w-full space-x-3">
                    <div className="cursor-pointer">Today's Deals</div>
                    <div className="cursor-pointer">Customer Service</div>
                    <div className="cursor-pointer">Registry</div>
                    <div className="cursor-pointer">Gift Cards</div>
                    <div className="cursor-pointer">Sell</div>
                </div>
            </div>

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 bg-white w-[250px] h-full shadow-lg z-50 p-4 rounded-l-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-bold">Hello, {authStatus ? userEmail : 'Guest'}</div>
                    <button onClick={toggleSidebar}>
                        <XMarkIcon className="h-6 w-6 text-black" />
                    </button>
                </div>
                <div className="flex flex-col space-y-2">
                    {authStatus && (
                        <>
                            <Link to="/addresses" onClick={toggleSidebar} className="cursor-pointer">Addresses</Link>
                            <Link to="/cart" onClick={toggleSidebar} className="cursor-pointer">Cart</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;

