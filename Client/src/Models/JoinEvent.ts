interface JoinEvent {
  header: number;
  success: boolean;
  playerId: number;
  playerCount: number;
  board: string[];
}

export type { JoinEvent };
