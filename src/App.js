import cards from "./data/cards.json";
import { useState, useEffect } from "react";

function App() {
  let [botsCards, setBotsCards] = useState([]);
  let [usersCards, setUsersCards] = useState([]);
  let [centerCard, setCenterCard] = useState([]);
  let [cardsInPlay, setCardsInPlay] = useState([]);
  let [canPlayCards, setCanPlayCards] = useState(true);
  let [pickingWildCard, setPickingWildCard] = useState(false);
  let [centerCardWild, setCenterCardWild] = useState(false);
  let [colorChoice, setColorChoice] = useState();

  let generateRandomCard = () => {
    return Math.floor(Math.random() * cards.length);
  };

  // on initial load
  useEffect(() => {
    let playCenterCard = () => {
      let randomCard = Math.floor(Math.random() * 40);
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

  // card idxs to choose from after wild card selects a new color
  let blue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 40, 41, 42, 52, 53];
  let green = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 43, 44, 45, 52, 53];
  let red = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 46, 47, 48, 52, 53];
  let yellow = [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 49, 50, 51, 52, 53];

  let playCard = (currentCardIdx, setWhichHand, whichCards) => {
    // opens prompt
    if (canPlayCards && cards[currentCardIdx].type === "wild") {
      setPickingWildCard(true);
      console.log(`playing the wild card`);
    }

    // handle if card is wild
    if (
      cards[currentCardIdx].type === "wild" &&
      cards[currentCardIdx].function !== undefined
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

      // if card has draw attribute, make opposite player draw
      handleDrawAttribute(currentCardIdx, setWhichHand, whichCards);

      // if bot turn, change to user turn after playing wild card
      if (!canPlayCards) {
        setCanPlayCards(!canPlayCards);
      }
    }
    // handle if last card was wild
    else if (centerCardWild === true) {
      if (canPlayCards && !colorChoice.includes(currentCardIdx)) {
        // your turn && invalid choice
        console.log(`do nothing`);
      } else if (!canPlayCards && !colorChoice.includes(currentCardIdx)) {
        console.log(`drawn card not of chosen color`);
        setCanPlayCards(true);
      } else if (colorChoice.includes(currentCardIdx)) {
        // sets new center card. removes card from hand.
        setCenterCard([currentCardIdx]);
        let newHand = whichCards.filter(
          (element) => element !== currentCardIdx
        );
        setWhichHand(newHand);
        // removes old center card from play
        let [centerCardNumber] = centerCard;
        let filteredCardsInPlay = cardsInPlay.filter(
          (element) => element !== centerCardNumber
        );
        setCardsInPlay(filteredCardsInPlay);
        setCanPlayCards(!canPlayCards);
        setCenterCardWild(false);
        setColorChoice();
      }
    }
    // handle if color / number / action match
    else if (
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

      // if card has draw attribute:
      handleDrawAttribute(currentCardIdx, setWhichHand, whichCards);
    }
    // safeguard after testing drawn cards for bot
    else if (!canPlayCards) {
      console.log(`drawn card not playable`);
      setCanPlayCards(true);
    } else {
      console.log(`end of playCard(), do nothing`);
    }
  };

  // put card in user/bot hand
  let drawCard = (setWhichHand, whichCards, numberOfCards) => {
    let randomCard = generateRandomCard();
    // randomCard = 53;

    // if card forces opposite player to draw cards
    if (numberOfCards) {
      let cardsToAdd = [];
      for (let i = 0; i < numberOfCards; i++) {
        while (
          cardsInPlay.includes(randomCard) ||
          cardsToAdd.includes(randomCard)
        ) {
          randomCard = generateRandomCard();
        }
        cardsToAdd.push(randomCard);
      }
      setWhichHand([...whichCards, ...cardsToAdd]);
      setCardsInPlay([...cardsInPlay, ...cardsToAdd]);
    } else {
      while (cardsInPlay.includes(randomCard)) {
        randomCard = generateRandomCard();
      }
      setWhichHand([...whichCards, randomCard]);
      setCardsInPlay([...cardsInPlay, randomCard]);
    }
  };

  let handleDrawAttribute = (currentCardIdx, setWhichHand, whichCards) => {
    // if card has draw attribute, make opposite player draw
    if (cards[currentCardIdx].draw !== undefined) {
      if (setWhichHand === setUsersCards && whichCards === usersCards) {
        drawCard(setBotsCards, botsCards, cards[currentCardIdx].draw);
      } else if (setWhichHand === setBotsCards && whichCards === botsCards) {
        drawCard(setUsersCards, usersCards, cards[currentCardIdx].draw);
      }
    }
  };

  // bot's turn
  useEffect(() => {
    if (!canPlayCards) {
      setTimeout(() => {
        scanHand();
      }, 1000);
    }
  }, [canPlayCards]);

  let blueCards = [];
  let greenCards = [];
  let redCards = [];
  let yellowCards = [];

  // bot functions
  let scanHand = () => {
    // reset color card arrays
    blueCards = [];
    greenCards = [];
    redCards = [];
    yellowCards = [];

    // playable cards
    let numberedCards = [];
    let actionCards = [];
    let wildCards = [];

    // put each card into respective array(s)
    botsCards.forEach((cardInHandIdx) => {
      let matchingNumbers =
        cards[cardInHandIdx].number === cards[centerCard].number &&
        cards[cardInHandIdx].number !== undefined;
      let matchingColors =
        (cards[cardInHandIdx].color === cards[centerCard].color &&
          cards[cardInHandIdx].color !== undefined) ||
        (centerCardWild &&
          colorChoice.includes(cardInHandIdx) &&
          cardInHandIdx !== 52 &&
          cardInHandIdx !== 53);
      let matchingFunction =
        cards[cardInHandIdx].function === cards[centerCard].function &&
        cards[cardInHandIdx].function !== undefined;

      // pushing cardIdxs to arrays
      if ((matchingNumbers || matchingColors) && cardInHandIdx <= 39) {
        numberedCards.push(cardInHandIdx);
      } else if (matchingColors || matchingFunction) {
        actionCards.push(cardInHandIdx);
      } else if (cardInHandIdx >= 52) {
        wildCards.push(cardInHandIdx);
      }

      // pushing to color arrays for bot to make informed choices while playing wild cards
      if (cards[cardInHandIdx].color === "blue") {
        blueCards.push(cardInHandIdx);
      } else if (cards[cardInHandIdx].color === "green") {
        greenCards.push(cardInHandIdx);
      } else if (cards[cardInHandIdx].color === "red") {
        redCards.push(cardInHandIdx);
      } else if (cards[cardInHandIdx].color === "yellow") {
        yellowCards.push(cardInHandIdx);
      }
    });

    // bot decides which card to play
    if (
      // if N/A, draw card
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
      console.log(`play action card, logic still WIP`);
      let randomIndex = Math.floor(Math.random() * actionCards.length);
      playCard(actionCards[randomIndex], setBotsCards, botsCards);
    }
    // play numbered card
    else if (numberedCards.length !== 0) {
      console.log(`play random numbered card, logic still WIP`);
      let randomIndex = Math.floor(Math.random() * numberedCards.length);
      playCard(numberedCards[randomIndex], setBotsCards, botsCards);
    }
    // play wild card
    else {
      console.log(`choose wild card, logic still WIP`);
      let randomIndex = Math.floor(Math.random() * wildCards.length);
      chooseColor();
      setCenterCardWild(true);
      playCard(wildCards[randomIndex], setBotsCards, botsCards);
    }

    {
      console.log(`numberedCards: ${numberedCards}`);
      console.log(`actionCards: ${actionCards}`);
      console.log(`wildCards: ${wildCards}`);
    }
  };

  // when bot draws 1 card
  useEffect(() => {
    if (!canPlayCards) {
      setTimeout(() => {
        console.log(`bot drew a card`);
        const drawnCard = botsCards[botsCards.length - 1];
        if (cards[drawnCard].type === "wild") {
          chooseColor();
          setCenterCardWild(true);
        }
        playCard(drawnCard, setBotsCards, botsCards);
      }, 1000);
    }
  }, [botsCards]);

  let chooseColor = () => {
    // count the number of cards for the most held color
    let maxLength = Math.max(
      blueCards.length,
      greenCards.length,
      redCards.length,
      yellowCards.length
    );

    console.log(`maxLength: ${maxLength}`);
    console.log(blueCards.length);
    console.log(greenCards.length);
    console.log(redCards.length);
    console.log(yellowCards.length);

    // checks if maximum colors held are equal in count
    let checkIfMultiple = 0;
    let mostHeldColors = [];
    let colorArrayHolder = [blueCards, greenCards, redCards, yellowCards];
    colorArrayHolder.forEach((colorArray) => {
      if (colorArray.length === maxLength) {
        mostHeldColors.push(colorArray);
        checkIfMultiple++;
      }
    });
    console.log(`most held colors: ${mostHeldColors}`);

    // if bot's most held color is more than just one color
    if (checkIfMultiple >= 2) {
      console.log(`tie between colors`);
      // if the same, choose whatever color user just changed from

      // else, choose randomly most held color
      let randomIndex = Math.floor(Math.random() * mostHeldColors.length);
      mostHeldColors[randomIndex].forEach((color) => {
        if (blue.includes(color)) {
          setColorChoice(blue);
          console.log(`Blue contains ${color}`);
        }
        if (green.includes(color)) {
          setColorChoice(green);
          console.log(`Green contains ${color}`);
        }
        if (red.includes(color)) {
          setColorChoice(red);
          console.log(`Red contains ${color}`);
        }
        if (yellow.includes(color)) {
          setColorChoice(yellow);
          console.log(`Yellow contains ${color}`);
        }
      });
    } else if (blueCards.length === maxLength) {
      console.log(`choosing blue`);
      setColorChoice(blue);
    } else if (greenCards.length === maxLength) {
      console.log(`choosing green`);
      setColorChoice(green);
    } else if (redCards.length === maxLength) {
      console.log(`choosing red`);
      setColorChoice(red);
    } else if (yellowCards.length === maxLength) {
      console.log(`choosing yellow`);
      setColorChoice(yellow);
    }
    //   compare colorCard arrays. select one with highest length.
    //   if the same, choose whatever color user just changed from
    //   if none, randomly choose between ones of highest length
  };
  return (
    <div className="App">
      <div id="container">
        <div className="row row-with-cards">
          {botsCards.map((cardInHand) => {
            return (
              <img
                src={cards[cardInHand].img}
                key={cards[cardInHand].name}
                alt={cards[cardInHand].name}
              />
            );
          })}
        </div>
        <div className="row row-with-sides">
          {/* <div className="sideOptions">
            <p>skip turn</p>
          </div> */}
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
              return (
                <img
                  src={cards[card].img}
                  key={cards[card].name}
                  alt={cards[card].name}
                />
              );
            })}
          </div>
          {pickingWildCard && (
            <div className="sideOptions wildColorChange">
              <p>Which Color?</p>
              <div
                onClick={() => {
                  setColorChoice(blue);
                  setCenterCardWild(true);
                  setPickingWildCard(false);
                  setCanPlayCards(!canPlayCards);
                }}
              ></div>
              <div
                onClick={() => {
                  setColorChoice(green);
                  setCenterCardWild(true);
                  setPickingWildCard(false);
                  setCanPlayCards(!canPlayCards);
                }}
              ></div>
              <div
                onClick={() => {
                  setColorChoice(red);
                  setCenterCardWild(true);
                  setPickingWildCard(false);
                  setCanPlayCards(!canPlayCards);
                }}
              ></div>
              <div
                onClick={() => {
                  setColorChoice(yellow);
                  setCenterCardWild(true);
                  setPickingWildCard(false);
                  setCanPlayCards(!canPlayCards);
                }}
              ></div>
            </div>
          )}
        </div>
        <div className="row row-with-cards">
          {usersCards.map((cardInHand) => {
            return (
              <img
                onClick={() => {
                  if (canPlayCards) {
                    playCard(cardInHand, setUsersCards, usersCards);
                  }
                }}
                src={cards[cardInHand].img}
                key={cards[cardInHand].name}
                alt={cards[cardInHand].name}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
