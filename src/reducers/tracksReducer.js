import { FETCH_TRACKS } from '../actions/types'
const INITIAL_STATE = {
  selectedTrack: {},
  tracks: []
};

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case FETCH_TRACKS:
    
      return {...state, tracks:action.payload}
    default:
      return state;
  }
}
