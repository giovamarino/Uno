import cards from "./data/cards.json";
import { useState, useEffect } from "react";

function App() {
  let [botsCards, setBotsCards] = useState([]);
  let [usersCards, setUsersCards] = useState([]);
  let [centerCard, setCenterCard] = useState([]);
  let [cardsInPlay, setCardsInPlay] = useState([]);
  let [canPlayCards, setCanPlayCards] = useState(true);
  let [colorArrays, setColorArrays] = useState([]);

  let generateRandomCard = () => {
    return Math.floor(Math.random() * cards.length);
  };

  useEffect(() => {
    let playCenterCard = () => {
      let randomCard = Math.floor(Math.random() * 40);
      console.log(`center: ${cards[randomCard].name}`);
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
      // same number
      (cards[currentCardIdx].number === cards[centerCard].number &&
        cards[currentCardIdx].number !== undefined &&
        cards[centerCard].number !== undefined) ||
      // same colors
      (cards[currentCardIdx].color === cards[centerCard].color &&
        cards[currentCardIdx].color !== undefined &&
        cards[centerCard].color !== undefined) ||
      // same action type
      (cards[currentCardIdx].type === cards[centerCard].type &&
        cards[currentCardIdx].function === cards[centerCard].function &&
        cards[currentCardIdx].type === "action" &&
        cards[currentCardIdx].function !== undefined)
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
    // safeguard after testing drawn cards for bot
    else if (!canPlayCards) {
      console.log(`drawn card not playable`);
      setCanPlayCards(true);
    }
  };

  // put card in user/bot hand
  let drawCard = (setWhichHand, whichCards) => {
    let randomCard = generateRandomCard();
    randomCard = 53;

    // while (cardsInPlay.includes(randomCard)) {
    //   randomCard = generateRandomCard();
    // }
    setWhichHand([...whichCards, randomCard]);
    setCardsInPlay([...cardsInPlay, randomCard]);
  };

  // bot's turn
  useEffect(() => {
    if (!canPlayCards) {
      setTimeout(() => {
        // botsCards.forEach((cardInHand) => {
        //   playCard(cardInHand, setBotsCards, botsCards);
        // });
        scanHand();
      }, 1000);
    }
  }, [canPlayCards]);

  let [blueCards, setBlueCards] = useState([]);
  let [greenCards, setGreenCards] = useState([]);
  let [redCards, setRedCards] = useState([]);
  let [yellowCards, setYellowCards] = useState([]);

  // bot functions
  let scanHand = () => {
    // playable cards
    let numberedCards = [];
    let actionCards = [];
    let wildCards = [];

    // extra organization
    // let blueCards = [];
    // let greenCards = [];
    // let redCards = [];
    // let yellowCards = [];
    botsCards.forEach((cardInHandIdx) => {
      let matchingNumbers =
        cards[cardInHandIdx].number === cards[centerCard].number;
      let matchingColors =
        cards[cardInHandIdx].color === cards[centerCard].color;

      // pushing cardIdxs to arrays
      if ((matchingNumbers || matchingColors) && cardInHandIdx <= 39) {
        // numberedCards.push(cardInHandIdx);
      } else if (matchingColors && cardInHandIdx >= 40 && cardInHandIdx <= 51) {
        actionCards.push(cardInHandIdx);
      } else if (cardInHandIdx >= 52) {
        wildCards.push(cardInHandIdx);
      }

      if (cards[cardInHandIdx].color === "blue") {
        setBlueCards((currentCards) => [...currentCards, cardInHandIdx]);
      } else if (cards[cardInHandIdx].color === "green") {
        setGreenCards((currentCards) => [...currentCards, cardInHandIdx]);
      } else if (cards[cardInHandIdx].color === "red") {
        setRedCards((currentCards) => [...currentCards, cardInHandIdx]);
      } else if (cards[cardInHandIdx].color === "yellow") {
        setYellowCards((currentCards) => [...currentCards, cardInHandIdx]);
      }
    });

    // determine which card to play
    // if N/A, draw card
    if (
      numberedCards.length === 0 &&
      actionCards.length === 0 &&
      wildCards.length === 0
    ) {
      console.log(`no playable cards`);
      drawCard(setBotsCards, botsCards);
    }
    // play action card
    else if (
      numberedCards.length <= actionCards.length &&
      actionCards.length > 0
      // work on this logic later
    ) {
      console.log(`play action card`);
    }
    // play numbered card
    else if (numberedCards.length !== 0) {
      console.log(`play random numbered card`);
    }
    // play wild card
    else {
      console.log(`choose wild card `);
    }

    {
      console.log(`numberedCards: ${numberedCards}`);
      console.log(`actionCards: ${actionCards}`);
      console.log(`wildCards: ${wildCards}`);
    }
  };

  useEffect(() => {
    console.log(blueCards);
    console.log(greenCards);
    console.log(redCards);
    console.log(yellowCards);
  }, [blueCards, greenCards, redCards, yellowCards]);

  // when bot draws 1 card
  useEffect(() => {
    if (!canPlayCards) {
      setTimeout(() => {
        // if wildCard is available
        if (cards[botsCards[botsCards.length - 1]].type === "wild") {
          let maxLength = Math.max(
            blueCards.length,
            greenCards.length,
            redCards.length,
            yellowCards.length
          );

          let checkIfMultiple = 0;
          let colorArrayHolder = [blueCards, greenCards, redCards, yellowCards];
          colorArrayHolder.forEach((colorArray) => {
            if (colorArray.length === maxLength) {
              checkIfMultiple++;
            }
          });
          // somewhere in this logic we change color to the one with highest length

          if (checkIfMultiple >= 2) {
            console.log(`multiple colors`);
            //   if the same, choose whatever color user just changed from
          }

          // loop through array,
          // if (each colorarray = maxlength, ) {
          // checkIfMultiple++
          // }

          // wildCard();

          //   compare colorCard arrays. select one with highest length.
          //   if the same, choose whatever color user just changed from
          //   if none, randomly choose between ones of highest length
        } else {
          console.log(
            `drawn: ${cards[botsCards[botsCards.length - 1]].color} ${
              cards[botsCards[botsCards.length - 1]].number
            }`
          );
          console.log(
            `center: ${cards[centerCard].color} ${cards[centerCard].number}`
          );
          playCard(botsCards[botsCards.length - 1], setBotsCards, botsCards);
        }
      }, 1000);
    }
  }, [botsCards]);

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
