interface JoinEvent {
  header: number;
  success: boolean;
  playerId: number;
  board: string[];
}

export type { JoinEvent };
