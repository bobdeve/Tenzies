import React, { useEffect, useState } from "react";

import Die from "../../Die";
import { nanoid } from "nanoid";
import "./App.css";

import Confetti from 'react-confetti'




function App() {
  const [dice, setDice] = React.useState(allNewDice);
  const [tenzies, setTenzies] = React.useState(false)
  
  const [rollTimeStamp, setRollTimeStamp] = React.useState(0)
  const [tempRoll, setTempRoll] = React.useState(0)
  

  const savedRollCount = parseInt(localStorage.getItem('maxRolls')) || 0
  
  

  const [countRoll, setCountRoll] = React.useState(savedRollCount)
  const topRollScore =[]

   console.log("This is from db "+savedRollCount)
 

  function generateNewDice (){
    return  {
    value: Math.ceil(Math.random() * 6),
    isHeld: false,
    id: nanoid(),
    }
  }
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(
         generateNewDice()
      );
    }
    return newDice;
  }
  // function createNewDices() unesscarry code 
  // {
  //   setDice(allNewDice())
  //   setTenzies(false)
  // }
  React.useEffect(()=> {
     const checkIsHeld = dice.every(die=> die.isHeld) 
     const firstValue = dice[0].value  
     const checkEveryValues = dice.every(die => die.value === firstValue)   
     if(checkEveryValues && checkIsHeld){
      console.log("You won!");
      setTenzies(true)
     }

  },[dice])

  React.useEffect(()=>{
    const currentMaxCount = parseInt(localStorage.getItem('maxRolls')) || 0;

    
    if (tempRoll > currentMaxCount) {
      localStorage.setItem('maxRolls', tempRoll.toString());
    }
   

  },[countRoll])

  const diceElements = dice.map((die) => (
    <Die
      holdDice={() => holdDice(die.id)}
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
    />
  ));
  

  function rollDice() {
    // setDice((oldDice) =>
    //   oldDice.map((die) => {
    //     return die.isHeld === false
    //       ? { ...die, id: nanoid(), value: Math.ceil(Math.random() * 6) }
    //       : die;
    //   })
    // );
       if(!tenzies){
        setDice(oldDice => oldDice.map( die => {
          return die.isHeld ?
            die :
            generateNewDice()
        }))
      
        // setCountRoll(countRoll+1)
        setTempRoll(tempRoll+1)
        if(savedRollCount<tempRoll){
          setCountRoll(tempRoll+1)
        }
      
        setRollTimeStamp(Date.now())
        console.log(rollTimeStamp)

       } else{
        setDice(allNewDice())
        setTempRoll(0)
        setTenzies(false)
        
       }
    
  }
  function holdDice(id) {
    //my Solution
    //   const setDices = dice.map(dic => {
    //     if (dic.id === id) {
    //         return {
    //             ...dic,
    //             isHeld: !dic.isHeld
    //         };
    //     } else {
    //         return dic;
    //     }
    // });
    // setDice(setDices)
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }
 const currentTimeInSeconds = Math.floor(Date.now() / 10000);
 console.log("this is seconds " + currentTimeInSeconds  )

  return (
    <main>
     {tenzies &&<Confetti/>}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-btn" onClick={rollDice}>
        {tenzies?"New Game": "Roll"}
        
      </button>
      <h1>Your current Roll is  {tempRoll} </h1> <p color="red"> Your hightest numbers of Roll {savedRollCount}</p>
      {/* <p>Amount of time it takes is {Math.floor(rollTimeStamp/1000)}</p> */}
    </main>
  );
}

export default App;
