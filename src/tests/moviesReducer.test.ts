import { describe, expect, it } from 'vitest';
import { moviesReducer } from '../state/moviesReducer';

describe('moviesReducer', () => {
  it('deve alternar o estado de favorito do filme', () => {
    const filmId = 'abc';

    const once = moviesReducer({}, { type: 'toggle_favorite', filmId });
    const twice = moviesReducer(once, { type: 'toggle_favorite', filmId });

    expect(once[filmId].favorite).toBe(true);
    expect(twice[filmId].favorite).toBe(false);
  });
});
