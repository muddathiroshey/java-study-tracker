'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { updateUserProgress, checkAndUpdateStreak, getCurrentUserSession } from '../lib/storage';

// Utility to parse hh:mm:ss into seconds
const timeToSecs = (t) => {
  if (!t) return 0;
  const parts = t.toString().split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
};

const secsToTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return [h, m, sec].map(n => n.toString().padStart(2, '0')).join(':');
};

// Simulated Java compiler validator
const validateJavaCode = (code, testCases) => {
  const results = [];
  testCases.forEach((tc) => {
    let passed = false;
    let actualOutput = '[Simulated output]';
    const expected = tc.expected.toLowerCase();
    const codeLower = code.toLowerCase();
    
    // Exercise 1.5
    if (expected.includes('0.8392857142857143')) {
      if (codeLower.includes('exercise01_05') && codeLower.includes('system.out.print') && (codeLower.includes('9.5') || codeLower.includes('0.839'))) {
        passed = true;
        actualOutput = '0.8392857142857143';
      }
    }
    // Exercise 1.9
    else if (expected.includes('area: 35.55')) {
      if (codeLower.includes('exercise01_09') && codeLower.includes('4.5') && codeLower.includes('7.9') && codeLower.includes('system.out.print')) {
        passed = true;
        actualOutput = 'Area: 35.55\nPerimeter: 24.8';
      }
    }
    // Exercise 1.11
    else if (expected.includes('year 1: 314812582')) {
      if (codeLower.includes('exercise01_11') && (codeLower.includes('312032486') || codeLower.includes('31536000') || codeLower.includes('314812582'))) {
        passed = true;
        actualOutput = 'Year 1: 314812582\nYear 2: 317592679\nYear 3: 320372776\nYear 4: 323152873\nYear 5: 325932970';
      }
    }
    // Exercise 2.2
    else if (expected.includes('volume: 1140.4')) {
      if (codeLower.includes('exercise02_02') && codeLower.includes('scanner') && codeLower.includes('double') && (codeLower.includes('math.pi') || codeLower.includes('3.1415'))) {
        passed = true;
        actualOutput = 'Area: 95.0331...\nVolume: 1140.4...';
      }
    }
    // Exercise 2.5
    else if (expected.includes('tip: 1.5')) {
      if (codeLower.includes('exercise02_05') && codeLower.includes('scanner') && codeLower.includes('subtotal') && (codeLower.includes('rate') || codeLower.includes('gratuity'))) {
        passed = true;
        actualOutput = 'Tip: 1.5\nTotal: 11.5';
      }
    }
    // Exercise 2.6
    else if (expected.includes('sum: 14')) {
      if (codeLower.includes('exercise02_06') && codeLower.includes('scanner') && (codeLower.includes('% 10') || codeLower.includes('/ 10'))) {
        passed = true;
        actualOutput = 'Sum: 14';
      }
    }
    // Exercise 3.4
    else if (expected.includes('[month]')) {
      if (codeLower.includes('exercise03_04') && (codeLower.includes('math.random') || codeLower.includes('random')) && (codeLower.includes('january') || codeLower.includes('february'))) {
        passed = true;
        actualOutput = 'Selected Month: March';
      }
    }
    // Exercise 3.5
    else if (expected.includes('future day is thursday')) {
      if (codeLower.includes('exercise03_05') && codeLower.includes('scanner') && (codeLower.includes('today') || codeLower.includes('future'))) {
        passed = true;
        actualOutput = 'Today is Monday and the future day is Thursday';
      }
    }
    // Exercise 3.9
    else if (expected.includes('013031997x')) {
      if (codeLower.includes('exercise03_09') && codeLower.includes('scanner') && (codeLower.includes('% 11') || codeLower.includes('checksum'))) {
        passed = true;
        actualOutput = '013031997X';
      }
    }
    // Exercise 4.2
    else if (expected.includes('distance: 218.')) {
      if (codeLower.includes('exercise04_02') && codeLower.includes('math.sin') && codeLower.includes('math.cos')) {
        passed = true;
        actualOutput = 'Distance: 218.42 km';
      }
    }
    // Exercise 4.5
    else if (expected.includes('area: 61.937')) {
      if (codeLower.includes('exercise04_05') && codeLower.includes('math.tan') && codeLower.includes('math.pi')) {
        passed = true;
        actualOutput = 'Area: 61.937';
      }
    }
    // Exercise 5.4
    else if (expected.includes('10      16.09')) {
      if (codeLower.includes('exercise05_04') && (codeLower.includes('for') || codeLower.includes('while')) && codeLower.includes('1.609')) {
        passed = true;
        actualOutput = 'Miles   Kilometers\n1       1.609\n...\n10      16.09';
      }
    }
    // Exercise 5.7
    else if (expected.includes('tuition: 16288.9')) {
      if (codeLower.includes('exercise05_07') && (codeLower.includes('for') || codeLower.includes('while')) && (codeLower.includes('1.05') || codeLower.includes('0.05'))) {
        passed = true;
        actualOutput = 'Tuition: 16288.9\nCost: 73717.7';
      }
    }
    // Exercise 5.9
    else if (expected.includes('highest: alice')) {
      if (codeLower.includes('exercise05_09') && codeLower.includes('scanner') && (codeLower.includes('for') || codeLower.includes('while')) && (codeLower.includes('highest') || codeLower.includes('score'))) {
        passed = true;
        actualOutput = 'Highest: Alice\nSecond: Tom';
      }
    }
    // Exercise 6.2
    else if (expected.includes('sum: 9')) {
      if (codeLower.includes('exercise06_02') && codeLower.includes('sumdigits') && (codeLower.includes('% 10') || codeLower.includes('/ 10'))) {
        passed = true;
        actualOutput = 'Sum: 9';
      }
    }
    // Exercise 6.3
    else if (expected.includes('is palindrome: true')) {
      if (codeLower.includes('exercise06_03') && codeLower.includes('reverse') && codeLower.includes('ispalindrome')) {
        passed = true;
        actualOutput = 'Is Palindrome: true';
      }
    }
    // Exercise 6.5
    else if (expected.includes('1.0 2.0 3.0')) {
      if (codeLower.includes('exercise06_05') && codeLower.includes('displaysortednumbers')) {
        passed = true;
        actualOutput = '1.0 2.0 3.0';
      }
    }
    // Exercise 7.2
    else if (expected.includes('10 9 8 7 6 5 4 3 2 1')) {
      if (codeLower.includes('exercise07_02') && codeLower.includes('scanner') && codeLower.includes('new int') && (codeLower.includes('for') || codeLower.includes('while'))) {
        passed = true;
        actualOutput = '10 9 8 7 6 5 4 3 2 1';
      }
    }
    // Exercise 7.7
    else if (expected.includes('digit 0:')) {
      if (codeLower.includes('exercise07_07') && codeLower.includes('math.random') && codeLower.includes('new int')) {
        passed = true;
        actualOutput = 'Digit 0: 9\nDigit 1: 11\n...';
      }
    }
    // Exercise 8.2
    else if (expected.includes('diagonal sum: 34.0')) {
      if (codeLower.includes('exercise08_02') && codeLower.includes('summajordiagonal') && (codeLower.includes('for') || codeLower.includes('m[i][i]'))) {
        passed = true;
        actualOutput = 'Diagonal Sum: 34.0';
      }
    }
    // Exercise 9.1
    else if (expected.includes('area: 160.0') && codeLower.includes('rectangle')) {
      if (codeLower.includes('exercise09_01') && codeLower.includes('class rectangle') && codeLower.includes('getarea') && codeLower.includes('getperimeter')) {
        passed = true;
        actualOutput = 'Area: 160.0\nPerimeter: 88.0';
      }
    }
    // Exercise 9.2
    else if (expected.includes('-0.43')) {
      if (codeLower.includes('exercise09_02') && codeLower.includes('class stock') && codeLower.includes('getchangepercent')) {
        passed = true;
        actualOutput = '-0.43478%';
      }
    }
    // Exercise 9.3
    else if (expected.includes('1970')) {
      if (codeLower.includes('exercise09_03') && codeLower.includes('date') && codeLower.includes('settime')) {
        passed = true;
        actualOutput = 'Date representations starting in 1970';
      }
    }
    // Exercise 9.6
    else if (expected.includes('time:')) {
      if (codeLower.includes('exercise09_06') && codeLower.includes('class stopwatch') && codeLower.includes('start') && codeLower.includes('stop')) {
        passed = true;
        actualOutput = 'Time: 421 ms';
      }
    }
    // Exercise 9.8
    else if (expected.includes('fan is off')) {
      if (codeLower.includes('exercise09_08') && codeLower.includes('class fan') && codeLower.includes('tostring')) {
        passed = true;
        actualOutput = 'color: blue, radius: 5.0, fan is off';
      }
    }
    // Exercise 9.10
    else if (expected.includes('root 1: -1.0')) {
      if (codeLower.includes('exercise09_10') && codeLower.includes('class quadraticequation') && codeLower.includes('getdiscriminant')) {
        passed = true;
        actualOutput = 'Root 1: -1.0\nRoot 2: -2.0';
      }
    }
    // Exercise 10.2
    else if (expected.includes('normal')) {
      if (codeLower.includes('exercise10_02') && codeLower.includes('class bmi') && codeLower.includes('getbmi') && codeLower.includes('getstatus')) {
        passed = true;
        actualOutput = 'BMI: 21.5 Status: Normal';
      }
    }
    // Exercise 10.3
    else if (expected.includes('is prime: true') && codeLower.includes('myinteger')) {
      if (codeLower.includes('exercise10_03') && codeLower.includes('class myinteger') && codeLower.includes('isprime')) {
        passed = true;
        actualOutput = 'Is Prime: true';
      }
    }
    // Exercise 10.4
    else if (expected.includes('distance: 32.1')) {
      if (codeLower.includes('exercise10_04') && codeLower.includes('class mypoint') && codeLower.includes('distance')) {
        passed = true;
        actualOutput = 'Distance: 32.1648';
      }
    }
    // Exercise 10.11
    else if (expected.includes('area: 95.033')) {
      if (codeLower.includes('exercise10_11') && codeLower.includes('class circle2d') && codeLower.includes('getarea')) {
        passed = true;
        actualOutput = 'Area: 95.033';
      }
    }
    // Exercise 10.17
    else if (expected.includes('9223372036854775807')) {
      if (codeLower.includes('exercise10_17') && codeLower.includes('biginteger')) {
        passed = true;
        actualOutput = 'Squares exceeding Long.MAX_VALUE';
      }
    }
    // Exercise 11.1
    else if (expected.includes('area: 0.496')) {
      if (codeLower.includes('exercise11_01') && codeLower.includes('extends geometricobject') && codeLower.includes('class triangle')) {
        passed = true;
        actualOutput = 'Area: 0.496';
      }
    }
    // Exercise 11.2
    else if (expected.includes('student: alice')) {
      if (codeLower.includes('exercise11_02') && codeLower.includes('extends person') && codeLower.includes('tostring')) {
        passed = true;
        actualOutput = 'Student: Alice';
      }
    }
    // Exercise 11.3
    else if (expected.includes('checkingaccount')) {
      if (codeLower.includes('exercise11_03') && codeLower.includes('extends account')) {
        passed = true;
        actualOutput = 'CheckingAccount checks passed';
      }
    }
    // Exercise 11.8
    else if (expected.includes('transaction')) {
      if (codeLower.includes('exercise11_08') && codeLower.includes('arraylist') && codeLower.includes('transaction')) {
        passed = true;
        actualOutput = 'Recorded transaction list checked';
      }
    }
    // Exercise 12.2
    else if (expected.includes('sum: 15')) {
      if (codeLower.includes('exercise12_02') && codeLower.includes('inputmismatchexception') && codeLower.includes('scanner')) {
        passed = true;
        actualOutput = 'Sum: 15';
      }
    }
    // Exercise 12.3
    else if (expected.includes('out of bounds')) {
      if (codeLower.includes('exercise12_03') && codeLower.includes('arrayindexoutofboundsexception')) {
        passed = true;
        actualOutput = 'Out of bounds';
      }
    }
    // Exercise 12.15
    else if (expected.includes('sorted file content')) {
      if (codeLower.includes('exercise12_15') && (codeLower.includes('file') || codeLower.includes('writer') || codeLower.includes('reader'))) {
        passed = true;
        actualOutput = 'Sorted file content check passed';
      }
    }
    // Exercise 13.1
    else if (expected.includes('geometricobject') && codeLower.includes('abstract')) {
      if (codeLower.includes('exercise13_01') && codeLower.includes('extends geometricobject')) {
        passed = true;
        actualOutput = 'GeometricObject abstract checks passed';
      }
    }
    // Exercise 13.5
    else if (expected.includes('max')) {
      if (codeLower.includes('exercise13_05') && codeLower.includes('comparable')) {
        passed = true;
        actualOutput = 'max() method checks passed';
      }
    }
    // Old legacy fallbacks
    else if (expected.includes('hello world') && codeLower.includes('system.out.println') && codeLower.includes('hello world')) {
      passed = true;
      actualOutput = 'Hello World';
    } else if (expected.includes('area:') && codeLower.includes('math.pi') && (codeLower.includes('area') || codeLower.includes('radius * radius'))) {
      passed = true;
      actualOutput = 'Area: 95.0331...';
    } else if (expected.includes('leap year: true') && codeLower.includes('% 4') && codeLower.includes('% 100')) {
      passed = true;
      actualOutput = 'Leap Year: true';
    } else if (expected.includes('username: john.doe') && codeLower.includes('indexof') && codeLower.includes('touppercase')) {
      passed = true;
      actualOutput = 'Username: JOHN.DOE';
    } else if (expected.includes('factorial: 120') && codeLower.includes('factorial') && (codeLower.includes('for') || codeLower.includes('while'))) {
      passed = true;
      actualOutput = 'Factorial: 120';
    } else if (expected.includes('is prime: true') && codeLower.includes('isprime') && codeLower.includes('% i')) {
      passed = true;
      actualOutput = 'Is Prime: true';
    } else if (expected.includes('max: 30') && codeLower.includes('maxval') && (codeLower.includes('for') || codeLower.includes('>'))) {
      passed = true;
      actualOutput = 'Max: 30';
    } else if (expected.includes('sum: 45') && codeLower.includes('gridsum') && codeLower.includes('for')) {
      passed = true;
      actualOutput = 'Sum: 45';
    } else if (expected.includes('area: 160.0') && codeLower.includes('getarea') && codeLower.includes('width') && codeLower.includes('height')) {
      passed = true;
      actualOutput = 'Area: 160.0';
    } else if (expected.includes('balance: 23000.0') && codeLower.includes('deposit') && codeLower.includes('balance')) {
      passed = true;
      actualOutput = 'Balance: 23000.0';
    } else if (expected.includes('student') && codeLower.includes('extends person') && codeLower.includes('tostring')) {
      passed = true;
      actualOutput = 'Student';
    } else {
      const expectedStr = tc.expected.split(':')[0].toLowerCase().replace(/\s/g, '');
      if (codeLower.includes('system.out.println') && codeLower.includes(expectedStr)) {
        passed = Math.random() > 0.3;
        actualOutput = passed ? tc.expected : `Runtime error: check your logic`;
      }
    }
    
    results.push({ ...tc, passed, actualOutput });
  });
  return results;
};

