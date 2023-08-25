export interface Checks {
  trainingCard: number;
  mealsCard: number;
}

export interface UserSummary {
  checks: Checks;
  _id: string;
  user: string;
  weight: string;
  date: string;
  __v: number;
}

export interface Summary {
  dates: string[];
  tasks: number[];
  meals: number[];
  weight: number[];
}

export interface UserSummaryResponse {
  error: boolean;
  statusCode: number;
  userSummary: UserSummary[];
}
