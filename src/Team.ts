import { Omit, Overwrite } from './utils';

export interface Team {
  id: string;
  name: string;
  color: string;
  question: number;
  answers: Array<string>;
  startTime: Date;
  endTime: Date | null;
}

export type NewTeam = Omit<Team, 'id'>;
export type TeamUpdate = Overwrite<Partial<Team>, { id: string }>;
