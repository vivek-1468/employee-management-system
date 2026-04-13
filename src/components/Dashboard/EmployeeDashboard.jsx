import React, { useState, useContext } from 'react'
import ProfessionalHeader from '../other/ProfessionalHeader'
import TaskListNumbers from '../other/TaskListNumbers'
import TaskList from '../TaskList/TaskList'
import PerformanceStats from '../other/PerformanceStats'
import Attendance from '../other/Attendance'
import LeaveManagement from '../other/LeaveManagement'
import EmployeeChatbot from '../other/EmployeeChatbot'
import GeoLocationCheckIn from '../other/GeoLocationCheckIn'
import AutoCheckInOut from '../other/AutoCheckInOut'
import { DarkModeContext } from '../../context/DarkModeProvider'

const EmployeeDashboard = (props) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext)

    // Return loading state if data is not available
    if (!props.data) {
        return (
            <div className='flex h-screen w-screen items-center justify-center'>
                <p className='text-xl'>Loading employee data...</p>
            </div>
        )
    }

    // Filter tasks based on search and status
    const filteredData = {
        ...props.data,
        tasks: props.data.tasks.filter(task => {
            const matchesSearch = task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                task.category.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = filterStatus === 'all' ||
                                (filterStatus === 'new' && task.newTask) ||
                                (filterStatus === 'active' && task.active) ||
                                (filterStatus === 'completed' && task.completed) ||
                                (filterStatus === 'failed' && task.failed)
            return matchesSearch && matchesStatus
        })
    }

    return (
        <div className='w-full min-h-screen bg-gray-50 dark:bg-gray-950'>
            <ProfessionalHeader data={props.data} changeUser={props.changeUser} isAdmin={false} />
            
            {/* Quick Stats */}
            <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
                <div className='max-w-7xl mx-auto px-6 py-6'>
                    <TaskListNumbers data={props.data} />
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-6 py-8 space-y-6'>
                {/* Performance & Search Section */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-2'>
                        <div className='bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800'>
                            <h2 className='text-xl font-semibold text-black dark:text-white mb-4'>My Tasks</h2>
                            
                            {/* Search and Filter */}
                            <div className='flex gap-3 mb-6 flex-wrap'>
                                <input
                                    type='text'
                                    placeholder='Search tasks...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-black dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                                />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className='px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-black dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500'
                                >
                                    <option value='all'>All Tasks</option>
                                    <option value='new'>New</option>
                                    <option value='active'>Active</option>
                                    <option value='completed'>Completed</option>
                                    <option value='failed'>Failed</option>
                                </select>
                            </div>

                            <TaskList data={filteredData} />
                        </div>
                    </div>

                    <div className='space-y-6'>
                        <PerformanceStats data={props.data} />
                        
                        {/* Dark Mode Toggle Card */}
                        <div className='bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800'>
                            <button
                                onClick={toggleDarkMode}
                                className='w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition'
                            >
                                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Attendance, Check-in, and Auto Systems Section */}
                <div className='space-y-6'>
                    <GeoLocationCheckIn employee={props.data} />
                    <AutoCheckInOut employee={props.data} />
                </div>

                {/* Attendance Section */}
                {/* <Attendance employeeData={props.data} /> */}

                {/* Leave Management Section */}
                <div className='bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800'>
                    <LeaveManagement employeeData={props.data} />
                </div>

                {/* Recognitions */}
                {props.data.recognitions && props.data.recognitions.length > 0 && (
                    <div className='bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800'>
                        <h2 className='text-xl font-semibold text-black dark:text-white mb-4'>🌟 My Recognitions</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {props.data.recognitions.map(rec => (
                                <div key={rec.id} className='bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800'>
                                    <h3 className='font-semibold text-green-600 dark:text-green-400 mb-1'>{rec.type}</h3>
                                    <p className='text-sm text-gray-700 dark:text-gray-300'>{rec.message}</p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>{new Date(rec.date).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <EmployeeChatbot employeeData={props.data} />
        </div>
    )
}

export default EmployeeDashboard