import React, { useState, useEffect } from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import './App.css'

function App() {
  const [dice, setDice] = useState(generateRandomDice())
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameStatus, setGameStatus] = useState('playing') // 'playing', 'won', 'lost'
  const [display, setDisplay] = useState(false)
  const { width, height } = useWindowSize()

  // Play background music on mount
  useEffect(() => {
    const audio = new Audio('music.mp3') // Correct path for public folder
    audio.play().catch(error => {
      console.log('Audio failed:', error)
    })
  }, [])

  // Check for win condition
  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const allSame = dice.every(die => die.value === dice[0].value)

    if (allHeld && allSame) {
      setGameStatus('won')
    }
  }, [dice])

  // Flashing "You Won" message
  useEffect(() => {
    let intervalId

    if (gameStatus === 'won') {
      intervalId = setInterval(() => {
        setDisplay(prev => !prev)
      }, 1000)
    } else {
      setDisplay(false)
    }

    return () => clearInterval(intervalId)
  }, [gameStatus])

  // Countdown timer
  useEffect(() => {
    if (gameStatus !== 'playing') return

    if (timeLeft === 0) {
      setGameStatus('lost')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, gameStatus])

  // Auto-reset game after 10 seconds
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      const restart = setTimeout(() => {
        resetGame()
      }, 10000)

      return () => clearTimeout(restart)
    }
  }, [gameStatus])

  function generateRandomDice() {
    return Array.from({ length: 20 }, () => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }))
  }

  function resetGame() {
    setDice(generateRandomDice())
    setTimeLeft(30)
    setGameStatus('playing')
  }

  function rollDice() {
    if (gameStatus !== 'playing') return

    setDice(prevDice =>
      prevDice.map(die =>
        die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
      )
    )
  }

  function holdDie(id) {
    if (gameStatus !== 'playing') return

    setDice(prevDice =>
      prevDice.map(die =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    )
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDie={() => holdDie(die.id)}
    />
  ))

  return (
    <main>
      <marquee>
        This Tenzies game is developed by <strong>Matthew Olawale Olanipekun</strong>
      </marquee>

      {gameStatus === 'won' && <Confetti width={width} height={height} />}

      <h1 className='title'>TENZIES GAME</h1>
      <p className='instruction'>
        <strong>Instructions:</strong> Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
      </p>
      <p className='timer'>⏱ Time Left: {timeLeft}s</p>

      {gameStatus === 'won' && (
        <h2 className="status win" style={{ visibility: display ? 'visible' : 'hidden' }}>
          🎉 You won!!! 🎉
        </h2>
      )}
      {gameStatus === 'lost' && <h2 className="status lose">❌ You ran out of time! ❌</h2>}

      <div className='grid'>{diceElements}</div>

      <button
        className='roll-btn'
        onClick={rollDice}
        disabled={gameStatus !== 'playing'}
      >
        {gameStatus === 'playing' ? 'Roll' : 'Restarting...'}
      </button>
    </main>
  )
}

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    function handleSize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleSize)

    return () => {
      window.removeEventListener('resize', handleSize)
    }
  }, [])

  return size
}

export default App
