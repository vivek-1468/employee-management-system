import React, { useState, useContext, useMemo } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const LatePenaltyTracking = () => {
    const { userData } = useContext(AuthContext)
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
    const [filterEmployee, setFilterEmployee] = useState('')

    // Calculate penalties for all employees
    const penaltyData = useMemo(() => {
        return userData.map(employee => {
            let totalPenalties = 0
            let lateEntries = []

            // Process all attendance records
            if (employee.attendance && Array.isArray(employee.attendance)) {
                employee.attendance.forEach(record => {
                    if (record.date && record.date.startsWith(selectedMonth) && record.isLate && record.lateByMinutes > 0) {
                        // 1 penalty point per 5 minutes late (max 5 per day)
                        const penalties = Math.min(Math.ceil(record.lateByMinutes / 5), 5)
                        totalPenalties += penalties
                        lateEntries.push({
                            date: record.date,
                            lateByMinutes: record.lateByMinutes,
                            penalties,
                            checkInTime: record.checkInTime
                        })
                    }
                })
            }

            return {
                id: employee.id,
                name: employee.firstName + ' ' + employee.lastName,
                email: employee.email,
                department: employee.department || 'N/A',
                totalPenalties,
                lateEntries
            }
        }).filter(emp => {
            if (!filterEmployee) return true
            return emp.name.toLowerCase().includes(filterEmployee.toLowerCase()) ||
                   emp.email.toLowerCase().includes(filterEmployee.toLowerCase())
        }).sort((a, b) => b.totalPenalties - a.totalPenalties)
    }, [userData, selectedMonth, filterEmployee])

    const totalEmployeesWithPenalties = penaltyData.filter(emp => emp.totalPenalties > 0).length
    const totalPenaltiesIssued = penaltyData.reduce((sum, emp) => sum + emp.totalPenalties, 0)
    const averagePenaltiesPerEmployee = totalEmployeesWithPenalties > 0 
        ? (totalPenaltiesIssued / totalEmployeesWithPenalties).toFixed(2) 
        : 0

    return (
        <div className='w-full'>
            {/* Header */}
            <div className='bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-lg mb-6'>
                <h2 className='text-3xl font-bold mb-2'>🚨 Late Entry Penalty Tracking</h2>
                <p className='text-red-100'>Monitor and manage employee late entry penalties</p>
            </div>

            {/* Statistics Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
                    <div className='text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2'>Total Penalties Issued</div>
                    <div className='text-4xl font-bold text-red-600 dark:text-red-400'>{totalPenaltiesIssued}</div>
                    <p className='text-gray-600 dark:text-gray-400 text-xs mt-2'>In {selectedMonth}</p>
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
                    <div className='text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2'>Employees with Penalties</div>
                    <div className='text-4xl font-bold text-orange-600 dark:text-orange-400'>{totalEmployeesWithPenalties}</div>
                    <p className='text-gray-600 dark:text-gray-400 text-xs mt-2'>Out of {userData.length} employees</p>
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
                    <div className='text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2'>Avg Penalties per Employee</div>
                    <div className='text-4xl font-bold text-yellow-600 dark:text-yellow-400'>{averagePenaltiesPerEmployee}</div>
                    <p className='text-gray-600 dark:text-gray-400 text-xs mt-2'>Average per late employee</p>
                </div>
            </div>

            {/* Filters */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex gap-4 flex-wrap items-center'>
                <div className='flex-1 min-w-max'>
                    <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>Month</label>
                    <input
                        type='month'
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white'
                    />
                </div>
                <div className='flex-1 min-w-max'>
                    <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>Search Employee</label>
                    <input
                        type='text'
                        placeholder='Name or email...'
                        value={filterEmployee}
                        onChange={(e) => setFilterEmployee(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white'
                    />
                </div>
            </div>

            {/* Penalty Table */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600'>
                            <tr>
                                <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 dark:text-white'>Employee Name</th>
                                <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 dark:text-white'>Email</th>
                                <th className='px-6 py-3 text-left text-sm font-bold text-gray-800 dark:text-white'>Department</th>
                                <th className='px-6 py-3 text-center text-sm font-bold text-gray-800 dark:text-white'>Late Entries</th>
                                <th className='px-6 py-3 text-center text-sm font-bold text-gray-800 dark:text-white'>Total Penalties</th>
                                <th className='px-6 py-3 text-center text-sm font-bold text-gray-800 dark:text-white'>Severity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {penaltyData.length === 0 ? (
                                <tr>
                                    <td colSpan='6' className='px-6 py-8 text-center text-gray-600 dark:text-gray-400'>
                                        No penalty data for this period
                                    </td>
                                </tr>
                            ) : (
                                penaltyData.map((emp) => (
                                    <React.Fragment key={emp.id}>
                                        <tr className='border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'>
                                            <td className='px-6 py-4 font-semibold text-gray-800 dark:text-white'>{emp.name}</td>
                                            <td className='px-6 py-4 text-gray-600 dark:text-gray-400'>{emp.email}</td>
                                            <td className='px-6 py-4 text-gray-600 dark:text-gray-400'>{emp.department}</td>
                                            <td className='px-6 py-4 text-center'>
                                                <span className='bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold'>
                                                    {emp.lateEntries.length}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 text-center'>
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                    emp.totalPenalties > 15 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                                                    emp.totalPenalties > 10 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' :
                                                    emp.totalPenalties > 5 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                                                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                                }`}>
                                                    {emp.totalPenalties}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 text-center'>
                                                <span className={`text-sm font-semibold ${
                                                    emp.totalPenalties > 15 ? 'text-red-600 dark:text-red-400' :
                                                    emp.totalPenalties > 10 ? 'text-orange-600 dark:text-orange-400' :
                                                    emp.totalPenalties > 5 ? 'text-yellow-600 dark:text-yellow-400' :
                                                    'text-green-600 dark:text-green-400'
                                                }`}>
                                                    {emp.totalPenalties > 15 ? '🔴 Critical' :
                                                     emp.totalPenalties > 10 ? '🟠 High' :
                                                     emp.totalPenalties > 5 ? '🟡 Medium' :
                                                     '🟢 Low'}
                                                </span>
                                            </td>
                                        </tr>
                                        {emp.lateEntries.length > 0 && (
                                            <tr className='bg-gray-50 dark:bg-gray-700/50'>
                                                <td colSpan='6' className='px-6 py-4'>
                                                    <div className='text-sm'>
                                                        <p className='font-semibold text-gray-700 dark:text-gray-300 mb-2'>Late Entries:</p>
                                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                                                            {emp.lateEntries.map((entry, idx) => (
                                                                <div key={idx} className='bg-white dark:bg-gray-600 p-2 rounded text-xs'>
                                                                    <p className='text-gray-600 dark:text-gray-300'>
                                                                        <strong>{entry.date}</strong> @ {entry.checkInTime}
                                                                    </p>
                                                                    <p className='text-red-600 dark:text-red-400'>
                                                                        {entry.lateByMinutes} min late ({entry.penalties} pts)
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Penalty Rules Info */}
            <div className='mt-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg'>
                <h4 className='font-bold text-blue-900 dark:text-blue-200 mb-2'>📋 Penalty System Rules</h4>
                <ul className='text-sm text-blue-800 dark:text-blue-300 space-y-1'>
                    <li>• <strong>1 Penalty Point</strong> = Every 5 minutes late (rounded up)</li>
                    <li>• <strong>Maximum 5 points</strong> per day (any lateness {'{>'} 25 mins = 5 pts)</li>
                    <li>• <strong>Green (🟢)</strong> = 1-5 penalties | <strong>Yellow (🟡)</strong> = 6-10 penalties</li>
                    <li>• <strong>Orange (🟠)</strong> = 11-15 penalties | <strong>Red (🔴)</strong> = 16+ penalties</li>
                    <li>• Penalties impact performance score and may lead to warnings</li>
                </ul>
            </div>
        </div>
    )
}

export default LatePenaltyTracking
