export type Visibility = 'public' | 'members' | 'premium' | 'private'

export interface Lesson {
  id: string
  name: string
  date: string
  url: string
  audioPaths: string[]
  visibility: Visibility
}

export interface WipLesson {
  id: string
  name: string
  step: 1 | 2 | 3 | 4
  audioCount: number
  audioData: AudioBlock[]
  date: string
  url: string
}

export interface AudioBlock {
  rawText: string
  sentences: Sentence[]
}

export interface Sentence {
  text: string
  tokens: Token[]
}

export interface Token {
  term: string
  meaning?: string
  type: 'word' | 'phrase' | 'plain'
}

export interface DictEntry {
  es: string
  jp: string
  pos: string
  examples: { es: string; jp: string }[]
  trivia: string
  visibility: 'public' | 'members'
}

export interface Flashcard {
  id: string
  jp: string
  es: string
  memo: string
  type: 'word' | 'phrase'
  category: string
  visibility: Visibility
  created: string
}

export interface FCCategory {
  id: string
  name: string
  created: string
}

export interface Announcement {
  id: string
  title: string
  url: string
  description: string
  visibility: Visibility
  lessonId: string | null
  lessonName: string | null
  createdAt: string
}

export interface DashboardStats {
  lessonCount: number
  dictCount: number
  flashcardCount: number
  announcementCount: number
  wipLessons: WipLesson[]
}
