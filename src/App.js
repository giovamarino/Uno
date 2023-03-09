import cards from "./data/cards.json";
import { useState, useEffect } from "react";

function App() {
  let [usersCards, setUsersCards] = useState([]);
  let [botsCards, setBotsCards] = useState([]);
  let [centerCard, setCenterCard] = useState([]);
  let [cardsInPlay, setCardsInPlay] = useState([]);

  useEffect(() => {
    // get card. put it in centerCard and cardsInPlay array
    let playCenterCard = () => {
      let randomCard = [Math.floor(Math.random() * cards.length)];
      console.log(randomCard);
      return randomCard;
    };
    let centerCardArr = playCenterCard();
    setCenterCard(centerCardArr);
    setCardsInPlay(centerCardArr);

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

    let usersInitialCards = initialDraw(centerCardArr);
    setUsersCards(usersInitialCards);
    setCardsInPlay(usersInitialCards);
    let userAndCenterCard = [...centerCardArr, usersInitialCards];

    let botsInitialCards = initialDraw(userAndCenterCard);
    setBotsCards(botsInitialCards);
    setCardsInPlay((currentCards) => [...currentCards, ...botsInitialCards]);
  }, []);

  let playCard = (currentCardIdx) => {
    if (
      cards[currentCardIdx].number === cards[centerCard].number ||
      cards[currentCardIdx].color === cards[centerCard].color
    ) {
      console.log(`centerCard: ${centerCard}`);
      console.log(`currentCardIdx: ${currentCardIdx}`);
      // todo: remove it from usersCards
      // todo: remove old centerCard from cardsInPlay
      setCenterCard(currentCardIdx);
      console.log(
        `${cards[currentCardIdx].color} ${cards[currentCardIdx].number}`
      );
    }
  };

  return (
    <div className="App">
      <div>
        {usersCards.map((cardInHand) => {
          return <img src={cards[cardInHand].img} alt="" />;
        })}
      </div>
      <div>
        {centerCard.map((card) => {
          return <img src={cards[card].img} alt="" />;
        })}
        {/* <img src={cards[centerCard].img} alt="" /> */}
      </div>
      <div>
        {botsCards.map((cardInHand) => {
          return (
            <img
              onClick={() => {
                playCard(cardInHand);
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
