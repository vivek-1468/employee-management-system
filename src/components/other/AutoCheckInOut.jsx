import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const AutoCheckInOut = ({ employee }) => {
    const { userData, setUserData } = useContext(AuthContext)
    const [autoCheckInEnabled, setAutoCheckInEnabled] = useState(false)
    const [officeHours, setOfficeHours] = useState({
        startTime: '09:00',
        endTime: '18:00'
    })
    const [nextAction, setNextAction] = useState(null)
    const [lastCheckedIn, setLastCheckedIn] = useState(null)

    useEffect(() => {
        const saved = localStorage.getItem(`autoCheckIn_${employee?.id}`)
        if (saved) {
            const { enabled, hours } = JSON.parse(saved)
            setAutoCheckInEnabled(enabled)
            setOfficeHours(hours)
        }

        if (autoCheckInEnabled) {
            checkAndAutoCheckInOut()
            const interval = setInterval(checkAndAutoCheckInOut, 60000) // Check every minute
            return () => clearInterval(interval)
        }
    }, [autoCheckInEnabled])

    const checkAndAutoCheckInOut = () => {
        // Guard: ensure employee data exists
        if (!employee || !employee.id) return

        const now = new Date()
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0')
        const today = now.toISOString().split('T')[0]

        // Auto check-in
        if (currentTime >= officeHours.startTime && !isCheckedInToday()) {
            performAutoCheckIn(today)
            setNextAction(`Next auto check-out at ${officeHours.endTime}`)
        }

        // Auto check-out
        if (currentTime >= officeHours.endTime && isCheckedInToday() && !isCheckedOutToday()) {
            performAutoCheckOut(today)
            setNextAction('All automatic check-in/out completed')
        }
    }

    const isCheckedInToday = () => {
        const today = new Date().toISOString().split('T')[0]
        return employee?.attendance?.some(a => a.date === today && a.checkInTime)
    }

    const isCheckedOutToday = () => {
        const today = new Date().toISOString().split('T')[0]
        return employee?.attendance?.some(a => a.date === today && a.checkOutTime)
    }

    const performAutoCheckIn = (date) => {
        if (!employee || !employee.id || !userData) return

        const checkInTime = new Date().toLocaleTimeString()
        const lateByMinutes = calculateLateness(officeHours.startTime)

        const updatedEmployee = {
            ...employee,
            attendance: (employee.attendance || []).map(record => {
                if (record.date === date) {
                    return {
                        ...record,
                        status: 'present',
                        checkInTime,
                        isAutoCheckedIn: true,
                        lateByMinutes: lateByMinutes > 0 ? lateByMinutes : 0,
                        isLate: lateByMinutes > 0
                    }
                }
                return record
            })
        }

        // If attendance is empty, add today's record
        if (!updatedEmployee.attendance || updatedEmployee.attendance.length === 0) {
            updatedEmployee.attendance = [{
                date,
                status: 'present',
                checkInTime,
                isAutoCheckedIn: true,
                lateByMinutes: lateByMinutes > 0 ? lateByMinutes : 0,
                isLate: lateByMinutes > 0
            }]
        }

        const updatedUsers = userData.map(u => u.id === employee.id ? updatedEmployee : u)
        setUserData(updatedUsers)
        localStorage.setItem('userId', JSON.stringify(updatedUsers))
        setLastCheckedIn(checkInTime)
    }

    const performAutoCheckOut = (date) => {
        if (!employee || !employee.id || !userData) return

        const checkOutTime = new Date().toLocaleTimeString()

        const updatedEmployee = {
            ...employee,
            attendance: (employee.attendance || []).map(record => {
                if (record.date === date && record.checkInTime) {
                    return {
                        ...record,
                        checkOutTime,
                        isAutoCheckedOut: true
                    }
                }
                return record
            })
        }

        const updatedUsers = userData.map(u => u.id === employee.id ? updatedEmployee : u)
        setUserData(updatedUsers)
        localStorage.setItem('userId', JSON.stringify(updatedUsers))
    }

    const calculateLateness = (startTime) => {
        const now = new Date()
        const [startHour, startMin] = startTime.split(':').map(Number)
        const startDate = new Date()
        startDate.setHours(startHour, startMin, 0)

        if (now > startDate) {
            return Math.floor((now - startDate) / (1000 * 60))
        }
        return 0
    }

    const handleToggleAutoCheckIn = () => {
        const newState = !autoCheckInEnabled
        setAutoCheckInEnabled(newState)
        localStorage.setItem(`autoCheckIn_${employee?.id}`, JSON.stringify({
            enabled: newState,
            hours: officeHours
        }))

        if (newState) {
            checkAndAutoCheckInOut()
        }
    }

    const handleUpdateHours = (e, field) => {
        const newHours = {
            ...officeHours,
            [field]: e.target.value
        }
        setOfficeHours(newHours)
        localStorage.setItem(`autoCheckIn_${employee?.id}`, JSON.stringify({
            enabled: autoCheckInEnabled,
            hours: newHours
        }))
    }

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6'>
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                    <span className='text-3xl'>⏱️</span>
                    <div>
                        <h3 className='text-xl font-bold text-gray-800 dark:text-white'>Auto Check-In/Out System</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Automatic attendance based on time</p>
                    </div>
                </div>
                <label className='flex items-center gap-3'>
                    <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Enable</span>
                    <div className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
                        autoCheckInEnabled ? 'bg-green-600' : 'bg-gray-400'
                    }`} onClick={handleToggleAutoCheckIn}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                            autoCheckInEnabled ? 'translate-x-6' : ''
                        }`}></div>
                    </div>
                </label>
            </div>

            {/* Office Hours Configuration */}
            {autoCheckInEnabled && (
                <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4'>
                    <h4 className='font-bold text-gray-800 dark:text-white mb-3'>⏰ Office Hours</h4>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>Start Time</label>
                            <input
                                type='time'
                                value={officeHours.startTime}
                                onChange={(e) => handleUpdateHours(e, 'startTime')}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>End Time</label>
                            <input
                                type='time'
                                value={officeHours.endTime}
                                onChange={(e) => handleUpdateHours(e, 'endTime')}
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white'
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Status Messages */}
            {autoCheckInEnabled && (
                <div className='space-y-2'>
                    {lastCheckedIn && (
                        <div className='bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-3 rounded'>
                            <p className='text-sm text-green-700 dark:text-green-400'>
                                ✓ Auto checked-in today at {lastCheckedIn}
                            </p>
                        </div>
                    )}
                    {nextAction && (
                        <div className='bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-3 rounded'>
                            <p className='text-sm text-purple-700 dark:text-purple-400'>
                                📅 {nextAction}
                            </p>
                        </div>
                    )}
                    <div className='bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded'>
                        <p className='text-sm text-yellow-700 dark:text-yellow-400'>
                            ℹ️ System will automatically log check-in at {officeHours.startTime} and check-out at {officeHours.endTime}
                        </p>
                    </div>
                </div>
            )}

            {!autoCheckInEnabled && (
                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center'>
                    <p className='text-gray-700 dark:text-gray-300'>
                        Enable auto check-in/out to activate automatic attendance tracking
                    </p>
                </div>
            )}
        </div>
    )
}

export default AutoCheckInOut
