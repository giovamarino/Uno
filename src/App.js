import cards from "./data/cards.json";
import { useState, useEffect } from "react";

function App() {
  let [botsCards, setBotsCards] = useState([]);
  let [usersCards, setUsersCards] = useState([]);
  let [centerCard, setCenterCard] = useState([]);
  let [cardsInPlay, setCardsInPlay] = useState([]);
  let [canPlayCards, setCanPlayCards] = useState(true);

  let generateRandomCard = () => {
    return Math.floor(Math.random() * cards.length);
  };

  useEffect(() => {
    let playCenterCard = () => {
      let randomCard = generateRandomCard();
      console.log(`randomCard: ${randomCard}`);
      return [randomCard];
    };

    const initialDraw = (cardsInUse) => {
      let cardsToAdd = [];
      for (let i = 0; i < 7; i++) {
        let randomCard = generateRandomCard();
        while (
          cardsInUse.includes(randomCard) ||
          cardsToAdd.includes(randomCard)
        ) {
          randomCard = generateRandomCard();
        }
        cardsToAdd.push(randomCard);
      }
      console.log(cardsToAdd);
      return cardsToAdd;
    };

    // set initial center, bot, and user cards
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
      canPlayCards &&
      (cards[currentCardIdx].number === cards[centerCard].number ||
        cards[currentCardIdx].color === cards[centerCard].color)
    ) {
      // sets new center card. removes card from hand.
      setCenterCard([currentCardIdx]);
      let newHand = whichCards.filter((element) => element !== currentCardIdx);
      setWhichHand(newHand);

      // removes old center card from play
      let [centerCardNumber] = centerCard;
      let filteredCardsInPlay = cardsInPlay.filter(
        (element) => element !== centerCardNumber
      );
      setCardsInPlay(filteredCardsInPlay);
      setCanPlayCards(false);
    }
  };

  // put card in user/bot hand
  let drawCard = (setWhichHand, whichCards) => {
    if (canPlayCards) {
      let randomCard = generateRandomCard();

      while (cardsInPlay.includes(randomCard)) {
        randomCard = generateRandomCard();
      }
      setWhichHand([...whichCards, randomCard]);
      setCardsInPlay([...cardsInPlay, randomCard]);
    }
  };

  useEffect(() => {
    if (!canPlayCards) {
      console.log(`bot's turn`);
    }
  }, [canPlayCards]);

  useEffect(() => {
    console.log(`cards in play: ${cardsInPlay}`);
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
