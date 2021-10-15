import './App.css';
import { youtubeAPIKey } from './key'
import React, { Component } from 'react';
import axios from 'axios';
import TitleBar from './components/TitleBar/TitleBar';
import VideoPlayer from './components/VideoPlayer/VideoPlayer'
import SearchResultsList from './components/SearchResultsList/SearchResultsList';



// URL = `https://www.googleapis.com/youtube/v3/search?q=${searchQuery}&key=${youtubeAPIKey}&type=video&maxResults=3`

class App  extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchResults: [],
      videoID: null,
      videoInfo: {
        title: "",
        description: ""
      }
     }
  }

  baseURL = 'https://www.googleapis.com/youtube/v3/'
  searchURL = 'https://www.googleapis.com/youtube/v3/search'

  // latestSearchResults =  null

  playSelectedVideo = (video) => {
    this.setState({
      videoID: video.id.videoId,
      videoInfo: {
        title: video.snippet.title,
        description: video.snippet.description
      }
    })
    this.getRelatedVideos(video.id.videoId)
  }

  getRelatedVideos = async (videoID) => {
    const response = await axios.get(this.searchURL, {
      params: {
        key: youtubeAPIKey,
        type: "video",
        maxResults: 5,
        part: "snippet",
        relatedToVideoId: videoID,
      }
    })
    this.setState({
      searchResults: response.data.items
    })
  }

  getSearchResults = async (query) => {
    const response = await axios.get(this.searchURL, {
      params: {
        q: query,
        key: youtubeAPIKey,
        type: "video",
        maxResults: 5,
        part: "snippet"
      }
    })
    // this.latestSearchResults = [response.data]
    this.setState({
      searchResults: response.data.items
    })
  }



  render() { 
    return ( 
      <div className="container-fluid">
        <TitleBar searchResults={this.getSearchResults}/>
        <div className = "row">
          <div className = "col-md-6">
            {this.state.videoID != null && <VideoPlayer videoId={this.state.videoID} videoInfo={this.state.videoInfo}/>}
          </div>
          <div className = "col-md-3">
            <SearchResultsList playVideo = {this.playSelectedVideo}results={this.state.searchResults} />
          </div>
          {/* <p>{this.state.searchResults}</p> */}
        </div>
      </div>

     );
  }
}
 
export default App ;
