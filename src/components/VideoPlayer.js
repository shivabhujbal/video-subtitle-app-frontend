import React, { useState, useEffect, useRef } from 'react';
import videoService from '../services/VideoService';
import subtitleService from '../services/SubtitleService';
import SubtitleManager from './SubtitleManager';
import VideoManager from './VideoManager';

const VideoPlayer = () => {
    const [videosList, setVideosList] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [fileInput, setFileInput] = useState(null);
    const [showSubtitleForm, setShowSubtitleForm] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [subtitleText, setSubtitleText] = useState('');
    const [videoDuration, setVideoDuration] = useState('');
    const videoEl = useRef(null);
    const [subtitles, setSubtitles] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        getAllVideos();
        // console.log("Video Duration Updated:", videoDuration);
        // console.log("Subtitle",subtitles);

    }, [videoDuration, subtitles]);

    const handleTimeUpdate = () => {
        const video = videoEl.current;
        if (video) {
            const currentTime = video.currentTime;

            // Filter subtitles based on the current video time
            const matchingSubtitles = subtitles.filter(subtitle =>
                currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
            );

            // console.log('Matching Subtitles:', matchingSubtitles);

            const subtitleContainer = document.getElementById('subtitles-container');
            if (subtitleContainer) {
                subtitleContainer.innerHTML = matchingSubtitles.map(subtitle =>
                    `<div>${subtitle.subtitleText}</div>`).join('')

            }
        }
    };

    const getAllVideos = () => {
        videoService.getAllVideos()
            .then(response => {
                setVideosList(response.data);
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
            });
    }

    const handlePlayVideo = async (videoId) => {
        // console.log("clicked");
        setSelectedVideo(null)
        setSubtitles(null)
        try {
            setLoading(true)
            const response = await videoService.streamVideo(videoId);
            const blob = new Blob([response.data], { type: 'video/mp4' });
            const videoUrl = URL.createObjectURL(blob);
            setSelectedVideo({ id: videoId, videoUrl, });
            setShowSubtitleForm(true)

            try {
                const subtitlesResponse = await subtitleService.getSubtitlesByVideoId(videoId);
                // console.log("Subtitles response:", subtitlesResponse);

                setSubtitles(subtitlesResponse);
                // console.log("subs", subtitles);
            } catch (error) {
                console.error("Error fetching subtitles:", error);
            }

            setLoading(false)



        } catch (error) {
            console.error('Error streaming video:', error);
        }
    };



    const handleLoadedMetadata = () => {
        const video = videoEl.current;
        if (video) {
            // console.log(`The video is ${video.duration} seconds long.`);
            setVideoDuration(video.duration);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            // Check the file type
            if (!selectedFile.type.startsWith('video/')) {
                alert('Please select a valid video file.');
                setFileInput(null);
                return;
            }

            // Check the file size (limit to 30MB)
            if (selectedFile.size > 30 * 1024 * 1024) {
                alert('File size exceeds the limit of 30MB. Please select a smaller file.');
                setFileInput(null);
                return;
            }

            setFileInput(selectedFile);
        }
    };

    const handleUpload = () => {
        if (fileInput) {
            videoService.uploadVideo(fileInput)
                .then(response => {
                    // console.log('File uploaded successfully:', response.data);
                    getAllVideos();
                    alert("Video Uploaded")
                })
                .catch(error => {
                    console.error('Error uploading video:', error);
                });
        }
    };

    const handleSubtitleSubmit = () => {
        if (startTime >= 0 && endTime > startTime && endTime <= videoDuration) {
            // Submit subtitle data to the subtitleService
            const subtitleData = {
                video: selectedVideo,
                startTime,
                endTime,
                subtitleText,
            };

            subtitleService.saveSubtitle(subtitleData)
                .then(response => {
                    alert(" Subtitles added")
                    console.log('Subtitle added successfully:');

                    subtitleService.getSubtitlesByVideoId(selectedVideo.id)
                        .then(subtitlesResponse => {
                            setSubtitles(subtitlesResponse);
                            // console.log("Updated Subtitles:", subtitlesResponse);
                        })
                        .catch(error => {
                            console.error("Error fetching updated subtitles:", error);
                        });


                })
                .catch(error => {
                    console.error('Error adding subtitle:', error);
                });
        } else {
            console.error('Invalid subtitle input. Please check start time, end time, and duration.');
            alert("Invalid Subtitle Time/s")
        }
    };

    const [showSubtitleManager, setShowSubtitleManager] = useState(false);

    const handleManageSubtitlesClick = () => {
        setShowSubtitleManager(!showSubtitleManager)

    };

    const [showVideoManager, setShowVideoManager] = useState(false);

    const handleManageVideosClick = () => {
        setShowVideoManager(!showVideoManager)

    };




    return (
        <div>
            {/* Navbar */}
            <nav className="navbar  bg-dark navbar-dark">
                <span className="navbar-brand mx-auto mb-0 fs-3 ">VideoSubtitle Api</span>
            </nav>

            <div className="container-fluid">
                <div className="row">
                    {/* Video List Sidebar */}
                    <div className="sidebar-sticky col-md-3  bg-light" style={{ height: "100vh" }}>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Videos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {videosList.map((video, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td onClick={() => handlePlayVideo(video.id)}>{video.videoName.substring(14)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className='mb-5 btn btn-primary' onClick={handleManageVideosClick}>Manage Videos</button>
                        {showVideoManager && <VideoManager getVideos={getAllVideos} />}
                    </div>


                    {/* Video Player Section */}
                    <div className="col-md-5">
                        {loading && (
                            <div>
                                <h4 className="text-center mt-5 ">Loading video...(estimate Time : 3 min)</h4>

                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}

                        {selectedVideo ? (
                            <div className='col-md-5'>
                                <video controls width="500" height="400" ref={videoEl} onLoadedMetadata={handleLoadedMetadata} onTimeUpdate={handleTimeUpdate} >
                                    <source src={selectedVideo.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div id="subtitles-container" className='text-uppercase text-center text-wrap mb-5 bg-dark text-light' style={{ width: 500 }}></div>
                                <button className='mb-3 btn btn-primary text-center' onClick={handleManageSubtitlesClick}>Manage Subtitles</button>
                                {showSubtitleManager && <SubtitleManager videoId={selectedVideo.id} />}                           </div>
                        ) : (
                            <p className='mt-5'>Select a video from the list to play</p>

                        )}

                    </div>

                    {/* Upload Video Files */}
                    <div className="col-md-4">
                        <div className="mb-3">
                            <label htmlFor="formFile">Upload Video: </label>
                            <input
                                type="file"
                                className="form-control-sm mt-5 m-3"
                                id="fileInput"
                                onChange={handleFileChange}
                                accept='video/*'

                            />
                            <button className="btn btn-success" onClick={handleUpload}> Upload</button>
                        </div>


                        {showSubtitleForm && selectedVideo && (
                            <div className='col-md-'>

                                <div className="mb-3">
                                    <h3>Add Subtitles</h3>
                                    <label htmlFor="startTime" className="form-label">Start Time:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="startTime"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        placeholder='Start time in sec'

                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="endTime" className="form-label">End Time:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="endTime"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        placeholder='End time in sec'


                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="text" className="form-label">Text:</label>
                                    <textarea
                                        className="form-control"
                                        id="text"
                                        value={subtitleText
                                        }
                                        onChange={(e) => setSubtitleText(e.target.value)}

                                    />
                                </div>
                                <button type="button" className="btn btn-primary" onClick={handleSubtitleSubmit}>
                                    Add Subtitle
                                </button>
                            </div>
                        )}


                    </div>
                </div>
            </div>
            <p>&copy; shivsambh bhujbal</p>
        </div>
    );
};

export default VideoPlayer;
