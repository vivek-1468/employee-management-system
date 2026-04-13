import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const CreateTask = () => {

    const [userData, setUserData] = useContext(AuthContext)

    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [asignTo, setAsignTo] = useState('')
    const [category, setCategory] = useState('')
    const [priority, setPriority] = useState('Medium')

    // we don't need a separate piece of state for the task object itself

    const submitHandler = (e) => {
        e.preventDefault()

        // build the task straight away so we always push the correct data
        const task = {
            id: Date.now(),
            taskTitle,
            taskDescription,
            taskDate,
            category,
            priority,
            active: false,
            newTask: true,
            failed: false,
            completed: false,
        }

        // create a new copy of the users array with the updated employee
        const updated = userData.map((emp) => {
            if (asignTo === emp.firstName) {
                const notification = {
                    id: Date.now(),
                    message: `New task assigned: ${taskTitle}`,
                    date: new Date().toISOString(),
                    type: 'task'
                }
                return {
                    ...emp,
                    tasks: [...emp.tasks, task],
                    taskCounts: {
                        ...emp.taskCounts,
                        newTask: emp.taskCounts.newTask + 1,
                    },
                    notifications: [...(emp.notifications || []), notification]
                }
            }
            return emp
        })

        setUserData(updated)
        // persist the change so a refresh keeps the information
        localStorage.setItem('employees', JSON.stringify(updated))

        // reset the form fields
        setTaskTitle('')
        setCategory('')
        setAsignTo('')
        setTaskDate('')
        setTaskDescription('')
        setPriority('Medium')
    }

    return (
        <div className='p-6 bg-gray-100 dark:bg-gray-800 mt-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold text-black dark:text-white mb-4'>Create new task</h2>
            <form
                onSubmit={submitHandler}
                className='flex flex-wrap w-full items-start justify-between gap-4'
            >
                <div className='w-1/2'>
                    <div>
                        <h3 className='text-sm text-gray-900 dark:text-gray-300 mb-0.5'>Task Title</h3>
                        <input
                            value={taskTitle}
                            onChange={(e) => {
                                setTaskTitle(e.target.value)
                            }}
                            className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400 mb-4' type="text" placeholder='Make a UI design'
                        />
                    </div>
                    <div>
                        <h3 className='text-sm text-gray-900 dark:text-gray-300 mb-0.5'>Date</h3>
                        <input
                            value={taskDate}
                            onChange={(e) => {
                                setTaskDate(e.target.value)
                            }}
                            className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400 mb-4' type="date" />
                    </div>
                    <div>
                        <h3 className='text-sm text-gray-900 dark:text-gray-300 mb-0.5'>Asign to</h3>
                        <input
                            value={asignTo}
                            onChange={(e) => {
                                setAsignTo(e.target.value)
                            }}
                            className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400 mb-4' type="text" placeholder='employee name' />
                    </div>
                    <div>
                        <h3 className='text-sm text-gray-900 dark:text-gray-300 mb-0.5'>Category</h3>
                        <input
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value)
                            }}
                            className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400 mb-4' type="text" placeholder='design, dev, etc' />
                    </div>
                    <div>
                        <h3 className='text-sm text-gray-900 dark:text-gray-300 mb-0.5'>Priority</h3>
                        <select
                            value={priority}
                            onChange={(e) => {
                                setPriority(e.target.value)
                            }}
                            className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400 mb-4'
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>

                <div className='w-2/5 flex flex-col items-start'>
                    <h3 className='text-sm text-gray-900 dark:text-gray-300 mb-0.5'>Description</h3>
                    <textarea value={taskDescription}
                        onChange={(e) => {
                            setTaskDescription(e.target.value)
                        }} className='w-full h-44 text-sm py-2 px-4 rounded outline-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400' name="" id=""></textarea>
                    <button className='bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full'>Create Task</button>
                </div>

            </form>
        </div>
    )
}

export default CreateTask