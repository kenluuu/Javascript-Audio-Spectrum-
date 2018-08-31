import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTracks } from './actions/track_actions';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }
  handleKeyUp(e) {

    if (e.keyCode === 13) {

      this.props.fetchTracks(e.target.value, () => this.props.history.push('/'));
    }
  }
  render() {

    return (
      <div style={styles.navbar} id="navbar">
      
        <input type="text" style={styles.input} placeholder="search" onKeyUp ={this.handleKeyUp}/>

      </div>
    );
  }
}

const styles = {
  navbar: {
    overflow: 'hidden',
    height: '65px',
    backgroundColor: 'white',
    position: 'fixed',
    width: '100%',
    top: '0px',
    borderBottom: '1px solid rgba(0,0,0,.0975)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',


  },
  input: {
    textAlign: 'center',
    width: '175px',
    height: '20px',
    fontSize: '14px'
  },
  // searchBtn: {
  //   height: '22px',
  //   border: '1px solid rgba(0,0,0,.0975)',
  //   textAlign: 'center',
  //   paddingLeft: '10px',
  //   paddingRight: '10px',
  //
  //
  // }
}

export default connect(null, {fetchTracks})(NavBar);
