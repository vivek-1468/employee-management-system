import React, { createContext, useEffect, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '../utils/localStorage'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    // localStorage.clear()

    const [userData, setUserData] = useState(null)

    useEffect(() => {
        // ensure initial data is seeded only if not already present
        if (!localStorage.getItem('employees')) {
            setLocalStorage()
        }
        const {employees} = getLocalStorage()
        // Ensure all employees have notifications, recognitions, attendance, and leaves arrays
        const updatedEmployees = employees.map(emp => ({
            ...emp,
            notifications: emp.notifications || [],
            recognitions: emp.recognitions || [],
            attendance: emp.attendance || [],
            leaves: Array.isArray(emp.leaves) ? emp.leaves : []
        }))
        setUserData(updatedEmployees)
    }, [])

    // whenever userData changes persist it back to storage
    useEffect(() => {
        if (userData) {
            localStorage.setItem('employees', JSON.stringify(userData))
        }
    }, [userData])

    return (
        <AuthContext.Provider value={[userData, setUserData]}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider