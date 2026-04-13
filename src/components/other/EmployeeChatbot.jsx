import React, { useState } from 'react'

const EmployeeChatbot = ({ employeeData }) => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const predefinedQA = {
        'leave balance': `You have ${employeeData?.leaves?.length || 0} leaves remaining`,
        'attendance': `Your current attendance is ${Math.round((employeeData?.attendance?.length || 0) / 22 * 100)}%`,
        'tasks': `You have ${employeeData?.taskCompleted || 0} tasks completed`,
        'how are you': 'I am doing great! How can I help you?',
        'hello': 'Hello! Welcome to Employee Assistant. Ask me about your leave, attendance, or tasks!',
        'thanks': 'You are welcome! Feel free to ask anything else.',
        'help': 'I can help you with: Leave Balance, Attendance, Tasks, and general questions. Just ask!',
        '': 'Please ask a valid question!'
    }

    const handleSendMessage = () => {
        if (!input.trim()) return

        const userMessage = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages([...messages, userMessage])

        // Find matching response
        const lowerInput = input.toLowerCase()
        let botResponse = 'I did not understand that. Try asking: leave balance, attendance, tasks, or hello!'

        for (const [key, value] of Object.entries(predefinedQA)) {
            if (lowerInput.includes(key)) {
                botResponse = value
                break
            }
        }

        const botMessage = {
            id: Date.now() + 1,
            text: botResponse,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setTimeout(() => {
            setMessages(prev => [...prev, botMessage])
        }, 300)

        setInput('')
    }

    const clearChat = () => {
        setMessages([])
    }

    return (
        <div className='mb-6'>
            {/* Chatbot Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl shadow-lg transition transform hover:scale-110 z-40'
                title='Chat with Assistant'
            >
                💬
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className='fixed bottom-24 right-8 w-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl flex flex-col z-50 h-96'>
                    {/* Header */}
                    <div className='bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center'>
                        <h3 className='font-semibold'>Employee Assistant</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className='text-white text-xl hover:bg-blue-700 rounded px-2'
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                        {messages.length === 0 ? (
                            <div className='text-center text-gray-500 dark:text-gray-400 py-8'>
                                <p className='text-3xl mb-2'>👋</p>
                                <p className='font-semibold mb-2'>Hello! I am here to help.</p>
                                <p className='text-sm'>Ask about: leave, attendance, tasks, or just say hello!</p>
                            </div>
                        ) : (
                            messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg ${
                                            msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-bl-none'
                                        }`}
                                    >
                                        <p className='text-sm'>{msg.text}</p>
                                        <p className='text-xs opacity-70 mt-1'>{msg.timestamp}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Area */}
                    <div className='border-t border-gray-300 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 rounded-b-lg'>
                        <div className='flex gap-2 mb-2'>
                            <input
                                type='text'
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder='Type your question...'
                                className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white outline-none'
                            />
                            <button
                                onClick={handleSendMessage}
                                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition'
                            >
                                Send
                            </button>
                        </div>
                        <button
                            onClick={clearChat}
                            className='text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        >
                            Clear Chat
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EmployeeChatbot
