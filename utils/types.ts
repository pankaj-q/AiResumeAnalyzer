export interface Experience {
  title: string;
  company: string;
  duration: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeParsed {
  rawText: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  summary: string | null;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
}

export interface KeywordMatch {
  score: number;
  matched: string[];
  missing: string[];
}

export interface Sections {
  contact: boolean;
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  certifications: boolean;
}

export interface ATSResult {
  atsScore: number;
  keywordMatch: KeywordMatch;
  formatScore: number;
  experienceScore: number;
  educationScore: number;
  skillsScore: number;
  sections: Sections;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  summary: string;
}

export interface OpenAIError extends Error {
  status?: number;
  statusCode?: number;
}
