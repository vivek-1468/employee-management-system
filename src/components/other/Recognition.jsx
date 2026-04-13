import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const Recognition = () => {
    const [userData, setUserData] = useContext(AuthContext)
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const [recognitionType, setRecognitionType] = useState('Great Job')
    const [message, setMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const recognitionTypes = ['Great Job', 'Team Player', 'Innovation', 'Leadership', 'Excellence']

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!selectedEmployee || !message) return

        const updatedUserData = userData.map(emp => {
            if (emp.id == selectedEmployee) {
                const newRecognition = {
                    id: Date.now(),
                    type: recognitionType,
                    message,
                    date: new Date().toISOString()
                }
                const notification = {
                    id: Date.now() + 1,
                    message: `You received a recognition: ${recognitionType}`,
                    date: new Date().toISOString(),
                    type: 'recognition'
                }
                return {
                    ...emp,
                    recognitions: [...(emp.recognitions || []), newRecognition],
                    notifications: [...(emp.notifications || []), notification]
                }
            }
            return emp
        })
        setUserData(updatedUserData)
        setSelectedEmployee('')
        setMessage('')
        setRecognitionType('Great Job')
        
        // Show success message
        setSuccessMessage('✓ Recognition given successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
    }

    return (
        <div className='bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-6'>
            <h2 className='text-xl font-semibold text-black dark:text-white mb-4'>Give Recognition</h2>
            {successMessage && (
                <div className='mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md'>
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-900 dark:text-gray-300'>Select Employee</label>
                    <select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className='mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white'
                        required
                    >
                        <option value=''>Choose an employee</option>
                        {userData.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-900 dark:text-gray-300'>Recognition Type</label>
                    <select
                        value={recognitionType}
                        onChange={(e) => setRecognitionType(e.target.value)}
                        className='mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white'
                    >
                        {recognitionTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-900 dark:text-gray-300'>Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className='mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white'
                        rows='3'
                        placeholder='Write a recognition message...'
                        required
                    ></textarea>
                </div>
                <button
                    type='submit'
                    className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition'
                >
                    Give Recognition
                </button>
            </form>
        </div>
    )
}

export default Recognition