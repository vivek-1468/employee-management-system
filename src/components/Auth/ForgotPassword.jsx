import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const ForgotPassword = ({ setShowForgotPassword, setShowSignUp }) => {
    const [step, setStep] = useState(1) // step 1: enter email, step 2: verify, step 3: reset password
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [userData, setUserData] = useContext(AuthContext)
    const [foundUser, setFoundUser] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')

    const handleEmailSubmit = (e) => {
        e.preventDefault()
        setErrorMessage('')

        // Check if email exists
        const user = userData.find(u => u.email === email)
        if (!user) {
            setErrorMessage('Email not found in our system')
            return
        }

        // For employee accounts
        if (user.role !== 'admin') {
            setFoundUser(user)
            setStep(2)
        } else {
            setErrorMessage('Admin password reset not available through this portal')
        }
    }

    const handlePasswordReset = (e) => {
        e.preventDefault()
        setErrorMessage('')

        if (!newPassword || !confirmPassword) {
            setErrorMessage('Please fill in all fields')
            return
        }

        if (newPassword.length < 3) {
            setErrorMessage('Password must be at least 3 characters')
            return
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match')
            return
        }

        // Update user password
        const updatedUserData = userData.map(user => 
            user.id === foundUser.id 
                ? { ...user, password: newPassword }
                : user
        )

        setUserData(updatedUserData)

        // Show success message
        alert('Password reset successful! You can now log in with your new password.')
        
        // Reset form
        setEmail('')
        setNewPassword('')
        setConfirmPassword('')
        setFoundUser(null)
        setStep(1)
        setShowForgotPassword(false)
    }

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900'>
            <div className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-12 shadow-lg w-full max-w-md'>
                <h2 className='text-2xl font-bold text-black dark:text-white mb-2'>Forgot Password</h2>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>Reset your password in simple steps</p>

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className='flex flex-col'>
                        <label className='text-black dark:text-white text-sm font-medium mb-2'>Email Address</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='outline-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium text-lg py-2 px-6 rounded-lg w-full mb-4 placeholder-gray-500 dark:placeholder-gray-400'
                            type="email"
                            placeholder='Enter your email'
                        />
                        {errorMessage && <p className='text-red-500 text-sm mb-4'>{errorMessage}</p>}
                        <button
                            type="submit"
                            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-2 rounded-lg transition mb-4'
                        >
                            Find Account
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(false)}
                            className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-center'
                        >
                            Back to Login
                        </button>
                    </form>
                )}

                {step === 2 && foundUser && (
                    <form onSubmit={handlePasswordReset} className='flex flex-col'>
                        <div className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6'>
                            <p className='text-green-700 dark:text-green-300 text-sm'>
                                <span className='font-semibold'>Account Found: </span>
                                {foundUser.firstName} ({foundUser.email})
                            </p>
                        </div>

                        <label className='text-black dark:text-white text-sm font-medium mb-2'>New Password</label>
                        <input
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className='outline-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium text-lg py-2 px-6 rounded-lg w-full mb-4 placeholder-gray-500 dark:placeholder-gray-400'
                            type="password"
                            placeholder='Enter new password'
                        />

                        <label className='text-black dark:text-white text-sm font-medium mb-2'>Confirm Password</label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className='outline-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium text-lg py-2 px-6 rounded-lg w-full mb-6 placeholder-gray-500 dark:placeholder-gray-400'
                            type="password"
                            placeholder='Confirm new password'
                        />

                        {errorMessage && <p className='text-red-500 text-sm mb-4'>{errorMessage}</p>}

                        <button
                            type="submit"
                            className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-2 rounded-lg transition mb-4'
                        >
                            Reset Password
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setStep(1)
                                setFoundUser(null)
                                setEmail('')
                            }}
                            className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-center text-sm'
                        >
                            Use different email
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
