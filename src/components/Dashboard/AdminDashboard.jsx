import React, { useContext, useState } from 'react'
import ProfessionalHeader from '../other/ProfessionalHeader'
import CreateTask from '../other/CreateTask'
import AllTask from '../other/AllTask'
import Leaderboard from '../other/Leaderboard'
import Recognition from '../other/Recognition'
import AdminLeaveApproval from '../other/AdminLeaveApproval'
import AdminAttendanceVerification from '../other/AdminAttendanceVerification'
import SmartAttendance from '../other/SmartAttendance'
import PerformanceScore from '../other/PerformanceScore'
import AnalyticsDashboard from '../other/AnalyticsDashboard'
import LatePenaltyTracking from '../other/LatePenaltyTracking'
import { AuthContext } from '../../context/AuthProvider'
import { DarkModeContext } from '../../context/DarkModeProvider'

const AdminDashboard = (props) => {
    const [userData] = useContext(AuthContext)
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext)
    const [activeTab, setActiveTab] = useState('overview')

    const exportTasks = () => {
        const dataStr = JSON.stringify(userData, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        const exportFileDefaultName = 'ems-tasks-export.json'
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    return (
        <div className='w-full min-h-screen bg-gray-50 dark:bg-gray-950'>
            <ProfessionalHeader data={props.data} changeUser={props.changeUser} isAdmin={true} />
            
            {/* Navigation & Controls */}
            <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-30'>
                <div className='max-w-7xl mx-auto px-6 py-4'>
                    <div className='flex items-center justify-between flex-wrap gap-4'>
                        <div className='flex gap-2'>
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    activeTab === 'overview'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                📊 Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('attendance')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    activeTab === 'attendance'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                ✓ Attendance
                            </button>
                            <button
                                onClick={() => setActiveTab('tasks')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    activeTab === 'tasks'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                ✎ Tasks
                            </button>
                            <button
                                onClick={() => setActiveTab('leaves')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    activeTab === 'leaves'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                🎯 Leaves
                            </button>
                            <button
                                onClick={() => setActiveTab('penalties')}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    activeTab === 'penalties'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                🚨 Penalties
                            </button>
                        </div>

                        <div className='flex gap-2'>
                            <button
                                onClick={exportTasks}
                                className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition'
                            >
                                📥 Export
                            </button>
                            <button
                                onClick={toggleDarkMode}
                                className='px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium transition'
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-6 py-8'>
                {activeTab === 'overview' && (
                    <div className='space-y-6'>
                        <AnalyticsDashboard />
                        <SmartAttendance />
                        <PerformanceScore />
                        <Leaderboard />
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className='space-y-6'>
                        <AdminAttendanceVerification />
                        <Recognition />
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className='space-y-6'>
                        <CreateTask />
                        <AllTask />
                    </div>
                )}

                {activeTab === 'leaves' && (
                    <div className='space-y-6'>
                        <AdminLeaveApproval />
                    </div>
                )}

                {activeTab === 'penalties' && (
                    <div className='space-y-6'>
                        <LatePenaltyTracking />
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard