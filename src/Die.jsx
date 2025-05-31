import React from 'react'

function Die({ value, isHeld, holdDie }) {
  const styles = {
    backgroundColor: isHeld ? '#59e391' : null
  }
  return (
    <button 
      style={styles} 
      onClick={holdDie}
    >
      {value}
    </button>
  )
}

export default Die