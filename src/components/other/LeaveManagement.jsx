import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const LeaveManagement = ({ employeeData }) => {
    const [userData, setUserData] = useContext(AuthContext)
    const [showLeaveForm, setShowLeaveForm] = useState(false)
    const [leaveType, setLeaveType] = useState('sick')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [reason, setReason] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const leaveBalance = {
        sick: 10,
        casual: 12,
        earned: 20,
        maternity: 90
    }

    // Get employee's leaves
    const employeeLeaves = employeeData?.leaves || []
    const appliedLeaves = employeeLeaves.filter(l => l.status !== undefined)
    
    const getUsedLeaves = (type) => {
        return employeeLeaves
            .filter(l => l.leaveType === type && l.status === 'approved')
            .reduce((sum, l) => {
                const start = new Date(l.startDate)
                const end = new Date(l.endDate)
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
                return sum + days
            }, 0)
    }

    const handleSubmitLeave = (e) => {
        e.preventDefault()
        setErrorMessage('')

        // Validation
        if (!startDate || !endDate || !reason.trim()) {
            setErrorMessage('Please fill in all fields')
            return
        }

        if (new Date(startDate) > new Date(endDate)) {
            setErrorMessage('Start date must be before end date')
            return
        }

        if (new Date(startDate) < new Date()) {
            setErrorMessage('Cannot apply for past dates')
            return
        }

        // Calculate number of days
        const start = new Date(startDate)
        const end = new Date(endDate)
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1

        const usedDays = getUsedLeaves(leaveType)
        const balance = leaveBalance[leaveType]

        if (usedDays + days > balance) {
            setErrorMessage(`Insufficient ${leaveType} leave balance. Available: ${balance - usedDays} days`)
            return
        }

        // Create new leave request
        const newLeave = {
            id: Date.now(),
            leaveType,
            startDate,
            endDate,
            reason,
            status: 'pending',
            appliedOn: new Date().toISOString(),
            days
        }

        // Update user data
        const updatedUserData = userData.map(user =>
            user.id === employeeData.id
                ? { ...user, leaves: [...(user.leaves || []), newLeave] }
                : user
        )

        setUserData(updatedUserData)

        // Reset form
        setLeaveType('sick')
        setStartDate('')
        setEndDate('')
        setReason('')
        setShowLeaveForm(false)
        alert('Leave request submitted successfully!')
    }

    const handleCancelLeave = (leaveId) => {
        const updatedUserData = userData.map(user =>
            user.id === employeeData.id
                ? {
                    ...user,
                    leaves: user.leaves.filter(l => l.id !== leaveId)
                  }
                : user
        )
        setUserData(updatedUserData)
    }

    return (
        <div className='space-y-6'>
            {/* Leave Balance Cards */}
            <div>
                <h2 className='text-xl font-semibold text-black dark:text-white mb-4'>Leave Balance</h2>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {Object.entries(leaveBalance).map(([type, total]) => (
                        <div key={type} className='bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800'>
                            <p className='text-sm font-medium text-gray-600 dark:text-gray-400 capitalize mb-2'>{type} Leave</p>
                            <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                                {total - getUsedLeaves(type)}/{total}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                                Used: {getUsedLeaves(type)} days
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Apply Leave Button */}
            <div>
                <button
                    onClick={() => setShowLeaveForm(!showLeaveForm)}
                    className='px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition'
                >
                    {showLeaveForm ? '✕ Cancel' : '+ Apply for Leave'}
                </button>
            </div>

            {/* Apply Leave Form */}
            {showLeaveForm && (
                <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6'>
                    <h3 className='text-lg font-semibold text-black dark:text-white mb-4'>Apply for Leave</h3>
                    <form onSubmit={handleSubmitLeave} className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Leave Type
                                </label>
                                <select
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                    className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                                >
                                    {Object.keys(leaveBalance).map(type => (
                                        <option key={type} value={type} className='capitalize'>
                                            {type.charAt(0).toUpperCase() + type.slice(1)} Leave
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Leave Balance
                                </label>
                                <div className='px-4 py-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg font-medium'>
                                    {leaveBalance[leaveType] - getUsedLeaves(leaveType)} days available
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Start Date
                                </label>
                                <input
                                    type='date'
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    End Date
                                </label>
                                <input
                                    type='date'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Reason
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder='Enter reason for leave...'
                                rows='3'
                                className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                            />
                        </div>

                        {errorMessage && (
                            <div className='p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm'>
                                {errorMessage}
                            </div>
                        )}

                        <div className='flex gap-3'>
                            <button
                                type='submit'
                                className='flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition'
                            >
                                Submit Request
                            </button>
                            <button
                                type='button'
                                onClick={() => setShowLeaveForm(false)}
                                className='flex-1 px-4 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white rounded-lg font-medium transition'
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Leave History */}
            {appliedLeaves.length > 0 && (
                <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6'>
                    <h3 className='text-lg font-semibold text-black dark:text-white mb-4'>Leave Requests</h3>
                    <div className='space-y-3'>
                        {appliedLeaves.map(leave => (
                            <div key={leave.id} className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                                <div className='flex-1'>
                                    <p className='font-semibold text-black dark:text-white capitalize'>
                                        {leave.leaveType} Leave - {leave.days} days
                                    </p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                        {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                                    </p>
                                    <p className='text-sm text-gray-700 dark:text-gray-300 mt-1'>{leave.reason}</p>
                                    <div className='mt-2 space-y-1'>
                                        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                                            leave.status === 'approved'
                                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                : leave.status === 'rejected'
                                                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                        }`}>
                                            {leave.status === 'approved' && '✅ Approved by Admin'}
                                            {leave.status === 'pending' && '⏳ Pending Approval'}
                                            {leave.status === 'rejected' && '❌ Rejected by Admin'}
                                        </span>
                                        {leave.approvedOn && (
                                            <p className='text-xs text-green-600 dark:text-green-400 ml-3'>
                                                Approved on: {new Date(leave.approvedOn).toLocaleString()}
                                            </p>
                                        )}
                                        {leave.rejectedOn && (
                                            <p className='text-xs text-red-600 dark:text-red-400 ml-3'>
                                                Rejected on: {new Date(leave.rejectedOn).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {leave.status === 'pending' && (
                                    <button
                                        onClick={() => handleCancelLeave(leave.id)}
                                        className='ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition'
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LeaveManagement
