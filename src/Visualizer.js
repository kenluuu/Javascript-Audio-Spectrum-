import React, { Component } from 'react';
import './visualizer.css';
import ClientId from './ClientID';

var canvasContainer;

var canvas;



var ctx, source, context, analyser, audio, fbc_array,
bars, bar_x, bar_y, bar_width, bar_height,
center_x, center_y, rot, intensity, radius, old_radius, rads,
delta_rad, shockwave, playSecs, duration, secs, playBtn, playTime, progressBar, isPlaying, controls, mouseTimer, playBar, fullscreen, isFull;

isFull = false;
canvasContainer = document.getElementById('canvas-container');
playBtn = document.getElementById('play-btn');
playTime = document.getElementById('play-time');
progressBar = document.getElementById('progress-bar');
controls = document.getElementById('controls');
playBar = document.getElementById('bar');
fullscreen = document.getElementById('fullscreen');

fullscreen.onclick = function() {
  isFull = !isFull;

}

playBar.onclick = function(e) {

  let posX = e.clientX-(playBar.getBoundingClientRect().left);
  audio.currentTime = duration * (posX/playBar.clientWidth);
}
// canvas = document.getElementById('canvas');

class Visualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {audio: null}


  }
  componentDidMount() {


    canvas = document.createElement('canvas');
    canvas.onmousemove = function() {

      clearTimeout(mouseTimer);


      controls.style.display = 'flex';
      mouseTimer = setTimeout(function() {
        controls.style.display = 'none';
      },3000)


    }
    canvasContainer.insertBefore(canvas, canvasContainer.firstChild);
    if (!this.props.location.state) {

      this.props.history.push('/')
    } else {

      const {track} = this.props.location.state;

        audio = new Audio(`${track.stream_url}?client_id=${ClientId}`);
        audioInit();

        audio.crossOrigin = 'anonymous';
    }





  }

  componentWillUnmount() {

      canvasContainer.removeChild(canvas);
      canvas = null;
      audio.pause();

      isPlaying = false;
      playBtn.className = 'glyphicon glyphicon-play'

  }
  render() {


    if (!this.props.location.state) {
      return <div></div>;
    } else {
      const { user: {avatar_url, username }, title, description} = this.props.location.state.track;
      return (
        <div style={styles.songDetailContainer} id="song-container">
          <div  id="artist-container" style={{margin:'15px'}}>
            <img  src={avatar_url} alt="" style={{borderRadius: '50%', maxWidth:'100%', height:'auto'}}/>
            <p style={styles.usernameStyle}>{username}</p>
          </div>
          <div style={{marginRight: '15px', marginLeft:'auto',display:'flex', flexDirection: 'column'}}>
            <p >{title}</p>
            <p style={{}}>{description}</p>

          </div>


        </div>
      );
    }


  }
}

const styles = {
  songDetailContainer: {
    display: 'flex',
    backgroundColor: 'white',
    border: '1px solid rgba(0,0,0,.0975)',
    alignItems: 'flex-start',
    paddingBottom: '50px'


  },
  usernameStyle: {
    whiteSpace: 'nowrap',
    width: '100px',
    overflow:'hidden',
    textOverflow: 'ellipsis'
  }
}
function audioInit() {
  addCanvasStyle();
  bars = 200;
  playBtn.onclick = function() {
    if (!isPlaying) {
      audio.play();
      playBtn.className = 'glyphicon glyphicon-pause';
      isPlaying = true;
    } else {
      isPlaying = false;
      playBtn.className = 'glyphicon glyphicon-play';
      audio.pause();
    }

  }
  rot = 0;
  intensity = 0;
  radius = 0;
  shockwave = 0;

  ctx = canvas.getContext('2d');

  context = new AudioContext();
  analyser = context.createAnalyser();
  source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
  // analyser.fftSize = 512;

  fbc_array = new Uint8Array(analyser.frequencyBinCount);
  audio.onloadeddata = function() {
    // audio.play();
    frameLooper();
  }


}

