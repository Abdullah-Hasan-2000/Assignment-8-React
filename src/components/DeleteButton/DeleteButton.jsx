import React from 'react'


const DeleteButton = ({value}) => {
  return (
    <div style={{margin: '0 0 0 10px', width: '120px'}}>
      <button className="btn btn-danger" onClick={value}>Delete All</button>
    </div>
  )
}

export default DeleteButton