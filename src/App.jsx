import React, { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import SignUp from './components/Auth/SignUp'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { AuthContext } from './context/AuthProvider'
import { DarkModeProvider, DarkModeContext } from './context/DarkModeProvider'
import NotificationSystem from './components/other/NotificationSystem'

const AppContent = () => {
  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const [userData, setUserData] = useContext(AuthContext)
  const [showSignUp, setShowSignUp] = useState(false)
  const { darkMode } = useContext(DarkModeContext)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')

    if (loggedInUser && userData) {
      try {
        const parsedUser = JSON.parse(loggedInUser)
        setUser(parsedUser.role)
        
        // If it's an employee, fetch from userData context
        if (parsedUser.role === 'employee') {
          const employee = userData.find(emp => emp.id === parsedUser.id)
          if (employee) {
            setLoggedInUserData(employee)
          }
        }
      } catch (e) {
        // If there's an error parsing, clear localStorage
        localStorage.removeItem('loggedInUser')
        setUser(null)
        setLoggedInUserData(null)
      }
    } else if (!loggedInUser && userData) {
      // If no logged-in user but userData is ready, mark as initialized
      setUser(null)
      setLoggedInUserData(null)
    }
    
    // Only mark as initialized when userData is available
    if (userData) {
      setIsInitialized(true)
    }
  }, [userData])

  useEffect(() => {
    if (user === 'employee' && userData && loggedInUserData) {
      const updatedEmployee = userData.find(emp => emp.id === loggedInUserData.id)
      if (updatedEmployee) {
        setLoggedInUserData(updatedEmployee)
        // Store only the ID to save localStorage space
        localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', id: updatedEmployee.id }))
      }
    }
  }, [userData])

  // Handle logout cleanup
  useEffect(() => {
    if (user === null) {
      setLoggedInUserData(null)
      localStorage.removeItem('loggedInUser')
    }
  }, [user])

  const handleLogin = (email, password) => {
    if (email == 'admin@me.com' && password == '123') {
      setUser('admin')
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }))
      window.notificationSystem?.addNotification('✓ Admin Login Successful!', 'success')
    } else if (userData) {
      const employee = userData.find((e) => email == e.email && e.password == password)
      if (employee) {
        setUser('employee')
        setLoggedInUserData(employee)
        // Store only the user ID, not the entire employee object to save space
        localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', id: employee.id }))
        window.notificationSystem?.addNotification(`✓ Welcome ${employee.firstName}!`, 'success')
      } else {
        alert("Invalid Credentials")
      }
    }
    else {
      alert("Invalid Credentials")
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className='bg-white text-black dark:bg-gray-800 dark:text-white min-h-screen'>
        {!isInitialized ? (
          <div className='flex h-screen w-screen items-center justify-center'>
            <p className='text-xl'>Loading...</p>
          </div>
        ) : (
          <>
            {!user && !showSignUp && <Login handleLogin={handleLogin} setShowSignUp={setShowSignUp} />}
            {!user && showSignUp && <SignUp setShowSignUp={setShowSignUp} />}
            {user === 'admin' && <AdminDashboard changeUser={setUser} />}
            {user === 'employee' && loggedInUserData ? (
              <EmployeeDashboard changeUser={setUser} data={loggedInUserData} />
            ) : user === 'employee' ? (
              <div className='flex h-screen w-screen items-center justify-center'>
                <p className='text-xl'>Loading employee data...</p>
              </div>
            ) : null}
          </>
        )}
      </div>
      <NotificationSystem />
    </div>
  )
}

const App = () => {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  )
}

export default App