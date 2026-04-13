import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const Leaderboard = () => {
    const [userData] = useContext(AuthContext)

    if (!userData || !Array.isArray(userData) || userData.length === 0) {
        return <div className='bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-6'>No employee data available</div>
    }

    // Sort employees by completed tasks in descending order
    const sortedEmployees = [...userData].sort((a, b) => b.taskCounts.completed - a.taskCounts.completed)

    return (
        <div className='bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-6'>
            <h2 className='text-xl font-semibold text-black dark:text-white mb-4'>Employee Leaderboard</h2>
            <div className='space-y-4'>
                {sortedEmployees.map((emp, index) => (
                    <div key={emp.id} className='flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded'>
                        <div className='flex items-center'>
                            <span className='text-2xl mr-4'>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                            </span>
                            <div>
                                <h3 className='text-lg font-medium text-black dark:text-white'>{emp.firstName || 'Unknown'}</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-300'>{emp.email || 'No email'}</p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='text-green-600 dark:text-green-400 font-bold'>{emp.taskCounts?.completed || 0} Completed</p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>Active: {emp.taskCounts?.active || 0} | Failed: {emp.taskCounts?.failed || 0}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Leaderboard