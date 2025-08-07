import React from 'react'

const DeleteTask = ({value}) => {
  return (
    <div className='ms-2'>
        <button onClick={value} className='btn btn-danger'>Delete</button>
    </div>
  )
}

export default DeleteTask