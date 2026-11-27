export interface Scene {
  time: string;
  location: string;
  content: string;
}

export interface StoryChapter {
  title: string;
  openingLine: string;
  scenes: Scene[];
  youSaw: string[];
  youAte: string[];
  youPhotographed: string[];
  youWroteDown: string;
  endingLine: string;
  suggestedFollowUps: string[];
}

export interface UserInput {
  mood: string;
  destination?: string;
  tone?: string;
  travelWith?: string;
  vibe?: string;
}
