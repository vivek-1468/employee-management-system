import React from 'react'

const PerformanceStats = ({ data }) => {
    if (!data) return null

    const { taskCounts } = data
    const totalTasks = taskCounts.newTask + taskCounts.active + taskCounts.completed + taskCounts.failed
    const completionRate = totalTasks > 0 ? Math.round((taskCounts.completed / totalTasks) * 100) : 0
    const activeRate = totalTasks > 0 ? Math.round((taskCounts.active / totalTasks) * 100) : 0

    return (
        <div className='mt-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg'>
            <h2 className='text-xl font-semibold text-black dark:text-white mb-4'>Your Performance</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-green-600 p-4 rounded text-center'>
                    <h3 className='text-2xl font-bold text-white'>{completionRate}%</h3>
                    <p className='text-sm text-green-100'>Completion Rate</p>
                </div>
                <div className='bg-blue-600 p-4 rounded text-center'>
                    <h3 className='text-2xl font-bold text-white'>{taskCounts.completed}</h3>
                    <p className='text-sm text-blue-100'>Tasks Completed</p>
                </div>
                <div className='bg-yellow-600 p-4 rounded text-center'>
                    <h3 className='text-2xl font-bold text-white'>{activeRate}%</h3>
                    <p className='text-sm text-yellow-100'>Active Tasks</p>
                </div>
            </div>
            <div className='mt-4'>
                <p className='text-gray-900 dark:text-gray-300'>
                    Keep up the great work! You've completed {taskCounts.completed} tasks out of {totalTasks} total.
                </p>
            </div>
        </div>
    )
}

export default PerformanceStats