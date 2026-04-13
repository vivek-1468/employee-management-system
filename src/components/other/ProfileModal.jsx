import React, { useState, useContext, useRef } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const ProfileModal = ({ isOpen, onClose, employeeData }) => {
    const [userData, setUserData] = useContext(AuthContext)
    const [profilePic, setProfilePic] = useState(employeeData?.profilePic || null)
    const [successMessage, setSuccessMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef(null)

    const compressImage = (file, callback) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height
                
                // Resize if too large
                if (width > 500 || height > 500) {
                    const scale = Math.min(500 / width, 500 / height)
                    width *= scale
                    height *= scale
                }
                
                canvas.width = width
                canvas.height = height
                
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                
                const compressedImageData = canvas.toDataURL('image/jpeg', 0.7)
                callback(compressedImageData)
            }
            img.src = event.target.result
        }
        reader.readAsDataURL(file)
    }

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size too large. Please upload a file smaller than 2MB')
                return
            }

            setLoading(true)

            // Compress image in a timeout to prevent blocking
            setTimeout(() => {
                compressImage(file, (imageData) => {
                    try {
                        // Update UI
                        setProfilePic(imageData)

                        // Update userData
                        const updatedUserData = userData.map(emp => {
                            if (emp.id === employeeData.id) {
                                return { ...emp, profilePic: imageData }
                            }
                            return emp
                        })
                        setUserData(updatedUserData)
                        localStorage.setItem('employees', JSON.stringify(updatedUserData))
                        
                        setSuccessMessage('✓ Profile picture updated successfully!')
                        setTimeout(() => setSuccessMessage(''), 3000)
                    } catch (error) {
                        console.error('Error updating profile:', error)
                        alert('Error uploading image. Please try again.')
                    } finally {
                        setLoading(false)
                    }
                })
            }, 0)
        }
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-2xl font-bold text-black dark:text-white'>My Profile</h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50'
                    >
                        ✕
                    </button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className='mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-sm'>
                        {successMessage}
                    </div>
                )}

                {/* User Info */}
                <div className='mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800'>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Name</p>
                    <p className='font-semibold text-black dark:text-white mb-3'>
                        {employeeData?.firstName} {employeeData?.lastName}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Department</p>
                    <p className='font-semibold text-black dark:text-white mb-3'>
                        {employeeData?.department}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>Email</p>
                    <p className='font-semibold text-black dark:text-white'>
                        {employeeData?.email}
                    </p>
                </div>

                {/* Profile Picture Section */}
                <div className='mb-6'>
                    <p className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4'>Profile Picture</p>
                    
                    {/* Profile Image Display */}
                    <div className='w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden border-4 border-blue-600 shadow-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative'>
                        {loading && (
                            <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                                <div className='animate-spin'>⏳</div>
                            </div>
                        )}
                        {profilePic ? (
                            <img src={profilePic} alt='Profile' className='w-full h-full object-cover' />
                        ) : (
                            <div className='text-5xl'>📷</div>
                        )}
                    </div>

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        onChange={handleFileUpload}
                        disabled={loading}
                        className='hidden'
                    />

                    {/* Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className='w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? '⏳ Uploading...' : '📁 Upload Photo from PC'}
                    </button>

                    <p className='text-xs text-gray-500 dark:text-gray-400 text-center mt-2'>
                        Supported formats: JPG, PNG, GIF (Max 2MB)
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className='w-full px-4 py-3 border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50'
                >
                    Done
                </button>
            </div>
        </div>
    )
}

export default ProfileModal
