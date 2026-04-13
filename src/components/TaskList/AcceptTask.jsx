import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const AcceptTask = ({ data, employeeData }) => {
    const [userData, setUserData] = useContext(AuthContext)
    const [showNotes, setShowNotes] = useState(false)
    const [note, setNote] = useState(data.note || '')

    const completeTask = () => {
        const updatedUserData = userData.map(emp => {
            if (emp.id === employeeData.id) {
                const updatedTasks = emp.tasks.map(task => {
                    if (task.id === data.id) {
                        return { ...task, active: false, completed: true, note }
                    }
                    return task
                })
                return {
                    ...emp,
                    tasks: updatedTasks,
                    taskCounts: {
                        ...emp.taskCounts,
                        active: emp.taskCounts.active - 1,
                        completed: emp.taskCounts.completed + 1
                    }
                }
            }
            return emp
        })
        setUserData(updatedUserData)
    }

    const failTask = () => {
        const updatedUserData = userData.map(emp => {
            if (emp.id === employeeData.id) {
                const updatedTasks = emp.tasks.map(task => {
                    if (task.id === data.id) {
                        return { ...task, active: false, failed: true, note }
                    }
                    return task
                })
                return {
                    ...emp,
                    tasks: updatedTasks,
                    taskCounts: {
                        ...emp.taskCounts,
                        active: emp.taskCounts.active - 1,
                        failed: emp.taskCounts.failed + 1
                    }
                }
            }
            return emp
        })
        setUserData(updatedUserData)
    }

    const saveNote = () => {
        // Update note without changing status
        const updatedUserData = userData.map(emp => {
            if (emp.id === employeeData.id) {
                const updatedTasks = emp.tasks.map(task => {
                    if (task.id === data.id) {
                        return { ...task, note }
                    }
                    return task
                })
                return { ...emp, tasks: updatedTasks }
            }
            return emp
        })
        setUserData(updatedUserData)
        setShowNotes(false)
    }

    return (
        <div className='p-5 bg-yellow-600 rounded-xl shadow-md flex flex-col justify-between'>
            <div className='flex justify-between items-center mb-3'>
                <span className='text-xs bg-white text-yellow-800 px-2 py-1 rounded'>{data.category}</span>
                <div className='flex items-center gap-2'>
                    <span className={`text-xs px-2 py-1 rounded ${
                        data.priority === 'High' ? 'bg-red-500 text-white' :
                        data.priority === 'Medium' ? 'bg-yellow-500 text-black' :
                        'bg-blue-500 text-white'
                    }`}>
                        {data.priority}
                    </span>
                    <span className='text-xs text-gray-200'>{data.taskDate}</span>
                </div>
            </div>
            <h2 className='text-xl font-semibold text-white mb-2'>{data.taskTitle}</h2>
            <p className='text-sm text-gray-100 flex-grow'>{data.taskDescription}</p>
            {data.note && (
                <p className='text-xs text-gray-300 mt-2 italic'>Note: {data.note}</p>
            )}
            {showNotes && (
                <div className='mt-2'>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder='Add a personal note...'
                        className='w-full p-2 text-sm bg-gray-700 text-white rounded'
                        rows='2'
                    />
                    <button
                        onClick={saveNote}
                        className='mt-1 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded'
                    >
                        Save Note
                    </button>
                </div>
            )}
            <div className='flex justify-between mt-4'>
                <button 
                    onClick={completeTask}
                    className='bg-green-500 hover:bg-green-600 text-white rounded font-medium py-1 px-3 text-xs'
                >
                    Complete
                </button>
                <div className='flex gap-2'>
                    <button 
                        onClick={() => setShowNotes(!showNotes)}
                        className='bg-gray-500 hover:bg-gray-600 text-white rounded font-medium py-1 px-2 text-xs'
                    >
                        📝 Note
                    </button>
                    <button 
                        onClick={failTask}
                        className='bg-red-500 hover:bg-red-600 text-white rounded font-medium py-1 px-3 text-xs'
                    >
                        Fail
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AcceptTask