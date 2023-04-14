import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import useAudio from "../hooks/useAudio";
import Lottie from "lottie-react";

interface Card {
    letter: string;
    index: number;
}

interface Props {
    rows: number;
    cols: number;
}

function shuffleArray(array: any[]) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function MemoryGame({ rows = 4, cols = 4 }: Props) {

    const letters = useMemo(() =>
        // Si i es igual a 0, entonces String.fromCharCode(65 + i) devuelve la letra "A" (número ASCII).
        // Si i es igual a 1, entonces devuelve la letra "B", y así sucesivamente
        Array.from({ length: (rows * cols) / 2 }, (_, i) => String.fromCharCode(65 + i)),
        [rows, cols]
    );

    const [cards, setCards] = useState<Card[]>(() =>
        shuffleArray([...letters, ...letters]).map((letter, index) => ({
            letter,
            index,
        }))
    );
    const [flippedCards, setFlippedCards] = useState<Card[]>([]);
    const [matchedCards, setMatchedCards] = useState<Card[]>([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [winAnimation, setWinAnimation] = useState();

    const { play: playMatchedCards, pause: pauseMatchedCards } = useAudio('/matched_cards.mp3');
    const { play: playCardClick, pause: pauseCardClick } = useAudio('/card_click.mp3');
    const { play: playWrongCard, pause: pauseWrongCard } = useAudio('/wrong_card.mp3');
    const { play: playGameEndWin, pause: pauseGameEndWin } = useAudio('/game_end_win.mp3');

    const getAnimation = async () => {
        const res = await fetch('/winner_lottie.json');
        const data = await res.json();
        setWinAnimation(data);
    }

    useEffect(() => {
        getAnimation();
    }, []);

    useEffect(() => {
        // Trackear estado del juego
        if (matchedCards.length / 2 === letters.length) {
            playGameEndWin();
            setGameEnded(true);
        }
    }, [matchedCards]);

    const handleCardClick = (card: Card) => {
        pauseMatchedCards();
        pauseWrongCard();
        playCardClick();

        const isAlreayMatched = matchedCards.some(
            (matchedCard) => matchedCard.index === card.index
        );

        if (isAlreayMatched) return

        // Si se vuelve a clickear en la misma card, no hacer nada;
        if (flippedCards.length === 1 && flippedCards[0].index === card.index) {
            return;
        }

        const newFlippedCards = [...flippedCards, card];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            if (newFlippedCards[0].letter === newFlippedCards[1].letter) {
                // son iguales
                setMatchedCards([...matchedCards, ...newFlippedCards]);
                playMatchedCards();
                setFlippedCards([]);
            } else {
                playWrongCard();
                setTimeout(() => setFlippedCards([]), 500);
            }
            // vaciar las cartas en flipped
            // setTimeout(() => setFlippedCards([]), 500);
        }
    };

    const resetGame = () => {
        setCards(shuffleArray([...letters, ...letters]).map((letter, index) => ({
            letter,
            index,
        })));
        setGameEnded(false);
        setMatchedCards([]);
        setFlippedCards([]);
    }

    return (
        <>
            <div className="flex justify-center flex-col items-center min-h-screen  bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900">
                {/* <h1 className='text-6xl mb-20 tracking-wider font	'>
                    Ideas para aprender
                </h1> */}
                {gameEnded === false ?
                    <div className={`grid grid-cols-${cols} gap-4 mx-auto w-96`}>
                        {cards.map((card) => {
                            const isFlipped = flippedCards.some(
                                (flippedCard) => flippedCard.index === card.index
                            );
                            const isMatched = matchedCards.some(
                                (matchedCard) => matchedCard.index === card.index
                            );
                            const wrongCards = flippedCards.length === 2 && flippedCards.includes(card) && !isMatched && isFlipped
                            return (
                                <motion.div
                                    animate={{
                                        rotateY: isFlipped || isMatched ? 360 : 0,
                                        scale: isFlipped || isMatched ? 1.1 : 1,
                                        transition: { duration: .25 },
                                        zIndex: 10,
                                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'
                                    }}
                                    transition={{
                                        ease: "linear",
                                        duration: 0.2,
                                        x: { duration: 0.3 }
                                    }}
                                    key={card.index}
                                    onClick={() => handleCardClick(card)}
                                    className={`border border-gray-400 rounded-md flex items-center justify-center h-20 text-3xl cursor-pointer 
                                    transition-all duration-300 ${wrongCards ? 'bg-red-300' : ''}
                                    ${isFlipped || isMatched ? "bg-green-500 text-white" : "bg-white text-gray-700"}`}
                                >
                                    {isFlipped || isMatched ? card.letter : ""}
                                </motion.div>
                            );
                        })}
                    </div> :
                    <>
                        <button onClick={() => resetGame()}
                            className="flex items-center justify-center gap-2 rounded-xl border-4 border-black bg-pink-100 px-8 py-4 
                            font-bold shadow-[6px_6px_0_0_#000] transition hover:shadow-none focus:outline-none focus:ring active:bg-pink-50"
                        >
                            Jugar de nuevo
                        </button>

                        <Lottie animationData={winAnimation} loop={true} />
                    </>
                }
            </div>

        </>
    );
}

export default MemoryGame;