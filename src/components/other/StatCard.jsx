import React from 'react'

const StatCard = ({ label, value, icon, color = 'blue', trend = null }) => {
    const colorMap = {
        blue: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
        green: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
        purple: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
        orange: 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800'
    }

    const textMap = {
        blue: 'text-blue-600 dark:text-blue-400',
        green: 'text-green-600 dark:text-green-400',
        purple: 'text-purple-600 dark:text-purple-400',
        orange: 'text-orange-600 dark:text-orange-400'
    }

    return (
        <div className={`${colorMap[color]} border rounded-xl p-6 transition hover:shadow-md`}>
            <div className='flex items-start justify-between'>
                <div>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'>{label}</p>
                    <p className='text-3xl font-bold text-black dark:text-white'>{value}</p>
                    {trend && (
                        <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                        </p>
                    )}
                </div>
                <div className={`text-3xl ${textMap[color]}`}>{icon}</div>
            </div>
        </div>
    )
}

export default StatCard
