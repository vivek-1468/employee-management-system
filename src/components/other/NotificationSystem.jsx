import React, { useState, useEffect } from 'react'

const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)

    // Add notification
    const addNotification = (message, type = 'info', duration = 4000) => {
        const id = Date.now()
        const notification = { id, message, type }
        
        setNotifications(prev => [...prev, notification])
        
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id)
            }, duration)
        }
    }

    // Remove notification
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
    }

    // Export function to window for easy access
    useEffect(() => {
        window.notificationSystem = { addNotification }
    }, [])

    return (
        <>
            {/* Notification Toast Container */}
            <div className='fixed top-4 right-4 z-50 space-y-2 pointer-events-none'>
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`p-4 rounded-lg shadow-lg text-white font-semibold animate-slide-in pointer-events-auto ${
                            notif.type === 'success' ? 'bg-green-500' :
                            notif.type === 'error' ? 'bg-red-500' :
                            notif.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                        }`}
                    >
                        <div className='flex items-center justify-between gap-4'>
                            <span>{notif.message}</span>
                            <button
                                onClick={() => removeNotification(notif.id)}
                                className='text-white hover:opacity-75'
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* CSS for animation */}
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </>
    )
}

export default NotificationSystem
