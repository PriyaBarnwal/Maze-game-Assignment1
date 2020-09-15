import React, {useState, useEffect, useRef} from 'react'
import './styles.scss'

const Square = ({type, onStart}) => {
  return (
    <button className={`square ${type}`} onClick={()=> onStart && onStart()}/>
  )
}

const Gameboard = ({width, height})=> {
  let numBoxes = width*height,
    numEnemies = Math.floor(Math.sqrt(numBoxes)),
    [gameStatus, setStatus] = useState(false),
    [count, setCount] = useState(0),
    [playerPosXY, setPlayerPosXY] = useState([Math.ceil(height/2), Math.ceil(width/2)]),
    [enemyPos, setEnemyPos] = useState([]),
    playerPos = (playerPosXY[0]-1)*width +(playerPosXY[1]),
    gameRef = useRef(null)

    useEffect(()=> {
      //initializing the enemy positions only once
      if(!gameStatus) {
        let enemyPositions =[]
        for(let e=0; e<numEnemies; e++) {
          let randomPos
          do {
            randomPos = Math.floor(Math.random()*numBoxes) +1
          }
          while(enemyPositions.includes(randomPos) || playerPos === randomPos)
    
          enemyPositions.push(randomPos)
        }
        setEnemyPos(enemyPositions)
      }
    }, [gameStatus, numEnemies, numBoxes, playerPos])

    //called when player clicks on mario and game starts
    let onStart = () => {
      setStatus(true)
      gameRef.current.focus()
    }

    //check if the player hits a sprite
    let checkEnemyHit = (x,y) => {
      let nextPos = (x-1)*width + y
      
      if(enemyPos.includes(nextPos)) {
        setEnemyPos(enemyPos.filter(enemy => enemy !== nextPos))
      }
    }

    let movePlayer = (x,y) => {
      if(x>0 && x<=height && y>0 && y<=width) {
        setCount(count+1)
        checkEnemyHit(x,y)
        setPlayerPosXY([x,y])
      }
    }

    let onKeyPress = (event) => {  
      console.log('pressed') 
        switch (event.key) {
          case "Down":
          case "ArrowDown":
            movePlayer(playerPosXY[0]+1,playerPosXY[1])
            break
          case "Up": 
          case "ArrowUp":
            movePlayer(playerPosXY[0]-1,playerPosXY[1])
            break
          case "Left":
          case "ArrowLeft":
            movePlayer(playerPosXY[0],playerPosXY[1]-1)
            break
          case "Right":
          case "ArrowRight":
            movePlayer(playerPosXY[0],playerPosXY[1]+1)
            break
          default:
            return
        }
    }

    let game = []

    //setting the board
    for(let i=1; i<=height; i++) {
      let row=[]

      for(let j=1; j<=width; j++) {
        if(playerPosXY[0]===i && playerPosXY[1]===j)
          row.push(<Square type='player' onStart={onStart} key={i+j}/>)
        else if(enemyPos.includes((i-1)*width +j))
          row.push(<Square type='enemy'/>)
        else
          row.push(<Square/>)
      }

      game.push(<div className="row">{row}</div>)
    }

  if(enemyPos.length === 0 && gameStatus) {
    //game over
    alert(`Game over. Total moves to save princess:${count}`)
  }

  return(
    <div 
      ref={gameRef}
      className="game" onKeyDown={(e)=>gameStatus && enemyPos.length ? onKeyPress(e) : undefined} tabIndex={0}>
      {game}
    </div>
  )
}

const Game =()=> {
  let width, height

  let validate=(input)=> {
    let num = parseInt(input)
    if (isNaN(num) || num<=0)
      return null
    return num
  }

  do {
    width = validate(prompt("Please enter board Width"))
  } while(!width)
  
  do {
    height = validate(prompt("Please enter board Height"))
  } while(!height)

  return <Gameboard height={height} width={width}/>
}

export default Game
