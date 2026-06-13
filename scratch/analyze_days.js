const fs = require('fs');
const path = require('path');

const courseDataPath = path.join(__dirname, '../src/lib/courseData.js');

const tempScript = `
const fs = require('fs');
const path = require('path');
const courseData = require('${courseDataPath.replace(/\\/g, '/')}');
const schedule = courseData.courseSchedule;

const analysis = schedule.map(day => {
  return {
    day: day.day,
    type: day.type,
    chapterNum: day.chapterNum,
    chapterTitle: day.chapterTitle,
    title: day.title,
    videoId: day.videos && day.videos.length > 0 ? day.videos[0].videoId : null,
    videoTitle: day.videos && day.videos.length > 0 ? day.videos[0].title : null,
    assignedStart: day.videos && day.videos.length > 0 ? day.videos[0].assignedStart : null,
    assignedEnd: day.videos && day.videos.length > 0 ? day.videos[0].assignedEnd : null,
    duration: day.videos && day.videos.length > 0 ? day.videos[0].duration : null,
  };
});

fs.writeFileSync(path.join(__dirname, 'analysis.json'), JSON.stringify(analysis, null, 2));
console.log("Analysis written to scratch/analysis.json");
`;

fs.writeFileSync(path.join(__dirname, 'run_analysis.js'), tempScript);
console.log("Analysis runner updated.");
