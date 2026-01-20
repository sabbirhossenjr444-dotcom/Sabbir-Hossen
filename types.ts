
export enum MatchType {
  BATTLE_ROYALE = 'Battle Royale',
  CLASH_SQUAD = 'Clash Squad 4v4'
}

export enum MatchFormat {
  SOLO = 'Solo',
  DUO = 'Duo',
  SQUAD = 'Squad'
}

export interface Match {
  id: string;
  matchNumber: number;
  title: string;
  type: MatchType;
  format: MatchFormat;
  entryFee: string;
  prizePool: string;
  startTime: string;
  totalSlots: number;
  filledSlots: number;
  banner: string;
  roomCode?: string;
  roomPassword?: string;
}

export type UserRole = 'player' | 'admin';

export interface User {
  mobile: string;
  password?: string;
  role: UserRole;
  balance: number;
  username: string;
}

export type TransactionType = 'deposit' | 'withdraw';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export interface Transaction {
  id: string;
  userMobile: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  method: string;
  trxId?: string; // For deposits
  timestamp: number;
}

export interface UserMatch {
  id: string;
  userMobile: string;
  matchId: string;
  matchTitle: string;
  matchType: MatchType;
  startTime: string;
  uid: string;
  gameName: string;
  status: 'joined' | 'won' | 'lost';
  prizeWon?: string;
  timestamp: number;
}
