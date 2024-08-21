import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext.jsx";
import Logo from "./assets/Remote_Nest.png";

export default function Header() {
  const { user } = useContext(UserContext);
  const [dropdown, setDropdown] = useState(null); // state to manage dropdown visibility

  // Toggle dropdown visibility
  const toggleDropdown = (type) => {
    setDropdown(dropdown === type ? null : type);
  };

  return (
    <header className="flex justify-between p-4 bg-white shadow-md">
      <Link to={'/'} className="flex items-center gap-1">
        <img src={Logo} alt="Logo" className="w-16 h-12" />
        <span className="font-bold text-xl">HomeAway</span>
      </Link>

      <div className="relative flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
        <div 
          className="cursor-pointer hover:bg-blue-100 rounded-full p-2"
          onClick={() => toggleDropdown('location')}
        >
          Anywhere
        </div>
        <div 
          className="cursor-pointer hover:bg-blue-100 rounded-full p-2"
          onClick={() => toggleDropdown('dates')}
        >
          Any week
        </div>
        <div 
          className="cursor-pointer hover:bg-blue-100 rounded-full p-2"
          onClick={() => toggleDropdown('guests')}
        >
          Add guests
        </div>
        <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition flex items-center justify-center w-10 h-10">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
</button>

        
        {/* Dropdowns */}
        {dropdown === 'location' && (
          <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-md shadow-lg mt-2 p-4">
            <h4 className="font-bold mb-2">Select Location</h4>
            <input type="text" placeholder="Enter location" className="border p-2 rounded-md w-full" />
            <button className="mt-2 bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition">Search</button>
          </div>
        )}
        {dropdown === 'dates' && (
          <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-md shadow-lg mt-2 p-4">
            <h4 className="font-bold mb-2">Select Dates</h4>
            <input type="date" className="border p-2 rounded-md w-full mb-2" />
            <input type="date" className="border p-2 rounded-md w-full" />
            <button className="mt-2 bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition">Search</button>
          </div>
        )}
        {dropdown === 'guests' && (
          <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-md shadow-lg mt-2 p-4">
            <h4 className="font-bold mb-2">Number of Guests</h4>
            <input type="number" min="1" placeholder="Enter number of guests" className="border p-2 rounded-md w-full" />
            <button className="mt-2 bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition">Search</button>
          </div>
        )}
      </div>

      <Link to={user ? '/account' : '/login'} className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        </div>
        {!!user && (
          <div>
            {user.name}
          </div>
        )}
      </Link>
    </header>
  );
}
