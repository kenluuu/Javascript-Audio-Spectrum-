import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {fetchTracks} from './actions/track_actions';


class Home extends Component {
  // constructor(props) {
  //   super(props);
  //
  //
  // }
  componentDidMount() {

    const {tracks} = this.props.trackReducer;
    if (tracks.length === 0) {
      this.props.fetchTracks();
    }

  }
  showTracks() {

    const {tracks} = this.props.trackReducer;
    if (tracks.length > 0) {

      return tracks.map(track => {

        const { id, title,  artwork_url, genre, user:{username, avatar_url } } = track;

        return (
            <Link key={id} to={{ pathname: `/track/${id}`, state: { tracks, track } }} style={{textDecoration: 'none', color: 'black'}}>
              <div  style={styles.trackBody}>
                <img src={artwork_url} style={styles.artwork} alt=""/>
                <div style={{margin: '0 20px'}}>
                  <div style={{display:'flex', alignItems: 'center'}}>
                    <img style={styles.userAvater} src={avatar_url} alt=""/>
                    <p style={styles.username}>{username}</p>
                  </div>

                  <p style={styles.title}>{title}</p>
                </div>
              </div>
            </Link>
        )
      });
    }
  }
  render() {

    return (
      <div style={styles.homeContainer}>

        {this.showTracks()}
      </div>

    );
  }
}

const styles = {
  homeContainer: {
    maxWidth: '600px',
    marginTop: '100px',
    padding: '0 50px',
  

  },
  artwork: {

  },
  title: {
    margin: '5px 0',

  },
  username: {
    margin: '0',
    color: '#999',
    fontSize: '10px',
    marginLeft: '5px'
  },
  userAvater: {
    height: '25px',
    width: '25px',
    borderRadius: '50%'
  },
  trackBody: {
    margin: '20px 0',
    display: 'flex',
    maxHeight: '100px',
    backgroundColor: 'white',
    padding: '15px',
    border: '1px solid #dddfe2',
    borderRadius: '3px'
  }
}

function mapStateToProps(state) {
  return { trackReducer: state.tracks }
}
export default connect(mapStateToProps, {fetchTracks})(Home);
