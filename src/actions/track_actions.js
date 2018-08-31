import ClientId from '.././ClientID';
import { FETCH_TRACKS } from './types.js'

let SC = window.SC;
export const fetchTracks = (searchTerm, callback) => {


  return function (dispatch) {
    if (!searchTerm) {
      searchTerm = 'lofi'
    }
    SC.initialize({
      client_id: ClientId
    });

    SC.get('/tracks', {
      q: searchTerm
    }).then((tracks) => {
      
      dispatch({
        type: FETCH_TRACKS,
        payload: tracks
      });
      if (callback) {
        callback()
      }

    });
  }

}
