import React from 'react'

const InputField = ({value , remover}) => {
  return (
    <div className='input-group'>
        <input  type="text" className='form-control' placeholder='Enter task' onChange={value} value={remover} />
    </div>
  )
}

export default InputField