// All 13 PL2 Final Projects — Dr. Mohammed El-Said
// These are randomly assigned to students. The assignment is locked until all videos are completed.

export const PROJECTS_LIST = [
  {
    id: 1,
    title: "College Examination Management System",
    tagline: "Digital exam lifecycle management for educational institutions",
    icon: "school",
    color: "#4F46E5", // indigo
    modules: [
      {
        name: "Administrative Module",
        items: [
          "User Authentication: Admins have usernames and passwords, with the ability to alter their credentials.",
          "User Management: Admins can add, delete, update, list, and search for both students and lecturers.",
          "Subject Management: Admins manage course subjects and assign them to students and lecturers.",
          "Grade Approval and Publication: Admins review and approve grades before publishing results to students.",
        ],
      },
      {
        name: "Lecturer Module",
        items: [
          "Exam Management: Lecturers can create, manage, and modify exams — adding questions, specifying duration, and setting correct answers (MCQ, true/false, short answer).",
          "Automatic Grading: The system calculates the final grade for each student based on their responses.",
          "Reporting Tools: Lecturers can generate class performance reports.",
        ],
      },
      {
        name: "Student Module",
        items: [
          "Access to Exams: Students can only access exams for subjects they are registered in.",
          "One-time Exam Entry: Students are permitted to enter each exam only once.",
          "Result Viewing: Students can view their results and corrected exams after grades are published.",
          "Re-correction Requests: Students can submit requests for re-evaluation of their grades.",
          "Feedback Mechanism: Students can provide feedback on exam difficulty and overall experience.",
        ],
      },
      {
        name: "User Module",
        items: [
          "All Users can login and logout.",
          "Users can update their information except ID.",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Task Management System",
    tagline: "Monitor employee workload, tasks, and performance in real time",
    icon: "task_alt",
    color: "#0EA5E9", // sky
    modules: [
      {
        name: "Admin Module",
        items: [
          "Add, update, and delete users.",
          "Add, update, and delete employees.",
          "Add, update, and delete employee types.",
          "Add, update, and delete task phases (pending, under work, test, evaluation, canceled, …).",
          "Add, update, and delete projects or customers.",
          "Login and logout.",
        ],
      },
      {
        name: "Tasks Module",
        items: [
          "Tasks page: code, title, description, assigned employee, task phase, project, priority, creator name, start date, end date, estimation hours.",
          "Tasks log: from/to time, assigned employee, task — recording actual time spent.",
          "Calendar showing all employee tasks and phases.",
          "Every employee can see only their own tasks.",
          "The leader can create, show all, evaluate, reassign, and modify any task field.",
        ],
      },
      {
        name: "Employee Module",
        items: [
          "Timecards: record attendance and departure of employees.",
          "Mission and Permission Request submission.",
          "Page to approve/disapprove mission and permission requests.",
          "Leave Types: record types of vacations.",
          "Leave Request submission.",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Library Management System",
    tagline: "Streamline book lending, reservations, and patron management",
    icon: "local_library",
    color: "#10B981", // emerald
    modules: [
      {
        name: "Administrative Module",
        items: [
          "Create, delete, update, and search for librarian and patron accounts.",
          "Admins can manage their own credentials for secure access.",
          "Add new books, update existing book information, and remove books.",
          "Categorize books by genre, author, publication year, and other criteria.",
          "Track the status of each book (available, checked out, reserved).",
        ],
      },
      {
        name: "Librarian Module",
        items: [
          "Check out and return books for patrons.",
          "Handle reservations for books that are currently checked out, notifying patrons when available.",
        ],
      },
      {
        name: "Patron Module",
        items: [
          "Create and manage library accounts, updating personal information.",
          "Search for books using various filters (title, author, genre) and view details.",
          "View check-out history including current books and due dates.",
          "Renew checked-out books or request reservations.",
        ],
      },
      {
        name: "User Module",
        items: [
          "All users (admins, librarians, patrons) can log in and out.",
          "Users can update their contact information and preferences.",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Parking Guidance System",
    tagline: "Smart parking management with ticket, payment, and spot monitoring",
    icon: "local_parking",
    color: "#F59E0B", // amber
    modules: [
      {
        name: "Customer Module",
        items: [
          "Print ticket at entry station with entry ID, plate number, and transaction date.",
          "Pay at exit station for parking hours using entry ID.",
        ],
      },
      {
        name: "Entry Station Operator",
        items: [
          "Monitor free spots in the parking area.",
          "Advise customers on available free spots.",
        ],
      },
      {
        name: "Exit Station Operator",
        items: [
          "Enter ticket ID to calculate total parking hours and generate payment.",
        ],
      },
      {
        name: "Admin Module",
        items: [
          "Add spots to the parking facility.",
          "View total spots in parking.",
          "Add, update, and delete users with different roles.",
          "View shifts report with payment summaries.",
          "View parked cars report.",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Project Management System",
    tagline: "Track tasks, working hours, vacations, and project completion",
    icon: "analytics",
    color: "#8B5CF6", // violet
    modules: [
      {
        name: "Employee Module",
        items: [
          "Enter entry time and exit time to calculate monthly working hours.",
          "Request vacation.",
          "View penalties.",
          "View assigned tasks over a project.",
          "Check off assigned tasks upon completion.",
        ],
      },
      {
        name: "Team Leader Module",
        items: [
          "Manage employees.",
          "Assign tasks to employees.",
          "View completed tasks.",
        ],
      },
      {
        name: "Project Manager Module",
        items: [
          "View the percentage of project completion.",
          "Generate reports about specific employees to the team leader.",
        ],
      },
      {
        name: "Admin Module",
        items: [
          "View all projects.",
          "Add, update, and delete users with different roles.",
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Bug Tracking System",
    tagline: "Manage, assign, and resolve software bugs with automated notifications",
    icon: "bug_report",
    color: "#EF4444", // red
    modules: [
      {
        name: "Tester Module",
        items: [
          "Define bug: name, type, priority, level, project name, date, status.",
          "Assign bug to a developer.",
          "Attach screenshots of bugs.",
          "Monitor open and closed bugs.",
          "System sends email automatically to assigned developer with bug details.",
        ],
      },
      {
        name: "Developer Module",
        items: [
          "View assigned bugs.",
          "Change the status of a bug after resolving it.",
          "System sends email automatically to tester when developer marks bug as complete.",
        ],
      },
      {
        name: "Project Manager Module",
        items: [
          "Check performance of developers and testers.",
          "Monitor open and closed bugs.",
        ],
      },
      {
        name: "Admin Module",
        items: [
          "View all bugs for a project.",
          "Add, update, and delete users with different roles.",
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Electricity Billing System",
    tagline: "Meter-based billing, payments, and consumption management",
    icon: "bolt",
    color: "#F97316", // orange
    modules: [
      {
        name: "Old Customer Module",
        items: [
          "Pay a bill using meter code.",
          "Enter monthly meter reading.",
          "Submit complaints about a bill using meter code.",
          "System sends email automatically if customer doesn't pay within 3 months.",
        ],
      },
      {
        name: "New Customer Module",
        items: [
          "Fill in all required customer information.",
          "Attach a copy of contract (apartment, etc.).",
          "System sends email automatically to notify customer when meter is ready.",
        ],
      },
      {
        name: "Operator Module",
        items: [
          "Collect payments from customers.",
          "Print bills using meter codes.",
          "View bills for a specific region.",
          "Validate meter readings against actual consumption.",
          "Define tariff for a customer.",
          "Stop meter and cancel subscription for a customer.",
        ],
      },
      {
        name: "Admin Module",
        items: [
          "View all bills for specific regions.",
          "View total amounts collected.",
          "Generate consumption statistics for specific regions.",
          "Add, update, and delete users with different roles.",
        ],
      },
    ],
  },
  {
    id: 8,
    title: "Event Management System",
    tagline: "Full-cycle event booking coordination between customers and service providers",
    icon: "event",
    color: "#EC4899", // pink
    modules: [
      {
        name: "Customer Module",
        items: [
          "Create an account.",
          "Book an event with full details.",
          "System sends email automatically with reservation number and login credentials.",
          "Manage bookings (view, update, cancel).",
          "Contact the project manager.",
        ],
      },
      {
        name: "Project Manager Module",
        items: [
          "Receive customer requests.",
          "Forward customer requests to service providers and follow up.",
          "Communicate with customers.",
          "Show bill/invoice to customers.",
        ],
      },
      {
        name: "Service Provider Module",
        items: [
          "Receive customer requests from the Project Manager.",
          "Price the request and resend it to the Project Manager.",
          "Determine the ready date for the request.",
        ],
      },
      {
        name: "Admin Module",
        items: [
          "Receive requests from customers and forward to Project Manager.",
          "Add, update, and delete users with different roles.",
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Hyper Market Management System",
    tagline: "End-to-end sales, inventory, and employee management for large retail markets",
    icon: "store",
    color: "#14B8A6", // teal
    modules: [
      {
        name: "Administrative Module",
        items: [
          "Admin has username and password and can alter them.",
          "Manage employees: Add (with unique ID, password, type), Delete, Update, List all, Search.",
        ],
      },
      {
        name: "Marketing Module",
        items: [
          "Marketing employees can generate product reports (make queries).",
          "Marketing employees can create special offers and send them to inventory management.",
        ],
      },
      {
        name: "Inventory Management Module",
        items: [
          "Inventory employees can Add, Delete, Update, List, and Search products.",
          "System sends notification when product quantity falls below a set range.",
          "System sends notification when a product's expiry date is approaching.",
          "Manage damaged items and sales returns.",
        ],
      },
      {
        name: "Sales Module",
        items: [
          "Sellers can search for products, list all products, and make/cancel orders.",
        ],
      },
      {
        name: "User Module",
        items: [
          "All users can login and logout.",
          "Users can update their information except ID.",
          "Users can view all previous actions (optional).",
        ],
      },
    ],
  },
  {
    id: 10,
    title: "Health Club Management System",
    tagline: "Subscription, coach scheduling, and member management for gyms",
    icon: "fitness_center",
    color: "#06B6D4", // cyan
    modules: [
      {
        name: "Administrative Module",
        items: [
          "Admin has username and password and can alter them.",
          "Manage coaches and members: Add, Delete, Update, List, Search.",
          "Manage billing.",
          "Generate reports about members.",
          "Assign members to their coaches.",
          "System sends notification when a member's subscription is ending.",
        ],
      },
      {
        name: "Coach Module",
        items: [
          "Create workout plans and timeline schedules for members.",
          "Send messages to all assigned members.",
        ],
      },
      {
        name: "Member Module",
        items: [
          "View subscription end date.",
          "View assigned coach and their schedule.",
          "Receive notification when subscription is ending.",
        ],
      },
      {
        name: "User Module",
        items: [
          "All users can login and logout.",
          "Users can update their information except ID.",
        ],
      },
    ],
  },
  {
    id: 11,
    title: "Restaurant Management System",
    tagline: "Orders, billing, loyalty programs, and customer management for restaurants",
    icon: "restaurant",
    color: "#D97706", // yellow
    modules: [
      {
        name: "Administrative Module",
        items: [
          "Admin has username and password and can alter them.",
          "Manage Employees: Add, Delete, Update, List, Search.",
          "Manage Meals: Add, Delete, Update, List, Search.",
          "Generate reports about customers and employees.",
          "Create special offers, marketing, loyalty, and reward programs.",
        ],
      },
      {
        name: "Employee Module",
        items: [
          "Manage Customers: Add, Delete, Update, List, Search.",
          "Make and cancel orders.",
          "Manage billing.",
          "Receive notifications when offers are added.",
          "Receive notifications for customer gifts when payments reach a specific threshold.",
        ],
      },
      {
        name: "Customer Module",
        items: [
          "Register in marketing, loyalty, and reward programs.",
          "All payments and orders are saved to the customer profile.",
          "All gifts and special offers received are saved to the customer profile.",
        ],
      },
      {
        name: "User Module",
        items: [
          "All users (except customers) can login and logout.",
          "Users can update their information except ID.",
        ],
      },
    ],
  },
  {
    id: 12,
    title: "Inventory Management System",
    tagline: "Product lifecycle, supplier management, and purchase orders for supermarkets",
    icon: "inventory_2",
    color: "#7C3AED", // purple
    modules: [
      {
        name: "Product Module",
        items: [
          "Add, update, and delete products.",
          "Search products by name, production/expiration dates, or categories.",
          "Notify user for products with near expiration dates or low quantity.",
        ],
      },
      {
        name: "Admin Module",
        items: [
          "Add, update, and delete product categories.",
          "Add, update, and delete suppliers.",
          "Generate reports and statistics for products or categories.",
          "Add offers for specific products within a date range (start date – end date).",
          "Generate profit reports.",
        ],
      },
      {
        name: "Client Module",
        items: [
          "Register on the system and edit their data.",
          "Request a purchase order for specific products and generate an invoice.",
          "Generate order reports.",
          "Receive email notifications for purchase orders.",
        ],
      },
    ],
  },
  {
    id: 13,
    title: "Hotel Reservation System",
    tagline: "Guest check-in, room assignment, billing, and service management for hotels",
    icon: "hotel",
    color: "#0F766E", // dark teal
    modules: [
      {
        name: "User Module",
        items: [
          "Add, update, and delete employees.",
          "Add, update, and delete customers.",
          "Add, update, and delete rooms and their services.",
        ],
      },
      {
        name: "Room Management Module",
        items: [
          "Enter guest details if not already in the system.",
          "Filter rooms by availability, room type, and room service.",
          "Assign rooms to guests.",
          "View guests with checkout within the next two days.",
          "Assign clients to other service modules.",
          "Generate a detailed bill/invoice for each client.",
        ],
      },
      {
        name: "Other Service Module",
        items: [
          "Add, update, and delete services (name, description, price, etc.).",
          "Generate statistical reports for service usage.",
        ],
      },
    ],
  },
];

// Cover sheet checklist items — same for ALL projects (Dr. Mohammed El-Said)
// "Individual Work" item is excluded per instructions
export const COVER_SHEET_CHECKLIST = [
  {
    id: "oop",
    label: "OOP Concepts",
    description: "Classes, Interface and abstract classes, polymorphism, Inheritance, etc.",
    points: 3,
    icon: "code",
  },
  {
    id: "user_module",
    label: "User Manipulation Module",
    description: "Login, Add / update / delete / search, list — full user lifecycle.",
    points: 2,
    icon: "manage_accounts",
  },
  {
    id: "authorization",
    label: "User Authorization",
    description: "Users can only view and use features designated for their role.",
    points: 2,
    icon: "shield",
  },
  {
    id: "file_handling",
    label: "File Handling",
    description: "Save and retrieve data from files (Text Files only — no databases).",
    points: 2,
    icon: "folder_open",
  },
  {
    id: "fulfillment",
    label: "Fulfillment of All Modules",
    description: "All modules described in the project specification are implemented.",
    points: 3,
    icon: "checklist",
  },
];

export const COVER_SHEET_NOTES = [
  "GUI is a must — if not provided, 5 points will be deducted.",
  "DB is prohibited — you must use Text Files for data storage.",
];

export const TOTAL_POINTS = COVER_SHEET_CHECKLIST.reduce((s, i) => s + i.points, 0);
