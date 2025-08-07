import React from 'react'

const AddButton = ({value}) => {
  return (
    <div className='ms-2'>
        <button className="btn btn-primary" onClick={value}>Add</button>
    </div>
  )
}

export default AddButton