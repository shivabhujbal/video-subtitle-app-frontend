import React, { useState, useEffect } from 'react';
import videoService from '../services/VideoService';

const VideoManager = ({getVideos}) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch all videos
    videoService.getAllVideos()
      .then(response => setVideos(response.data))
      .catch(error => console.error('Error fetching videos:', error));

      getVideos()
  }, [getVideos]);

  const handleDeleteVideo = async (id) => {
    console.log("clicked");
    try {
      // Delete video by ID
      await videoService.deleteVideo(id);
      // Remove the deleted video from the state
      setVideos(videos.filter(video => video.id !== id));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  return (
    <div>
      <h3>Video Manager</h3>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Video Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, index) => (
            <tr key={video.id}>
              <th scope="row">{index + 1}</th>
              <td>{video.videoName.substring(14)}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteVideo(video.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoManager;
