import { SUPPORTED_LANGUAGES } from './constants';

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  meta?: {
    subject?: string;
    topic?: string;
    practiceActivities?: string[];
  };
}

// This type is for the structure of grounding chunks if Search Grounding is used.
// Not actively used in this version but good to have for future extension.
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Other types of chunks can be added here
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields
}