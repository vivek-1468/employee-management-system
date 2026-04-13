import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const AllTask = () => {

   const [userData,setUserData] =  useContext(AuthContext)

   
  return (
    <div className='bg-white dark:bg-gray-900 p-6 rounded-lg mt-6'>
        {/* summary bar still useful */}
        <div className='bg-gray-200 dark:bg-gray-700 mb-4 py-2 px-4 flex justify-between rounded text-black dark:text-white font-semibold'>
            <span className='w-1/5'>Employee</span>
            <span className='w-1/5 text-center'>New</span>
            <span className='w-1/5 text-center'>Active</span>
            <span className='w-1/5 text-center'>Done</span>
            <span className='w-1/5 text-center'>Failed</span>
        </div>

        {userData && userData.map((emp, idx) => {
            return (
                <div key={idx} className='mb-8'>
                    <div className='flex items-center justify-between py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded'>
                        <h2 className='text-lg font-medium text-black dark:text-white'>{emp.firstName}</h2>
                        <div className='flex gap-4'>
                            <span className='text-blue-600 dark:text-blue-400'>{emp.taskCounts.newTask} new</span>
                            <span className='text-yellow-600 dark:text-yellow-400'>{emp.taskCounts.active} active</span>
                            <span className='text-green-600 dark:text-green-400'>{emp.taskCounts.completed} done</span>
                            <span className='text-red-600 dark:text-red-400'>{emp.taskCounts.failed} failed</span>
                        </div>
                    </div>

                    {/* show details for each task */}
                    <div className='mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                        {emp.tasks.map((t, i) => (
                            <div
                                key={i}
                                className='p-3 bg-gray-100 dark:bg-gray-800 rounded shadow'
                            >
                                <div className='flex justify-between items-center mb-1'>
                                    <div className='flex gap-2'>
                                        <span className='text-xs bg-blue-500 text-white px-2 py-0.5 rounded'>
                                            {t.category}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                            t.priority === 'High' ? 'bg-red-500 text-white' :
                                            t.priority === 'Medium' ? 'bg-yellow-500 text-black' :
                                            'bg-blue-500 text-white'
                                        }`}>
                                            {t.priority || 'Medium'}
                                        </span>
                                    </div>
                                    <span className='text-xs text-gray-500 dark:text-gray-400'>{t.taskDate}</span>
                                </div>
                                <h3 className='font-semibold text-black dark:text-white'>{t.taskTitle}</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-300'>{t.taskDescription}</p>
                                <div className='mt-2'>
                                    <span
                                        className={`inline-block px-2 py-0.5 rounded text-xs 
                                        ${t.newTask ? 'bg-blue-600' : ''}
                                        ${t.active ? 'bg-yellow-600' : ''}
                                        ${t.completed ? 'bg-green-600' : ''}
                                        ${t.failed ? 'bg-red-600' : ''}`.replace(/\s+/g, ' ')}
                                    >
                                        {t.newTask
                                            ? 'New'
                                            : t.active
                                            ? 'Active'
                                            : t.completed
                                            ? 'Completed'
                                            : 'Failed'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export default AllTask