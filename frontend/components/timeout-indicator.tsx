"use client";

import { Game } from "@/lib/contract";
import { useStacks } from "@/hooks/use-stacks";
import { useState, useEffect } from "react";

interface TimeoutIndicatorProps {
  game: Game;
}

export function TimeoutIndicator({ game }: TimeoutIndicatorProps) {
  const { userData, handleCancelGame, checkCanCancelGame } = useStacks();
  const [canCancel, setCanCancel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the current user is a player in this game
  const isPlayer = userData && (
    userData.profile.stxAddress.testnet === game["player-one"] ||
    userData.profile.stxAddress.testnet === game["player-two"]
  );

  // Check if the game is ongoing (no winner yet)
  const isOngoing = !game.winner;

  useEffect(() => {
    if (isPlayer && isOngoing) {
      checkCanCancelGame(game.id).then(setCanCancel);
    }
  }, [game.id, isPlayer, isOngoing, checkCanCancelGame]);

  const handleCancel = async () => {
    if (!canCancel) return;
    
    setIsLoading(true);
    try {
      await handleCancelGame(game.id);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show anything if user is not a player or game is already finished
  if (!isPlayer || !isOngoing) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="text-yellow-800">
          <p className="font-semibold">⏰ Timeout Protection Active</p>
          <p className="text-sm">
            If your opponent doesn't make a move, you can cancel the game and claim the funds.
          </p>
        </div>
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Cancelling..." : "Cancel Game"}
          </button>
        )}
      </div>
    </div>
  );
}
