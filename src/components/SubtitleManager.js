import React, { useState, useEffect } from 'react';
import subtitleService from '../services/SubtitleService';

const SubtitleManager = ({ videoId }) => {
  const [subtitles, setSubtitles] = useState([]);

  useEffect(() => {
    // Fetch subtitles for the specified videoId
    subtitleService.getSubtitlesByVideoId(videoId)
      .then(subtitles => setSubtitles(subtitles))
      .catch(error => console.error('Error fetching subtitles:', error));
  }, [videoId]);

  const handleDeleteSubtitle = async (id) => {
    try {
      // Delete subtitle by ID
      await subtitleService.deleteSubtitle(id);
      // Remove the deleted subtitle from the state
      setSubtitles(subtitles.filter(subtitle => subtitle.id !== id));
    } catch (error) {
      console.error('Error deleting subtitle:', error);
    }
  };

  return (
    <div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Start Time</th>
            <th scope="col">End Time</th>
            <th scope="col">Subtitle Text</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subtitles.map((subtitle, index) => (
            <tr key={subtitle.id}>
              <th scope="row">{index + 1}</th>
              <td>{subtitle.startTime}s</td>
              <td>{subtitle.endTime}s</td>
              <td>{subtitle.subtitleText}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteSubtitle(subtitle.id)}
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

export default SubtitleManager;
