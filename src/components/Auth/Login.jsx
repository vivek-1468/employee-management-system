import React, { useState } from 'react'
import ForgotPassword from './ForgotPassword'
import FaceRecognitionLogin from './FaceRecognitionLogin'

const Login = ({ handleLogin, setShowSignUp }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [loginMode, setLoginMode] = useState('email') // 'email' or 'face'

    const submitHandler = (e) => {
        e.preventDefault()
        handleLogin(email, password)
        setEmail("")
        setPassword("")
    }

    const handleFaceLogin = (faceDescriptor) => {
        // Store face descriptor and attempt login
        // For now, we'll use a special marker to identify face login
        const faceEmail = `face_${Date.now()}`
        handleLogin(faceEmail, 'face_recognition')
    }

    if (showForgotPassword) {
        return <ForgotPassword setShowForgotPassword={setShowForgotPassword} setShowSignUp={setShowSignUp} />
    }

    if (loginMode === 'face') {
        return <FaceRecognitionLogin 
            onFaceLogin={handleFaceLogin} 
            fallbackToEmail={() => setLoginMode('email')}
        />
    }

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900'>
            <div className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-12 shadow-lg w-full max-w-md'>
                <h2 className='text-2xl font-bold text-black dark:text-white mb-6'>Project Tracker</h2>
                
                {/* Tab Switcher */}
                <div className='flex gap-2 mb-6'>
                    <button
                        type='button'
                        onClick={() => setLoginMode('email')}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                            loginMode === 'email'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}
                    >
                        📧 Email
                    </button>
                    {/* <button
                        type='button'
                        onClick={() => setLoginMode('face')}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                            loginMode === 'face'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}
                    >
                        👤 Face
                    </button> */}
                </div>

                <form
                    onSubmit={submitHandler}
                    className='flex flex-col items-center justify-center'
                >
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
                    <button className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg py-2 rounded-full transition mb-4'>
                        Log in
                    </button>
                    <div className='flex flex-col w-full gap-3'>
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition'
                        >
                            Forgot Password?
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowSignUp(true)}
                            className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm'
                        >
                            New Employee? Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login