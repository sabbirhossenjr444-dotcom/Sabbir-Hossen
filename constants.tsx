
import { Match, MatchType, MatchFormat } from './types';

export const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    matchNumber: 1,
    title: 'Daily Evening BR Rush',
    type: MatchType.BATTLE_ROYALE,
    format: MatchFormat.SOLO,
    entryFee: '20 BDT',
    prizePool: '500 BDT',
    startTime: '08:00 PM Today',
    totalSlots: 48,
    filledSlots: 32,
    banner: 'https://picsum.photos/seed/ff1/800/400'
  },
  {
    id: '2',
    matchNumber: 2,
    title: 'Elite Clash Squad Pro',
    type: MatchType.CLASH_SQUAD,
    format: MatchFormat.SQUAD,
    entryFee: 'Free',
    prizePool: '100 Diamonds',
    startTime: '09:30 PM Today',
    totalSlots: 8,
    filledSlots: 4,
    banner: 'https://picsum.photos/seed/ff2/800/400'
  },
  {
    id: '3',
    matchNumber: 3,
    title: 'Weekend Mega Royale',
    type: MatchType.BATTLE_ROYALE,
    format: MatchFormat.SQUAD,
    entryFee: '50 BDT',
    prizePool: '2000 BDT',
    startTime: '10:00 PM Tomorrow',
    totalSlots: 48,
    filledSlots: 12,
    banner: 'https://picsum.photos/seed/ff3/800/400'
  }
];

export const RULES = [
  "No Hack / No Mod: ধরা পড়লে ব্যান এবং রিফান্ড নেই।",
  "Custom Room Only: গেমের ভেতর রুম কার্ড দেওয়া হবে।",
  "Late Entry Not Allowed: সময়মতো না এলে এন্ট্রি মিস করবেন।",
  "Decision by Admin is Final: কোনো তর্কের সুযোগ নেই।"
];
