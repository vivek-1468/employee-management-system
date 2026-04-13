import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const AdminLeaveApproval = () => {
    const [userData, setUserData] = useContext(AuthContext)
    const [filterStatus, setFilterStatus] = useState('pending')

    // Get all leave requests from all employees
    const getAllLeaveRequests = () => {
        const allLeaves = []
        userData?.forEach(emp => {
            emp.leaves?.forEach(leave => {
                allLeaves.push({
                    ...leave,
                    employeeId: emp.id,
                    employeeName: `${emp.firstName} ${emp.lastName || ''}`,
                    employeeEmail: emp.email
                })
            })
        })
        return allLeaves.filter(l => l.status === filterStatus).sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn))
    }

    const handleApproveLeave = (employeeId, leaveId) => {
        const updatedUserData = userData.map(emp =>
            emp.id === employeeId
                ? {
                    ...emp,
                    leaves: emp.leaves.map(leave =>
                        leave.id === leaveId
                            ? { ...leave, status: 'approved', approvedOn: new Date().toISOString(), approvedBy: 'Admin' }
                            : leave
                    )
                  }
                : emp
        )
        setUserData(updatedUserData)
    }

    const handleRejectLeave = (employeeId, leaveId) => {
        const updatedUserData = userData.map(emp =>
            emp.id === employeeId
                ? {
                    ...emp,
                    leaves: emp.leaves.map(leave =>
                        leave.id === leaveId
                            ? { ...leave, status: 'rejected', rejectedOn: new Date().toISOString(), rejectedBy: 'Admin' }
                            : leave
                    )
                  }
                : emp
        )
        setUserData(updatedUserData)
    }

    const leaveRequests = getAllLeaveRequests()

    return (
        <div className='bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6'>
            <h2 className='text-2xl font-bold text-black dark:text-white mb-6'>🎯 Leave Approval Management</h2>

            {/* Filter Tabs */}
            <div className='flex gap-2 mb-6 flex-wrap'>
                {['pending', 'approved', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filterStatus === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        {status === 'pending' && `⏳ Pending (${userData?.reduce((sum, emp) => sum + (emp.leaves?.filter(l => l.status === 'pending').length || 0), 0)})`}
                        {status === 'approved' && `✅ Approved`}
                        {status === 'rejected' && `❌ Rejected`}
                    </button>
                ))}
            </div>

            {/* Leave Requests List */}
            {leaveRequests.length === 0 ? (
                <div className='text-center py-8'>
                    <p className='text-gray-500 dark:text-gray-400 text-lg'>
                        {filterStatus === 'pending' && 'No pending leave requests'}
                        {filterStatus === 'approved' && 'No approved leaves'}
                        {filterStatus === 'rejected' && 'No rejected leaves'}
                    </p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {leaveRequests.map(leave => (
                        <div
                            key={`${leave.employeeId}-${leave.id}`}
                            className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition'
                        >
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                {/* Left Side - Employee Info */}
                                <div>
                                    <h3 className='text-lg font-semibold text-black dark:text-white mb-1'>
                                        {leave.employeeName}
                                    </h3>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                                        📧 {leave.employeeEmail}
                                    </p>
                                    <div className='space-y-1'>
                                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                                            <span className='font-semibold'>Leave Type:</span> {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                                        </p>
                                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                                            <span className='font-semibold'>Duration:</span> {leave.days} days
                                        </p>
                                        <p className='text-sm text-gray-700 dark:text-gray-300'>
                                            <span className='font-semibold'>Dates:</span> {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side - Leave Details */}
                                <div>
                                    <p className='text-sm text-gray-700 dark:text-gray-300 mb-3'>
                                        <span className='font-semibold'>Reason:</span>
                                    </p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded mb-3'>
                                        {leave.reason}
                                    </p>
                                    <p className='text-xs text-gray-500 dark:text-gray-500'>
                                        Applied on: {new Date(leave.appliedOn).toLocaleString()}
                                    </p>
                                    {leave.approvedOn && (
                                        <p className='text-xs text-green-600 dark:text-green-400 mt-1'>
                                            Approved on: {new Date(leave.approvedOn).toLocaleString()}
                                        </p>
                                    )}
                                    {leave.rejectedOn && (
                                        <p className='text-xs text-red-600 dark:text-red-400 mt-1'>
                                            Rejected on: {new Date(leave.rejectedOn).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Status and Actions */}
                            <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700'>
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                        leave.status === 'pending'
                                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                            : leave.status === 'approved'
                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                    }`}>
                                        {leave.status === 'pending' && '⏳ Pending'}
                                        {leave.status === 'approved' && '✅ Approved'}
                                        {leave.status === 'rejected' && '❌ Rejected'}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                {leave.status === 'pending' && (
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={() => handleApproveLeave(leave.employeeId, leave.id)}
                                            className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition'
                                        >
                                            ✅ Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectLeave(leave.employeeId, leave.id)}
                                            className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition'
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminLeaveApproval
