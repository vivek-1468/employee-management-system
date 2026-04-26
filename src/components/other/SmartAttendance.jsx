import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const SmartAttendance = () => {
    const [userData, setUserData] = useContext(AuthContext)
    const [attendanceData, setAttendanceData] = useState({})
    const [bestEmployee, setBestEmployee] = useState(null)
    const [warnings, setWarnings] = useState([])

    useEffect(() => {
        calculateAttendance()
    }, [userData])

    const calculateAttendance = () => {
        const today = new Date()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
        
        let monthAttendance = {}
        let bestScore = 0
        let bestEmp = null
        let warningList = []

        userData.forEach(emp => {
            const attendedDays = emp.attendance?.filter(att => {
                const attDate = new Date(att.date)
                return attDate.getMonth() === currentMonth && attDate.getFullYear() === currentYear
            }).length || 0

            const percentage = (attendedDays / daysInMonth) * 100
            const isLate = emp.attendance?.some(att => att.isLate === true) || false
            
            monthAttendance[emp.id] = {
                name: `${emp.firstName}`,
                attended: attendedDays,
                total: daysInMonth,
                percentage: Math.round(percentage),
                isLate,
                status: percentage >= 75 ? '✓ Good' : '⚠️ Low'
            }

            if (percentage < 75) {
warningList.push(`${emp.firstName}: ${Math.round(percentage)}% (Low Attendance)`)            }

            if (percentage > bestScore) {
                bestScore = percentage
              bestEmp = { name: `${emp.firstName}`, percentage: Math.round(percentage) }
            }
        })

        setAttendanceData(monthAttendance)
        setBestEmployee(bestEmp)
        setWarnings(warningList)
    }

    const markAttendance = (empId, isLate = false) => {
        const today = new Date().toISOString().split('T')[0]
        
        const updatedData = userData.map(emp => {
            if (emp.id.toString() === empId) {
                const existingAtt = emp.attendance || []
                const alreadyMarked = existingAtt.some(att => att.date === today)
                
                if (!alreadyMarked) {
                    return {
                        ...emp,
                        attendance: [...existingAtt, { date: today, isLate }]
                    }
                }
            }
            return emp
        })

        setUserData(updatedData)
        localStorage.setItem('employees', JSON.stringify(updatedData))
        
    }

    return (
        <div className='bg-white dark:bg-gray-700 p-6 rounded-lg mt-6'>
            <h2 className='text-2xl font-bold text-black dark:text-white mb-6'>🎯 Smart Attendance System</h2>

            {/* Best Employee Badge */}
            {bestEmployee && (
                <div className='mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg border-2 border-yellow-400'>
                    <div className='text-center'>
                        <div className='text-3xl mb-2'>🏆</div>
                        <div className='font-bold text-xl text-orange-800 dark:text-orange-200'>Best Employee of Month</div>
                        <div className='text-lg text-orange-700 dark:text-orange-300 font-semibold'>{bestEmployee.name}</div>
                        <div className='text-sm text-orange-600 dark:text-orange-400'>Attendance: {bestEmployee.percentage}%</div>
                    </div>
                </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className='mb-6 p-4 bg-red-100 dark:bg-red-900 rounded-lg border-2 border-red-400'>
                    <div className='font-bold text-red-700 dark:text-red-300 mb-2'>⚠️ Low Attendance Warnings</div>
                    {warnings.map((warning, idx) => (
                        <div key={idx} className='text-sm text-red-600 dark:text-red-200 py-1'>
                            • {warning}
                        </div>
                    ))}
                </div>
            )}

            {/* Attendance Table */}
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                    <thead>
                        <tr className='bg-gray-200 dark:bg-gray-600'>
                            <th className='border p-2 text-left font-bold'>Employee</th>
                            <th className='border p-2 text-center font-bold'>Present</th>
                            <th className='border p-2 text-center font-bold'>Attendance %</th>
                            <th className='border p-2 text-center font-bold'>Status</th>
                            <th className='border p-2 text-center font-bold'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(attendanceData).map(([empId, data]) => (
                            <tr key={empId} className='border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'>
                                <td className='border p-2 text-black dark:text-white'>{data.name}</td>
                                <td className='border p-2 text-center font-semibold text-black dark:text-white'>
                                    {data.attended}/{data.total}
                                </td>
                                <td className='border p-2 text-center font-bold'>
                                    <div className='relative w-full bg-gray-300 rounded h-6 overflow-hidden'>
                                        <div 
                                            className={`h-full transition-all ${data.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{ width: `${data.percentage}%` }}
                                        ></div>
                                        <span className='absolute inset-0 flex items-center justify-center text-sm font-bold text-white'>
                                            {data.percentage}%
                                        </span>
                                    </div>
                                </td>
                                <td className='border p-2 text-center font-semibold text-black dark:text-white'>
                                    {data.status}
                                </td>
                                <td className='border p-2 text-center'>
                                    <button
                                        onClick={() => markAttendance(empId, false)}
                                        className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-bold'
                                    >
                                        ✓ Present
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SmartAttendance
