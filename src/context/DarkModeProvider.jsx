import React, { createContext, useState, useEffect } from 'react'

export const DarkModeContext = createContext()

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode')
        if (savedMode) {
            setDarkMode(JSON.parse(savedMode))
        } else {
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}
