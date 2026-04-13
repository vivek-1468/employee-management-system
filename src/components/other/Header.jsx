import React, { useState, useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { setLocalStorage } from '../../utils/localStorage'

const Header = (props) => {

  // display a real username; data prop will be undefined for admin
  const username = props.data?.firstName || 'Admin'
  const [userData, setUserData, darkMode, setDarkMode] = useContext(AuthContext)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const logOutUser = ()=>{
    localStorage.removeItem('loggedInUser')
    props.changeUser(null)
    // window.location.reload()
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const notifications = props.data?.notifications || []
  
  return (
    <div className='flex items-center justify-between pb-4 border-b border-gray-300 dark:border-gray-600'>
        <h1 className='text-2xl font-bold text-black dark:text-white'>
            Welcome, <span className='text-3xl'>{username}</span> 👋
        </h1>
        <div className='flex items-center gap-4'>
            {props.data && (
                <div className='relative' ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className='relative bg-gray-200 dark:bg-gray-600 text-black dark:text-white px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition'
                    >
                        🔔
                        {notifications.length > 0 && (
                            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1'>
                                {notifications.length}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <div className='absolute right-0 mt-2 w-80 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-10'>
                            <div className='p-4'>
                                <div className='flex justify-between items-center mb-2'>
                                    <h3 className='text-lg font-semibold text-black dark:text-white'>Notifications</h3>
                                    <button
                                        onClick={() => setShowNotifications(false)}
                                        className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    >
                                        ✕
                                    </button>
                                </div>
                                {notifications.length === 0 ? (
                                    <p className='text-gray-500 dark:text-gray-400'>No notifications</p>
                                ) : (
                                    <div className='space-y-2 max-h-60 overflow-y-auto'>
                                        {notifications.slice().reverse().map(notif => (
                                            <div key={notif.id} className='p-2 bg-gray-100 dark:bg-gray-600 rounded'>
                                                <p className='text-sm text-black dark:text-white'>{notif.message}</p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>{new Date(notif.date).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <button
                onClick={toggleDarkMode}
                className='bg-gray-200 dark:bg-gray-600 text-black dark:text-white px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition'
            >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
                onClick={logOutUser}
                className='bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition'
            >
                Log out
            </button>
        </div>
    </div>
  )
}

export default Header