
export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  type: 'hero' | 'grid' | 'split' | 'quote' | 'stats' | 'image' | 'process' | 'footer';
  tags?: string[];
  imageUrl?: string;
  accentColor: string;
  // Dynamic content fields
  stats?: { val: string; label: string }[];
  gridInfo?: { title: string; label: string }[];
  processSteps?: { step: string; desc: string }[];
}

export enum AnimationType {
  SIDE_TO_SIDE = 'side-to-side',
  CORNER_TO_CORNER = 'corner-to-corner',
}
