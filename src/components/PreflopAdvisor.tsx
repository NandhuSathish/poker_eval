import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// interface HandRange {
//     [key: string]: string[];
// }
// console.log("🚀 ~ HandRange:", HandRange)

const POSITIONS = ['LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as const;
type Position = (typeof POSITIONS)[number];

// Helper function to generate all possible suited combinations
const generateSuitedCombos = (rank1: string, rank2: string): string[] => {
    const suits = ['s']; // We only need one suit marker as we're just checking if it's suited
    return suits.map((suit) => `${rank1}${rank2}${suit}`);
};

// Helper function to generate offsuit combinations
const generateOffsuitCombos = (rank1: string, rank2: string): string[] => {
    return [`${rank1}${rank2}o`];
};

// Helper function to generate pair combinations
const generatePairCombos = (rank: string): string[] => {
    return [`${rank}${rank}`];
};

// Define the playable hands for each position
const POSITION_RANGES: Record<Position, string[]> = {
    LJ: [
        ...generatePairCombos('A'), // AA
        ...generateSuitedCombos('A', 'K'), // AKs
        ...generateSuitedCombos('A', 'Q'), // AQs
        ...generateSuitedCombos('A', 'J'), // AJs
        ...generateSuitedCombos('A', 'T'), // ATs
        ...generateSuitedCombos('A', '9'), // A9s
        ...generateSuitedCombos('A', '8'), // A8s
        ...generateSuitedCombos('A', '7'), // A7s
        ...generateSuitedCombos('A', '6'), // A6s
        ...generateSuitedCombos('A', '5'), // A5s
        ...generateSuitedCombos('A', '4'), // A4s
        ...generateSuitedCombos('A', '3'), // A3s
        ...generateSuitedCombos('A', '2'), // A2s
        ...generateOffsuitCombos('A', 'K'), // AKo
        ...generatePairCombos('K'), // KK
        ...generateSuitedCombos('K', 'Q'), // KQs
        ...generateSuitedCombos('K', 'J'), // KJs
        ...generateSuitedCombos('K', 'T'), // KTs
        ...generateSuitedCombos('K', '9'), // K9s
        ...generateSuitedCombos('K', '8'), // K8s
        ...generateSuitedCombos('K', '7'), // K7s
        ...generateOffsuitCombos('A', 'Q'), // AQo
        ...generateOffsuitCombos('Q', 'K'), // KQo
        ...generatePairCombos('Q'), // QQ
        ...generateSuitedCombos('Q', 'J'), // QJs
        ...generateSuitedCombos('Q', 'T'), // QTs
        ...generateSuitedCombos('Q', '9'), // Q9s
        ...generateOffsuitCombos('A', 'J'), // AJo
        ...generatePairCombos('J'), // JJ
        ...generateSuitedCombos('J', 'T'), // JTs
        ...generatePairCombos('T'), // TT
        ...generateSuitedCombos('T', '9'), // T9s
        ...generatePairCombos('9'), // 99
        ...generatePairCombos('8'), // 88
        ...generatePairCombos('7'), // 77
    ],
    HJ: [
        ...generatePairCombos('A'), // AA
        ...generateSuitedCombos('A', 'K'), // AKs
        ...generateSuitedCombos('A', 'Q'), // AQs
        ...generateSuitedCombos('A', 'J'), // AJs
        ...generateSuitedCombos('A', 'T'), // ATs
        ...generateSuitedCombos('A', '9'), // A9s
        ...generateSuitedCombos('A', '8'), // A8s
        ...generateSuitedCombos('A', '7'), // A7s
        ...generateSuitedCombos('A', '6'), // A6s
        ...generateSuitedCombos('A', '5'), // A5s
        ...generateSuitedCombos('A', '4'), // A4s
        ...generateSuitedCombos('A', '3'), // A3s
        ...generateSuitedCombos('A', '2'), // A2s
        ...generateOffsuitCombos('A', 'K'), // AKo
        ...generatePairCombos('K'), // KK
        ...generateSuitedCombos('K', 'Q'), // KQs
        ...generateSuitedCombos('K', 'J'), // KJs
        ...generateSuitedCombos('K', 'T'), // KTs
        ...generateSuitedCombos('K', '9'), // K9s
        ...generateSuitedCombos('K', '8'), // K8s
        ...generateSuitedCombos('K', '7'), // K7s
        ...generateSuitedCombos('K', '6'), // K6s
        ...generateOffsuitCombos('A', 'Q'), // AQo
        ...generateOffsuitCombos('K', 'Q'), // KQo
        ...generatePairCombos('Q'), // QQ
        ...generateSuitedCombos('Q', 'J'), // QJs
        ...generateSuitedCombos('Q', 'T'), // QTs
        ...generateSuitedCombos('Q', '9'), // Q9s
        ...generateSuitedCombos('Q', '8'), // Q8s
        ...generateOffsuitCombos('A', 'J'), // AJo
        ...generateOffsuitCombos('K', 'J'), // KJo
        ...generateOffsuitCombos('Q', 'J'), // QJo
        ...generatePairCombos('J'), // JJ
        ...generateSuitedCombos('J', 'T'), // JTs
        ...generateSuitedCombos('J', '9'), // J9s
        ...generateOffsuitCombos('A', 'T'), // ATo
        ...generateOffsuitCombos('K', 'T'), // KTo
        ...generatePairCombos('T'), // TT
        ...generateSuitedCombos('T', '9'), // T9s
        ...generatePairCombos('9'), // 99
        ...generatePairCombos('8'), // 88
        ...generatePairCombos('7'), // 77
        ...generatePairCombos('6'), // 66
    ],
    CO: [
        ...generatePairCombos('A'), // AA
        ...generateSuitedCombos('A', 'K'), // AKs
        ...generateSuitedCombos('A', 'Q'), // AQs
        ...generateSuitedCombos('A', 'J'), // AJs
        ...generateSuitedCombos('A', 'T'), // ATs
        ...generateSuitedCombos('A', '9'), // A9s
        ...generateSuitedCombos('A', '8'), // A8s
        ...generateSuitedCombos('A', '7'), // A7s
        ...generateSuitedCombos('A', '6'), // A6s
        ...generateSuitedCombos('A', '5'), // A5s
        ...generateSuitedCombos('A', '4'), // A4s
        ...generateSuitedCombos('A', '3'), // A3s
        ...generateSuitedCombos('A', '2'), // A2s
        ...generateOffsuitCombos('A', 'K'), // AKo
        ...generatePairCombos('K'), // KK
        ...generateSuitedCombos('K', 'Q'), // KQs
        ...generateSuitedCombos('K', 'J'), // KJs
        ...generateSuitedCombos('K', 'T'), // KTs
        ...generateSuitedCombos('K', '9'), // K9s
        ...generateSuitedCombos('K', '8'), // K8s
        ...generateSuitedCombos('K', '7'), // K7s
        ...generateSuitedCombos('K', '6'), // K6s
        ...generateSuitedCombos('K', '5'), // K5s
        ...generateSuitedCombos('K', '4'), // K4s
        ...generateOffsuitCombos('A', 'Q'), // AQo
        ...generateOffsuitCombos('K', 'Q'), // KQo
        ...generatePairCombos('Q'), // QQ
        ...generateSuitedCombos('Q', 'J'), // QJs
        ...generateSuitedCombos('Q', 'T'), // QTs
        ...generateSuitedCombos('Q', '9'), // Q9s
        ...generateSuitedCombos('Q', '8'), // Q8s
        ...generateOffsuitCombos('A', 'J'), // AJo
        ...generateOffsuitCombos('K', 'J'), // KJo
        ...generateOffsuitCombos('Q', 'J'), // QJo
        ...generatePairCombos('J'), // JJ
        ...generateSuitedCombos('J', 'T'), // JTs
        ...generateSuitedCombos('J', '9'), // J9s
        ...generateSuitedCombos('J', '8'), // J8s
        ...generateOffsuitCombos('A', 'T'), // ATo
        ...generateOffsuitCombos('K', 'T'), // KTo
        ...generateOffsuitCombos('Q', 'T'), // QTo
        ...generateOffsuitCombos('J', 'T'), // JTo
        ...generatePairCombos('T'), // TT
        ...generateSuitedCombos('T', '9'), // T9s
        ...generateSuitedCombos('T', '8'), // T8s
        ...generateOffsuitCombos('A', '9'), // A9o
        ...generatePairCombos('9'), // 99
        ...generateSuitedCombos('9', '8'), // 98s
        ...generatePairCombos('8'), // 88
        ...generateSuitedCombos('8', '7'), // 87s
        ...generatePairCombos('7'), // 77
        ...generateSuitedCombos('7', '6'), // 76s
        ...generatePairCombos('6'), // 66
        ...generatePairCombos('5'), // 55
        ...generatePairCombos('4'), // 44
    ],
    BTN: [
        ...generatePairCombos('A'), // AA
        ...generateSuitedCombos('A', 'K'), // AKs
        ...generateSuitedCombos('A', 'Q'), // AQs
        ...generateSuitedCombos('A', 'J'), // AJs
        ...generateSuitedCombos('A', 'T'), // ATs
        ...generateSuitedCombos('A', '9'), // A9s
        ...generateSuitedCombos('A', '8'), // A8s
        ...generateSuitedCombos('A', '7'), // A7s
        ...generateSuitedCombos('A', '6'), // A6s
        ...generateSuitedCombos('A', '5'), // A5s
        ...generateSuitedCombos('A', '4'), // A4s
        ...generateSuitedCombos('A', '3'), // A3s
        ...generateSuitedCombos('A', '2'), // A2s
        ...generateOffsuitCombos('A', 'K'), // AKo
        ...generatePairCombos('K'), // KK
        ...generateSuitedCombos('K', 'Q'), // KQs
        ...generateSuitedCombos('K', 'J'), // KJs
        ...generateSuitedCombos('K', 'T'), // KTs
        ...generateSuitedCombos('K', '9'), // K9s
        ...generateSuitedCombos('K', '8'), // K8s
        ...generateSuitedCombos('K', '7'), // K7s
        ...generateSuitedCombos('K', '6'), // K6s
        ...generateSuitedCombos('K', '5'), // K5s
        ...generateSuitedCombos('K', '4'), // K4s
        ...generateSuitedCombos('K', '3'), // K3s
        ...generateSuitedCombos('K', '2'), // K2s
        ...generateOffsuitCombos('A', 'Q'), // AQo
        ...generateOffsuitCombos('K', 'Q'), // KQo
        ...generatePairCombos('Q'), // QQ
        ...generateSuitedCombos('Q', 'J'), // QJs
        ...generateSuitedCombos('Q', 'T'), // QTs
        ...generateSuitedCombos('Q', '9'), // Q9s
        ...generateSuitedCombos('Q', '8'), // Q8s
        ...generateSuitedCombos('Q', '7'), // Q7s
        ...generateSuitedCombos('Q', '6'), // Q6s
        ...generateSuitedCombos('Q', '5'), // Q5s
        ...generateSuitedCombos('Q', '4'), // Q4s
        ...generateSuitedCombos('Q', '3'), // Q3s
        ...generateOffsuitCombos('A', 'J'), // AJo
        ...generateOffsuitCombos('K', 'J'), // KJo
        ...generateOffsuitCombos('Q', 'J'), // QJo
        ...generatePairCombos('J'), // JJ
        ...generateSuitedCombos('J', 'T'), // JTs
        ...generateSuitedCombos('J', '9'), // J9s
        ...generateSuitedCombos('J', '8'), // J8s
        ...generateSuitedCombos('J', '7'), // J7s
        ...generateSuitedCombos('J', '6'), // J6s
        ...generateSuitedCombos('J', '5'), // J5s
        ...generateOffsuitCombos('A', 'T'), // ATo
        ...generateOffsuitCombos('K', 'T'), // KTo
        ...generateOffsuitCombos('Q', 'T'), // QTo
        ...generateOffsuitCombos('J', 'T'), // JTo
        ...generatePairCombos('T'), // TT
        ...generateSuitedCombos('T', '9'), // T9s
        ...generateSuitedCombos('T', '8'), // T8s
        ...generateSuitedCombos('T', '7'), // T7s
        ...generateSuitedCombos('T', '6'), // T6s
        ...generateOffsuitCombos('A', '9'), // A9o
        ...generateOffsuitCombos('K', '9'), // K9o
        ...generateOffsuitCombos('Q', '9'), // Q9o
        ...generateOffsuitCombos('J', '9'), // J9o
        ...generateOffsuitCombos('T', '9'), // T9o
        ...generatePairCombos('9'), // 99
        ...generateSuitedCombos('9', '8'), // 98s
        ...generateSuitedCombos('9', '7'), // 97s
        ...generateSuitedCombos('9', '6'), // 96s
        ...generateOffsuitCombos('A', '8'), // A8o
        ...generateOffsuitCombos('K', '8'), // K8o
        ...generatePairCombos('8'), // 88
        ...generateSuitedCombos('8', '7'), // 87s
        ...generateSuitedCombos('8', '6'), // 86s
        ...generateOffsuitCombos('A', '7'), // A7o
        ...generatePairCombos('7'), // 77
        ...generateSuitedCombos('7', '6'), // 76s
        ...generateSuitedCombos('7', '5'), // 75s
        ...generateOffsuitCombos('A', '6'), // A6o
        ...generatePairCombos('6'), // 66
        ...generateSuitedCombos('6', '5'), // 65s
        ...generateOffsuitCombos('A', '5'), // A5o
        ...generatePairCombos('5'), // 55
        ...generateSuitedCombos('5', '4'), // 54s
        ...generateOffsuitCombos('A', '4'), // A4o
        ...generatePairCombos('4'), // 44
        ...generateOffsuitCombos('A', '3'), // A3o
        ...generatePairCombos('3'), // 33
        ...generatePairCombos('2'), // 22
    ],
    SB: [
        ...generatePairCombos('A'), // AA
        ...generateSuitedCombos('A', 'K'), // AKs
        ...generateSuitedCombos('A', 'Q'), // AQs
        ...generateSuitedCombos('A', 'J'), // AJs
        ...generateSuitedCombos('A', 'T'), // ATs
        ...generateSuitedCombos('A', '9'), // A9s
        ...generateSuitedCombos('A', '8'), // A8s
        ...generateSuitedCombos('A', '7'), // A7s
        ...generateSuitedCombos('A', '6'), // A6s
        ...generateSuitedCombos('A', '5'), // A5s
        ...generateSuitedCombos('A', '4'), // A4s
        ...generateSuitedCombos('A', '3'), // A3s
        ...generateSuitedCombos('A', '2'), // A2s
        ...generateOffsuitCombos('A', 'K'), // AKo
        ...generatePairCombos('K'), // KK
        ...generateSuitedCombos('K', 'Q'), // KQs
        ...generateSuitedCombos('K', 'J'), // KJs
        ...generateSuitedCombos('K', 'T'), // KTs
        ...generateSuitedCombos('K', '9'), // K9s
        ...generateSuitedCombos('K', '8'), // K8s
        ...generateSuitedCombos('K', '7'), // K7s
        ...generateSuitedCombos('K', '6'), // K6s
        ...generateSuitedCombos('K', '5'), // K5s
        ...generateSuitedCombos('K', '4'), // K4s
        ...generateSuitedCombos('K', '3'), // K3s
        ...generateSuitedCombos('K', '2'), // K2s
        ...generateOffsuitCombos('A', 'Q'), // AQo
        ...generateOffsuitCombos('K', 'Q'), // KQo
        ...generatePairCombos('Q'), // QQ
        ...generateSuitedCombos('Q', 'J'), // QJs
        ...generateSuitedCombos('Q', 'T'), // QTs
        ...generateSuitedCombos('Q', '9'), // Q9s
        ...generateSuitedCombos('Q', '8'), // Q8s
        ...generateSuitedCombos('Q', '7'), // Q7s
        ...generateSuitedCombos('Q', '6'), // Q6s
        ...generateSuitedCombos('Q', '5'), // Q5s
        ...generateSuitedCombos('Q', '4'), // Q4s
        ...generateSuitedCombos('Q', '3'), // Q3s
        ...generateSuitedCombos('Q', '2'), // Q2s
        ...generateOffsuitCombos('A', 'J'), // AJo
        ...generateOffsuitCombos('K', 'J'), // KJo
        ...generateOffsuitCombos('Q', 'J'), // QJo
        ...generatePairCombos('J'), // JJ
        ...generateSuitedCombos('J', 'T'), // JTs
        ...generateSuitedCombos('J', '9'), // J9s
        ...generateSuitedCombos('J', '8'), // J8s
        ...generateSuitedCombos('J', '7'), // J7s
        ...generateSuitedCombos('J', '6'), // J6s
        ...generateSuitedCombos('J', '5'), // J5s
        ...generateOffsuitCombos('A', 'T'), // ATo
        ...generateOffsuitCombos('K', 'T'), // KTo
        ...generateOffsuitCombos('Q', 'T'), // QTo
        ...generateOffsuitCombos('J', 'T'), // JTo
        ...generatePairCombos('T'), // TT
        ...generateSuitedCombos('T', '9'), // T9s
        ...generateSuitedCombos('T', '8'), // T8s
        ...generateSuitedCombos('T', '7'), // T7s
        ...generateSuitedCombos('T', '6'), // T6s
        ...generateOffsuitCombos('A', '9'), // A9o
        ...generateOffsuitCombos('K', '9'), // K9o
        ...generateOffsuitCombos('Q', '9'), // Q9o
        ...generateOffsuitCombos('J', '9'), // J9o
        ...generateOffsuitCombos('T', '9'), // T9o
        ...generatePairCombos('9'), // 99
        ...generateSuitedCombos('9', '8'), // 98s
        ...generateSuitedCombos('9', '7'), // 97s
        ...generateSuitedCombos('9', '6'), // 96s
        ...generateOffsuitCombos('A', '8'), // A8o
        ...generateOffsuitCombos('K', '8'), // K8o
        ...generatePairCombos('8'), // 88
        ...generateSuitedCombos('8', '7'), // 87s
        ...generateSuitedCombos('8', '6'), // 86s
        ...generateOffsuitCombos('A', '7'), // A7o
        ...generatePairCombos('7'), // 77
        ...generateSuitedCombos('7', '6'), // 76s
        ...generateSuitedCombos('7', '5'), // 75s
        ...generateOffsuitCombos('A', '6'), // A6o
        ...generatePairCombos('6'), // 66
        ...generateSuitedCombos('6', '5'), // 65s
        ...generateSuitedCombos('6', '4'), // 64s
        ...generateOffsuitCombos('A', '5'), // A5o
        ...generatePairCombos('5'), // 55
        ...generateSuitedCombos('5', '4'), // 54s
        ...generateOffsuitCombos('A', '4'), // A4o
        ...generatePairCombos('4'), // 44
        ...generateOffsuitCombos('A', '3'), // A3o
        ...generatePairCombos('3'), // 33
        ...generatePairCombos('2'), // 22
    ],

    BB: [
        // Add BB range here
    ],
};

const PreflopAdvisor: React.FC = () => {
    const [selectedPosition, setSelectedPosition] = useState<Position | ''>('');
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [showCardSelector, setShowCardSelector] = useState(false);

    const getHandNotation = (cards: string[]): string => {
        if (cards.length !== 2) return '';

        const [card1, card2] = cards;
        const rank1 = card1[0];
        const rank2 = card2[0];
        const suit1 = card1[1];
        const suit2 = card2[1];

        if (rank1 === rank2) {
            return rank1 + rank2; // Pair
        }

        const isSuited = suit1 === suit2;
        return rank1 + rank2 + (isSuited ? 's' : 'o');
    };

    const getAdvice = (): string => {
        if (!selectedPosition || selectedCards.length !== 2) return '';

        const handNotation = getHandNotation(selectedCards);
        const range = POSITION_RANGES[selectedPosition];

        return range.includes(handNotation) ? 'RAISE' : 'FOLD';
    };

    const SUITS = ['♠', '♥', '♦', '♣'];
    const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Preflop Advisor</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Position Selection */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Select Position</h3>
                        <div className="flex gap-2 flex-wrap">
                            {POSITIONS.map((position) => (
                                <Button
                                    key={position}
                                    variant={selectedPosition === position ? 'default' : 'outline'}
                                    onClick={() => setSelectedPosition(position)}
                                    className="w-16"
                                >
                                    {position}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Card Selection */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Select Hole Cards</h3>
                        <div className="flex gap-2 mb-4">
                            {selectedCards.map((card, index) => (
                                <div key={index} className="w-12 h-16 border rounded flex items-center justify-center text-lg font-bold">
                                    {card}
                                </div>
                            ))}
                            {selectedCards.length < 2 && (
                                <Button variant="outline" className="w-12 h-16" onClick={() => setShowCardSelector(true)}>
                                    +
                                </Button>
                            )}
                        </div>

                        {showCardSelector && (
                            <div className="border p-4 rounded-lg">
                                <div className="space-y-2">
                                    {SUITS.map((suit) => (
                                        <div key={suit} className="flex gap-1">
                                            {RANKS.map((rank) => (
                                                <Button
                                                    key={`${rank}${suit}`}
                                                    variant="outline"
                                                    className="w-8 h-8 p-0 text-sm"
                                                    onClick={() => {
                                                        const newCard = `${rank}${suit}`;
                                                        if (selectedCards.length < 2 && !selectedCards.includes(newCard)) {
                                                            setSelectedCards([...selectedCards, newCard]);
                                                            if (selectedCards.length === 1) {
                                                                setShowCardSelector(false);
                                                            }
                                                        }
                                                    }}
                                                    disabled={selectedCards.includes(`${rank}${suit}`)}
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

                    {/* Advice Section */}
                    {selectedPosition && selectedCards.length === 2 && (
                        <div className="border p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Advice</h3>
                            <p className="text-xl font-bold">
                                Hand: {getHandNotation(selectedCards)}
                                <br />
                                Action: {getAdvice()}
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedCards([]);
                                    setShowCardSelector(false);
                                }}
                                className="mt-4"
                            >
                                Reset Hand
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PreflopAdvisor;
