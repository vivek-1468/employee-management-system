import React from 'react'

const TaskListNumbers = ({data}) => {
  if (!data) return null

  return (
    <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='rounded-xl py-6 px-8 bg-blue-500 text-white shadow'>
            <h2 className='text-3xl font-bold'>{data.taskCounts.newTask}</h2>
            <h3 className='text-xl mt-1 font-medium'>New</h3>
        </div>
        <div className='rounded-xl py-6 px-8 bg-green-500 text-white shadow'>
            <h2 className='text-3xl font-bold'>{data.taskCounts.completed}</h2>
            <h3 className='text-xl mt-1 font-medium'>Completed</h3>
        </div>
        <div className='rounded-xl py-6 px-8 bg-yellow-400 text-black shadow'>
            <h2 className='text-3xl font-bold'>{data.taskCounts.active}</h2>
            <h3 className='text-xl mt-1 font-medium'>Accepted</h3>
        </div>
        <div className='rounded-xl py-6 px-8 bg-red-500 text-white shadow'>
            <h2 className='text-3xl font-bold'>{data.taskCounts.failed}</h2>
            <h3 className='text-xl mt-1 font-medium'>Failed</h3>
        </div>
    </div>
  )
}

export default TaskListNumbers