import React, { useEffect, useState } from 'react';
import SingleCard from './Components/SingleCard';
import './App.css';

const cardImages = [
  { "src": "/img/helmet-1.png" },
  { "src": "/img/potion-1.png" },
  { "src": "/img/ring-1.png"   },
  { "src": "/img/scroll-1.png" },
  { "src": "/img/shield-1.png" },
  { "src": "/img/sword-1.png"  },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameFinished, setGameFinished] = useState(false);

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setGameFinished(false);
  };

  const handleChoice = (card) => {
    if (disabled || card.matched) return;

    if (!choiceOne) {
      setChoiceOne(card);
    } else if (!choiceTwo) {
      setChoiceTwo(card);
    }
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  const handleNameInput = () => {
    const name = prompt("Adınız: ");
    setPlayerName(name);
  };

  useEffect(() => {
    handleNameInput();
    shuffleCards();
  }, []);

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);

      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === choiceOne.src ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    const allMatched = cards.every((card) => card.matched);
    if (allMatched) {
      setGameFinished(true);
    }
  }, [cards]);

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>Yeniden Karıştır</button>
      <div className="modal-button">Oyuna Hoşgeldin {playerName}</div>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Hamle Sayısı: {turns}</p>

      {gameFinished && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tebrikler, Bulmacayı Tamamladınız!</h2>
            <p>Toplam Hamle Sayısı: {turns}</p>
            <button onClick={shuffleCards}>Yeniden Başla</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
