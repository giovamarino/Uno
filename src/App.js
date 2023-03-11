import cards from "./data/cards.json";
import { useState, useEffect } from "react";

function App() {
  let [botsCards, setBotsCards] = useState([]);
  let [usersCards, setUsersCards] = useState([]);
  let [centerCard, setCenterCard] = useState([]);
  let [cardsInPlay, setCardsInPlay] = useState([]);

  useEffect(() => {
    let playCenterCard = () => {
      let randomCard = Math.floor(Math.random() * cards.length);
      return [randomCard];
    };

    const initialDraw = (cardsInUse) => {
      let cardsToAdd = [];
      for (let i = 0; i < 7; i++) {
        let randomCard = Math.floor(Math.random() * cards.length);
        while (
          cardsInUse.includes(randomCard) ||
          cardsToAdd.includes(randomCard)
        ) {
          randomCard = Math.floor(Math.random() * cards.length);
        }
        cardsToAdd.push(randomCard);
      }
      console.log(cardsToAdd);
      return cardsToAdd;
    };

    {
      let centerCardArr = playCenterCard();
      setCenterCard(centerCardArr);
      setCardsInPlay(centerCardArr);

      let botsInitialCards = initialDraw(centerCardArr);
      setBotsCards(botsInitialCards);
      setCardsInPlay((currentCards) => [...currentCards, ...botsInitialCards]);

      let usersInitialCards = initialDraw([
        ...centerCardArr,
        ...botsInitialCards,
      ]);

      setUsersCards(usersInitialCards);
      setCardsInPlay((currentCards) => [...currentCards, ...usersInitialCards]);
    }
  }, []);

  let playCard = (currentCardIdx, setWhichHand, whichCards) => {
    if (
      cards[currentCardIdx].number === cards[centerCard].number ||
      cards[currentCardIdx].color === cards[centerCard].color
    ) {
      setCenterCard([currentCardIdx]);

      // removes selected card from hand and cardsInPlay
      whichCards.forEach(() => {
        let newHand = whichCards.filter(
          (element) => element !== currentCardIdx
        );
        let newCardsInPlay = cardsInPlay.filter(
          (element) => element !== currentCardIdx
        );
        setWhichHand(newHand);
        setCardsInPlay(newCardsInPlay);
      });
    }
  };

  // put card in user/bot
  let drawCard = (setWhichHand, whichCards) => {
    let randomCard = Math.floor(Math.random() * cards.length);

    while (cardsInPlay.includes(randomCard)) {
      randomCard = Math.floor(Math.random() * cards.length);
    }
    setWhichHand([...whichCards, randomCard]);
    setCardsInPlay([...cardsInPlay, randomCard]);
  };

  useEffect(() => {
    console.log(cardsInPlay);
  }, [cardsInPlay]);

  return (
    <div className="App">
      <div>
        {botsCards.map((cardInHand) => {
          return <img src={cards[cardInHand].img} alt="" />;
        })}
      </div>
      <div>
        <img
          // onClick={() => console.log(`button works`)}
          onClick={() => {
            drawCard(setUsersCards, usersCards);
          }}
          src="/drawCard.png"
          alt=""
        />
        {centerCard.map((card) => {
          return <img src={cards[card].img} alt="" />;
        })}
      </div>
      <div>
        {usersCards.map((cardInHand) => {
          return (
            <img
              onClick={() => {
                // index, know if user/bot
                playCard(cardInHand, setUsersCards, usersCards);
              }}
              src={cards[cardInHand].img}
              alt=""
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
