export type View = 'intro' | 'studio' | 'book' | 'hub' | 'gallery';
export type Journey = { view: View; page: number; inspected: number | null };
export type JourneyAction =
  | { type: 'skip' | 'home' | 'open' | 'portal' | 'gallery' | 'back' }
  | { type: 'page'; direction: number }
  | { type: 'inspect'; index: number };
export const initialJourney: Journey = { view: 'intro', page: 0, inspected: null };
export function journeyReducer(state: Journey, action: JourneyAction): Journey {
  switch (action.type) {
    case 'skip':
    case 'home':
      return { ...initialJourney, view: 'studio' };
    case 'open':
      return { ...state, view: 'book', inspected: null };
    case 'portal':
      return { ...state, view: 'hub', inspected: null };
    case 'gallery':
      return { ...state, view: 'gallery', inspected: null };
    case 'page':
      return { ...state, page: (state.page + action.direction + 4) % 4 };
    case 'inspect':
      return { ...state, inspected: action.index };
    case 'back':
      return state.inspected !== null
        ? { ...state, inspected: null }
        : { ...state, view: state.view === 'gallery' ? 'hub' : 'studio' };
  }
}
