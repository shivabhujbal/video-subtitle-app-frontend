import axios from 'axios';

const API_BASE_URL = 'http://localhost:8888';

const videoService = {
  getAllVideos: () => {
    return axios.get(`${API_BASE_URL}/videos/getAll`);
  },

  getVideoById: (id) => {
    return axios.get(`${API_BASE_URL}/videos/${id}`);
  },

  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_BASE_URL}/videos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteVideo: (id) => {
    return axios.delete(`${API_BASE_URL}/videos/${id}`);
  },

  streamVideo: (videoId) => {
    return axios.get(`${API_BASE_URL}/videos/${videoId}/stream`, {
      responseType: 'arraybuffer', // Important for handling binary data
    });
  },
  
};

export default videoService;
