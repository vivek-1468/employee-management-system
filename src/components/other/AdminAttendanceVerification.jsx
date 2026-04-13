import React, { useState, useRef, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import ImageModal from './ImageModal'

const AdminAttendanceVerification = () => {
    const [userData, setUserData] = useContext(AuthContext)
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const [useCamera, setUseCamera] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [verificationResult, setVerificationResult] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalImage, setModalImage] = useState(null)
    const [modalTitle, setModalTitle] = useState('')

    const selectedEmpData = userData.find(emp => emp.id == selectedEmployee)

    const todayAttendance = selectedEmpData?.attendance?.find(att => {
        const attDate = new Date(att.date)
        const today = new Date()
        return attDate.toDateString() === today.toDateString()
    })

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 320 },
                    height: { ideal: 240 }
                },
                audio: false
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.play()
            }
            setUseCamera(true)
        } catch (error) {
            alert('Unable to access camera. ' + error.message)
        }
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d')
            context.drawImage(videoRef.current, 0, 0, 320, 240)
            const imageData = canvasRef.current.toDataURL('image/jpeg')
            setCapturedImage(imageData)
            stopCamera()
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject
            stream.getTracks().forEach(track => track.stop())
            videoRef.current.srcObject = null
        }
        setUseCamera(false)
    }

    const verifyFace = () => {
        if (!capturedImage || !selectedEmpData?.faceData) {
            setVerificationResult('error')
            return
        }

        // Simple face verification (in real app, use ML model)
        // For now, just confirm face data exists
        if (selectedEmpData.faceRecognitionEnabled) {
            setVerificationResult('success')
            setTimeout(() => setVerificationResult(''), 3000)
        } else {
            setVerificationResult('error')
        }
    }

    const markAttendanceAsAdmin = (type) => {
        if (!selectedEmployee) {
            alert('Please select an employee')
            return
        }

        if (!selectedEmpData.faceData) {
            alert('Employee face data not set up. Admin cannot verify.')
            return
        }

        const now = new Date()
        const today = now.toDateString()
        const time = now.toLocaleTimeString()

        const updatedUserData = userData.map(emp => {
            if (emp.id == selectedEmployee) {
                let updatedAttendance = [...(emp.attendance || [])]
                
                let todayAtt = updatedAttendance.find(att => {
                    const attDate = new Date(att.date)
                    return attDate.toDateString() === today
                })

                if (!todayAtt) {
                    todayAtt = {
                        id: Date.now(),
                        date: new Date().toISOString(),
                        checkIn: null,
                        checkOut: null,
                        verifiedByAdmin: false
                    }
                    updatedAttendance.push(todayAtt)
                } else {
                    todayAtt = { ...todayAtt }
                }

                if (type === 'checkIn') {
                    todayAtt.checkIn = time
                    todayAtt.checkInPhoto = capturedImage
                    todayAtt.verifiedByAdmin = true
                } else {
                    todayAtt.checkOut = time
                    todayAtt.checkOutPhoto = capturedImage
                    todayAtt.verifiedByAdmin = true
                }

                updatedAttendance = updatedAttendance.map(att => att.id === todayAtt.id ? todayAtt : att)

                return {
                    ...emp,
                    attendance: updatedAttendance
                }
            }
            return emp
        })

        setUserData(updatedUserData)
        localStorage.setItem('employees', JSON.stringify(updatedUserData))
        
        setCapturedImage(null)
        setSuccessMessage(`✓ ${type === 'checkIn' ? 'Check-in' : 'Check-out'} marked for ${selectedEmpData.firstName} at ${time}`)
        setTimeout(() => setSuccessMessage(''), 3000)
    }

    const openImageModal = (imageUrl, title) => {
        setModalImage(imageUrl)
        setModalTitle(title)
        setModalOpen(true)
    }

    return (
        <div className='bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-6'>
            <h2 className='text-xl font-semibold text-black dark:text-white mb-4'>Employee Attendance Verification</h2>

            {successMessage && (
                <div className='mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md'>
                    {successMessage}
                </div>
            )}

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Employee Selection & Camera */}
                <div className='lg:col-span-2'>
                    <div className='bg-white dark:bg-gray-700 p-6 rounded-lg'>
                        <h3 className='text-lg font-semibold text-black dark:text-white mb-4'>Mark Attendance</h3>

                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2'>Select Employee</label>
                            <select
                                value={selectedEmployee}
                                onChange={(e) => {
                                    setSelectedEmployee(e.target.value)
                                    setCapturedImage(null)
                                    setVerificationResult('')
                                }}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white'
                            >
                                <option value=''>Choose an employee</option>
                                {userData && userData.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedEmpData && (
                            <>
                                {!selectedEmpData.faceData ? (
                                    <div className='p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 rounded-md mb-4'>
                                        ⚠️ No face data for this employee. Admin cannot verify attendance.
                                    </div>
                                ) : (
                                    <div className='p-4 bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-md mb-4'>
                                        ✓ Face data available for verification
                                    </div>
                                )}

                                {!useCamera ? (
                                    <button
                                        onClick={startCamera}
                                        disabled={!selectedEmpData.faceData}
                                        className='w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed'
                                    >
                                        📷 Open Camera
                                    </button>
                                ) : (
                                    <div className='space-y-3'>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className='w-full bg-black rounded'
                                            style={{ maxHeight: '240px', transform: 'scaleX(-1)' }}
                                        />
                                        <canvas
                                            ref={canvasRef}
                                            className='hidden'
                                            width={320}
                                            height={240}
                                        />
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={capturePhoto}
                                                className='flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition'
                                            >
                                                📸 Capture
                                            </button>
                                            <button
                                                onClick={stopCamera}
                                                className='flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition'
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {capturedImage && (
                                    <div className='mt-4'>
                                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>Captured Image:</p>
                                        <img src={capturedImage} alt='Captured' className='w-full bg-gray-200 dark:bg-gray-600 rounded mb-3' />
                                        <button
                                            onClick={verifyFace}
                                            className='w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition mb-3'
                                        >
                                            🔍 Verify Face
                                        </button>
                                        {verificationResult === 'success' && (
                                            <div className='p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md mb-3'>
                                                ✓ Face verified successfully
                                            </div>
                                        )}
                                        {verificationResult === 'error' && (
                                            <div className='p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md mb-3'>
                                                ✕ Face verification failed
                                            </div>
                                        )}
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => markAttendanceAsAdmin('checkIn')}
                                                disabled={todayAttendance?.checkIn}
                                                className='flex-1 bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition'
                                            >
                                                ✓ Mark Check In
                                            </button>
                                            <button
                                                onClick={() => markAttendanceAsAdmin('checkOut')}
                                                disabled={!todayAttendance?.checkIn || todayAttendance?.checkOut}
                                                className='flex-1 bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-700 transition'
                                            >
                                                ✕ Mark Check Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Today's Attendance Summary */}
                <div className='bg-white dark:bg-gray-700 p-6 rounded-lg'>
                    <h3 className='text-lg font-semibold text-black dark:text-white mb-4'>Today's Summary</h3>
                    {selectedEmpData ? (
                        <div className='space-y-4'>
                            <div className='p-3 bg-gray-100 dark:bg-gray-600 rounded'>
                                <p className='text-sm font-medium text-black dark:text-white'>{selectedEmpData.firstName} {selectedEmpData.lastName}</p>
                                <p className='text-xs text-gray-600 dark:text-gray-400'>{selectedEmpData.email}</p>
                            </div>
                            
                            {todayAttendance ? (
                                <>
                                    <div className='flex items-center justify-between p-3 bg-green-50 dark:bg-green-900 rounded'>
                                        <span className='text-black dark:text-white font-medium'>Check In</span>
                                        <span className='text-green-600 dark:text-green-400 font-bold'>{todayAttendance.checkIn || '-'}</span>
                                    </div>
                                    <div className='flex items-center justify-between p-3 bg-red-50 dark:bg-red-900 rounded'>
                                        <span className='text-black dark:text-white font-medium'>Check Out</span>
                                        <span className={`font-bold ${todayAttendance.checkOut ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                                            {todayAttendance.checkOut || 'Pending'}
                                        </span>
                                    </div>
                                    {todayAttendance.verifiedByAdmin && (
                                        <div className='p-2 bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded text-sm text-center'>
                                            ✓ Verified by Admin
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className='text-gray-500 dark:text-gray-400 text-center'>No attendance today</p>
                            )}
                        </div>
                    ) : (
                        <p className='text-gray-500 dark:text-gray-400 text-center'>Select an employee</p>
                    )}
                </div>
            </div>

            {/* Attendance History for Selected Employee */}
            {selectedEmpData && (
                <div className='bg-white dark:bg-gray-700 p-6 rounded-lg mt-6'>
                    <h3 className='text-lg font-semibold text-black dark:text-white mb-4'>Attendance History - {selectedEmpData.firstName}</h3>
                    <div className='space-y-2 max-h-96 overflow-y-auto'>
                        {selectedEmpData?.attendance && selectedEmpData.attendance.length > 0 ? (
                            selectedEmpData.attendance.slice().reverse().map(att => (
                                <div key={att.id} className='p-3 bg-gray-100 dark:bg-gray-600 rounded'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <p className='text-sm font-medium text-black dark:text-white'>
                                            {new Date(att.date).toLocaleDateString()}
                                        </p>
                                        {att.verifiedByAdmin && (
                                            <span className='text-xs bg-blue-600 text-white px-2 py-1 rounded'>Admin Verified</span>
                                        )}
                                    </div>
                                    <p className='text-xs text-gray-600 dark:text-gray-400'>
                                        {att.checkIn ? `In: ${att.checkIn}` : 'No check-in'} 
                                        {att.checkOut ? ` - Out: ${att.checkOut}` : ''}
                                    </p>
                                    <div className='flex gap-2 mt-2'>
                                        {att.checkInPhoto && (
                                            <img 
                                                src={att.checkInPhoto} 
                                                alt='Check In' 
                                                className='w-10 h-10 rounded border border-gray-300 dark:border-gray-500 cursor-pointer hover:opacity-80 transition'
                                                onClick={() => openImageModal(att.checkInPhoto, `Check-In - ${new Date(att.date).toLocaleDateString()}`)}
                                            />
                                        )}
                                        {att.checkOutPhoto && (
                                            <img 
                                                src={att.checkOutPhoto} 
                                                alt='Check Out' 
                                                className='w-10 h-10 rounded border border-gray-300 dark:border-gray-500 cursor-pointer hover:opacity-80 transition'
                                                onClick={() => openImageModal(att.checkOutPhoto, `Check-Out - ${new Date(att.date).toLocaleDateString()}`)}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='text-gray-500 dark:text-gray-400 text-center'>No attendance records</p>
                        )}
                    </div>
                </div>
            )}

            <ImageModal 
                isOpen={modalOpen} 
                imageUrl={modalImage} 
                onClose={() => setModalOpen(false)}
                title={modalTitle}
            />
        </div>
    )
}

export default AdminAttendanceVerification