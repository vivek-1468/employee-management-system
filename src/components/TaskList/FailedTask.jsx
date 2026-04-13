import React from 'react'

const FailedTask = ({data}) => {
  return (
    <div className='p-5 bg-red-700 rounded-xl shadow-md'>
        <div className='flex justify-between items-center mb-3'>
            <span className='text-xs bg-white text-red-800 px-2 py-1 rounded'>{data.category}</span>
            <span className='text-xs text-gray-200'>{data.taskDate}</span>
        </div>
        <h2 className='text-xl font-semibold text-white mb-2'>{data.taskTitle}</h2>
        <p className='text-sm text-gray-100'>{data.taskDescription}</p>
    </div>
  )
}

export default FailedTask