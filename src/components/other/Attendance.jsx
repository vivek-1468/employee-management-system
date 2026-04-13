import React, { useState, useRef, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const Attendance = ({ employeeData }) => {
    const [userData, setUserData] = useContext(AuthContext)
    const [useCamera, setUseCamera] = useState(false)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const [successMessage, setSuccessMessage] = useState('')

    const todayAttendance = employeeData?.attendance?.find(att => {
        const attDate = new Date(att.date)
        const today = new Date()
        return attDate.toDateString() === today.toDateString()
    })

    const startCamera = async () => {
    setUseCamera(true) // पहले video UI दिखाओ

    setTimeout(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                await videoRef.current.play().catch(() => {})
            }

        } catch (err) {
            alert("Camera error: " + err.message)
            setUseCamera(false)
        }
    }, 300) // छोटा delay जरूरी है
}

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d')
            context.drawImage(videoRef.current, 0, 0, 640, 480)
            const imageData = canvasRef.current.toDataURL('image/jpeg')
            
            // Handle check-in with photo
            const now = new Date()
            const today = now.toDateString()
            const time = now.toLocaleTimeString()

            const updatedUserData = userData.map(emp => {
                if (emp.id === employeeData.id) {
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
                            checkOut: null
                        }
                        updatedAttendance.push(todayAtt)
                    } else {
                        todayAtt = { ...todayAtt }
                    }

                    todayAtt.checkIn = time
                    todayAtt.checkInPhoto = imageData

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
            setSuccessMessage(`✓ Checked in at ${time}`)
            
            stopCamera()
            setTimeout(() => setSuccessMessage(''), 3000)
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

    return (
        <div className='bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800'>
            <h2 className='text-2xl font-semibold text-black dark:text-white mb-6'>Mark Attendance</h2>

            {successMessage && (
                <div className='mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg'>
                    {successMessage}
                </div>
            )}

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Camera Section - Check In Only */}
                {/* <div>
                    <h3 className='text-lg font-semibold text-black dark:text-white mb-4'>Check In</h3>
                    
                    {!useCamera ? (
                        <button
                            onClick={startCamera}
                            disabled={todayAttendance?.checkIn}
                            className='w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition'
                        >
                            📷 Open Camera for Check In
                        </button>
                    ) : (
                        <div className='space-y-4'>
                            <div className='relative rounded-lg overflow-hidden bg-black shadow-lg'>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className='w-full aspect-square object-cover'
                                    style={{ transform: 'scaleX(-1)' }}
                                />
                            </div>
                            <canvas
                                ref={canvasRef}
                                className='hidden'
                                width={640}
                                height={480}
                            />
                            <div className='flex gap-2'>
                                <button
                                    onClick={capturePhoto}
                                    className='flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition'
                                >
                                    ✓ Capture Photo
                                </button>
                                <button
                                    onClick={stopCamera}
                                    className='flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition'
                                >
                                    ✕ Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div> */}

                {/* Today's Status & Check Out */}
                <div>
                    <h3 className='text-lg font-semibold text-black dark:text-white mb-4'>Today's Status</h3>
                    {todayAttendance ? (
                        <div className='space-y-4'>
                            <div className='p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-300 dark:border-green-800'>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>Check In Time</p>
                                <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
                                    {todayAttendance.checkIn ? todayAttendance.checkIn : '—'}
                                </p>
                            </div>

                            <div className='p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border-2 border-red-300 dark:border-red-800'>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>Check Out Time</p>
                                <p className={`text-2xl font-bold ${
                                    todayAttendance.checkOut 
                                        ? 'text-red-600 dark:text-red-400' 
                                        : 'text-gray-500 dark:text-gray-500'
                                }`}>
                                    {todayAttendance.checkOut || 'Pending'}
                                </p>
                            </div>

                            {todayAttendance.checkIn && !todayAttendance.checkOut && (
                                <button
                                    onClick={() => {
                                        const now = new Date()
                                        const today = now.toDateString()
                                        const time = now.toLocaleTimeString()
                                        
                                        const updatedUserData = userData.map(emp => {
                                            if (emp.id === employeeData.id) {
                                                let updatedAttendance = [...(emp.attendance || [])]
                                                let todayAtt = updatedAttendance.find(att => {
                                                    const attDate = new Date(att.date)
                                                    return attDate.toDateString() === today
                                                })
                                                if (todayAtt) {
                                                    todayAtt.checkOut = time
                                                }
                                                return { ...emp, attendance: updatedAttendance }
                                            }
                                            return emp
                                        })
                                        setUserData(updatedUserData)
                                        localStorage.setItem('employees', JSON.stringify(updatedUserData))
                                        setSuccessMessage(`✓ Checked out at ${time}`)
                                        setTimeout(() => setSuccessMessage(''), 3000)
                                    }}
                                    className='w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition'
                                >
                                    Check Out
                                </button>
                            )}

                            {todayAttendance.checkIn && todayAttendance.checkOut && (
                                <div className='p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-center font-semibold'>
                                    ✓ Attendance Complete
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='p-8 bg-gray-100 dark:bg-gray-800 rounded-lg text-center'>
                            <p className='text-gray-500 dark:text-gray-400 font-medium'>No attendance marked yet</p>
                            <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>Click "Open Camera" to mark attendance</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Attendance History */}
            <div className='bg-white dark:bg-gray-700 p-6 rounded-lg mt-6'>
                <h3 className='text-lg font-semibold text-black dark:text-white mb-4'>Attendance History</h3>
                <div className='space-y-2 max-h-96 overflow-y-auto'>
                    {employeeData?.attendance && employeeData.attendance.length > 0 ? (
                        employeeData.attendance.slice().reverse().map(att => (
                            <div key={att.id} className='p-3 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-black dark:text-white'>
                                        {new Date(att.date).toLocaleDateString()}
                                    </p>
                                    <p className='text-xs text-gray-600 dark:text-gray-400'>
                                        {att.checkIn ? `In: ${att.checkIn}` : 'No check-in'} 
                                        {att.checkOut ? ` - Out: ${att.checkOut}` : ''}
                                    </p>
                                </div>
                                <span className={`text-sm font-semibold ${att.checkOut ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                    {att.checkOut ? 'Complete' : 'In Progress'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className='text-gray-500 dark:text-gray-400 text-center'>No attendance records</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Attendance