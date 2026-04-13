import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const GeoLocationCheckIn = ({ employee }) => {
    const { userData, setUserData } = useContext(AuthContext)
    const [locationData, setLocationData] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [isCheckedIn, setIsCheckedIn] = useState(false)
    const [distanceToOffice, setDistanceToOffice] = useState(null)

    // Office location (set your office coordinates here)
    const OFFICE_LOCATION = {
        lat: 28.5921, // Delhi coordinates (example)
        lng: 77.2064,
        radius: 500 // 500 meters radius
    }

    useEffect(() => {
        checkCurrentCheckInStatus()
    }, [])

    const checkCurrentCheckInStatus = () => {
        if (employee?.attendance) {
            const today = new Date().toISOString().split('T')[0]
            const todayAttendance = employee.attendance.find(a => a.date === today)
            if (todayAttendance && todayAttendance.checkInTime) {
                setIsCheckedIn(true)
            }
        }
    }

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371000 // Earth radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    const handleCheckIn = async () => {
        setLoading(true)
        setError('')

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })

            const { latitude, longitude } = position.coords
            const distance = calculateDistance(
                OFFICE_LOCATION.lat,
                OFFICE_LOCATION.lng,
                latitude,
                longitude
            )

            setDistanceToOffice(distance)
            setLocationData({ latitude, longitude })

            if (distance > OFFICE_LOCATION.radius) {
                setError(`❌ You are ${Math.round(distance)} meters away from office. Minimum ${OFFICE_LOCATION.radius}m required.`)
                return
            }

            // Check-in successful
            const today = new Date().toISOString().split('T')[0]
            const checkInTime = new Date().toLocaleTimeString()
            const lateByMinutes = calculateLateMinutes(checkInTime)

            const updatedEmployee = {
                ...employee,
                attendance: employee.attendance?.map(record => {
                    if (record.date === today) {
                        return {
                            ...record,
                            status: 'present',
                            checkInTime,
                            checkInLocation: { latitude, longitude },
                            lateByMinutes: lateByMinutes > 0 ? lateByMinutes : 0,
                            isLate: lateByMinutes > 0
                        }
                    }
                    return record
                }) || [{
                    date: today,
                    status: 'present',
                    checkInTime,
                    checkInLocation: { latitude, longitude },
                    lateByMinutes: lateByMinutes > 0 ? lateByMinutes : 0,
                    isLate: lateByMinutes > 0
                }]
            }

            const updatedUsers = userData.map(u => u.id === employee.id ? updatedEmployee : u)
            setUserData(updatedUsers)
            localStorage.setItem('userId', JSON.stringify(updatedUsers))

            setIsCheckedIn(true)
            setError('')
        } catch (err) {
            setError(`⚠️ Location access failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const calculateLateMinutes = (checkInTime) => {
        const [hours, minutes] = checkInTime.split(':').slice(0, 2).map(Number)
        const checkInDate = new Date()
        checkInDate.setHours(hours, minutes)
        
        const officeStartTime = new Date()
        officeStartTime.setHours(9, 0) // Office opens at 9 AM
        
        if (checkInDate > officeStartTime) {
            return Math.floor((checkInDate - officeStartTime) / (1000 * 60))
        }
        return 0
    }

    const handleCheckOut = async () => {
        setLoading(true)
        setError('')

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })

            const { latitude, longitude } = position.coords
            const today = new Date().toISOString().split('T')[0]
            const checkOutTime = new Date().toLocaleTimeString()

            const updatedEmployee = {
                ...employee,
                attendance: employee.attendance?.map(record => {
                    if (record.date === today) {
                        return {
                            ...record,
                            checkOutTime,
                            checkOutLocation: { latitude, longitude }
                        }
                    }
                    return record
                }) || []
            }

            const updatedUsers = userData.map(u => u.id === employee.id ? updatedEmployee : u)
            setUserData(updatedUsers)
            localStorage.setItem('userId', JSON.stringify(updatedUsers))

            setIsCheckedIn(false)
            setError('')
        } catch (err) {
            setError(`⚠️ Location access failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6'>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                    <span className='text-3xl'>📍</span>
                    <div>
                        <h3 className='text-xl font-bold text-gray-800 dark:text-white'>Geo-Location Check-In</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Office: {Math.round(OFFICE_LOCATION.radius)}m radius</p>
                    </div>
                </div>
                {isCheckedIn && <span className='bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-full font-semibold'>✓ Checked In</span>}
            </div>

            {/* Distance Display */}
            {locationData && (
                <div className='bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-4 rounded'>
                    <p className='text-sm text-gray-700 dark:text-gray-300'>
                        <strong>Current Distance:</strong> {Math.round(distanceToOffice)} meters
                    </p>
                    {distanceToOffice <= OFFICE_LOCATION.radius ? (
                        <p className='text-green-700 dark:text-green-400 text-sm mt-1'>✓ Within office boundaries</p>
                    ) : (
                        <p className='text-red-700 dark:text-red-400 text-sm mt-1'>✗ Outside office boundaries</p>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4 rounded'>
                    <p className='text-red-700 dark:text-red-400 text-sm'>{error}</p>
                </div>
            )}

            {/* Buttons */}
            <div className='flex gap-3'>
                {!isCheckedIn ? (
                    <button
                        onClick={handleCheckIn}
                        disabled={loading}
                        className='flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2'
                    >
                        {loading ? '⏳ Checking...' : '✓ Check In'}
                    </button>
                ) : (
                    <button
                        onClick={handleCheckOut}
                        disabled={loading}
                        className='flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2'
                    >
                        {loading ? '⏳ Checking...' : '✗ Check Out'}
                    </button>
                )}
                <button
                    onClick={handleCheckIn}
                    className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2'
                >
                    🔄 Refresh Location
                </button>
            </div>

            {/* Info Box */}
            <div className='mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm text-gray-700 dark:text-gray-300'>
                <p><strong>⚠️ Note:</strong> Location must be enabled. You must be within {Math.round(OFFICE_LOCATION.radius)}m of office to check-in.</p>
            </div>
        </div>
    )
}

export default GeoLocationCheckIn
