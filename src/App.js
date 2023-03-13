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
      cards[currentCardIdx].number === cards[centerCard].number ||
      cards[currentCardIdx].color === cards[centerCard].color
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
      setCanPlayCards(!canPlayCards);
    }
  };

  // put card in user/bot hand
  let drawCard = (setWhichHand, whichCards) => {
    // if (canPlayCards) {
    let randomCard = generateRandomCard();

    while (cardsInPlay.includes(randomCard)) {
      randomCard = generateRandomCard();
    }
    setWhichHand([...whichCards, randomCard]);
    setCardsInPlay([...cardsInPlay, randomCard]);
    // }
  };

  // bot's turn
  useEffect(() => {
    if (!canPlayCards) {
      setTimeout(() => {
        // botsCards.forEach((cardInHand) => {
        //   playCard(cardInHand, setBotsCards, botsCards);
        // });
        organizeHand();
      }, 1000);
    }
  }, [canPlayCards]);

  // bot functions
  let organizeHand = () => {
    // playable cards
    let numberedCards = [];
    let actionCards = [];
    let wildCards = [];

    // extra organization
    let blueCards = [];
    let greenCards = [];
    let redCards = [];
    let yellowCards = [];
    // maybe: drawingCards[]

    botsCards.forEach((cardInHandIdx) => {
      let matchingNumbers =
        cards[cardInHandIdx].number === cards[centerCard].number;
      let matchingColors =
        cards[cardInHandIdx].color === cards[centerCard].color;

      if ((matchingNumbers || matchingColors) && cardInHandIdx <= 39) {
        numberedCards.push(cardInHandIdx);
      } else if (matchingColors && cardInHandIdx >= 40 && cardInHandIdx <= 51) {
        actionCards.push(cardInHandIdx);
      } else if (cardInHandIdx >= 52) {
        wildCards.push(cardInHandIdx);
      }

      if (cardInHandIdx <= 9) {
        blueCards.push(cardInHandIdx);
      } else if (cardInHandIdx >= 10 && cardInHandIdx <= 19) {
        greenCards.push(cardInHandIdx);
      } else if (cardInHandIdx >= 20 && cardInHandIdx <= 29) {
        redCards.push(cardInHandIdx);
      } else if (cardInHandIdx >= 30 && cardInHandIdx <= 39) {
        yellowCards.push(cardInHandIdx);
      }
    });

    // determine which card to play
    // if none:
    if (
      numberedCards.length === 0 &&
      actionCards.length === 0 &&
      wildCards.length === 0
    ) {
      console.log(`no playable cards`);
      drawCard(setBotsCards, botsCards);
      console.log(`botsCards: ${botsCards}`);
    } else if (
      numberedCards.length <= actionCards.length &&
      actionCards.length > 0
    ) {
      console.log(`play action card`);
    } else if (numberedCards != null) {
      console.log(`play random numbered card`);
    } else {
      console.log(`choose wild card `);
    }

    {
      console.log(`numberedCards: ${numberedCards}`);
      console.log(`actionCards: ${actionCards}`);
      console.log(`wildCards: ${wildCards}`);
      console.log(`blueCards: ${blueCards}`);
      console.log(`greenCards: ${greenCards}`);
      console.log(`redCards: ${redCards}`);
      console.log(`yellowCards: ${yellowCards}`);
    }
  };

  // plays drawn card
  useEffect(() => {
    if (!canPlayCards) {
      setTimeout(() => {
        // if (wildCard) {
        // botWildCardSelection():
        //   compare colorCard arrays. select one with highest length.
        //   if the same, choose whatever color user just changed from
        //   if none, randomly choose between ones of highest length
        // }
        if (
          (cards[botsCards[botsCards.length - 1]].number ===
            cards[centerCard].number ||
            cards[botsCards[botsCards.length - 1]].color ===
              cards[centerCard].color) &&
          botsCards[botsCards.length - 1] <= 39

          // cards[botsCards[botsCards.length - 1]].number ===
          //   cards[centerCard].number ||
          // cards[botsCards[botsCards.length - 1]].color ===
          //   cards[centerCard].color

          // same color DONE
          // same number DONE
          // same actiontype PENDING
        ) {
          console.log("playing drawn card");
          console.log(
            `drawn: ${cards[botsCards[botsCards.length - 1]].color} ${
              cards[botsCards[botsCards.length - 1]].number
            }`
          );
          console.log(
            `center: ${cards[centerCard].color} ${cards[centerCard].number}`
          );
          playCard(botsCards[botsCards.length - 1], setBotsCards, botsCards);
        } else {
          setCanPlayCards(true);
        }
      }, 1000);
    }
  }, [botsCards]);

  useEffect(() => {
    console.log(cardsInPlay);
  }, [cardsInPlay]);

  useEffect(() => {
    if (canPlayCards) {
      console.log(`player's turn`);
    } else console.log(`bot's turn`);
  }, [canPlayCards]);

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
            if (canPlayCards) {
              drawCard(setUsersCards, usersCards);
            }
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
                if (canPlayCards) {
                  playCard(cardInHand, setUsersCards, usersCards);
                }
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