export default function LessonView({ user, day, onBack, onComplete, onUserUpdate }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'code') return 'code';
    }
    return 'video';
  }); // 'video' | 'code' | 'project'
  const [projectRepo, setProjectRepo] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [code, setCode] = useState(day?.task?.codeTemplate || '');
  const [testResults, setTestResults] = useState(null);
  const [runningCode, setRunningCode] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  // Custom player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoQuality, setVideoQuality] = useState('auto');
  const [showReplayOverlay, setShowReplayOverlay] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [qualityLevels, setQualityLevels] = useState(['auto', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny']);

  const containerRef = useRef(null);
  const ytWrapperRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const lastSavedTime = useRef(0);
  const qualityMenuRef = useRef(null);

  const { schedule, currentDate, globalConfig } = useApp();
  const router = useRouter();

  // Close quality menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (qualityMenuRef.current && !qualityMenuRef.current.contains(e.target)) {
        setShowQualityMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Task & Video completions
  const video = day?.videos?.[0];
  const isVideoCompleted = !!user?.lessonsProgress?.[video?.videoId + "_day" + day?.day]?.completed;
  const isTaskCompleted = !!user?.tasksProgress?.[day?.task?.taskId]?.completed;

  const [videoCompleted, setVideoCompleted] = useState(isVideoCompleted);
  const [taskCompleted, setTaskCompleted] = useState(isTaskCompleted);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successOverlayText, setSuccessOverlayText] = useState('Task Completed!');

  const playerRef = useRef(null);
  const pollInterval = useRef(null);

  const startSecs = timeToSecs(video?.assignedStart || '00:00:00');
  const endSecs = timeToSecs(video?.assignedEnd || video?.duration || '00:00:00');
  const segmentDuration = Math.max(1, endSecs - startSecs);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);

  const saveVideoProgress = async (absoluteTime, targetVideo = video, targetStartSecs = startSecs, targetEndSecs = endSecs) => {
    if (!targetVideo) return;
    // Query directly from session/database to prevent stale closure states
    const dbUser = await getCurrentUserSession();
    if (!dbUser) return;
    const isCompleted = dbUser.lessonsProgress?.[targetVideo.videoId + "_day" + day?.day]?.completed;
    if (isCompleted) return;

    const updated = await updateUserProgress(dbUser.username, (u) => {
      const prog = { ...u.lessonsProgress };
      if (prog[targetVideo.videoId + "_day" + day?.day]?.completed) return u;
      
      prog[targetVideo.videoId + "_day" + day?.day] = {
        ...prog[targetVideo.videoId + "_day" + day?.day],
        completed: false,
        lastPosition: absoluteTime,
        totalDuration: targetEndSecs - targetStartSecs
      };
      return { ...u, lessonsProgress: prog };
    });
    if (updated) onUserUpdate(updated);
  };

  const saveVideoProgressRef = useRef(saveVideoProgress);
  saveVideoProgressRef.current = saveVideoProgress;

  const markVideoCompleteRef = useRef(null);

  // Show controls temporarily on mouse movement
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

  // Fullscreen Event Change
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Sync state with day changes
  useEffect(() => {
    const videoKey = video?.videoId ? (video.videoId + "_day" + day?.day) : '';
    setVideoCompleted(!!user?.lessonsProgress?.[videoKey]?.completed);
    setTaskCompleted(!!user?.tasksProgress?.[day?.task?.taskId]?.completed);
    setCode(day?.task?.codeTemplate || '');
    setTestResults(null);
    setSegmentProgress(0);
    setWatchTime(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setIsBuffering(false);
    setShowReplayOverlay(!!user?.lessonsProgress?.[videoKey]?.completed);
    setPlaybackSpeed(1);
    lastSavedTime.current = 0;
    setShowQualityMenu(false);
    
    // Sync project details
    setProjectRepo(user?.submissions?.[day.day]?.githubUrl || '');
    setProjectNotes(user?.submissions?.[day.day]?.notes || '');
    setCheckedItems(user?.submissions?.[day.day]?.checkedItems || {});
    
    let targetTab = day?.type === 'project' ? 'project' : (day?.videos && day.videos.length > 0 ? 'video' : 'code');
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'code') {
        targetTab = 'code';
      }
    }
    setActiveTab(targetTab);
  }, [day?.day, video?.videoId]);

  const handleTogglePlay = (e) => {
    if (e) e.stopPropagation();
    if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
      try {
        const state = playerRef.current.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
          if (typeof playerRef.current.pauseVideo === 'function') playerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          if (typeof playerRef.current.playVideo === 'function') playerRef.current.playVideo();
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
          if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
          setIsMuted(false);
        } else {
          if (typeof playerRef.current.mute === 'function') playerRef.current.mute();
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
        if (typeof playerRef.current.setVolume === 'function') {
          playerRef.current.setVolume(vol);
        }
        if (vol > 0 && isMuted) {
          if (typeof playerRef.current.unMute === 'function') {
            playerRef.current.unMute();
          }
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

  const handleSelectQuality = (lvl) => {
    if (playerRef.current && typeof playerRef.current.setPlaybackQuality === 'function') {
      try {
        playerRef.current.setPlaybackQuality(lvl);
        setVideoQuality(lvl);
        setShowQualityMenu(false);
      } catch (err) {
        console.error("Error setting video quality", err);
      }
    }
  };

  const mapQualityText = (q) => {
    const maps = {
      'highres': 'High',
      'hd1080': '1080p',
      'hd720': '720p',
      'large': '480p',
      'medium': '360p',
      'small': '240p',
      'tiny': '144p',
      'auto': 'Auto'
    };
    return maps[q] || q;
  };

  const handleSeekRelative = (secondsOffset) => {
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      try {
        const current = playerRef.current.getCurrentTime();
        let target = current + secondsOffset;
        if (target < startSecs) target = startSecs;
        if (target > endSecs) target = endSecs;
        if (typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(target, true);
        }
        setCurrentTime(Math.max(0, target - startSecs));
      } catch (err) {
        console.error("Error seeking relative", err);
      }
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== 'video') return;
      if (!e.target) return;
      const targetTag = e.target.tagName?.toLowerCase();
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
  }, [activeTab, isPlaying, isMuted, volume, isFullscreen, playbackSpeed, startSecs, endSecs]);

  const handleSeekChange = (e) => {
    const seekVal = parseFloat(e.target.value);
    setCurrentTime(seekVal);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(startSecs + seekVal, true);
    }
  };

  const handleReplaySegment = () => {
    setShowReplayOverlay(false);
    setCurrentTime(0);
    setIsPlaying(true);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(startSecs, true);
      playerRef.current.playVideo();
    }
  };

  // Pause video when switching away from video tab
  useEffect(() => {
    if (activeTab !== 'video' && playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch (e) {
        console.error("Error pausing video on tab switch", e);
      }
    }
  }, [activeTab]);

  // Load YouTube Player
  useEffect(() => {
    if (!video) return;

    const currentVideo = video;
    const currentStart = startSecs;
    const currentEnd = endSecs;
    let checkYT = null;

    const loadPlayer = () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy?.();
        } catch (e) {}
        playerRef.current = null;
      }
      
      if (!ytWrapperRef.current) return;
      ytWrapperRef.current.innerHTML = '';
      const container = document.createElement('div');
      container.className = 'absolute w-full h-full top-0 left-0 pointer-events-none';
      ytWrapperRef.current.appendChild(container);

      playerRef.current = new window.YT.Player(container, {
        videoId: video.videoId,
        playerVars: {
          start: startSecs,
          end: endSecs,
          autoplay: 0,
          controls: 0, // Hide native controls
          rel: 0,
          modestbranding: 1,
          fs: 0,
          disablekb: 1, // Disable native keyboard controls
          iv_load_policy: 3,
        },
        events: {
          onReady: async (event) => {
            const player = event.target;
            setPlayerReady(true);
            
            if (player && typeof player.isMuted === 'function') {
              setIsMuted(player.isMuted());
            }
            if (player && typeof player.getVolume === 'function') {
              setVolume(player.getVolume());
            }
            if (typeof player.getPlaybackRate === 'function') {
              setPlaybackSpeed(player.getPlaybackRate());
            }
            if (typeof player.getPlaybackQuality === 'function') {
              setVideoQuality(player.getPlaybackQuality() || 'auto');
            }
            if (typeof player.getAvailableQualityLevels === 'function') {
              try {
                const levels = player.getAvailableQualityLevels();
                if (levels && levels.length > 0) {
                  setQualityLevels(levels);
                }
              } catch (e) {
                console.error("Error getting quality levels", e);
              }
            }

            // Resume progress from where they left off
            let startPosition = startSecs;
            let isCompleted = false;
            try {
              const dbUser = await getCurrentUserSession();
              const savedProg = dbUser?.lessonsProgress?.[video.videoId + "_day" + day?.day];
              if (savedProg) {
                if (savedProg.completed) {
                  setShowReplayOverlay(true);
                  isCompleted = true;
                } else if (savedProg.lastPosition > startSecs + 1) {
                  startPosition = savedProg.lastPosition;
                }
              }
            } catch (err) {
              console.error("Error getting user session in onReady", err);
            }

            if (player && typeof player.seekTo === 'function') {
              player.seekTo(startPosition, true);
            }
            if (isCompleted && player && typeof player.pauseVideo === 'function') {
              try {
                player.pauseVideo();
              } catch (e) {}
            }
            lastSavedTime.current = startPosition;
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setIsBuffering(false);
              startPolling();
            } else if (e.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopPolling();
              // Save immediately when paused
              try {
                const current = e.target.getCurrentTime();
                saveVideoProgressRef.current(current, currentVideo, currentStart, currentEnd);
              } catch (err) {}
            } else if (e.data === window.YT.PlayerState.BUFFERING) {
              setIsBuffering(true);
            } else if (e.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              stopPolling();
              setShowReplayOverlay(true);
              if (markVideoCompleteRef.current) {
                markVideoCompleteRef.current();
              }
            }
          },
        },
      });
    };

    const handleBeforeUnload = () => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const current = playerRef.current.getCurrentTime();
          saveVideoProgressRef.current(current, currentVideo, currentStart, currentEnd);
        } catch (e) {}
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      
      checkYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYT);
          loadPlayer();
        }
      }, 100);
    }

    return () => {
      if (checkYT) clearInterval(checkYT);
      stopPolling();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          const current = playerRef.current.getCurrentTime();
          saveVideoProgressRef.current(current, currentVideo, currentStart, currentEnd);
          playerRef.current.destroy();
        } catch (e) {}
      }
      playerRef.current = null;
    };
  }, [video?.videoId, startSecs, endSecs]);

  const startPolling = () => {
    stopPolling();
    pollInterval.current = setInterval(() => {
      if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;
      try {
        const t = playerRef.current.getCurrentTime();

        setCurrentTime(Math.max(0, t - startSecs));
        if (typeof playerRef.current.isMuted === 'function') {
          setIsMuted(playerRef.current.isMuted());
        }
        if (typeof playerRef.current.getVolume === 'function') {
          setVolume(playerRef.current.getVolume());
        }

        if (typeof playerRef.current.getPlaybackQuality === 'function') {
          setVideoQuality(playerRef.current.getPlaybackQuality() || 'auto');
        }

        // Throttled database saving every 2 seconds
        if (Math.abs(t - lastSavedTime.current) >= 2) {
          saveVideoProgressRef.current(t);
          lastSavedTime.current = t;
        }

        if (t < startSecs - 2) {
          if (typeof playerRef.current.seekTo === 'function') {
            playerRef.current.seekTo(startSecs, true);
          }
          return;
        }
        if (t >= endSecs - 2) {
          if (typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo();
          }
          setIsPlaying(false);
          setShowReplayOverlay(true);
          stopPolling();
          markVideoCompleteRef.current();
          return;
        }
        
        const elapsed = Math.max(0, t - startSecs);
        const pct = Math.min(100, (elapsed / segmentDuration) * 100);
        setSegmentProgress(Math.round(pct));
        setWatchTime(Math.round(elapsed));
      } catch (err) {
        console.error("Error polling player state:", err);
      }
    }, 250);
  };

  const stopPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  };

  const triggerSuccessOverlay = (text) => {
    setSuccessOverlayText(text);
    setShowSuccessOverlay(true);
    setTimeout(() => setShowSuccessOverlay(false), 2000);
  };

  const markVideoComplete = async () => {
    if (!video || videoCompleted) return;
    setVideoCompleted(true);
    
    const dbUser = await getCurrentUserSession();
    if (!dbUser) return;
    
    const updated = await updateUserProgress(dbUser.username, (u) => {
      const prog = { ...u.lessonsProgress };
      prog[video.videoId + "_day" + day.day] = { completed: true, dateCompleted: new Date().toISOString().split('T')[0] };
      const streaked = checkAndUpdateStreak({ ...u, lessonsProgress: prog });
      return streaked;
    });
    if (updated) onUserUpdate(updated);
    triggerSuccessOverlay('Video Lecture Watched!');
  };

  markVideoCompleteRef.current = markVideoComplete;

  const handleKeyDownInEditor = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleToggleChecklist = async (index) => {
    const newChecked = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(newChecked);
    
    // Save to user storage
    const updated = await updateUserProgress(user.username, (u) => {
      const subs = { ...(u.submissions || {}) };
      subs[day.day] = {
        ...(subs[day.day] || { githubUrl: '', notes: '', projectName: day.title, submittedAt: '' }),
        checkedItems: newChecked
      };
      return { ...u, submissions: subs };
    });
    if (updated) onUserUpdate(updated);
  };

  const handleRunCode = () => {
    if (!day?.task) return;
    setRunningCode(true);
    setTestResults(null);
    setTimeout(async () => {
      const results = validateJavaCode(code, day.task.testCases);
      setTestResults(results);
      setRunningCode(false);

      if (results.every(r => r.passed)) {
        const wasCompleted = taskCompleted;
        setTaskCompleted(true);
        const updated = await updateUserProgress(user.username, (u) => {
          const tp = { ...u.tasksProgress };
          tp[day.task.taskId] = { completed: true, code, submittedAt: new Date().toISOString() };
          return { ...u, tasksProgress: tp };
        });
        if (updated) onUserUpdate(updated);
        if (!wasCompleted) {
          triggerSuccessOverlay('Coding Task Solved! +25 XP');
        }
      }
    }, 1500);
  };

  const handleProjectSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!projectRepo.trim()) {
      alert("Please enter a valid GitHub Repository URL.");
      return;
    }
    const updated = await updateUserProgress(user.username, (u) => {
      const subs = { ...(u.submissions || {}) };
      subs[day.day] = {
        githubUrl: projectRepo.trim(),
        notes: projectNotes.trim(),
        submittedAt: new Date().toISOString(),
        projectName: day.title
      };
      return { ...u, submissions: subs };
    });
    if (updated) {
      onUserUpdate(updated);
      triggerSuccessOverlay('Project Submitted! +50 XP');
    }
  };

  const isProject = day?.type === 'project';
  const isProjectCompleted = !!user?.submissions?.[day.day];
  const totalTasks = isProject ? 1 : (1 + (day?.task ? 1 : 0));
  let completedTasks = 0;
  if (isProject) {
    if (isProjectCompleted) completedTasks++;
  } else {
    if (videoCompleted) completedTasks++;
    if (day?.task && taskCompleted) completedTasks++;
  }

  const handleDaySelect = (dayNum) => {
    router.push('/lessons/' + dayNum);
  };

  const prevDay = day.day > 1 ? schedule.find(d => d.day === day.day - 1) : null;
  const nextDay = day.day < schedule.length ? schedule.find(d => d.day === day.day + 1) : null;
  
  const activeWeekNum = Math.floor((day.day - 1) / 7) + 1;
  const currentWeekDays = schedule.filter(d => Math.floor((d.day - 1) / 7) + 1 === activeWeekNum);

  const getDayStateIcon = (d) => {
    const isCompleted = d.type === 'off' ? true 
      : d.type === 'project' ? !!user?.submissions?.[d.day]
      : d.type === 'review' ? !!user?.lessonsProgress?.[`review_${d.day}`]?.completed
      : (!!user?.lessonsProgress?.[d.videos?.[0]?.videoId + "_day" + d.day]?.completed && (d.task ? !!user?.tasksProgress?.[d.task.taskId]?.completed : true));
    
    const weekIndex = Math.floor((d.day - 1) / 7);
    const sundayDayNum = weekIndex * 7 + 1;
    const sundayDay = schedule.find(sDay => sDay.day === sundayDayNum) || d;
    const sundayDate = new Date(sundayDay.date || '2026-06-14');
    const isLocked = sundayDate > new Date(currentDate) && !user?.settings?.devWarpTime && !user?.settings?.openAvailability && !globalConfig?.openAvailabilityForAll;

    if (isCompleted) return 'check_circle';
    if (isLocked) return 'lock';
    return d.day === day.day ? 'pause_circle' : 'play_circle';
  };

  return (
    <div className="flex-1 overflow-y-auto pt-20 pb-xl px-md md:px-lg min-h-screen select-none">
      {/* Success Feedback Overlay */}
      <div 
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-on-background/40 backdrop-blur-sm transition-all duration-300 ${
          showSuccessOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className={`bg-white p-xl rounded-xl text-center shadow-2xl transition-transform duration-300 w-full max-w-[360px] mx-4 shrink-0 ${
            showSuccessOverlay ? 'scale-100' : 'scale-90'
          }`}
        >
          <div className="w-20 h-20 bg-tertiary text-white rounded-full flex items-center justify-center mx-auto mb-lg">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm font-black">{successOverlayText}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Your progress has been synchronized.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Navigation Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high border border-outline-variant text-primary cursor-pointer transition-colors bg-surface-container-lowest shadow-sm"
            title="Back to timeline"
          >
            <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
          </button>
          <div className="flex-1 min-w-0">
            <span className="font-caption text-caption text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Day {day.day} · {day.dayOfWeek}
            </span>
            <h1 className="font-headline-lg text-headline-lg font-black text-on-surface truncate mt-1 leading-none">{day.title}</h1>
          </div>
        </div>

        {/* Tab Row */}
        <div className="flex gap-2 mb-6 border-b border-outline-variant/50 pb-2">
          {isProject ? (
            <button
              className="px-5 py-2.5 rounded-t-lg text-label-md font-bold text-primary bg-primary/5 relative capitalize cursor-default"
            >
              <span className="material-symbols-outlined text-[16px] mr-1.5 align-[-3px]">work</span>
              Project Submission
              {isProjectCompleted && (
                <span className="ml-1.5 w-2 h-2 bg-tertiary rounded-full inline-block" />
              )}
              <span className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-primary rounded-full" />
            </button>
          ) : (
            [day?.videos && day.videos.length > 0 && 'video', day?.task && 'code'].filter(Boolean).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-t-lg text-label-md font-bold transition-all cursor-pointer capitalize relative ${
                  activeTab === tab
                    ? 'text-primary bg-primary/5'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab === 'video' && <span className="material-symbols-outlined text-[16px] mr-1.5 align-[-3px]">play_circle</span>}
                {tab === 'code' && <span className="material-symbols-outlined text-[16px] mr-1.5 align-[-3px]">terminal</span>}
                {tab}
                {tab === 'video' && videoCompleted && (
                  <span className="ml-1.5 w-2 h-2 bg-tertiary rounded-full inline-block" />
                )}
                {tab === 'code' && taskCompleted && (
                  <span className="ml-1.5 w-2 h-2 bg-tertiary rounded-full inline-block" />
                )}
                {activeTab === tab && (
                  <span className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex flex-col gap-xl">
          {/* Main Visual Screen Container */}
          <section className="w-full">
            <div 
              ref={containerRef}
              onMouseMove={showControlsTemp}
              onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
              className="relative aspect-video w-full bg-on-background rounded-xl overflow-hidden shadow-lg border border-outline-variant/60"
            >
              
              {/* VIDEO TAB SCREEN (always mounted to prevent YouTube player iframe destruction) */}
              {video && (
                <div 
                  className="w-full h-full relative"
                  style={{ display: activeTab === 'video' ? 'block' : 'none' }}
                >
                  <div className={`relative w-full h-full overflow-hidden ${showReplayOverlay ? 'pointer-events-none opacity-20' : ''}`}>
                    <div ref={ytWrapperRef} className="absolute w-full h-full top-0 left-0 pointer-events-none" />
                  </div>

                  {!playerReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-highest">
                      <span className="material-symbols-outlined text-primary text-5xl mb-3 animate-spin">progress_activity</span>
                      <p className="text-on-surface-variant font-bold text-caption">Loading Video Player...</p>
                    </div>
                  )}

                  {/* Click-capturing transparent overlay to play/pause when clicked */}
                  {playerReady && !showReplayOverlay && (
                    <div 
                      onClick={handleTogglePlay}
                      className="absolute inset-0 bg-transparent cursor-pointer z-30"
                    />
                  )}

                  {/* Custom Controller Overlay */}
                  {playerReady && !showReplayOverlay && (
                    <div 
                      className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 z-40 flex flex-col gap-2 ${
                        isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      {/* Progress Bar Slider */}
                      <div className="relative flex items-center h-2 w-full group/progress">
                        <input
                          type="range"
                          min={0}
                          max={segmentDuration || 1}
                          value={currentTime}
                          onChange={handleSeekChange}
                          className="w-full h-1 hover:h-1.5 rounded-lg appearance-none cursor-pointer accent-primary transition-all duration-150 focus:outline-none"
                          style={{
                            background: `linear-gradient(to right, var(--color-primary, #004ac6) ${
                              (currentTime / (segmentDuration || 1)) * 100
                            }%, rgba(255,255,255,0.2) ${(currentTime / (segmentDuration || 1)) * 100}%)`,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-white text-xs select-none">
                        <div className="flex items-center gap-4">
                          {/* Play/Pause Button */}
                          <button
                            onClick={handleTogglePlay}
                            className="p-1 hover:text-primary transition-colors cursor-pointer focus:outline-none bg-transparent border-0 flex items-center justify-center text-white"
                          >
                            {isPlaying ? (
                              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
                            ) : (
                              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                            )}
                          </button>

                          {/* Volume Icon & Slider */}
                          <div className="flex items-center gap-2 group/volume">
                            <button
                              onClick={handleToggleMute}
                              className="p-1 hover:text-primary transition-colors cursor-pointer focus:outline-none bg-transparent border-0 flex items-center justify-center text-white"
                            >
                              {isMuted || volume === 0 ? (
                                <span className="material-symbols-outlined text-[20px]">volume_off</span>
                              ) : volume < 50 ? (
                                <span className="material-symbols-outlined text-[20px]">volume_down</span>
                              ) : (
                                <span className="material-symbols-outlined text-[20px]">volume_up</span>
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
                            {secsToTime(currentTime)} / {secsToTime(segmentDuration)}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Speed Control Button */}
                          <button
                            onClick={handleCycleSpeed}
                            className="px-1.5 py-0.5 rounded border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-[9px] font-mono font-bold tracking-tighter text-white hover:text-primary transition-all cursor-pointer focus:outline-none"
                            title="Playback Speed"
                          >
                            {playbackSpeed}x
                          </button>

                           {/* Quality Control Dropdown */}
                           <div className="relative flex items-center" ref={qualityMenuRef}>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setShowQualityMenu(!showQualityMenu);
                               }}
                               className="px-1.5 py-0.5 rounded border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-[9px] font-mono font-bold tracking-tighter text-white hover:text-primary transition-all cursor-pointer focus:outline-none flex items-center gap-0.5"
                               title="Video Quality"
                             >
                               <span>{mapQualityText(videoQuality)}</span>
                               <span className="material-symbols-outlined text-[8px] leading-none">arrow_drop_up</span>
                             </button>
                             
                             {showQualityMenu && (
                               <div className="absolute bottom-full right-0 mb-1.5 bg-[#16212e] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 flex flex-col min-w-[70px] select-none">
                                 {qualityLevels.map((lvl) => (
                                   <button
                                     key={lvl}
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       handleSelectQuality(lvl);
                                     }}
                                     className={`px-2 py-1 text-left text-[9px] font-mono font-bold hover:bg-white/5 transition-colors border-0 cursor-pointer ${
                                       videoQuality === lvl ? 'text-primary bg-primary/5' : 'text-white/80'
                                     }`}
                                   >
                                     {mapQualityText(lvl)}
                                   </button>
                                 ))}
                               </div>
                             )}
                           </div>

                          {/* Fullscreen Button */}
                          <button
                            onClick={handleFullscreen}
                            className="p-1 hover:text-primary transition-colors cursor-pointer focus:outline-none bg-transparent border-0 flex items-center justify-center text-white"
                          >
                            {isFullscreen ? (
                              <span className="material-symbols-outlined text-[20px]">fullscreen_exit</span>
                            ) : (
                              <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replay Overlay */}
                  {showReplayOverlay && (
                    <div className="absolute inset-0 bg-on-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50 rounded-xl">
                      <div className="p-4 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
                        <span className="material-symbols-outlined text-3xl animate-spin">replay</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">Today's Video Segment Finished</h3>
                      <p className="text-[10px] text-white/70 max-w-xs mb-5 leading-relaxed">
                        You have completed today's assigned segment for this lesson:
                        <span className="block mt-1 font-semibold text-primary font-mono text-xs">
                          {video.assignedStart || "00:00:00"} - {video.assignedEnd || video.duration}
                        </span>
                      </p>
                      <button
                        onClick={handleReplaySegment}
                        className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition-all border border-primary/20"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">play_arrow</span>
                        Replay Segment
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* CODE TAB SCREEN */}
              {activeTab === 'code' && day?.task && (
                <div className="w-full h-full bg-[#1e2a3a] text-white flex flex-col justify-between overflow-hidden">
                  {/* IDE Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-[#16212e] border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <span className="text-caption font-mono text-white/50 ml-2">Solution.java</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Java Compiler</span>
                  </div>

                  {/* Split instructions / editor / log output */}
                  <div className="flex-1 flex flex-col md:flex-row min-h-0">
                    {/* Left Pane: Problem Statement */}
                    <div className="w-full md:w-72 bg-[#16212e]/75 flex flex-col overflow-y-auto custom-scrollbar p-4 select-text border-b md:border-b-0 md:border-r border-white/10">
                      <h4 className="text-caption font-bold text-white mb-2 flex items-center gap-1.5 font-sans">
                        <span className="material-symbols-outlined text-[16px] text-primary">description</span>
                        Instructions
                      </h4>
                      <div className="text-[11px] text-white/80 leading-relaxed font-sans space-y-2">
                        <p className="font-bold text-xs text-white">{day.task.title}</p>
                        <p className="whitespace-pre-line text-white/70">{day.task.description}</p>
                        
                        {day.task.testCases && day.task.testCases.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
                            {day.task.testCases[0].input && (
                              <div>
                                <span className="font-bold text-white/40 block text-[9px] uppercase tracking-wider">Sample Input</span>
                                <pre className="bg-black/30 p-2 rounded text-[10px] font-mono text-white/80 mt-1 whitespace-pre-wrap">{day.task.testCases[0].input}</pre>
                              </div>
                            )}
                            {day.task.testCases[0].expected && (
                              <div>
                                <span className="font-bold text-white/40 block text-[9px] uppercase tracking-wider">Sample Output</span>
                                <pre className="bg-black/30 p-2 rounded text-[10px] font-mono text-white/80 mt-1 whitespace-pre-wrap">{day.task.testCases[0].expected}</pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Center Pane: Editor */}
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={handleKeyDownInEditor}
                      spellCheck={false}
                      className="flex-1 bg-transparent p-4 font-mono text-xs outline-none resize-none leading-relaxed border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto custom-scrollbar"
                      style={{ fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}
                    />
                    
                    {/* Right Pane: Compiler Console */}
                    <div className="w-full md:w-64 bg-[#16212e]/55 flex flex-col overflow-y-auto custom-scrollbar p-4 text-xs font-mono select-text border-t md:border-t-0 md:border-l border-white/5">
                      <p className="text-white/40 border-b border-white/10 pb-1.5 mb-2 font-bold flex items-center justify-between">
                        <span>Compiler Console</span>
                        <span className="text-[9px] uppercase bg-white/10 px-1 rounded">stdout</span>
                      </p>
                      
                      {runningCode ? (
                        <p className="text-primary animate-pulse font-bold">Executing test suites...</p>
                      ) : testResults ? (
                        <div className="space-y-3">
                          <p className={`font-bold ${testResults.every(r => r.passed) ? 'text-tertiary' : 'text-error'}`}>
                            {testResults.every(r => r.passed) ? '✓ All Tests Passed (+25 XP)' : '✗ Test Assertions Failed'}
                          </p>
                          {testResults.map((tr, idx) => (
                            <div key={idx} className="border-t border-white/5 pt-1.5">
                              <p className="font-bold flex items-center gap-1">
                                <span className={tr.passed ? 'text-tertiary' : 'text-error'}>{tr.passed ? '●' : '○'}</span>
                                {tr.description}
                              </p>
                              <p className="text-white/40 mt-0.5">Exp: "{tr.expected}"</p>
                              <p className={tr.passed ? 'text-tertiary/75' : 'text-error/75'}>Act: "{tr.actualOutput}"</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/30 italic">Console idle. Click "Run Code" to execute assertions.</p>
                      )}
                    </div>
                  </div>

                  {/* IDE Toolbar footer */}
                  <div className="flex items-center justify-between px-4 py-2 bg-[#16212e] border-t border-white/10 shrink-0 select-none">
                    <button
                      onClick={handleRunCode}
                      disabled={runningCode}
                      className="px-4 py-1.5 bg-primary text-on-primary rounded font-bold text-caption hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40"
                    >
                      {runningCode ? 'Compiling...' : 'Run Code'}
                    </button>
                    <button
                      onClick={() => setCode(day.task.codeTemplate)}
                      className="text-white/40 hover:text-white/80 font-bold text-caption cursor-pointer"
                    >
                      Reset Template
                    </button>
                  </div>
                </div>
              )}

              {/* PROJECT TAB SCREEN */}
              {activeTab === 'project' && (
                <div className="w-full h-full bg-surface-container-lowest p-6 overflow-y-auto custom-scrollbar select-text">
                  <div className="space-y-8 max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
                      <span className="material-symbols-outlined text-primary text-2xl font-bold">work</span>
                      <h3 className="font-headline-sm text-headline-sm font-black text-on-surface">{day.title}</h3>
                    </div>

                    {/* Check if project details are seeded */}
                    {day.task?.projectInfo ? (
                      <>
                        {/* Scope and Goal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                          <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-xl">
                            <span className="font-bold text-[10px] uppercase text-primary tracking-wider block mb-1">🎯 Goal</span>
                            <p className="text-caption font-semibold text-on-surface leading-relaxed">{day.task.projectInfo.goal}</p>
                          </div>
                          <div className="bg-tertiary/5 border-l-4 border-tertiary p-4 rounded-r-xl">
                            <span className="font-bold text-[10px] uppercase text-tertiary tracking-wider block mb-1">📚 Topics Covered</span>
                            <p className="text-caption font-semibold text-on-surface-variant leading-relaxed">{day.task.projectInfo.covers}</p>
                          </div>
                        </div>

                        {/* Detailed Specifications */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-on-surface text-body-sm flex items-center gap-2 border-b border-outline-variant/20 pb-1.5 select-none">
                            <span className="material-symbols-outlined text-primary text-[18px]">assignment</span>
                            Detailed Project Specifications
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {day.task.projectInfo.requirements.map((req, idx) => (
                              <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 hover:bg-surface-container-high/60 transition-colors flex gap-4">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-caption select-none">
                                  {idx + 1}
                                </div>
                                <div>
                                  <h5 className="font-bold text-on-surface text-caption mb-1 select-none">{req.title}</h5>
                                  <p className="text-caption font-semibold text-on-surface-variant leading-relaxed whitespace-pre-line">{req.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Example Execution Run */}
                        {day.task.projectInfo.sampleRun && (
                          <div className="space-y-3">
                            <h4 className="font-bold text-on-surface text-body-sm flex items-center gap-2 border-b border-outline-variant/20 pb-1.5 select-none">
                              <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
                              Expected Console Execution Output
                            </h4>
                            <div className="bg-[#121820] rounded-xl overflow-hidden border border-white/10 shadow-lg font-mono text-xs text-white/95">
                              {/* Terminal Header */}
                              <div className="bg-[#1c2330] px-4 py-2 flex items-center justify-between border-b border-white/10 select-none">
                                <div className="flex gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                                </div>
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider font-sans">CLI Terminal Session</span>
                                <div className="w-10" />
                              </div>
                              {/* Terminal Code Body */}
                              <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed text-[#5af78e] bg-black/40 whitespace-pre-wrap select-text font-mono" style={{ fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}>
                                {day.task.projectInfo.sampleRun}
                              </pre>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Fallback for projects without full detailed projectInfo (e.g. general Capstone) */
                      <div className="space-y-2 text-body-sm text-on-surface-variant leading-relaxed">
                        <p className="font-bold text-on-surface select-none">Description & Objectives:</p>
                        <p className="whitespace-pre-line text-xs font-semibold">{day.task?.description}</p>
                      </div>
                    )}

                    {/* Checkboxes for tracking work */}
                    {day.task?.checklist && day.task.checklist.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                        <h4 className="font-bold text-on-surface text-body-sm flex items-center gap-2 select-none">
                          <span className="material-symbols-outlined text-primary text-[18px]">fact_check</span>
                          Interactive Task Checklist
                        </h4>
                        <div className="space-y-2">
                          {day.task.checklist.map((item, idx) => (
                            <label 
                              key={idx} 
                              className="flex items-start gap-3 p-3 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low cursor-pointer transition-all select-none"
                            >
                              <input 
                                type="checkbox"
                                checked={!!checkedItems[idx]}
                                onChange={() => handleToggleChecklist(idx)}
                                className="w-4 h-4 rounded border-outline text-primary focus:ring-primary mt-0.5 shrink-0"
                              />
                              <span className={`text-caption font-semibold leading-tight ${checkedItems[idx] ? 'text-on-surface-variant line-through opacity-60' : 'text-on-surface'}`}>
                                {item}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Submission Portal Card */}
                    <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 shadow-sm space-y-4">
                      <h4 className="font-bold text-on-surface text-body-sm flex items-center gap-2 border-b border-outline-variant/30 pb-2 select-none">
                        <span className="material-symbols-outlined text-primary text-[20px]">publish</span>
                        Submission Portal
                      </h4>
                      <form onSubmit={handleProjectSubmit} className="space-y-4">
                        <div>
                          <label className="block text-caption font-bold text-on-surface-variant mb-1 select-none">GitHub Repository URL</label>
                          <input
                            type="url"
                            required
                            placeholder="https://github.com/yourusername/your-repository"
                            value={projectRepo}
                            onChange={(e) => setProjectRepo(e.target.value)}
                            disabled={isProjectCompleted}
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary disabled:opacity-60 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-caption font-bold text-on-surface-variant mb-1 select-none">Development / Deployment Notes</label>
                          <textarea
                            rows={3}
                            placeholder="Describe your architecture, challenges, and what you accomplished..."
                            value={projectNotes}
                            onChange={(e) => setProjectNotes(e.target.value)}
                            disabled={isProjectCompleted}
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm focus:outline-none focus:border-primary disabled:opacity-60 resize-none font-semibold"
                          />
                        </div>
                        
                        {!isProjectCompleted ? (
                          <button
                            type="submit"
                            className="px-lg py-sm bg-primary text-on-primary font-bold rounded-lg text-caption cursor-pointer hover:opacity-90 border-0"
                          >
                            Submit Project Code
                          </button>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-tertiary font-bold flex items-center gap-1 text-caption select-none">
                              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              Submitted on {user.submissions?.[day.day] ? new Date(user.submissions[day.day].submittedAt).toLocaleDateString() : ''}
                            </span>
                            <button
                              type="button"
                              onClick={async () => {
                                const updated = await updateUserProgress(user.username, (u) => {
                                  const subs = { ...(u.submissions || {}) };
                                  delete subs[day.day];
                                  return { ...u, submissions: subs };
                                });
                                if (updated) onUserUpdate(updated);
                              }}
                              className="px-md py-sm bg-surface-container border border-outline text-on-surface text-caption font-bold rounded-lg cursor-pointer"
                            >
                              Edit Submission
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* Lesson Details Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-xl items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-2 space-y-lg">
              <header>
                <div className="flex items-center gap-sm mb-xs">
                  <span className="bg-surface-container-high text-primary px-sm py-xs rounded text-caption font-bold uppercase">
                    {day.chapterNum ? `Chapter ${day.chapterNum}` : 'Curriculum'}
                  </span>
                  <span className="text-on-surface-variant text-caption font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    {video?.duration || '15 mins'} segment
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg font-black text-on-surface mt-1">{day.title}</h1>
              </header>

              <div className="prose prose-slate max-w-none">
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  {day.type === 'project' ? day.task?.description : 'Revise previous concepts, review coding syntax, and sync your notebook notes. Rest and recharge for upcoming assessments.'}
                </p>

              </div>

              {/* Book Companion Website Resources Link */}
              <div className="mt-md p-md bg-surface-container-low border border-outline-variant/60 rounded-xl flex items-center justify-between shadow-sm select-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
                  <div>
                    <p className="text-body-sm font-bold text-on-surface">Liang Java Companion Resources</p>
                    <p className="text-[10px] text-on-surface-variant">Companion website for Introduction to Java Programming (12th Edition)</p>
                  </div>
                </div>
                <a 
                  href="https://media.pearsoncmg.com/ph/php8/sites/ecs/ecs_liang_java_12/cw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-md py-1.5 bg-primary text-on-primary rounded font-bold text-caption hover:opacity-90 transition-opacity cursor-pointer text-center"
                >
                  Open Website
                </a>
              </div>

              {day.slides && (
                <div className="mt-md p-md bg-surface-container-low border border-outline-variant/60 rounded-xl flex items-center justify-between shadow-sm select-none">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">presentation_play</span>
                    <div>
                      <p className="text-body-sm font-bold text-on-surface">Lecture Slides</p>
                      <p className="text-[10px] text-on-surface-variant font-semibold">Download presentation slides for this chapter</p>
                    </div>
                  </div>
                  <a 
                    href={day.slides}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-md py-1.5 bg-primary text-on-primary rounded font-bold text-caption hover:opacity-90 transition-opacity cursor-pointer text-center"
                  >
                    Download Slides
                  </a>
                </div>
              )}

              {/* Tasks List Box */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-md shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary">checklist</span>
                    Interactive Lesson Goals
                  </h3>
                  <span className="text-caption font-bold text-on-surface-variant">
                    {completedTasks} of {totalTasks} completed
                  </span>
                </div>
                <div className="space-y-sm">
                  
                   {/* Task 1: Video */}
                  {!isProject && (
                    <label className="flex items-center gap-md p-md border border-outline-variant rounded-lg hover:bg-surface-container-low cursor-pointer transition-all">
                      <input 
                        type="checkbox" 
                        checked={videoCompleted} 
                        readOnly 
                        className="w-5 h-5 rounded border-outline text-primary focus:ring-primary pointer-events-none"
                      />
                      <span className={`font-body-md text-body-md ${videoCompleted ? 'text-on-surface-variant line-through opacity-60' : 'text-on-surface'}`}>
                        Watch the complete assigned lecture segment ({video?.assignedStart || '00:00:00'} to {video?.assignedEnd || video?.duration || '00:00:00'})
                      </span>
                    </label>
                  )}

                  {/* Task 2: Project Submission */}
                  {isProject && (
                    <label className="flex items-center gap-md p-md border border-outline-variant rounded-lg hover:bg-surface-container-low cursor-pointer transition-all">
                      <input 
                        type="checkbox" 
                        checked={isProjectCompleted} 
                        readOnly 
                        className="w-5 h-5 rounded border-outline text-primary focus:ring-primary pointer-events-none"
                      />
                      <span className={`font-body-md text-body-md ${isProjectCompleted ? 'text-on-surface-variant line-through opacity-60' : 'text-on-surface'}`}>
                        Implement and submit your project codebase via GitHub repository URL (+50 XP)
                      </span>
                    </label>
                  )}
 

 
                   {/* Task 4: Coding Console */}
                   {day.task && !isProject && (
                     <label className="flex items-center gap-md p-md border border-outline-variant rounded-lg hover:bg-surface-container-low cursor-pointer transition-all">
                       <input 
                         type="checkbox" 
                         checked={taskCompleted} 
                         readOnly 
                         className="w-5 h-5 rounded border-outline text-primary focus:ring-primary pointer-events-none"
                       />
                       <span className={`font-body-md text-body-md ${taskCompleted ? 'text-on-surface-variant line-through opacity-60' : 'text-on-surface'}`}>
                         Implement solutions inside the compiler and pass verification test suites (+25 XP)
                       </span>
                     </label>
                   )}

                </div>
              </div>
            </div>

            {/* Right Module Outline Sidebar */}
            <div className="space-y-lg select-none shrink-0">
              <div className="bg-surface border border-outline-variant rounded-xl p-md">
                <h4 className="font-label-md text-label-md font-bold text-primary mb-md uppercase tracking-wider">Week {activeWeekNum} Outline</h4>
                <div className="space-y-sm max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                  {currentWeekDays.map((d) => {
                    const isActive = d.day === day.day;
                    const isCompleted = d.type === 'off' ? true : d.type === 'review'
                      ? !!user?.lessonsProgress?.[`review_${d.day}`]?.completed
                      : (!!user?.lessonsProgress?.[d.videos?.[0]?.videoId + "_day" + d.day]?.completed && (d.task ? !!user?.tasksProgress?.[d.task.taskId]?.completed : true));
                    
                    const weekIndex = Math.floor((d.day - 1) / 7);
                    const sundayDayNum = weekIndex * 7 + 1;
                    const sundayDay = schedule.find(sDay => sDay.day === sundayDayNum) || d;
                    const sundayDate = new Date(sundayDay.date || '2026-06-14');
                    
                    const isLocked = sundayDate > new Date(currentDate) && !user?.settings?.devWarpTime && !user?.settings?.openAvailability && !globalConfig?.openAvailabilityForAll;

                    return (
                      <div 
                        key={d.day}
                        onClick={() => !isLocked && handleDaySelect(d.day)}
                        className={`flex items-center gap-md p-sm rounded-lg transition-all ${
                          isActive
                            ? 'border border-primary bg-primary/5 text-primary font-bold'
                            : isLocked
                            ? 'opacity-40 cursor-not-allowed text-on-surface-variant'
                            : 'hover:bg-surface-container-high cursor-pointer text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm font-bold">
                          {getDayStateIcon(d)}
                        </span>
                        <span className="font-caption text-caption truncate flex-1 pr-2">
                          Day {d.day}. {d.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Card */}
              <div className="p-lg bg-primary-container text-on-primary-container rounded-xl flex flex-col items-center text-center gap-md shadow-sm border border-primary/20">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl font-bold">emoji_events</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md font-bold">{user.username}, you're doing great!</p>
                  <p className="font-caption text-caption opacity-90">Keep maintaining your focus streak!</p>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full transition-all" style={{ width: `${user?.streak > 0 ? Math.min(100, user.streak * 10) : 10}%` }}></div>
                </div>
              </div>
            </div>

          </section>

          {/* Bottom Lesson Navigation */}
          <footer className="mt-xl pt-lg border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-lg">
            {prevDay ? (
              <button
                onClick={() => handleDaySelect(prevDay.day)}
                className="w-full md:w-auto px-xl py-md border border-outline text-on-surface-variant hover:text-on-surface rounded-lg font-label-md text-label-md flex items-center justify-center gap-md hover:bg-surface-container-low transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">chevron_left</span>
                Previous Lesson (Day {prevDay.day})
              </button>
            ) : (
              <div className="w-full md:w-auto" />
            )}
            
            <div className="flex items-center gap-md order-first md:order-none">
              <div className={`h-2.5 w-2.5 rounded-full ${videoCompleted ? 'bg-primary' : 'bg-outline-variant/60'}`}></div>
              {day.task && (
                <div className={`h-2.5 w-2.5 rounded-full ${taskCompleted ? 'bg-primary' : 'bg-outline-variant/60'}`}></div>
              )}
            </div>

            {nextDay ? (
              <button
                onClick={() => handleDaySelect(nextDay.day)}
                className="w-full md:w-auto px-xl py-md bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center justify-center gap-md hover:shadow-lg hover:opacity-95 transition-all group cursor-pointer"
              >
                Next Lesson (Day {nextDay.day})
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
            ) : (
              <div className="w-full md:w-auto" />
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}
