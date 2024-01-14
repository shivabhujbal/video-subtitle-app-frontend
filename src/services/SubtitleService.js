import axios from 'axios';

const API_BASE_URL = 'http://localhost:8888'; // Replace with your Spring Boot backend URL

const subtitleService = {
  getAllSubtitles: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subtitles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all subtitles:', error);
      throw error;
    }
  },

  getSubtitleById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subtitles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subtitle by ID ${id}:`, error);
      throw error;
    }
  },

  saveSubtitle: async (subtitle) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subtitles`, subtitle);
      return response.data;
    } catch (error) {
      console.error('Error saving subtitle:', error);
      throw error;
    }
  },

  deleteSubtitle: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/subtitles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting subtitle with ID ${id}:`, error);
      throw error;
    }
  },

  getSubtitlesByVideoId: async (videoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subtitles/video/${videoId}`);
      if (!response.ok) {
        throw new Error(`Error fetching subtitles for video ${videoId}`);
      }

      const subtitles = await response.json();
      return subtitles;
    } catch (error) {
      console.error('SubtitleService - getSubtitlesByVideoId:', error);
      throw error; // You can handle errors in your component
    }
  },
};

export default subtitleService;
