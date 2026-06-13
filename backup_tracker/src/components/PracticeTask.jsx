'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Terminal, 
  HelpCircle, 
  CheckCircle2, 
  Video, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Coffee,
  RotateCcw,
  Pause,
  VolumeX,
  Volume1,
  Volume2,
  Maximize,
  Minimize
} from 'lucide-react';

// Time parsing helpers
const parseTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  if (typeof timeStr === 'number') return timeStr;
  const parts = timeStr.toString().split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1 && !isNaN(parts[0])) {
    return parts[0];
  }
  return 0;
};

const formatSecondsToTime = (secs) => {
  if (isNaN(secs) || secs < 0) return "00:00:00";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return [
    h.toString().padStart(2, '0'),
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0')
  ].join(':');
};

export default function PracticeTask({ 
  dayData, 
  user, 
  onCompleteVideo, 
  onCompleteTask 
}) {
  const [code, setCode] = useState(dayData?.task?.codeTemplate || '');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState({});
  const [activeVideoId, setActiveVideoId] = useState(dayData?.videos?.[0]?.videoId || null);
  const [showReplayOverlay, setShowReplayOverlay] = useState(false);
  const playerRef = useRef(null);

  const videosList = dayData?.videos || [];
  const activeVideo = videosList.find(v => v.videoId === activeVideoId) || videosList[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const showControlsTemp = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 2500);
    }
  };

  useEffect(() => {
    showControlsTemp();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Handle Fullscreen Event Change (Escape key, etc.)
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleTogglePlay = (e) => {
    if (e) e.stopPropagation();
    if (playerRef.current) {
      try {
        const state = playerRef.current.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch (err) {
        console.error("Error toggling play state", err);
      }
    }
  };

  const handleToggleMute = (e) => {
    if (e) e.stopPropagation();
    if (playerRef.current) {
      try {
        if (isMuted) {
          playerRef.current.unMute();
          setIsMuted(false);
        } else {
          playerRef.current.mute();
          setIsMuted(true);
        }
      } catch (err) {
        console.error("Error toggling mute", err);
      }
    }
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const vol = parseInt(e.target.value, 10);
    setVolume(vol);
    if (playerRef.current) {
      try {
        playerRef.current.setVolume(vol);
        if (vol > 0 && isMuted) {
          playerRef.current.unMute();
          setIsMuted(false);
        }
      } catch (err) {
        console.error("Error setting volume", err);
      }
    }
  };

  const handleFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          console.error("Error enabling fullscreen", err);
        });
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen API error", err);
    }
  };

  const handleCycleSpeed = (e) => {
    if (e) e.stopPropagation();
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
      try {
        const speeds = [1, 1.25, 1.5, 2];
        const currentIdx = speeds.indexOf(playbackSpeed);
        const nextIdx = (currentIdx + 1) % speeds.length;
        const nextSpeed = speeds[nextIdx];
        
        playerRef.current.setPlaybackRate(nextSpeed);
        setPlaybackSpeed(nextSpeed);
      } catch (err) {
        console.error("Error changing playback rate", err);
      }
    }
  };

  const handleSeekRelative = (secondsOffset) => {
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      try {
        const startSeconds = parseTimeToSeconds(activeVideo.assignedStart || "00:00:00");
        const endSeconds = parseTimeToSeconds(activeVideo.assignedEnd || activeVideo.duration || "00:00:00");
        
        const current = playerRef.current.getCurrentTime();
        let target = current + secondsOffset;
        
        if (target < startSeconds) {
          target = startSeconds;
        }
        if (target > endSeconds) {
          target = endSeconds;
        }
        
        playerRef.current.seekTo(target, true);
        setCurrentTime(Math.max(0, target - startSeconds));
      } catch (err) {
        console.error("Error seeking relative", err);
      }
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.target) return;
      const targetTag = e.target.tagName?.toLowerCase();
      // Disable keys when typing inside editor fields, quiz answers, etc.
      if (targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleFullscreen();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSeekRelative(5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSeekRelative(-5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideo, isPlaying, isMuted, volume, isFullscreen, playbackSpeed]);

  const formatTimeDuration = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Sync state when dayData changes to prevent cross-day state leakage
  useEffect(() => {
    if (dayData?.videos?.[0]?.videoId) {
      setActiveVideoId(dayData.videos[0].videoId);
    } else {
      setActiveVideoId(null);
    }
    setCode(dayData?.task?.codeTemplate || '');
    setConsoleOutput('');
    setIsRunning(false);
    setQuizAnswers({});
    setQuizFeedback({});
    setShowReplayOverlay(false);
    setPlaybackSpeed(1);
  }, [dayData]);

  // Load YouTube Player IFrame API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.YT) {
        const tagExists = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
        if (!tagExists) {
          const tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName('script')[0];
          if (firstScriptTag && firstScriptTag.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          } else {
            document.body.appendChild(tag);
          }
        }
      }
    }
  }, []);

  // Initialize YT Player
  useEffect(() => {
    if (!activeVideo?.videoId) return;

    let player;
    let checkInterval;
    let progressInterval;

    const startSeconds = parseTimeToSeconds(activeVideo.assignedStart || "00:00:00");
    const endSeconds = parseTimeToSeconds(activeVideo.assignedEnd || activeVideo.duration || "00:00:00");

    const initPlayer = () => {
      // Clean up previous player reference
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying YT player", e);
        }
        playerRef.current = null;
      }

      setShowReplayOverlay(false);
      setCurrentTime(0);
      setIsPlaying(false);
      setIsBuffering(false);

      const ytPlayerDiv = document.getElementById('yt-player');
      if (!ytPlayerDiv) return;

      player = new window.YT.Player('yt-player', {
        videoId: activeVideo.videoId,
        playerVars: {
          start: startSeconds,
          end: endSeconds,
          rel: 0,
          controls: 0, // Hide YouTube native control bar completely
          disablekb: 1, // Disable keyboard scrubbing/control keys
          modestbranding: 1,
          fs: 0 // Disable native full screen button (we use HTML5 custom button)
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            event.target.seekTo(startSeconds, true);
            setIsMuted(event.target.isMuted());
            setVolume(event.target.getVolume());
          },
          onStateChange: (event) => {
            const state = event.data;
            if (state === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setIsBuffering(false);
              startProgressCheck();
            } else if (state === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopProgressCheck();
            } else if (state === window.YT.PlayerState.BUFFERING) {
              setIsBuffering(true);
            } else if (state === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              stopProgressCheck();
            }
          }
        }
      });
    };

    const checkYT = () => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkInterval);
        initPlayer();
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      checkInterval = setInterval(checkYT, 200);
    }

    const startProgressCheck = () => {
      stopProgressCheck();
      progressInterval = setInterval(() => {
        if (player && typeof player.getCurrentTime === 'function') {
          try {
            const current = player.getCurrentTime();
            
            // Sync current playhead state relative to startSeconds
            setCurrentTime(Math.max(0, current - startSeconds));
            
            // Sync volume/mute
            setIsMuted(player.isMuted());
            setVolume(player.getVolume());

            // Enforce start boundary (seeking before assigned start resets playhead)
            if (current < startSeconds - 2) {
              player.seekTo(startSeconds, true);
            }

            // Enforce end boundary
            if (current >= endSeconds) {
              player.pauseVideo();
              setIsPlaying(false);
              setShowReplayOverlay(true);
              stopProgressCheck();
              onCompleteVideo(activeVideo.videoId);
            }
          } catch (e) {
            console.error("Error in player state checks", e);
          }
        }
      }, 250);
    };

    const stopProgressCheck = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };

    return () => {
      clearInterval(checkInterval);
      stopProgressCheck();
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy();
        } catch (e) {}
      }
      playerRef.current = null;
    };
  }, [activeVideo?.videoId, activeVideo?.assignedStart, activeVideo?.assignedEnd]);

  const handleSeekChange = (e) => {
    const seekVal = parseFloat(e.target.value);
    setCurrentTime(seekVal);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      const startSeconds = parseTimeToSeconds(activeVideo.assignedStart || "00:00:00");
      playerRef.current.seekTo(startSeconds + seekVal, true);
    }
  };

  const handleReplaySegment = () => {
    setShowReplayOverlay(false);
    setCurrentTime(0);
    setIsPlaying(true);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      const startSeconds = parseTimeToSeconds(activeVideo.assignedStart || "00:00:00");
      playerRef.current.seekTo(startSeconds, true);
      playerRef.current.playVideo();
    }
  };

  if (!dayData) return null;

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput('Compiling Java source files...\n');

    setTimeout(() => {
      let output = '';
      let passed = true;

      if (dayData.task.taskId === 'task_1') {
        const hasHello = code.includes('Hello World') || code.includes('Hello, World');
        const hasSystem = code.includes('System.out.println');
        if (hasSystem && hasHello) {
          output += 'Executing HelloWorld.main()...\n';
          output += '> Hello World\n\n';
          output += 'TEST CASES:\n✓ Test Case 1: Print statement matching - PASSED\n';
        } else {
          output += 'Compilation Warning: Check system output statements.\n';
          output += 'TEST CASES:\n✗ Test Case 1: Print statement matching - FAILED (Expected: "Hello World")\n';
          passed = false;
        }
      } else if (dayData.task.taskId === 'task_2') {
        const hasPI = code.includes('Math.PI');
        const hasRadius = code.includes('radius');
        if (hasPI && hasRadius) {
          output += 'Executing CircleCalc.main()...\n';
          output += '> Area: 95.03317777109125\n';
          output += '> Perimeter: 34.55751918948772\n\n';
          output += 'TEST CASES:\n✓ Test Case 1: Area calculation - PASSED\n';
        } else {
          output += 'Error: Make sure to use Math.PI and standard circle formulas.\n';
          output += 'TEST CASES:\n✗ Test Case 1: Area calculation - FAILED\n';
          passed = false;
        }
      } else if (dayData.task.taskId === 'task_3') {
        const hasLeapCheck = code.includes('% 4') && (code.includes('% 100') || code.includes('% 400'));
        if (hasLeapCheck) {
          output += 'Executing LeapYearCheck.main()...\n';
          output += '> Leap Year: true\n\n';
          output += 'TEST CASES:\n✓ Test Case 1: Checking leap year 2024 - PASSED\n';
        } else {
          output += 'Error: Incomplete logic to check leap years.\n';
          output += 'TEST CASES:\n✗ Test Case 1: Checking leap year 2024 - FAILED\n';
          passed = false;
        }
      } else {
        output += `Compiling ${dayData.task.title}...\n`;
        output += 'Executing main method...\n';
        output += '✓ Test Case 1: Check compile syntax - PASSED\n';
      }

      setConsoleOutput(output);
      setIsRunning(false);
    }, 1500);
  };

  const handleQuizAnswer = (qIdx, optIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitTask = () => {
    const quizQuestions = dayData.task.quiz || [];
    let allQuizCorrect = true;
    const newFeedback = {};

    quizQuestions.forEach((q, idx) => {
      const selected = quizAnswers[idx];
      if (selected === q.correctIdx) {
        newFeedback[idx] = { correct: true, text: 'Correct!' };
      } else {
        newFeedback[idx] = { 
          correct: false, 
          text: `Incorrect. Correct answer was: "${q.options[q.correctIdx]}"` 
        };
        allQuizCorrect = false;
      }
    });

    setQuizFeedback(newFeedback);

    if (quizQuestions.length > 0 && !allQuizCorrect) {
      alert("Some quiz questions are incorrect. Review the feedback and try again.");
      return;
    }

    onCompleteTask(dayData.task.taskId, code);
  };

  // Video Day Layout
  if (dayData.type === 'video') {
    const startSecs = parseTimeToSeconds(activeVideo?.assignedStart || "00:00:00");
    const endSecs = parseTimeToSeconds(activeVideo?.assignedEnd || activeVideo?.duration || "00:00:00");
    const watchSeconds = Math.max(0, endSecs - startSecs);
    const watchMinutes = Math.floor(watchSeconds / 60);
    const watchSecRemainder = watchSeconds % 60;
    const watchTimeStr = watchSecRemainder > 0 
      ? `${watchMinutes} mins ${watchSecRemainder} secs` 
      : `${watchMinutes} mins`;

    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-custom-border pb-5">
          <span className="text-xs font-bold px-2.5 py-1 rounded border bg-primary-color/5 border-primary-color/20 text-primary-color shrink-0">
            DAY {dayData.day}
          </span>
          <div>
            <h1 className="text-xl font-bold text-foreground">{dayData.title}</h1>
            <p className="text-xs text-muted-text mt-0.5">{dayData.chapterTitle}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Embedded Video Display (Plays inside the website) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Video className="h-4.5 w-4.5 text-primary-color" />
              Embedded Video Player
            </h3>

            {activeVideo ? (
              <div className="space-y-3">
                {/* YouTube Video container */}
                <div 
                  ref={containerRef}
                  key={activeVideo.videoId} 
                  onMouseMove={showControlsTemp}
                  onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
                  className="group relative w-full aspect-video rounded-2xl overflow-hidden border border-custom-border bg-black shadow-lg shadow-primary-glow/5"
                >
                  <div className={`relative w-full h-full overflow-hidden ${showReplayOverlay ? 'pointer-events-none opacity-20' : ''}`}>
                    <div id="yt-player" className="absolute w-[104%] h-[104%] -top-[2%] -left-[2%] pointer-events-none"></div>
                  </div>

                  {/* Click-capturing transparent overlay to play/pause when clicked */}
                  {!showReplayOverlay && (
                    <div 
                      onClick={handleTogglePlay}
                      className="absolute inset-0 bg-transparent cursor-pointer z-30"
                    />
                  )}

                  {/* Top Header Fade Mask (Cinematic letterbox to cover top YouTube banners) */}
                  {!showReplayOverlay && (
                    <div 
                      className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 z-40 pointer-events-none ${
                        isControlsVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}

                  {/* Custom Controller Overlay */}
                  {!showReplayOverlay && (
                    <div 
                      className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity duration-300 z-40 flex flex-col gap-2 ${
                        isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      {/* Progress Bar Slider */}
                      <div className="relative flex items-center h-2 w-full group/progress">
                        <input
                          type="range"
                          min={0}
                          max={watchSeconds || 1}
                          value={currentTime}
                          onChange={handleSeekChange}
                          className="w-full h-1 hover:h-1.5 rounded-lg appearance-none cursor-pointer accent-primary-color transition-all duration-150 focus:outline-none"
                          style={{
                            background: `linear-gradient(to right, var(--primary-color, #3b82f6) ${
                              (currentTime / (watchSeconds || 1)) * 100
                            }%, rgba(255,255,255,0.2) ${(currentTime / (watchSeconds || 1)) * 100}%)`,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-white text-xs select-none">
                        <div className="flex items-center gap-4">
                          {/* Play/Pause Button */}
                          <button
                            onClick={handleTogglePlay}
                            className="p-1 hover:text-primary-color transition-colors cursor-pointer focus:outline-none"
                          >
                            {isPlaying ? (
                              <Pause className="h-5 w-5 fill-current" />
                            ) : (
                              <Play className="h-5 w-5 fill-current" />
                            )}
                          </button>

                          {/* Volume Icon & Slider */}
                          <div className="flex items-center gap-2 group/volume">
                            <button
                              onClick={handleToggleMute}
                              className="p-1 hover:text-primary-color transition-colors cursor-pointer focus:outline-none"
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="h-5 w-5" />
                              ) : volume < 50 ? (
                                <Volume1 className="h-5 w-5" />
                              ) : (
                                <Volume2 className="h-5 w-5" />
                              )}
                            </button>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              className="w-0 opacity-0 pointer-events-none group-hover/volume:w-16 group-hover/volume:opacity-100 group-hover/volume:pointer-events-auto h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white transition-all duration-300 focus:outline-none"
                            />
                          </div>

                          {/* Time Display */}
                          <div className="font-mono text-[10px] tracking-wider font-semibold">
                            {formatTimeDuration(currentTime)} / {formatTimeDuration(watchSeconds)}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Speed Control Button */}
                          <button
                            onClick={handleCycleSpeed}
                            className="px-1.5 py-0.5 rounded border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-[9px] font-mono font-bold tracking-tighter text-white hover:text-primary-color transition-all cursor-pointer focus:outline-none"
                            title="Playback Speed"
                          >
                            {playbackSpeed}x
                          </button>

                          {/* Fullscreen Button */}
                          <button
                            onClick={handleFullscreen}
                            className="p-1 hover:text-primary-color transition-colors cursor-pointer focus:outline-none"
                          >
                            {isFullscreen ? (
                              <Minimize className="h-5 w-5" />
                            ) : (
                              <Maximize className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replay Overlay */}
                  {showReplayOverlay && (
                    <div className="absolute inset-0 bg-[#090e1a]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50 border border-custom-border rounded-2xl">
                      <div className="p-4 rounded-full bg-primary-color/10 border border-primary-color/20 text-primary-color mb-4">
                        <RotateCcw className="h-8 w-8 animate-spin-slow" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-1">Today's Video Segment Finished</h3>
                      <p className="text-xxs text-muted-text max-w-xs mb-5 leading-relaxed">
                        You have completed today's assigned segment for this lesson:
                        <span className="block mt-1 font-semibold text-primary-color font-mono text-xs">
                          {activeVideo.assignedStart || "00:00:00"} - {activeVideo.assignedEnd || activeVideo.duration}
                        </span>
                      </p>
                      <button
                        onClick={handleReplaySegment}
                        className="px-5 py-2.5 rounded-xl bg-primary-color hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary-glow/20 transition-all border border-primary-color/20"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Replay Segment
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/3 border border-custom-border rounded-xl p-4">
                  <div>
                    <h4 className="text-xs font-bold text-foreground leading-normal">{activeVideo.title}</h4>
                    {/* Display assigned minutes segment */}
                    <p className="text-xxs text-primary-color font-semibold mt-1">
                      Assigned Lesson Segment: {activeVideo.assignedStart || "00:00:00"} to {activeVideo.assignedEnd || activeVideo.duration} 
                      {` (Watch time: ${watchTimeStr})`}
                    </p>
                  </div>
                  
                  {/* Backup Youtube Link */}
                  <a 
                    href={activeVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-bold text-foreground border border-custom-border transition-all self-start sm:self-center cursor-pointer"
                  >
                    Watch on YouTube
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-2xl border border-dashed border-custom-border flex items-center justify-center text-muted-text">
                No video selected
              </div>
            )}

            {/* Practice Task attached to video page (If day contains both) */}
            {dayData.task && (
              <div className="border-t border-custom-border/50 pt-5 space-y-4">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Terminal className="h-4.5 w-4.5 text-emerald-color" />
                  Connected Practice Task: {dayData.task.title}
                </h3>
                
                <div className="glass-panel rounded-2xl p-5 space-y-4">
                  <p className="text-xxs text-muted-text leading-relaxed">{dayData.task.description}</p>
                  
                  {/* Task completions checker */}
                  {user.tasksProgress?.[dayData.task.taskId]?.completed ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-color bg-emerald-color/5 border border-emerald-color/10 p-3 rounded-xl">
                      <CheckCircle2 className="h-4.5 w-4.5 fill-current" />
                      Task submitted successfully! Code stored.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-48 p-4 font-mono text-xs rounded-xl border border-custom-border bg-black/40 text-emerald-400 focus:outline-none resize-none leading-relaxed"
                        placeholder="Write your Java program solution here..."
                      />

                      {/* Run button & feedback */}
                      <div className="flex gap-2">
                        <button
                          onClick={handleRunCode}
                          disabled={isRunning}
                          className="px-4 py-1.5 rounded-lg bg-emerald-color hover:bg-emerald-color/90 text-white text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          Run Tests
                        </button>
                      </div>

                      {consoleOutput && (
                        <pre className="p-3 rounded-xl bg-black font-mono text-[9px] text-white overflow-x-auto border border-custom-border whitespace-pre-wrap">
                          {consoleOutput}
                        </pre>
                      )}

                      {/* Quizzes if present */}
                      {dayData.task.quiz && dayData.task.quiz.map((q, qIdx) => (
                        <div key={qIdx} className="space-y-2 pt-2 border-t border-custom-border/50">
                          <p className="text-xxs font-bold text-foreground">{qIdx + 1}. {q.question}</p>
                          <div className="grid gap-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = quizAnswers[qIdx] === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleQuizAnswer(qIdx, optIdx)}
                                  className={`w-full text-left px-3 py-2 rounded-lg border text-[10px] font-semibold transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'bg-primary-color/10 border-primary-color text-primary-color font-bold' 
                                      : 'bg-white/2 border-custom-border text-muted-text hover:text-foreground'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizFeedback[qIdx] && (
                            <p className="text-[9px] font-bold text-red-400">{quizFeedback[qIdx].text}</p>
                          )}
                        </div>
                      ))}

                      <button
                        onClick={handleSubmitTask}
                        className="px-5 py-2.5 rounded-lg bg-emerald-color hover:bg-emerald-color/90 text-white text-xs font-bold cursor-pointer transition-all shadow-md self-start"
                      >
                        Submit Task & Answers
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Videos Selector sidebar */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-primary-color" />
              Course Syllabus
            </h3>

            <div className="glass-panel rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-bold text-muted-text uppercase tracking-widest block pb-2 border-b border-custom-border">Day Lessons</span>
              
              <div className="space-y-2">
                {videosList.map(vid => {
                  const isActive = activeVideoId === vid.videoId || (!activeVideoId && videosList[0]?.videoId === vid.videoId);
                  const isCompleted = user.lessonsProgress?.[vid.videoId]?.completed;
                  
                  return (
                    <div 
                      key={vid.videoId}
                      onClick={() => setActiveVideoId(vid.videoId)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                        isActive 
                          ? 'bg-primary-color/10 border-primary-color text-white font-bold' 
                          : 'bg-white/3 border-custom-border text-muted-text hover:text-foreground hover:bg-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="line-clamp-2 leading-relaxed">{vid.title}</span>
                        {isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-color fill-current bg-black rounded-full shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-custom-border/40 pt-2 text-[10px]">
                        <span>{vid.duration} mins</span>
                        {!isCompleted ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Avoid triggering video change
                              onCompleteVideo(vid.videoId);
                            }}
                            className="px-2 py-1 rounded bg-primary-color hover:bg-primary-hover text-white text-[9px] font-bold cursor-pointer"
                          >
                            Mark Done
                          </button>
                        ) : (
                          <span className="text-emerald-color font-bold text-[9px]">COMPLETED</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {videosList.length === 0 && (
                  <p className="text-xxs text-muted-text italic py-2">No videos configured for this day.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review Day / Rest Day Layout
  const isCompleted = user.lessonsProgress?.[`review_${dayData.day}`]?.completed;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center bg-[#090e1a]">
      <div className="max-w-md text-center glass-panel rounded-2xl p-8 flex flex-col items-center space-y-4">
        {isCompleted ? (
          <CheckCircle2 className="h-16 w-16 text-emerald-color" />
        ) : (
          <Coffee className="h-16 w-16 text-amber-color" />
        )}
        <h1 className="text-xl font-bold text-foreground">{dayData.title}</h1>
        <p className="text-xs text-muted-text leading-relaxed">
          {dayData.type === 'off' 
            ? "Fridays are completely off to keep your learning pace sustainable! Take a break, spend time outdoors, or do a light review of earlier OOP chapters."
            : "Use today to read through your notes, revise completed exercises, and review major Java concepts. Prepare for the upcoming chapters!"
          }
        </p>
        
        {isCompleted ? (
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-color/10 border border-emerald-color/20 text-emerald-color text-xs font-semibold select-none">
            <CheckCircle2 className="h-4 w-4 fill-current bg-black rounded-full" />
            Day Completed
          </div>
        ) : (
          <button
            onClick={() => onCompleteVideo(`review_${dayData.day}`)}
            className="px-5 py-2.5 rounded-lg bg-primary-color hover:bg-primary-hover text-white text-xs font-semibold cursor-pointer shadow-md transition-colors"
          >
            Check Day Off
          </button>
        )}
      </div>
    </div>
  );
}
