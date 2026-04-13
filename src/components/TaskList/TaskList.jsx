import React from 'react'
import AcceptTask from './AcceptTask'
import NewTask from './NewTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FailedTask'

const TaskList = ({ data }) => {
    if (!data) return null

    return (
        <div id='tasklist' className='mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {data.tasks.map((elem, idx) => {
                if (elem.active) {
                    return <AcceptTask key={idx} data={elem} employeeData={data} />
                }
                if (elem.newTask) {
                    return <NewTask key={idx} data={elem} employeeData={data} />
                }
                if (elem.completed) {
                    return <CompleteTask key={idx} data={elem} />
                }
                if (elem.failed) {
                    return <FailedTask key={idx} data={elem} />
                }

            })}
        </div>
    )
}

export default TaskList