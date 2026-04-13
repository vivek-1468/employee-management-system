import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import StatCard from './StatCard'

const AnalyticsDashboard = () => {
    const [userData] = useContext(AuthContext)
    const [analytics, setAnalytics] = useState({
        totalEmployees: 0,
        presentToday: 0,
        absentToday: 0,
        onLeave: 0,
        totalLeaves: 0,
        departmentStats: {},
        avgAttendance: 0,
        taskStats: 0
    })

    useEffect(() => {
        calculateAnalytics()
    }, [userData])

    const calculateAnalytics = () => {
        const today = new Date().toISOString().split('T')[0]
        
        let departmentMap = {}
        let presentCount = 0
        let totalTasksDone = 0
        let totalLeaves = 0
        let totalAttendanceDays = 0
        let onLeaveCount = 0

        userData?.forEach(emp => {
            // Department stats
            const dept = emp.department || 'General'
            departmentMap[dept] = (departmentMap[dept] || 0) + 1

            // Present/Absent today
            const isPresentToday = emp.attendance?.some(att => att.date === today)
            if (isPresentToday) presentCount++

            // Tasks
            totalTasksDone += emp.taskCompleted || 0

            // Leaves - count the number of approved/pending leaves
            if (Array.isArray(emp.leaves)) {
                totalLeaves += emp.leaves.length
                const hasLeaveToday = emp.leaves?.some(leave => 
                    leave.status === 'approved' && 
                    new Date(leave.startDate) <= new Date(today) && 
                    new Date(leave.endDate) >= new Date(today)
                )
                if (hasLeaveToday) onLeaveCount++
            }

            // Attendance
            totalAttendanceDays += emp.attendance?.length || 0
        })

        const avgAttendance = userData?.length > 0 ? Math.round((totalAttendanceDays / (userData.length * 30)) * 100) : 0

        setAnalytics({
            totalEmployees: userData?.length || 0,
            presentToday: presentCount,
            absentToday: (userData?.length || 0) - presentCount,
            onLeave: onLeaveCount,
            totalLeaves,
            departmentStats: departmentMap,
            avgAttendance,
            taskStats: totalTasksDone
        })
    }

    return (
        <div className='space-y-6'>
            {/* Key Metrics Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <StatCard 
                    label='Total Employees' 
                    value={analytics.totalEmployees}
                    icon='👥'
                    color='blue'
                />
                <StatCard 
                    label='Present Today' 
                    value={analytics.presentToday}
                    icon='✓'
                    color='green'
                    trend={5}
                />
                <StatCard 
                    label='Absent Today' 
                    value={analytics.absentToday}
                    icon='✕'
                    color='orange'
                />
                <StatCard 
                    label='Avg. Attendance' 
                    value={`${analytics.avgAttendance}%`}
                    icon='📊'
                    color='purple'
                />
            </div>

            {/* Secondary Metrics */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <StatCard 
                    label='Tasks Completed' 
                    value={analytics.taskStats}
                    icon='✎'
                    color='purple'
                />
                <StatCard 
                    label='Total Leaves Used' 
                    value={analytics.totalLeaves}
                    icon='🏖️'
                    color='orange'
                />
                <StatCard 
                    label='Attendance Rate' 
                    value={`${analytics.presentToday > 0 ? Math.round((analytics.presentToday / analytics.totalEmployees) * 100) : 0}%`}
                    icon='📈'
                    color='green'
                />
            </div>

            {/* Department Distribution */}
            <div className='bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800'>
                <h3 className='text-lg font-semibold text-black dark:text-white mb-6'>Department Distribution</h3>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {Object.entries(analytics.departmentStats).map(([dept, count]) => (
                        <div key={dept} className='relative p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 border border-blue-200 dark:border-blue-800 group hover:shadow-md transition'>
                            <div className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>{dept}</div>
                            <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{count}</div>
                            <div className='text-xs text-gray-500 dark:text-gray-500 mt-2'>
                                {((count / analytics.totalEmployees) * 100).toFixed(1)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Attendance Chart */}
            <div className='bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800'>
                <h3 className='text-lg font-semibold text-black dark:text-white mb-6'>Today's Attendance Status</h3>
                <div className='flex items-center justify-between gap-8 flex-wrap'>
                    <div className='flex items-end gap-4'>
                        <div className='relative'>
                            <div className='w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg'>
                                <div className='text-center'>
                                    <div className='text-4xl font-bold text-white'>{analytics.presentToday}</div>
                                    <div className='text-xs text-green-100'>Present</div>
                                </div>
                            </div>
                        </div>
                        <div className='relative'>
                            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-md'>
                                <div className='text-center'>
                                    <div className='text-2xl font-bold text-white'>{analytics.absentToday}</div>
                                    <div className='text-xs text-red-100'>Absent</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                            <div className='flex items-center gap-3'>
                                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Present: <span className='font-bold'>{analytics.presentToday}</span></span>
                            </div>
                        </div>
                        <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                            <div className='flex items-center gap-3'>
                                <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Absent: <span className='font-bold'>{analytics.absentToday}</span></span>
                            </div>
                        </div>
                        <div className='p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800'>
                            <div className='text-sm font-medium text-gray-700 dark:text-gray-300'>Total: <span className='font-bold text-lg text-blue-600 dark:text-blue-400'>{analytics.totalEmployees}</span></div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>Attendance Rate</span>
                        <span className='text-sm font-bold text-gray-900 dark:text-white'>
                            {analytics.presentToday > 0 ? Math.round((analytics.presentToday / analytics.totalEmployees) * 100) : 0}%
                        </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden'>
                        <div 
                            className='bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-300'
                            style={{ width: `${analytics.totalEmployees > 0 ? (analytics.presentToday / analytics.totalEmployees) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalyticsDashboard
