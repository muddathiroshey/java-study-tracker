import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const LOCAL_DB_PATH = path.join(process.cwd(), 'db.json');

// Simple async queue to serialize file system reads and writes to db.json
let fsQueuePromise = Promise.resolve();

async function runFsQueue(operation) {
  return new Promise((resolve, reject) => {
    fsQueuePromise = fsQueuePromise.then(async () => {
      try {
        const result = await operation();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
}


// Default seeding data for classmates
const DEFAULT_CLASSMATES = [
  {
    id: 'classmate_ada',
    username: 'Ada Lovelace',
    email: 'ada@example.com',
    password: '123456',
    enrolledDate: '2026-06-11',
    streak: 4,
    lastActiveDate: '2026-06-11',
    totalStudyTime: 0,
    isAdmin: false,
    lessonsProgress: {
      'WnMPk6_8qDo': { completed: true, dateCompleted: '2026-06-11' },
      'r_0n_M38Or0': { completed: true, dateCompleted: '2026-06-11' },
      'M7XLFoSm1yw': { completed: true, dateCompleted: '2026-06-11' }
    },
    tasksProgress: {
      'task_1': { completed: true, code: '', submittedAt: '2026-06-11' }
    },
    submissions: {},
    settings: {
      dailyTargetMinutes: 60,
      devWarpTime: false,
      currentFakeDate: null,
      openAvailability: false
    }
  },
  {
    id: 'classmate_sarah',
    username: 'Sarah Connor',
    email: 'sarah@example.com',
    password: '123456',
    enrolledDate: '2026-06-11',
    streak: 2,
    lastActiveDate: '2026-06-11',
    totalStudyTime: 0,
    isAdmin: false,
    lessonsProgress: {
      'WnMPk6_8qDo': { completed: true, dateCompleted: '2026-06-11' },
      'r_0n_M38Or0': { completed: true, dateCompleted: '2026-06-11' }
    },
    tasksProgress: {
      'task_1': { completed: true, code: '', submittedAt: '2026-06-11' }
    },
    submissions: {},
    settings: {
      dailyTargetMinutes: 60,
      devWarpTime: false,
      currentFakeDate: null,
      openAvailability: false
    }
  },
  {
    id: 'classmate_linus',
    username: 'Linus Torvalds',
    email: 'linus@example.com',
    password: '123456',
    enrolledDate: '2026-06-11',
    streak: 1,
    lastActiveDate: '2026-06-11',
    totalStudyTime: 0,
    isAdmin: false,
    lessonsProgress: {
      'WnMPk6_8qDo': { completed: true, dateCompleted: '2026-06-11' }
    },
    tasksProgress: {},
    submissions: {},
    settings: {
      dailyTargetMinutes: 60,
      devWarpTime: false,
      currentFakeDate: null,
      openAvailability: false
    }
  }
];

const DEFAULT_ADMIN = {
  id: 'admin_id',
  username: 'muddathiradmin',
  email: 'admin@example.com',
  password: '64913728',
  enrolledDate: '2026-06-11',
  streak: 0,
  lastActiveDate: null,
  totalStudyTime: 0,
  isAdmin: true,
  lessonsProgress: {},
  tasksProgress: {},
  submissions: {},
  settings: {
    dailyTargetMinutes: 60,
    devWarpTime: false,
    currentFakeDate: null,
    openAvailability: false
  }
};

// Database connection pool for Postgres
let pool = null;

function getPool() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

// Convert PostgreSQL database columns to standard client-side camelCase properties
function mapDbUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    enrolledDate: row.enrolled_date,
    streak: Number(row.streak || 0),
    lastActiveDate: row.last_active_date,
    totalStudyTime: Number(row.total_study_time || 0),
    isAdmin: !!row.is_admin,
    lessonsProgress: row.lessons_progress || {},
    tasksProgress: row.tasks_progress || {},
    submissions: row.submissions || {},
    settings: row.settings || {}
  };
}

let dbInitialized = false;

export async function dbInit() {
  if (dbInitialized) return;
  const p = getPool();

  if (p) {
    // Initialize PostgreSQL
    const client = await p.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS java_study_users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE,
          password TEXT NOT NULL,
          enrolled_date TEXT NOT NULL,
          streak INTEGER DEFAULT 0,
          last_active_date TEXT,
          total_study_time INTEGER DEFAULT 0,
          is_admin BOOLEAN DEFAULT FALSE,
          lessons_progress JSONB DEFAULT '{}'::jsonb,
          tasks_progress JSONB DEFAULT '{}'::jsonb,
          submissions JSONB DEFAULT '{}'::jsonb,
          settings JSONB DEFAULT '{}'::jsonb
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS java_study_schedule (
          key TEXT PRIMARY KEY,
          data JSONB NOT NULL
        );
      `);

      // Seed if empty
      const res = await client.query('SELECT COUNT(*) FROM java_study_users');
      if (parseInt(res.rows[0].count) === 0) {
        // Seed Admin
        await client.query(
          `INSERT INTO java_study_users 
          (id, username, email, password, enrolled_date, streak, last_active_date, total_study_time, is_admin, lessons_progress, tasks_progress, submissions, settings)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            DEFAULT_ADMIN.id,
            DEFAULT_ADMIN.username,
            DEFAULT_ADMIN.email,
            DEFAULT_ADMIN.password,
            DEFAULT_ADMIN.enrolledDate,
            DEFAULT_ADMIN.streak,
            DEFAULT_ADMIN.lastActiveDate,
            DEFAULT_ADMIN.totalStudyTime,
            DEFAULT_ADMIN.isAdmin,
            JSON.stringify(DEFAULT_ADMIN.lessonsProgress),
            JSON.stringify(DEFAULT_ADMIN.tasksProgress),
            JSON.stringify(DEFAULT_ADMIN.submissions),
            JSON.stringify(DEFAULT_ADMIN.settings)
          ]
        );

        // Seed Classmates
        for (const c of DEFAULT_CLASSMATES) {
          await client.query(
            `INSERT INTO java_study_users 
            (id, username, email, password, enrolled_date, streak, last_active_date, total_study_time, is_admin, lessons_progress, tasks_progress, submissions, settings)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
              c.id,
              c.username,
              c.email,
              c.password,
              c.enrolledDate,
              c.streak,
              c.lastActiveDate,
              c.totalStudyTime,
              c.isAdmin,
              JSON.stringify(c.lessonsProgress),
              JSON.stringify(c.tasksProgress),
              JSON.stringify(c.submissions),
              JSON.stringify(c.settings)
            ]
          );
        }
      }
    } finally {
      client.release();
    }
  } else {
    // Initialize Local File Database
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const data = {
        users: [DEFAULT_ADMIN, ...DEFAULT_CLASSMATES],
        schedule: []
      };
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    }
  }
  dbInitialized = true;
}

export async function dbGetUserByUsernameOrEmail(usernameOrEmail) {
  await dbInit();
  const p = getPool();

  if (p) {
    const res = await p.query(
      `SELECT * FROM java_study_users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1)`,
      [usernameOrEmail]
    );
    return mapDbUser(res.rows[0]);
  } else {
    return runFsQueue(async () => {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      const user = data.users.find(
        u => u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
             (u.email && u.email.toLowerCase() === usernameOrEmail.toLowerCase())
      );
      return user || null;
    });
  }
}

export async function dbCreateUser(name, email, password, isAdmin = false) {
  await dbInit();
  const p = getPool();

  const newUser = {
    id: Date.now().toString(),
    username: name,
    email: email || '',
    password,
    enrolledDate: new Date().toISOString().split('T')[0],
    streak: 0,
    lastActiveDate: null,
    totalStudyTime: 0,
    isAdmin,
    lessonsProgress: {},
    tasksProgress: {},
    submissions: {},
    settings: {
      dailyTargetMinutes: 60,
      devWarpTime: false,
      currentFakeDate: null,
      openAvailability: false
    }
  };

  if (p) {
    const res = await p.query(
      `INSERT INTO java_study_users 
      (id, username, email, password, enrolled_date, streak, last_active_date, total_study_time, is_admin, lessons_progress, tasks_progress, submissions, settings)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        newUser.id,
        newUser.username,
        newUser.email,
        newUser.password,
        newUser.enrolledDate,
        newUser.streak,
        newUser.lastActiveDate,
        newUser.totalStudyTime,
        newUser.isAdmin,
        JSON.stringify(newUser.lessonsProgress),
        JSON.stringify(newUser.tasksProgress),
        JSON.stringify(newUser.submissions),
        JSON.stringify(newUser.settings)
      ]
    );
    return mapDbUser(res.rows[0]);
  } else {
    return runFsQueue(async () => {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      data.users.push(newUser);
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
      return newUser;
    });
  }
}

export async function dbUpdateUserProfile(oldUsername, name, email, password) {
  await dbInit();
  const p = getPool();

  if (p) {
    let query = `UPDATE java_study_users SET username = $1, email = $2`;
    const params = [name, email];
    
    if (password && password.trim() !== '') {
      query += `, password = $3 WHERE LOWER(username) = LOWER($4) RETURNING *`;
      params.push(password, oldUsername);
    } else {
      query += ` WHERE LOWER(username) = LOWER($3) RETURNING *`;
      params.push(oldUsername);
    }
    
    const res = await p.query(query, params);
    return mapDbUser(res.rows[0]);
  } else {
    return runFsQueue(async () => {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      const idx = data.users.findIndex(u => u.username.toLowerCase() === oldUsername.toLowerCase());
      if (idx === -1) return null;
      
      data.users[idx].username = name;
      data.users[idx].email = email;
      if (password && password.trim() !== '') {
        data.users[idx].password = password;
      }
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
      return data.users[idx];
    });
  }
}

export async function dbUpdateUserProgress(username, lessonsProgress, tasksProgress, submissions, settings = null, streak = null, lastActiveDate = null) {
  await dbInit();
  const p = getPool();

  if (p) {
    let query = `UPDATE java_study_users SET lessons_progress = $1, tasks_progress = $2, submissions = $3`;
    const params = [JSON.stringify(lessonsProgress), JSON.stringify(tasksProgress), JSON.stringify(submissions)];
    let paramIdx = 4;
    
    if (settings) {
      query += `, settings = $${paramIdx}`;
      params.push(JSON.stringify(settings));
      paramIdx++;
    }
    if (streak !== null && streak !== undefined) {
      query += `, streak = $${paramIdx}`;
      params.push(streak);
      paramIdx++;
    }
    if (lastActiveDate !== null && lastActiveDate !== undefined) {
      query += `, last_active_date = $${paramIdx}`;
      params.push(lastActiveDate);
      paramIdx++;
    }
    
    query += ` WHERE LOWER(username) = LOWER($${paramIdx}) RETURNING *`;
    params.push(username);
    
    const res = await p.query(query, params);
    return mapDbUser(res.rows[0]);
  } else {
    return runFsQueue(async () => {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      const idx = data.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
      if (idx === -1) return null;
      
      data.users[idx].lessonsProgress = lessonsProgress;
      data.users[idx].tasksProgress = tasksProgress;
      data.users[idx].submissions = submissions;
      if (settings) {
        data.users[idx].settings = settings;
      }
      if (streak !== null && streak !== undefined) {
        data.users[idx].streak = Number(streak);
      }
      if (lastActiveDate !== null && lastActiveDate !== undefined) {
        data.users[idx].lastActiveDate = lastActiveDate;
      }
      
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
      return data.users[idx];
    });
  }
}

