import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// TypeScript interfaces
interface CardType {
    rank: string;
    suit: string;
}

interface PokerTrainerProps {
    isHorizontal?: boolean;
}

const POSITIONS = ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'];
const SUITS = ['♠', '♥️', '♦', '♣'] as const;
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
const STAGES = ['preflop', 'flop', 'turn', 'river'] as const;
type GameStage = (typeof STAGES)[number];

const PokerTrainer: React.FC<PokerTrainerProps> = ({ isHorizontal = false }) => {
    // State management
    const [selectedPosition, setSelectedPosition] = useState<string>('');
    const [activePositions, setActivePositions] = useState<string[]>([]);
    const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
    const [communityCards, setCommunityCards] = useState<CardType[]>([]);
    const [showCardSelector, setShowCardSelector] = useState(false);
    const [cardSelectorTarget, setCardSelectorTarget] = useState<'hole' | 'community'>('hole');
    const [gameStage, setGameStage] = useState<GameStage>('preflop');

    // Get maximum allowed community cards for current stage
    const getMaxCommunityCards = () => {
        switch (gameStage) {
            case 'flop':
                return 3;
            case 'turn':
                return 4;
            case 'river':
                return 5;
            default:
                return 0;
        }
    };

    // Calculate winning probability
    const calculateWinningProbability = (): number => {
        if (selectedCards.length !== 2) return 0;

        let baseProbability = 0.5;
        const positionMultiplier: Record<string, number> = {
            BTN: 1.2,
            SB: 0.8,
            BB: 0.7,
            UTG: 0.9,
            MP: 1.0,
            CO: 1.1,
        };

        baseProbability *= positionMultiplier[selectedPosition] || 1;

        const [card1, card2] = selectedCards;
        const isPair = card1.rank === card2.rank;
        const isSuited = card1.suit === card2.suit;

        if (isPair) baseProbability *= 1.5;
        if (isSuited) baseProbability *= 1.2;

        const highCards = ['A', 'K', 'Q', 'J'];
        if (highCards.includes(card1.rank) && highCards.includes(card2.rank)) {
            baseProbability *= 1.3;
        }

        // Adjust probability based on community cards
        if (communityCards.length > 0) {
            const allCards = [...selectedCards, ...communityCards];

            // Check for pairs with community cards
            const rankCounts = new Map<string, number>();
            allCards.forEach((card) => {
                rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
            });

            // Boost probability for pairs, three of a kind, etc.
            rankCounts.forEach((count) => {
                if (count === 2) baseProbability *= 1.2;
                if (count === 3) baseProbability *= 1.5;
                if (count >= 4) baseProbability *= 2;
            });

            // Check for flush potential
            const suitCounts = new Map<string, number>();
            allCards.forEach((card) => {
                suitCounts.set(card.suit, (suitCounts.get(card.suit) || 0) + 1);
            });

            suitCounts.forEach((count) => {
                if (count >= 4) baseProbability *= 1.3;
                if (count >= 5) baseProbability *= 1.5;
            });
        }

        return Math.min(Math.round(baseProbability * 100), 100);
    };

    // Get advice based on probability and stage
    const getAdvice = (): string => {
        const probability = calculateWinningProbability();

        switch (gameStage) {
            case 'preflop':
                if (probability > 70) return 'Strong hand - Consider raising';
                if (probability > 50) return 'Decent hand - Consider calling or raising';
                if (probability > 30) return 'Marginal hand - Proceed with caution';
                return 'Weak hand - Consider folding';

            case 'flop':
                if (probability > 75) return 'Strong hand - Consider value betting';
                if (probability > 60) return 'Good hand - Consider betting for value';
                if (probability > 40) return 'Drawing hand - Consider pot odds';
                return 'Weak hand - Consider checking/folding';

            case 'turn':
            case 'river':
                if (probability > 80) return 'Very strong hand - Consider value betting';
                if (probability > 65) return 'Strong hand - Consider betting';
                if (probability > 45) return 'Moderate hand - Consider pot odds';
                return 'Weak hand - Consider folding to aggression';

            default:
                return 'Unknown stage';
        }
    };

    // Toggle position selection
    const togglePosition = (position: string): void => {
        if (activePositions.includes(position)) {
            setActivePositions(activePositions.filter((p) => p !== position));
        } else {
            setActivePositions([...activePositions, position]);
        }
    };

    // Select a card
    const selectCard = (rank: string, suit: string): void => {
        const newCard = { rank, suit };

        if (cardSelectorTarget === 'hole' && selectedCards.length < 2) {
            setSelectedCards([...selectedCards, newCard]);
            if (selectedCards.length === 1) {
                setShowCardSelector(false);
            }
        } else if (cardSelectorTarget === 'community' && communityCards.length < getMaxCommunityCards()) {
            setCommunityCards([...communityCards, newCard]);
            if (communityCards.length === getMaxCommunityCards() - 1) {
                setShowCardSelector(false);
            }
        }
    };

    // Progress to next stage
    const progressStage = () => {
        const currentIndex = STAGES.indexOf(gameStage);
        if (currentIndex < STAGES.length - 1) {
            setGameStage(STAGES[currentIndex + 1]);
        }
    };

    // Reset all selections
    const resetAll = (): void => {
        setSelectedPosition('');
        setActivePositions([]);
        setSelectedCards([]);
        setCommunityCards([]);
        setShowCardSelector(false);
        setCardSelectorTarget('hole');
        setGameStage('preflop');
    };

    // Check if a card is already selected
    const isCardSelected = (rank: string, suit: string): boolean => {
        const allCards = [...selectedCards, ...communityCards];
        return allCards.some((card) => card.rank === rank && card.suit === suit);
    };

    // Components for different sections
    const PositionSection = () => (
        <div className={`${isHorizontal ? 'w-1/4' : 'w-full'}`}>
            <h3 className="text-lg font-medium mb-2">Your Position</h3>
            <div className="flex gap-2 flex-wrap">
                {POSITIONS.map((position) => (
                    <Button key={position} variant={selectedPosition === position ? 'default' : 'outline'} onClick={() => setSelectedPosition(position)} className="w-16">
                        {position}
                    </Button>
                ))}
            </div>
        </div>
    );

    const ActivePositionsSection = () => (
        <div className={`${isHorizontal ? 'w-1/4' : 'w-full'}`}>
            <h3 className="text-lg font-medium mb-2">Active Players</h3>
            <div className="flex gap-2 flex-wrap">
                {POSITIONS.map((position) => (
                    <Button
                        key={position}
                        variant={activePositions.includes(position) ? 'default' : 'outline'}
                        onClick={() => togglePosition(position)}
                        disabled={position === selectedPosition}
                        className="w-16"
                    >
                        {position}
                    </Button>
                ))}
            </div>
        </div>
    );

    const CardSelectionSection = () => (
        <div className={`${isHorizontal ? 'w-1/4' : 'w-full'}`}>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">Your Hole Cards</h3>
                    <div className="flex gap-2 mb-4">
                        {selectedCards.map((card, index) => (
                            <div key={index} className="w-12 h-16 border rounded flex items-center justify-center text-lg font-bold">
                                {card.rank}
                                {card.suit}
                            </div>
                        ))}
                        {selectedCards.length < 2 && gameStage === 'preflop' && (
                            <Button
                                variant="outline"
                                className="w-12 h-16"
                                onClick={() => {
                                    setShowCardSelector(true);
                                    setCardSelectorTarget('hole');
                                }}
                            >
                                +
                            </Button>
                        )}
                    </div>
                </div>

                {gameStage !== 'preflop' && (
                    <div>
                        <h3 className="text-lg font-medium mb-2">Community Cards ({gameStage.toUpperCase()})</h3>
                        <div className="flex gap-2 mb-4">
                            {communityCards.map((card, index) => (
                                <div key={index} className="w-12 h-16 border rounded flex items-center justify-center text-lg font-bold">
                                    {card.rank}
                                    {card.suit}
                                </div>
                            ))}
                            {communityCards.length < getMaxCommunityCards() && (
                                <Button
                                    variant="outline"
                                    className="w-12 h-16"
                                    onClick={() => {
                                        setShowCardSelector(true);
                                        setCardSelectorTarget('community');
                                    }}
                                >
                                    +
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showCardSelector && (
                <div className="border p-4 rounded-lg mt-4 min-w-max">
                    <div className="space-y-2">
                        {SUITS.map((suit) => (
                            <div key={suit} className="flex gap-1">
                                {RANKS.map((rank) => (
                                    <Button
                                        key={`${rank}${suit}`}
                                        variant="outline"
                                        className="w-8 h-8 p-0 text-sm flex items-center justify-center"
                                        onClick={() => selectCard(rank, suit)}
                                        disabled={isCardSelected(rank, suit)}
                                    >
                                        {rank}
                                        {suit}
                                    </Button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const AnalysisSection = () => (
        <div className={`${isHorizontal ? 'w-1/4' : 'w-full'}`}>
            <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Analysis</h3>
                <p className="mb-2">Stage: {gameStage.toUpperCase()}</p>
                <p className="mb-2">Winning Probability: {calculateWinningProbability()}%</p>
                <p className="mb-4">Advice: {getAdvice()}</p>
                <div className="space-y-2">
                    {gameStage !== 'river' && communityCards.length === getMaxCommunityCards() && (
                        <Button variant="default" onClick={progressStage} className="w-full">
                            Next Stage
                        </Button>
                    )}
                    <Button variant="destructive" onClick={resetAll} className="w-full">
                        Reset All
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle>Poker Hand Trainer</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`${isHorizontal ? 'flex gap-4' : 'space-y-6'}`}>
                    <PositionSection />
                    <ActivePositionsSection />
                    <CardSelectionSection />
                    {selectedPosition && activePositions.length > 0 && selectedCards.length === 2 && <AnalysisSection />}
                </div>
            </CardContent>
        </Card>
    );
};

export default PokerTrainer;
