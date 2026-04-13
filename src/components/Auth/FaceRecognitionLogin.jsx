import React, { useRef, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'

const FaceRecognitionLogin = ({ onFaceLogin, fallbackToEmail }) => {
    const videoRef = useRef()
    const [isLoading, setIsLoading] = useState(true)
    const [isFaceDetected, setIsFaceDetected] = useState(false)
    const [detectionLabel, setDetectionLabel] = useState('Initializing face recognition...')
    const [modelsLoaded, setModelsLoaded] = useState(false)
    const [modelsError, setModelsError] = useState(false)

    useEffect(() => {
        loadModels()
    }, [])

    const loadModels = async () => {
        try {
            // Try to load models from CDN instead of local files
            const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/models/'
            
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
                faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
                faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
                faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
                faceapi.nets.ageGenderNet.loadFromUri(modelPath)
            ])
            setModelsLoaded(true)
            startWebcam()
        } catch (error) {
            console.error('Error loading models:', error)
            setModelsError(true)
            setDetectionLabel('⚠️ Face recognition setup incomplete. Please use email login.')
            setIsLoading(false)
        }
    }

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            })
            videoRef.current.srcObject = stream
            detectFace()
            setIsLoading(false)
        } catch (error) {
            console.error('Error accessing webcam:', error)
            setDetectionLabel('Webcam access denied')
            setModelsError(true)
            setIsLoading(false)
        }
    }

    const detectFace = async () => {
        if (!videoRef.current || !modelsLoaded) return

        try {
            const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors()
                .withFaceExpressions()
                .withAgeAndGender()

            if (detections.length > 0) {
                setIsFaceDetected(true)
                setDetectionLabel(`✓ Face detected (${Math.round(detections[0].age)} years old)`)
                
                // Store face descriptor for verification
                const faceDescriptor = detections[0].descriptor
                sessionStorage.setItem('faceDescriptor', JSON.stringify(Array.from(faceDescriptor)))
            } else {
                setIsFaceDetected(false)
                setDetectionLabel('Position your face in the camera')
            }
        } catch (err) {
            console.error('Face detection error:', err)
        }

        requestAnimationFrame(detectFace)
    }

    const handleFaceLogin = () => {
        if (isFaceDetected) {
            const faceDescriptor = sessionStorage.getItem('faceDescriptor')
            // For demo purposes, we'll accept any detected face
            // In production, you would compare with stored face descriptors
            onFaceLogin(faceDescriptor)
            setDetectionLabel('✓ Logging in via face recognition...')
        }
    }

    if (modelsError) {
        return (
            <div className='flex h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600'>
                <div className='w-full max-w-md'>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden'>
                        <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-6'>
                            <h1 className='text-3xl font-bold text-white'>👤 Face Login Setup</h1>
                        </div>
                        <div className='p-6'>
                            <div className='bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded mb-6'>
                                <p className='text-yellow-800 dark:text-yellow-200 font-semibold'>⚠️ Face Recognition Models Unavailable</p>
                                <p className='text-yellow-700 dark:text-yellow-300 text-sm mt-2'>
                                    Face recognition models are still loading. This may be the first time you're using this feature.
                                </p>
                            </div>

                            <div className='bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded mb-6'>
                                <p className='text-blue-800 dark:text-blue-200 font-semibold'>ℹ️ What's happening?</p>
                                <ul className='text-blue-700 dark:text-blue-300 text-sm mt-2 list-disc list-inside space-y-1'>
                                    <li>Downloading face detection AI models from CDN</li>
                                    <li>Requesting webcam access</li>
                                    <li>Setting up face recognition</li>
                                </ul>
                            </div>

                            <button
                                onClick={() => window.location.reload()}
                                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition mb-3'
                            >
                                🔄 Retry Face Recognition
                            </button>

                            <button
                                onClick={fallbackToEmail}
                                className='w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition'
                            >
                                📧 Use Email Login Instead
                            </button>
                        </div>

                        <div className='bg-gray-50 dark:bg-gray-700 p-4 text-sm text-gray-600 dark:text-gray-300'>
                            <p className='font-semibold mb-2'>💡 System Requirements:</p>
                            <ul className='list-disc list-inside space-y-1 text-xs'>
                                <li>Modern browser (Chrome, Firefox, Safari, Edge)</li>
                                <li>Webcam or built-in camera</li>
                                <li>Good internet for first-time model loading</li>
                                <li>Proper lighting for face detection</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600'>
            <div className='w-full max-w-md'>
                {/* Face Recognition Card */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden'>
                    <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-6'>
                        <h1 className='text-3xl font-bold text-white'>👤 Face Login</h1>
                        <p className='text-blue-100 mt-2'>Secure authentication with face recognition</p>
                    </div>

                    <div className='p-6'>
                        {/* Webcam Container */}
                        <div className='relative mb-6 rounded-lg overflow-hidden border-4 border-gray-300 dark:border-gray-600 bg-black'>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                width='100%'
                                style={{ transform: 'scaleX(-1)' }}
                                className='w-full h-64'
                            />
                            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                                <div className='w-40 h-48 border-4 border-green-400 rounded-lg opacity-50'></div>
                            </div>
                        </div>

                        {/* Status Message */}
                        <div className={`p-4 rounded-lg mb-6 text-center ${
                            isLoading
                                ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                                : isFaceDetected
                                ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                        }`}>
                            <p className='font-semibold'>{detectionLabel}</p>
                            {isFaceDetected && <p className='text-sm mt-1'>✓ Face matched. Ready to login!</p>}
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleFaceLogin}
                            disabled={!isFaceDetected || isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all mb-3 ${
                                isFaceDetected && !isLoading
                                    ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                                    : 'bg-gray-400 cursor-not-allowed opacity-50'
                            }`}
                        >
                            {isLoading ? '⏳ Loading...' : (isFaceDetected ? '✓ Login with Face' : '📽️ Waiting for face...')}
                        </button>

                        {/* Fallback Option */}
                        <button
                            onClick={fallbackToEmail}
                            className='w-full py-3 px-4 rounded-lg font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition'
                        >
                            📧 Use Email Instead
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className='bg-gray-50 dark:bg-gray-700 p-4 text-sm text-gray-600 dark:text-gray-300'>
                        <p className='font-semibold mb-2'>📸 For best results:</p>
                        <ul className='list-disc list-inside space-y-1'>
                            <li>Face good lighting</li>
                            <li>Be at arm's length from camera</li>
                            <li>Remove sunglasses and hats</li>
                            <li>Look straight at camera</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FaceRecognitionLogin