export async function dbUpdateUserStreak(username, streak, lastActiveDate) {
  await dbInit();
  const p = getPool();

  if (p) {
    const res = await p.query(
      `UPDATE java_study_users SET streak = $1, last_active_date = $2 WHERE LOWER(username) = LOWER($3) RETURNING *`,
      [streak, lastActiveDate, username]
    );
    return mapDbUser(res.rows[0]);
  } else {
    return runFsQueue(async () => {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      const idx = data.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
      if (idx === -1) return null;
      
      data.users[idx].streak = Number(streak || 0);
      data.users[idx].lastActiveDate = lastActiveDate;
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
      return data.users[idx];
    });
  }
}

export async function dbGetLeaderboard() {
  await dbInit();
  const p = getPool();

  if (p) {
    const res = await p.query(`SELECT * FROM java_study_users`);
    return res.rows.map(mapDbUser);
  } else {
    return runFsQueue(async () => {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      return data.users;
    });
  }
}

export async function dbGetStoredSchedule(defaultSchedule) {
  await dbInit();
  const p = getPool();

  if (p) {
    const res = await p.query(`SELECT data FROM java_study_schedule WHERE key = 'course_schedule'`);
    if (res.rows[0]) {
      return res.rows[0].data;
    } else {
      await p.query(
        `INSERT INTO java_study_schedule (key, data) VALUES ('course_schedule', $1) ON CONFLICT (key) DO NOTHING`,
        [JSON.stringify(defaultSchedule)]
      );
      return defaultSchedule;
    }
  } else {
    return runFsQueue(async () => {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      if (data.schedule && data.schedule.length > 0) {
        return data.schedule;
      } else {
        data.schedule = defaultSchedule;
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return defaultSchedule;
      }
    });
  }
}

export async function dbSaveStoredSchedule(schedule) {
  await dbInit();
  const p = getPool();

  if (p) {
    await p.query(
      `INSERT INTO java_study_schedule (key, data) VALUES ('course_schedule', $1)
       ON CONFLICT (key) DO UPDATE SET data = $1`,
      [JSON.stringify(schedule)]
    );
  } else {
    return runFsQueue(async () => {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      data.schedule = schedule;
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    });
  }
}

export async function dbGetGlobalConfig() {
  await dbInit();
  const p = getPool();
  if (p) {
    const res = await p.query(`SELECT data FROM java_study_schedule WHERE key = 'global_config'`);
    if (res.rows[0]) {
      return res.rows[0].data;
    } else {
      const defaultConfig = { openAvailabilityForAll: false };
      await p.query(
        `INSERT INTO java_study_schedule (key, data) VALUES ('global_config', $1) ON CONFLICT (key) DO NOTHING`,
        [JSON.stringify(defaultConfig)]
      );
      return defaultConfig;
    }
  } else {
    return runFsQueue(async () => {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      if (!data.globalConfig) {
        data.globalConfig = { openAvailabilityForAll: false };
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
      }
      return data.globalConfig;
    });
  }
}

export async function dbSaveGlobalConfig(config) {
  await dbInit();
  const p = getPool();
  if (p) {
    await p.query(
      `INSERT INTO java_study_schedule (key, data) VALUES ('global_config', $1)
       ON CONFLICT (key) DO UPDATE SET data = $1`,
      [JSON.stringify(config)]
    );
  } else {
    return runFsQueue(async () => {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
      data.globalConfig = config;
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    });
  }
}
