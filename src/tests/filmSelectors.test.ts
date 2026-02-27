import { describe, expect, it } from 'vitest';
import { getVisibleFilms } from '../utils/filmSelectors';
import type { AppFilters, Film, SortState } from '../types/film';

const films: Film[] = [
  {
    id: '1',
    title: 'Castle in the Sky',
    original_title: 'Tenku no Shiro Rapyuta',
    image: 'https://example.com/1.jpg',
    movie_banner: 'https://example.com/1-banner.jpg',
    description: 'A boy and a girl search for a mythical floating castle.',
    director: 'Hayao Miyazaki',
    producer: 'Isao Takahata',
    release_date: '1986',
    running_time: '124',
    rt_score: '95'
  },
  {
    id: '2',
    title: 'Kiki\'s Delivery Service',
    original_title: 'Majo no Takkyubin',
    image: 'https://example.com/2.jpg',
    movie_banner: 'https://example.com/2-banner.jpg',
    description: 'A young witch starts a delivery business in a seaside town.',
    director: 'Hayao Miyazaki',
    producer: 'Hayao Miyazaki',
    release_date: '1989',
    running_time: '102',
    rt_score: '96'
  },
  {
    id: '3',
    title: 'Spirited Away',
    original_title: 'Sen to Chihiro no Kamikakushi',
    image: 'https://example.com/3.jpg',
    movie_banner: 'https://example.com/3-banner.jpg',
    description: 'A ten-year-old girl enters a world ruled by spirits.',
    director: 'Hayao Miyazaki',
    producer: 'Toshio Suzuki',
    release_date: '2001',
    running_time: '125',
    rt_score: '97'
  }
];

const baseFilters: AppFilters = {
  search: '',
  includeSynopsis: false,
  watchedOnly: false,
  favoriteOnly: false,
  notedOnly: false,
  stars: 0
};

const baseSort: SortState = {
  field: 'title',
  direction: 'asc'
};

const items = [
  {
    film: films[0],
    meta: { watched: true, favorite: false, note: '', personalRating: 2 }
  },
  {
    film: films[1],
    meta: { watched: false, favorite: true, note: 'ótimo conforto', personalRating: 5 }
  },
  {
    film: films[2],
    meta: { watched: true, favorite: true, note: 'incrível', personalRating: 4 }
  }
];

describe('getVisibleFilms', () => {
  it('filtra por título', () => {
    const output = getVisibleFilms(items, { ...baseFilters, search: 'kiki' }, baseSort);

    expect(output).toHaveLength(1);
    expect(output[0].film.id).toBe('2');
  });

  it('filtra pela sinopse quando includeSynopsis está habilitado', () => {
    const output = getVisibleFilms(
      items,
      { ...baseFilters, search: 'spirits', includeSynopsis: true },
      baseSort
    );

    expect(output).toHaveLength(1);
    expect(output[0].film.id).toBe('3');
  });

  it('aplica filtros por assistido, favorito, anotação e estrelas', () => {
    const output = getVisibleFilms(
      items,
      {
        ...baseFilters,
        watchedOnly: true,
        favoriteOnly: true,
        notedOnly: true,
        stars: 4
      },
      baseSort
    );

    expect(output).toHaveLength(1);
    expect(output[0].film.id).toBe('3');
  });

  it('ordena por duração desc', () => {
    const output = getVisibleFilms(
      items,
      baseFilters,
      {
        field: 'duration',
        direction: 'desc'
      }
    );

    expect(output.map((item) => item.film.id)).toEqual(['3', '1', '2']);
  });

  it('ordena por avaliação pessoal asc', () => {
    const output = getVisibleFilms(
      items,
      baseFilters,
      {
        field: 'personalRating',
        direction: 'asc'
      }
    );

    expect(output.map((item) => item.film.id)).toEqual(['1', '3', '2']);
  });
});
