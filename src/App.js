import './App.css';
import { youtubeAPIKey } from './key'
import React, { Component } from 'react';
import axios from 'axios';
import TitleBar from './components/TitleBar/TitleBar';
import VideoPlayer from './components/VideoPlayer/VideoPlayer'
import SearchResultsList from './components/SearchResultsList/SearchResultsList';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      videoID: null,
      videoInfo: {
        title: "",
        description: ""
      },
      videoComments: []
    }
  }

  baseURL = 'https://www.googleapis.com/youtube/v3/'
  searchURL = 'https://www.googleapis.com/youtube/v3/search'
  commentURL = 'http://127.0.0.1:8000/comments/'


  playSelectedVideo = (video) => {
    this.setState({
      videoID: video.id.videoId,
      videoInfo: {
        title: video.snippet.title,
        description: video.snippet.description
      }
    })
    this.getRelatedVideos(video.id.videoId)
    this.getVideoComments(video.id.videoId)
    console.log(video.id.videoId)
  }

  getRelatedVideos = async (videoID) => {
    try {
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
    catch(err) {
      console.log("🚀 ~ file: App.js ~ line 62 ~ App ~ getRelatedVideos= ~ err", err)
    }
  }

  getSearchResults = async (query) => {
    try {
      const response = await axios.get(this.searchURL, {
        params: {
          q: query.searchQuery,
          key: youtubeAPIKey,
          type: "video",
          maxResults: 5,
          part: "snippet",
          kind: "youtube#searchListResponse",
          regionCode: "US",
          order: "viewCount"
        }
      })
      this.setState({
        searchResults: response.data.items
      })
    }
    catch(err){
      console.log("🚀 ~ file: App.js ~ line 86 ~ App ~ getSearchResults= ~ err", err)
      
    }
  }

  postComment = async (comment) => {
    try {
      let videoId = this.state.videoID
      const response = await axios.post(`${this.commentURL}${videoId}/`, {
        message: comment.message,
        video: videoId
      })
      console.log(comment)
      this.getVideoComments(videoId)
    }
    catch(err){
      console.log("🚀 ~ file: App.js ~ line 103 ~ App ~ postComment= ~ err", err)
    }
  }

  getVideoComments = async (videoId) => {
    try {
      const response = await axios.get(`${this.commentURL}${videoId}/`)
      this.setState({
        videoComments: response.data
      })
    }
    catch(err){
      console.log("🚀 ~ file: App.js ~ line 114 ~ App ~ getVideoComments= ~ err", err)
    }
  }


  render() {
    return (
      <div className="container-fluid">
        <TitleBar searchResults={this.getSearchResults} />
        <div className="row">
          <div className="col-md-9">
            {this.state.videoID != null && <VideoPlayer videoId={this.state.videoID} videoInfo={this.state.videoInfo} videoComments={this.state.videoComments} postComment = {this.postComment}/>}
          </div>
          <div className="col-md-3">
            <SearchResultsList playVideo={this.playSelectedVideo} results={this.state.searchResults} />
          </div>
          {/* <p>{this.state.searchResults}</p> */}
        </div>
      </div>

    );
  }
}

export default App;