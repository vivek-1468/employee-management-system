import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const SignUp = ({ setShowSignUp }) => {
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userData, setUserData] = useContext(AuthContext)

    const submitHandler = (e) => {
        e.preventDefault()

        // Check if email already exists
        const existingUser = userData.find(user => user.email === email)
        if (existingUser) {
            alert('Email already exists. Please use a different email.')
            return
        }

        // Create new employee
        const newEmployee = {
            id: Date.now(),
            firstName,
            email,
            password,
            taskCounts: {
                active: 0,
                newTask: 0,
                completed: 0,
                failed: 0
            },
            tasks: []
        }

        // Add to userData
        const updatedUserData = [...userData, newEmployee]
        setUserData(updatedUserData)

        // Reset form
        setFirstName('')
        setEmail('')
        setPassword('')

        alert('Registration successful! You can now log in.')
        setShowSignUp(false)
    }

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900'>
            <div className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-12 shadow-lg w-full max-w-md'>
                <h2 className='text-2xl font-bold text-black dark:text-white mb-6'>Employee Sign Up</h2>
                <form
                    onSubmit={submitHandler}
                    className='flex flex-col items-center justify-center'
                >
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className='outline-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium text-lg py-2 px-6 rounded-full w-full mb-4 placeholder-gray-500 dark:placeholder-gray-400'
                        type="text"
                        placeholder='First Name'
                    />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='outline-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium text-lg py-2 px-6 rounded-full w-full mb-4 placeholder-gray-500 dark:placeholder-gray-400'
                        type="email"
                        placeholder='Email'
                    />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className='outline-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium text-lg py-2 px-6 rounded-full w-full mb-6 placeholder-gray-500 dark:placeholder-gray-400'
                        type="password"
                        placeholder='Password'
                    />
                    <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-2 rounded-full transition mb-4'>
                        Sign Up
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowSignUp(false)}
                        className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignUp