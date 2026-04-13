import React from 'react'
import ProfileButton from './ProfileButton'

const ProfessionalHeader = ({ data, changeUser, isAdmin }) => {
    const handleLogout = () => {
        localStorage.removeItem('loggedInUser')
        changeUser(null)
    }

    return (
        <header className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 shadow-sm'>
            <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
                {/* Logo */}
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold'>
                        EMS
                    </div>
                    <div>
                        <h1 className='text-xl font-semibold text-black dark:text-white'>Employee Management</h1>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>Professional System</p>
                    </div>
                </div>

                {/* Center - Title */}
                <div className='hidden md:block text-center'>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                        {isAdmin ? '👨‍💼 Admin Dashboard' : '👤 Employee Dashboard'}
                    </p>
                </div>

                {/* Right - User Info & Logout */}
                <div className='flex items-center gap-4'>
                    {data && (
                        <div className='text-right'>
                            <p className='text-sm font-semibold text-black dark:text-white'>{data.firstName} {data.lastName}</p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>{data.department}</p>
                        </div>
                    )}
                    <ProfileButton data={data} />
                    <button
                        onClick={handleLogout}
                        className='px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition'
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}

export default ProfessionalHeader
