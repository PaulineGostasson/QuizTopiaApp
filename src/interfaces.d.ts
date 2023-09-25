export interface Login {
  username?: string;
  password?: string;
}
export interface LoginSuccessful {
  success: boolean;
  message?: string;
  token?: string;
}
export interface Api {
  success: boolean;
}
export interface UserProfile{
  quizName: string;
}

export interface Geolocation {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}
export interface Coord{
  latitude: number,
  longitude: number
}
export interface QuizInt {
  success: boolean;
  quiz: {
    Attributes: {
      questions: Array<{
        question: string;
        answer: string;
        location: {
          longitude: string;
          latitude: string;
        };
      }>;
      userId: string;
      quizId: string;
    };
  };
}
export interface Quiz {
  questions: {
    question: string;
    answer: string;
    location: {
      longitude: string;
      latitude: string;
    };
  }[];
  userId: string;
  quizId: string;
  username: string;
}
export interface QuizList{
  success:boolean;
  quizzes: Quiz[]
}


export interface MapBoxInt {
  setNewLat: React.Dispatch<React.SetStateAction<number>>;
  setNewLng: React.Dispatch<React.SetStateAction<number>>;
}