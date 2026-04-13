import React from 'react'

const ImageModal = ({ isOpen, imageUrl, onClose, title }) => {
    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-96 overflow-auto'>
                {/* Header */}
                <div className='flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700'>
                    <h3 className='font-semibold text-black dark:text-white'>{title}</h3>
                    <button
                        onClick={onClose}
                        className='text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-2xl'
                    >
                        ✕
                    </button>
                </div>

                {/* Image */}
                <div className='p-4 flex justify-center'>
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={title}
                            className='max-w-full max-h-96 rounded'
                        />
                    ) : (
                        <p className='text-gray-500 dark:text-gray-400'>No image available</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImageModal
