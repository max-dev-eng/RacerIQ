import type { Track } from "RacerIQ/src/shared/schema";

export interface TrackInfo extends Track {
  imageUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  characteristics: string[];
}

export const trackDatabase: Record<string, TrackInfo> = {
  'austrian-gp': {
    id: 1,
    name: 'Austrian GP - Red Bull Ring',
    slug: 'austrian-gp',
    country: 'Austria',
    length: '4.318 km',
    turns: 10,
    sectors: 3,
    description: 'High-speed circuit with elevation changes',
    mapData: {},
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200',
    difficulty: 'Medium',
    characteristics: ['High-speed', 'Elevation changes', 'Technical corners']
  },
  'nurburgring': {
    id: 2,
    name: 'Nürburgring - Nordschleife',
    slug: 'nurburgring',
    country: 'Germany',
    length: '20.832 km',
    turns: 154,
    sectors: 3,
    description: 'The legendary Green Hell',
    mapData: {},
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200',
    difficulty: 'Expert',
    characteristics: ['Extremely long']
  },
  'monza': {
    id: 3,
    name: 'Monza - Italy',
    slug: 'monza',
    country: 'Italy',
    length: '5.793 km',
    turns: 11,
    sectors: 3,
    description: 'Temple of Speed',
    mapData: {},
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200',
    difficulty: 'Easy',
    characteristics: ['High-speed', 'Long straights']
  },
  'spa': {
    id: 4,
    name: 'Spa-Francorchamps - Belgium',
    slug: 'spa',
    country: 'Belgium',
    length: '7.004 km',
    turns: 19,
    sectors: 3,
    description: 'Classic circuit through the Ardennes',
    mapData: {},
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200',
    difficulty: 'Hard',
    characteristics: ['Weather-dependent', 'Technical']
  }
};

export function getTrackInfo(slug: string): TrackInfo | undefined {
  return trackDatabase[slug];
}

export function getAllTracks(): TrackInfo[] {
  return Object.values(trackDatabase);
}