function frameLooper() {
  if (!canvas) {
    return null;
  }
  resizeCanvas();

  rot = rot + intensity * 0.0000002;
  intensity = 0;

  analyser.getByteFrequencyData(fbc_array);

  for (var i=0; i<bars; i++) {

    rads = Math.PI * 2 / bars;


    if (canvas.width > 1200) {
      bar_height = fbc_array[i]*1.65;
    } else if (canvas.width >= 700){
      bar_height = fbc_array[i];
    } else {
      bar_height = fbc_array[i]/2;
    }

    bar_width = bar_height * 0.02;

    bar_x = center_x + Math.cos(rads * i + rot) * (radius + bar_height);
    bar_y = center_y + Math.sin(rads * i + rot) * (radius + bar_height);


    ctx.save();


    let lineColor = "rgb(" + 82 + ", " + 150 + ", " + (fbc_array[i]).toString() + ")";
    ctx.strokeStyle= lineColor;
    ctx.lineWidth = bar_width;
    ctx.beginPath();
    ctx.moveTo(center_x, center_y);
    ctx.lineTo(bar_x, bar_y);
    ctx.stroke();


    intensity += fbc_array[i];

  }


  center_x = canvas.width/2
  center_y = canvas.height/2

  old_radius = radius;
  radius = (canvas.width/100)  + (intensity * 0.001);
  delta_rad = radius - old_radius;

  ctx.fillStyle = "rgb(82, 219, 255)";
	ctx.beginPath();
	ctx.arc(center_x, center_y, radius, 0, Math.PI * 2, false);
	ctx.fill();


  shockwave += 60;

  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgb(82, 219, 255)";
  ctx.beginPath();
  ctx.arc(center_x, center_y, shockwave + radius, 0, Math.PI * 2, false);
  ctx.stroke();
  if (delta_rad > 5) {
    shockwave = 0;

    ctx.fillStyle = "rgba(82, 219, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rot = rot + 0.4;
  }


  // ctx.save();
  //
  //
  // angle += intensity * 0.000071;
  // ctx.translate(center_x, center_y);
  // ctx.rotate(angle * Math.PI/180);
  // ctx.translate(-center_x, -center_y);
  //
  //
  //
  // ctx.drawImage(img, 0, 0, img.width, img.height,
  // center_x-(radius+15/2), center_y-(radius+15/2), radius*2+15, radius*2+15);
  // ctx.restore();
  duration = audio.duration;
   secs = Math.round(duration%60);
   if (secs < 10) {
       secs = '0'+secs;
   }
   playSecs = Math.round(audio.currentTime%60);
   if (playSecs < 10) {
       playSecs = '0'+playSecs;

   }

   playTime.innerHTML = Math.floor(audio.currentTime/60)+":" + playSecs + ' / ' + Math.floor(duration/60) + ":" + secs;
   progressBar.style.width = (audio.currentTime/duration*100) + '%';


  window.requestAnimationFrame(frameLooper);


}
function addCanvasStyle() {

  canvas.style.backgroundColor = 'black';
  canvas.style.border = '1px solid rgba(0,0,0,.0975)';
  canvas.style.display = 'block'
  // canvas.style.maxWidth = '600px';

  canvas.style.marginTop = '100px';

}

function resizeCanvas() {
  if (!isFull) {
    canvas.width = window.innerWidth > 600 ? 600 : window.innerWidth;
    canvas.height = canvas.width * (9/16);
    canvasContainer.style.margin = '0 auto';
    document.getElementById('song-container').style.display = 'flex';
    document.getElementById('navbar').style.display = 'flex';
    canvas.style.marginTop = '100px';
    controls.style.left = '0';
  } else {

    canvasContainer.style.margin = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('song-container').style.display = 'none';
    document.getElementById('navbar').style.display = 'none';
    canvas.style.margin = '0';
    let centerX = canvas.width/2 - controls.clientWidth/2;

    controls.style.left = centerX + 'px'
  }

}

export default Visualizer;
