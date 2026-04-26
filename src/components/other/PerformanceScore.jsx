import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const PerformanceScore = () => {
    const [userData, setUserData] = useContext(AuthContext)
    const [performanceData, setPerformanceData] = useState([])

    useEffect(() => {
        calculatePerformance()
    }, [userData])

    const calculatePerformance = () => {
        const performance = userData.map(emp => {
            // Tasks completed (0-40 points)
            const tasksCompleted = emp.tasksCompleted || 0
            const taskPoints = Math.min(tasksCompleted * 2, 40)

            // Attendance (0-35 points)
            const attendedDays = emp.attendance?.length || 0
            const attendancePercent = (attendedDays / 30) * 100
            const attendancePoints = (attendancePercent / 100) * 35

            // Leaves (0-25 points) - fewer leaves = more points
            const leavesCount = emp.leaves?.length || 0
            const leavePoints = Math.max(25 - (leavesCount * 2), 0)

            // Penalties (0 to -20 points) - late entries reduce score
            let penaltyDeduction = 0
            if (emp.attendance && Array.isArray(emp.attendance)) {
                emp.attendance.forEach(record => {
                    if (record.isLate && record.lateByMinutes > 0) {
                        // 1 point deduction per 5 minutes late (max 5 per day)
                        const penalties = Math.min(Math.ceil(record.lateByMinutes / 5), 5)
                        penaltyDeduction += penalties * 0.5 // Scale down to max 20 points total
                    }
                })
            }
            penaltyDeduction = Math.min(penaltyDeduction, 20) // Cap at 20 points deduction

            const totalScore = Math.round(taskPoints + attendancePoints + leavePoints - penaltyDeduction)

            return {
                id: emp.id,
                name: `${emp.firstName} `,
                tasks: tasksCompleted,
                taskPoints,
                attendance: attendedDays,
                attendancePoints,
                leaves: leavesCount,
                leavePoints,
                penaltyDeduction: penaltyDeduction.toFixed(1),
                totalScore: Math.max(totalScore, 0), // Ensure score doesn't go below 0
                grade: totalScore >= 80 ? 'A+ 🌟' : totalScore >= 70 ? 'A 👍' : totalScore >= 60 ? 'B ⚡' : totalScore >= 50 ? 'C ⚠️' : 'D 📉'
            }
        }).sort((a, b) => b.totalScore - a.totalScore)

        setPerformanceData(performance)
    }

    return (
        <div className='bg-white dark:bg-gray-700 p-6 rounded-lg mt-6'>
            <h2 className='text-2xl font-bold text-black dark:text-white mb-6'>📊 Employee Performance Score</h2>
            
            {/* Top Performers */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                {performanceData.slice(0, 3).map((emp, idx) => (
                    <div key={emp.id} className={`p-4 rounded-lg text-white font-bold text-center ${
                        idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}>
                        <div className='text-2xl mb-2'>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                        <div className='text-lg'>{emp.name}</div>
                        <div className='text-3xl font-bold'>{emp.totalScore}</div>
                        <div className='text-sm'>Rank #{idx + 1}</div>
                    </div>
                ))}
            </div>

            {/* Full Performance Table */}
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                    <thead>
                        <tr className='bg-gray-200 dark:bg-gray-600'>
                            <th className='border p-2 text-left font-bold'>Employee</th>
                            <th className='border p-2 text-center font-bold'>Tasks (40)</th>
                            <th className='border p-2 text-center font-bold'>Attendance (35)</th>
                            <th className='border p-2 text-center font-bold'>Leaves (25)</th>
                            <th className='border p-2 text-center font-bold'>Penalties</th>
                            <th className='border p-2 text-center font-bold'>Total Score</th>
                            <th className='border p-2 text-center font-bold'>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {performanceData.map((emp) => (
                            <tr key={emp.id} className='border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'>
                                <td className='border p-2 text-black dark:text-white font-semibold'>{emp.name}</td>
                                <td className='border p-2 text-center'>
                                    <div className='text-black dark:text-white'>{emp.taskPoints.toFixed(0)}/40</div>
                                    <div className='text-xs text-gray-600 dark:text-gray-400'>{emp.tasks} tasks</div>
                                </td>
                                <td className='border p-2 text-center'>
                                    <div className='text-black dark:text-white'>{emp.attendancePoints.toFixed(0)}/35</div>
                                    <div className='text-xs text-gray-600 dark:text-gray-400'>{emp.attendance} days</div>
                                </td>
                                <td className='border p-2 text-center'>
                                    <div className='text-black dark:text-white'>{emp.leavePoints.toFixed(0)}/25</div>
                                    <div className='text-xs text-gray-600 dark:text-gray-400'>{emp.leaves} leaves</div>
                                </td>
                                <td className='border p-2 text-center'>
                                    <div className={emp.penaltyDeduction > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                                        -{emp.penaltyDeduction}
                                    </div>
                                    <div className='text-xs text-gray-600 dark:text-gray-400'>Late entries</div>
                                </td>
                                <td className='border p-2 text-center font-bold text-lg text-black dark:text-white'>
                                    {emp.totalScore}
                                </td>
                                <td className='border p-2 text-center font-bold text-lg'>
                                    {emp.grade}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Score Breakdown Info */}
            <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg'>
                <div className='font-bold text-blue-900 dark:text-blue-200 mb-2'>📋 Score Breakdown</div>
                <div className='text-sm text-blue-800 dark:text-blue-300'>
                    <div>• Tasks Completed: 0-40 points (2 points per task)</div>
                    <div>• Attendance: 0-35 points (% based)</div>
                    <div>• Leaves: 0-25 points (fewer leaves = more points)</div>
                    <div>• Penalties: 0 to -20 points (late entries deduction)</div>
                    <div className='mt-2 font-bold'>Total: 0-100 points (after penalties)</div>
                </div>
            </div>
        </div>
    )
}

export default PerformanceScore
