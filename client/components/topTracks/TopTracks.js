import React from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const path = 'http://127.0.0.1:3000'

export default class TopTracks extends React.Component {
  constructor(props){
    super(props);
   	this.state = {
   		tracks: []
   	}
  }

  componentDidMount() {
  	this.getTopTracks();
  }

  getTopTracks(tracks) {
  	axios.get('/tracks/all', tracks => {
  		return tracks;
  	}).then((tracks) => {
  	  let sorted = tracks.data.sort((a,b) => {return (a.thumbs < b.thumbs) ? 1 : ((b.thumbs < a.thumbs) ? -1 : 0);} );
  	  this.setState({
  	  	tracks: sorted.slice(0, 6)
  	  })
  	})
  }
  
  render() {
    return (
      <div className="row">
	      <div className="navbar top-tracks">
		      <div className="col-lg-12">
            <h4 className="white space">TOP LOCAL TRACKS</h4>
		      	<div>
		      	{
		      	this.state.tracks.map((track) => {
		      		return (
		      			<div className="col-xs-2">
		      			<ReactPlayer
		      			  url={ track.url }
                  controls={ true }
                  height={ 160 }
                  width='100%'
		      			/>
		      			</div>
		      		)
		      	})
		      }
		      </div>
		      </div>
		    </div>
      </div>
    )
  }
}