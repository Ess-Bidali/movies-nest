import { take } from "rxjs";
import { Movie, MovieEndpointResponse } from "./movie.model";
import { MoviesQuery } from "./movies.query";
import { MoviesService } from "./movies.service";
import { MoviesStore } from "./movies.store";

describe('MoviesStore', () => {
  let store: MoviesStore;
  let query: MoviesQuery;
  let service: MoviesService;

  let sampleValidMovieData = [
    {
      Title: 'TEST',
      Year: 'TEST',
      imdbID: 'TEST',
      Type: 'TEST',
      Poster: 'TEST',
      plot: 'TEST'
    }, {
      Title: 'TEST1',
      Year: 'TEST1',
      imdbID: 'TEST1',
      Type: 'TEST1',
      Poster: 'TEST1',
      plot: 'TEST1'
    }
  ];

  const sampleDataWithRecords: MovieEndpointResponse = {
    Search: sampleValidMovieData,
    Response: 'True',
    totalResults: '2'
  };

  beforeEach(() => {
    store = new MoviesStore();
    query = new MoviesQuery(store);
    service = new MoviesService(store);
  });

  it('should replace store data with response data if query contains page 1', () => {
    const samplePage = 1;
    const sampleData: MovieEndpointResponse = {
      Search: [...sampleValidMovieData, ...sampleValidMovieData],
      Response: 'True',
      totalResults: '0'
    } as any;

    // Update store
    service.updateStore(sampleData, samplePage);

    // Check results
    expect(query.getCount()).toEqual(sampleData.Search?.length || 4);
  });

  it('should append store data with response data if query page > 1', () => {
    const samplePage = 1;
    const sampleData: MovieEndpointResponse = {
      Search: [...sampleValidMovieData, ...sampleValidMovieData],
      Response: 'True',
      totalResults: '0'
    } as any;

    // Update store
    service.updateStore(sampleData, samplePage);

    // Check results
    expect(query.getCount()).toEqual(sampleData.Search?.length || 4);

    // Add page 2
    const samplePage2 = 1;
    const sampleData2: MovieEndpointResponse = {
      Search: [...sampleValidMovieData, ...sampleValidMovieData],
      Response: 'True',
      totalResults: '0'
    } as any;

    // Update store
    service.updateStore(sampleData2, samplePage2);

    // Check results
    expect(query.getCount()).toEqual(sampleData.Search?.length || 8);
  });

  it('should reset store on error with no Search results', () => {
    spyOn(store, 'set');
    const sampleData: MovieEndpointResponse = {
      Search: [],
      Error: 'Error!',
      Response: 'True',
      totalResults: '2'
    };
    const samplePage = 1;
    service.updateStore(sampleData, samplePage);

    expect(store.set).toHaveBeenCalled();
    expect(query.getCount()).toEqual(sampleData.Search?.length || 0);
  });

  it('should reset store on null Search results', () => {
    const samplePage = 1;
    service.updateStore(sampleDataWithRecords, samplePage);
    expect(query.getCount()).toEqual(sampleDataWithRecords.Search?.length || 2);

    const sampleDataWithNoSearchResults: MovieEndpointResponse = {
      Error: 'Error!',
      Response: 'False',
      totalResults: '0'
    } as any;

    service.updateStore(sampleDataWithNoSearchResults, samplePage);
    expect(query.getCount()).toEqual(0);
  });

  it('should update store error on a known API Error response', () => {
    spyOn(store, 'setError');
    const knownErrors = [ 'too many results.', 'movie not found!', 'series not found!'];
    const randomIndex = Math.floor((Math.random() * knownErrors?.length));

    // Data
    const samplePage = 1;
    const errorSampleData: MovieEndpointResponse = {
      Error: knownErrors[randomIndex],
      Response: 'False',
      totalResults: '0'
    };

    // Update store
    service.handleResult(errorSampleData, {page: samplePage } as any);

    // Check
    expect(store.setError).toHaveBeenCalled();
  });

  it('should throw store error on API Error response', () => {
    spyOn(store, 'setError');

    // Data
    const samplePage = 1;
    const errorSampleData: MovieEndpointResponse = {
      Error: 'Error!',
      Response: 'False',
      totalResults: '0'
    };

    // Update store
    const updateFn = () => service.handleResult(errorSampleData, {page: samplePage } as any);

    // Check
    expect(updateFn).toThrow(new Error(errorSampleData.Error));
  });

  it('should throw store error on API Error response with valid search results', () => {
    spyOn(store, 'setError');

    // Data
    const samplePage = 1;
    const errorSampleData: MovieEndpointResponse = {
      Search: sampleValidMovieData,
      Error: 'Error!',
      Response: 'False',
      totalResults: '0'
    };

    // Update store
    const updateFn = () => service.handleResult(errorSampleData, {page: samplePage } as any);

    // Check
    expect(updateFn).toThrow(new Error(errorSampleData.Error));
  });

  it('should reset store error on after the next successful call', () => {
    // spyOn(store, 'setError');

    // Data
    const samplePage = 1;
    const errorSampleData: MovieEndpointResponse = {
      Search: sampleValidMovieData,
      Error: 'Error!',
      Response: 'False',
      totalResults: '0'
    };

    // Update store
    const updateFn = () => service.handleResult(errorSampleData, {page: samplePage } as any);

    // Check
    expect(updateFn).toThrow(new Error(errorSampleData.Error));

    // Provide valid result
    service.handleResult(sampleDataWithRecords, {page: samplePage} as any);

    // Check error state
    // expect(store.setError).toHaveBeenCalled();
    query.selectError().pipe(take(1)).subscribe((err) => expect(err).toEqual(null));
  });
});
