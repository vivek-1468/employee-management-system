import React, { useState } from 'react'
import ProfileModal from './ProfileModal'

const ProfileButton = ({ data }) => {
    const [profileModalOpen, setProfileModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setProfileModalOpen(true)}
                className='relative group'
                title='Click to edit profile'
            >
                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white dark:border-gray-800 hover:shadow-lg transition'>
                    {data?.profilePic ? (
                        <img src={data.profilePic} alt='Profile' className='w-full h-full rounded-full object-cover' />
                    ) : (
                        <>
                            {data?.firstName?.charAt(0)}{data?.lastName?.charAt(0)}
                        </>
                    )}
                </div>
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900'></div>
            </button>

            <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} employeeData={data} />
        </>
    )
}

export default ProfileButton
