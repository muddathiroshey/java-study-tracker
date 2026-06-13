const fs = require('fs');
const path = require('path');

// Durations from playlists_data.json
const durationMap = {
  "WnMPk6_8qDo": "00:59:30",
  "r_0n_M38Or0": "00:15:52",
  "M7XLFoSm1yw": "01:26:25",
  "ORW7sE95NlU": "00:26:00",
  "lGtJeCGeJEA": "01:00:57",
  "687TPQNBap8": "00:51:17",
  "DeCBRPWCkoc": "01:19:42",
  "NZzu49ffrgY": "00:55:09",
  "xQ1x_C9LwmI": "00:50:57",
  "LZ-S5v1Y6bs": "00:46:23",
  "qUCj_jK_MFQ": "00:46:14",
  "qvh6RfT_Kek": "00:51:08",
  "Hkg3wKVPznA": "01:02:00",
  "xzSy-sEt4W4": "00:44:29",
  "RK2ABib7pmI": "00:35:04",
  "eDxRQEmkoGM": "00:32:29",
  "jFw0ZkDXU6U": "00:38:40",
  "Vd3gfjFgalY": "00:22:51",
  "6hQ2pw4LqYk": "00:38:18",
  "NSDD8LUwCeM": "00:33:27",
  "qW291svCsb4": "00:20:07",
  "UnpEgotT5hg": "00:29:34",
  "Ly1wkba3EZk": "00:44:36",
  "OrQM3Luv6zg": "00:32:21",
  "QZE1PQaOhoQ": "00:22:04",
  "2i58ZxiZb-k": "00:12:48",
  "Y61XfRGzhC0": "00:40:12",
  "9J38Cm1SjHQ": "00:25:52",
  "bfouLyURcWE": "00:29:49",
  "jqmjxcs2T0w": "00:39:20",
  "nuqLs3MWvU4": "00:22:45"
};

async function run() {
  const courseDataPath = path.join(__dirname, '../src/lib/courseData.js');
  
  // Use dynamic import
  const moduleUrl = 'file://' + courseDataPath.replace(/\\/g, '/');
  const courseData = await import(moduleUrl);
  
  const schedule = JSON.parse(JSON.stringify(courseData.courseSchedule));
  
  schedule.forEach(day => {
    if (day.videos && day.videos.length > 0) {
      const video = day.videos[0];
      const videoId = video.videoId;
      const fullDur = durationMap[videoId];
      
      if (!fullDur) {
        console.log(`Warning: videoId ${videoId} not found in durationMap`);
        return;
      }
      
      // Check if it's one of the explicitly split days
      // 1. Ch 2 Part 1 split (Day 3 & Day 4)
      if (day.day === 3 && videoId === "M7XLFoSm1yw") {
        video.assignedStart = "00:00:00";
        video.assignedEnd = "00:42:16";
        video.duration = fullDur;
      } else if (day.day === 4 && videoId === "M7XLFoSm1yw") {
        video.assignedStart = "00:42:16";
        video.assignedEnd = "01:26:25";
        video.duration = fullDur;
      }
      // 2. Ch 4 split (Day 10 & Day 11)
      else if (day.day === 10 && videoId === "DeCBRPWCkoc") {
        video.assignedStart = "00:00:00";
        video.assignedEnd = "00:43:20";
        video.duration = fullDur;
      } else if (day.day === 11 && videoId === "DeCBRPWCkoc") {
        video.assignedStart = "00:43:20";
        video.assignedEnd = "01:19:42";
        video.duration = fullDur;
      }
      // 3. Ch 7 Part 2 split (Day 23)
      else if (day.day === 23 && videoId === "Hkg3wKVPznA") {
        video.assignedStart = "00:00:00";
        video.assignedEnd = "00:31:03";
        video.duration = fullDur;
      }
      // All other videos play in full duration from 00:00:00 to end
      else {
        video.assignedStart = "00:00:00";
        video.assignedEnd = fullDur;
        video.duration = fullDur;
      }
    }
  });

  const newContent = `// Reorganized Java Course Schedule (June 14, 2026 - August 15, 2026)
// Fridays are OFF (Rest Days). Saturdays are Practice/Submission days.
// Sunday to Thursday are Lecture days (5 lectures per week).

export const COURSE_TITLE = ${JSON.stringify(courseData.COURSE_TITLE, null, 2)};
export const START_DATE = ${JSON.stringify(courseData.START_DATE, null, 2)};
export const END_DATE = ${JSON.stringify(courseData.END_DATE, null, 2)};

export const courseSchedule = ${JSON.stringify(schedule, null, 2)};

export const TOPIC_DOMAINS = ${JSON.stringify(courseData.TOPIC_DOMAINS, null, 2)};
`;

  fs.writeFileSync(courseDataPath, newContent, 'utf8');
  console.log("Successfully normalized all video times in courseData.js using ES import!");
}

run().catch(console.error);
