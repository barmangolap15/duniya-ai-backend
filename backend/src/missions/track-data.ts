export interface StepData {
  id: number;
  title: string;
  instruction: string;
  target: 'html' | 'css' | 'js';
  expectedCode: string;
  hint: string;
  validation: string;
  xp: number;
  emoji: string;
}

export interface MissionData {
  title: string;
  description: string;
  instructions: string;
  xpReward: number;
  order: number;
  languages: string[];
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  steps: StepData[];
}

export interface CourseData {
  name: string;
  description: string;
  order: number;
  missions: MissionData[];
}

export interface TrackData {
  name: string;
  description: string;
  icon: string;
  color: string;
  courses: CourseData[];
}

export const ALL_TRACKS: TrackData[] = [
  {
    name: 'Frontend Web Development',
    description: 'Build beautiful, interactive user interfaces with semantic HTML5, modern CSS layouts, and dynamic JavaScript',
    icon: 'Layout',
    color: 'from-blue-500 to-indigo-600',
    courses: [
      {
        name: 'HTML Fundamentals',
        description: 'Learn the building blocks of every webpage on the internet',
        order: 1,
        missions: [
          {
            title: 'Build Your First Webpage',
            description: 'Create a basic HTML page with a heading, paragraph, and image',
            instructions: 'Follow the steps to build your very first webpage from scratch!',
            order: 1,
            xpReward: 50,
            languages: ['html'],
            starterHtml: '',
            starterCss: '',
            starterJs: '',
            steps: [
              {
                id: 1,
                title: 'Add a Heading',
                instruction: 'Every great webpage starts with a heading. Add an `<h1>` tag with the text **"Hello World"**.',
                target: 'html',
                expectedCode: '<h1>Hello World</h1>',
                hint: 'Type: <h1>Hello World</h1>',
                validation: '<h1>Hello World</h1>',
                xp: 10,
                emoji: '📝',
              },
              {
                id: 2,
                title: 'Add a Paragraph',
                instruction: 'Now add a paragraph below your heading. Use the `<p>` tag with the text **"Welcome to my first webpage!"**.',
                target: 'html',
                expectedCode: '<p>Welcome to my first webpage!</p>',
                hint: 'Type: <p>Welcome to my first webpage!</p>',
                validation: '<p>Welcome to my first webpage!</p>',
                xp: 10,
                emoji: '✍️',
              },
              {
                id: 3,
                title: 'Add an Image',
                instruction: 'Let\'s add an image! Use the `<img>` tag with `src` set to **"https://picsum.photos/300/200"** and `alt` set to **"Random image"**.',
                target: 'html',
                expectedCode: '<img src="https://picsum.photos/300/200" alt="Random image">',
                hint: 'Type: <img src="https://picsum.photos/300/200" alt="Random image">',
                validation: '<img',
                xp: 10,
                emoji: '🖼️',
              },
              {
                id: 4,
                title: 'Add a Link',
                instruction: 'Finally, add a link! Create an `<a>` tag with `href` set to **"#"** and text **"Learn More"**.',
                target: 'html',
                expectedCode: '<a href="#">Learn More</a>',
                hint: 'Type: <a href="#">Learn More</a>',
                validation: '<a href',
                xp: 20,
                emoji: '🔗',
              },
            ],
          },
          {
            title: 'Build a Profile Card',
            description: 'Create a structured profile card with HTML elements',
            instructions: 'Build a complete profile card step by step!',
            order: 2,
            xpReward: 75,
            languages: ['html'],
            starterHtml: '',
            starterCss: '',
            starterJs: '',
            steps: [
              {
                id: 1,
                title: 'Create the Card Container',
                instruction: 'Start by creating a `<div>` with class **"card"**.',
                target: 'html',
                expectedCode: '<div class="card">\n\n</div>',
                hint: 'Type: <div class="card"></div>',
                validation: '<div class="card">',
                xp: 15,
                emoji: '📦',
              },
              {
                id: 2,
                title: 'Add Profile Elements',
                instruction: 'Inside the card, add an avatar `<img>` and `<h2>Jane Doe</h2>`.',
                target: 'html',
                expectedCode: '<img class="avatar" src="https://picsum.photos/100/100" alt="Profile">\n<h2>Jane Doe</h2>',
                hint: 'Add img and h2 tags',
                validation: '<h2>Jane Doe</h2>',
                xp: 25,
                emoji: '👤',
              },
            ],
          },
        ],
      },
      {
        name: 'CSS Styling & Layouts',
        description: 'Make your webpages visually captivating with modern CSS and Flexbox',
        order: 2,
        missions: [
          {
            title: 'Style Your First Element',
            description: 'Learn CSS fundamentals by styling a heading and subtitle',
            instructions: 'Apply CSS styles to transform plain HTML into styled design!',
            order: 1,
            xpReward: 60,
            languages: ['html', 'css'],
            starterHtml: '<h1 class="title">Welcome to CSS!</h1>\n<p class="subtitle">Let\'s style this!</p>',
            starterCss: '',
            starterJs: '',
            steps: [
              {
                id: 1,
                title: 'Change the Color',
                instruction: 'Set `.title` color to **#3b82f6**.',
                target: 'css',
                expectedCode: '.title {\n  color: #3b82f6;\n}',
                hint: '.title { color: #3b82f6; }',
                validation: 'color:',
                xp: 20,
                emoji: '🎨',
              },
            ],
          },
          {
            title: 'Responsive Flexbox Grid',
            description: 'Design a modern responsive flexbox container with auto-wrapping items',
            instructions: 'Use display flex, justify-content, and gap to lay out responsive cards!',
            order: 2,
            xpReward: 80,
            languages: ['html', 'css'],
            starterHtml: '<div class="grid-container">\n  <div class="box">Card 1</div>\n  <div class="box">Card 2</div>\n  <div class="box">Card 3</div>\n</div>',
            starterCss: '.grid-container {\n  padding: 16px;\n}\n.box {\n  background: #1e293b;\n  color: white;\n  padding: 20px;\n  border-radius: 8px;\n}',
            starterJs: '',
            steps: [
              {
                id: 1,
                title: 'Enable Flexbox',
                instruction: 'In `.grid-container`, set `display: flex;` and `gap: 16px;`.',
                target: 'css',
                expectedCode: '.grid-container {\n  display: flex;\n  gap: 16px;\n  padding: 16px;\n}',
                hint: 'display: flex; gap: 16px;',
                validation: 'display: flex',
                xp: 40,
                emoji: '📐',
              },
            ],
          },
        ],
      },
      {
        name: 'Interactive JavaScript',
        description: 'Breathe life into web pages with event handlers and stateful DOM manipulation',
        order: 3,
        missions: [
          {
            title: 'Interactive Color Button',
            description: 'Make a button that changes colors when clicked',
            instructions: 'Add JavaScript event listeners to create an interactive button!',
            order: 1,
            xpReward: 70,
            languages: ['html', 'css', 'js'],
            starterHtml: '<button id="colorBtn">Click Me!</button>\n<p id="message">Waiting for click...</p>',
            starterCss: '#colorBtn { padding: 12px 24px; background: #3b82f6; color: white; border-radius: 8px; border: 0; cursor: pointer; }',
            starterJs: '',
            steps: [
              {
                id: 1,
                title: 'Select Element',
                instruction: 'Select the button element with `document.getElementById("colorBtn")`.',
                target: 'js',
                expectedCode: 'const btn = document.getElementById("colorBtn");',
                hint: 'const btn = document.getElementById("colorBtn");',
                validation: 'getElementById',
                xp: 25,
                emoji: '🎯',
              },
            ],
          },
          {
            title: 'Dynamic Counter App',
            description: 'Build an interactive counter with Increment, Decrement, and Reset controls',
            instructions: 'Maintain a numeric count variable and update the DOM in real-time!',
            order: 2,
            xpReward: 85,
            languages: ['html', 'css', 'js'],
            starterHtml: '<div class="counter-box">\n  <h2 id="countDisplay">0</h2>\n  <button id="incBtn">+ Increase</button>\n  <button id="resetBtn">Reset</button>\n</div>',
            starterCss: '.counter-box { text-align: center; font-family: sans-serif; color: white; padding: 24px; background: #0f172a; border-radius: 12px; }\n#countDisplay { font-size: 48px; margin: 16px 0; color: #38bdf8; }\nbutton { margin: 4px; padding: 8px 16px; border-radius: 6px; border: none; background: #2563eb; color: white; cursor: pointer; font-weight: bold; }',
            starterJs: 'let count = 0;\nconst display = document.getElementById("countDisplay");\nconst incBtn = document.getElementById("incBtn");\n',
            steps: [
              {
                id: 1,
                title: 'Add Click Listener',
                instruction: 'Add a click event listener to `incBtn` that increments `count` and updates `display.textContent`.',
                target: 'js',
                expectedCode: 'incBtn.addEventListener("click", () => {\n  count++;\n  display.textContent = count;\n});',
                hint: 'incBtn.addEventListener("click", () => { count++; display.textContent = count; });',
                validation: 'addEventListener',
                xp: 45,
                emoji: '🔢',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Backend Development',
    description: 'Build robust APIs, cloud microservices, authentication pipelines, and relational database systems',
    icon: 'Server',
    color: 'from-emerald-500 to-teal-600',
    courses: [
      {
        name: 'RESTful API Engineering',
        description: 'Design production-ready RESTful endpoints and request pipelines',
        order: 1,
        missions: [
          {
            title: 'Build a REST Health & User Endpoint',
            description: 'Implement a structured JSON response handler with status codes and timestamp',
            instructions: 'Write a route handler function that formats a JSON payload with standard status codes!',
            order: 1,
            xpReward: 65,
            languages: ['js'],
            starterHtml: '<div style="font-family: monospace; padding: 20px; color: #34d399; background: #064e3b; border-radius: 8px;">Backend API Runner: Waiting for handler execution...</div>',
            starterCss: '',
            starterJs: '// Implement the handleRequest function\nfunction handleRequest(endpoint) {\n  if (endpoint === "/health") {\n    // Return JSON object with status: "ok" and timestamp\n  }\n}\n',
            steps: [
              {
                id: 1,
                title: 'Write Health Response',
                instruction: 'In `handleRequest`, return an object `{ status: "ok", uptime: 100, timestamp: Date.now() }` when endpoint is `"/health"`.',
                target: 'js',
                expectedCode: 'function handleRequest(endpoint) {\n  if (endpoint === "/health") {\n    return { status: "ok", uptime: 100, timestamp: Date.now() };\n  }\n}',
                hint: 'return { status: "ok", uptime: 100, timestamp: Date.now() };',
                validation: 'status: "ok"',
                xp: 30,
                emoji: '🩺',
              },
            ],
          },
          {
            title: 'JWT Authentication Middleware Guard',
            description: 'Write an auth guard that parses Bearer tokens and extracts user roles',
            instructions: 'Inspect incoming HTTP headers, verify Bearer presence, and throw 401 Unauthorized if missing!',
            order: 2,
            xpReward: 90,
            languages: ['js'],
            starterHtml: '<div style="font-family: monospace; padding: 20px; color: #a7f3d0; background: #134e4a; border-radius: 8px;">JWT Guard Middleware Simulator</div>',
            starterCss: '',
            starterJs: 'function authMiddleware(req) {\n  // 1. Extract Authorization header\n  // 2. Validate "Bearer " prefix\n  // 3. Return user payload or throw Error\n}\n',
            steps: [
              {
                id: 1,
                title: 'Validate Bearer Header',
                instruction: 'Check if `req.headers.authorization` starts with `"Bearer "`, slice the token, and return `{ authorized: true, token }`.',
                target: 'js',
                expectedCode: 'function authMiddleware(req) {\n  const header = req.headers?.authorization || "";\n  if (!header.startsWith("Bearer ")) {\n    throw new Error("Unauthorized: Bearer token required");\n  }\n  return { authorized: true, token: header.split(" ")[1] };\n}',
                hint: 'if (!header.startsWith("Bearer ")) throw new Error("Unauthorized");',
                validation: 'startsWith("Bearer ")',
                xp: 45,
                emoji: '🛡️',
              },
            ],
          },
        ],
      },
      {
        name: 'Databases & Query Logic',
        description: 'Master relational data queries, filtering, and schema relationships',
        order: 2,
        missions: [
          {
            title: 'SQL Product Query & Filter Engine',
            description: 'Construct structured database queries with price filtering and pagination',
            instructions: 'Build a query function that formats SQL parameterized queries safely!',
            order: 1,
            xpReward: 75,
            languages: ['js'],
            starterHtml: '<div style="font-family: monospace; padding: 20px; color: #93c5fd; background: #1e3a8a; border-radius: 8px;">SQL Query Visualizer</div>',
            starterCss: '',
            starterJs: 'function buildProductQuery(category, maxPrice) {\n  // Build parameterized SQL query string\n}\n',
            steps: [
              {
                id: 1,
                title: 'Construct Parameterized Query',
                instruction: 'Return `"SELECT * FROM products WHERE category = $1 AND price <= $2 ORDER BY price ASC"`.',
                target: 'js',
                expectedCode: 'function buildProductQuery(category, maxPrice) {\n  return "SELECT * FROM products WHERE category = $1 AND price <= $2 ORDER BY price ASC";\n}',
                hint: 'return "SELECT * FROM products WHERE category = $1 AND price <= $2 ORDER BY price ASC";',
                validation: 'SELECT * FROM products',
                xp: 35,
                emoji: '🗄️',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Full-Stack Development',
    description: 'Bridge client interfaces and cloud microservices into unified production web applications',
    icon: 'Layers',
    color: 'from-purple-500 to-pink-600',
    courses: [
      {
        name: 'Modern Full-Stack Architecture',
        description: 'Connect rich frontends to asynchronous API backends with reactive state',
        order: 1,
        missions: [
          {
            title: 'Interactive Kanban Task Board',
            description: 'Build a multi-column task management board with dynamic column movement',
            instructions: 'Render task cards, allow moving between "Todo" and "Done", and display real-time counts!',
            order: 1,
            xpReward: 85,
            languages: ['html', 'css', 'js'],
            starterHtml: '<div class="kanban">\n  <div class="col" id="todoCol"><h3>To Do (<span id="todoCount">1</span>)</h3><div class="task" id="task1">Build Auth API <button id="moveBtn">→</button></div></div>\n  <div class="col" id="doneCol"><h3>Done (<span id="doneCount">0</span>)</h3></div>\n</div>',
            starterCss: '.kanban { display: flex; gap: 16px; font-family: sans-serif; }\n.col { flex: 1; background: #1e1b4b; padding: 16px; border-radius: 12px; color: white; }\n.task { background: #312e81; padding: 12px; border-radius: 8px; margin-top: 8px; display: flex; justify-content: space-between; }',
            starterJs: 'const moveBtn = document.getElementById("moveBtn");\nconst task = document.getElementById("task1");\nconst doneCol = document.getElementById("doneCol");\n',
            steps: [
              {
                id: 1,
                title: 'Move Task Card',
                instruction: 'Add click event to `moveBtn` that appends `task` to `doneCol`.',
                target: 'js',
                expectedCode: 'moveBtn.addEventListener("click", () => {\n  doneCol.appendChild(task);\n  document.getElementById("todoCount").textContent = "0";\n  document.getElementById("doneCount").textContent = "1";\n});',
                hint: 'doneCol.appendChild(task);',
                validation: 'doneCol.appendChild',
                xp: 40,
                emoji: '📋',
              },
            ],
          },
          {
            title: 'Real-time Live Chat Component',
            description: 'Create an event-driven chat window that automatically renders incoming messages',
            instructions: 'Handle form submissions, create message bubble elements, and append them dynamically!',
            order: 2,
            xpReward: 90,
            languages: ['html', 'css', 'js'],
            starterHtml: '<div class="chat-app">\n  <div id="messages" class="messages"></div>\n  <form id="chatForm">\n    <input id="chatInput" placeholder="Type a message..." />\n    <button type="submit">Send</button>\n  </form>\n</div>',
            starterCss: '.chat-app { max-width: 400px; background: #0f172a; padding: 16px; border-radius: 12px; color: white; font-family: sans-serif; }\n.messages { min-height: 150px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px; }\n.msg { background: #3b82f6; padding: 8px 12px; border-radius: 8px; align-self: flex-end; }',
            starterJs: 'const form = document.getElementById("chatForm");\nconst input = document.getElementById("chatInput");\nconst messages = document.getElementById("messages");\n',
            steps: [
              {
                id: 1,
                title: 'Handle Send Message',
                instruction: 'Prevent default on `chatForm` submit, create a div with class `"msg"`, set text to `input.value`, and append to `messages`.',
                target: 'js',
                expectedCode: 'form.addEventListener("submit", (e) => {\n  e.preventDefault();\n  const div = document.createElement("div");\n  div.className = "msg";\n  div.textContent = input.value;\n  messages.appendChild(div);\n  input.value = "";\n});',
                hint: 'form.addEventListener("submit", (e) => { e.preventDefault(); ... });',
                validation: 'createElement("div")',
                xp: 45,
                emoji: '💬',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Mobile App Development',
    description: 'Design mobile-first interfaces, gesture-driven experiences, and touch-responsive mobile layouts',
    icon: 'Smartphone',
    color: 'from-amber-500 to-orange-600',
    courses: [
      {
        name: 'Mobile-First Layouts & Touch UI',
        description: 'Master compact device viewport design and thumb-friendly navigation patterns',
        order: 1,
        missions: [
          {
            title: 'Mobile Bottom Tab Navigator',
            description: 'Create a fixed bottom navigation bar with active icon states and notification badges',
            instructions: 'Style a bottom navigation bar that sticks to the bottom of mobile viewports with flex distribution!',
            order: 1,
            xpReward: 70,
            languages: ['html', 'css'],
            starterHtml: '<div class="mobile-screen">\n  <div class="content">Mobile Screen Viewport</div>\n  <nav class="bottom-nav">\n    <button class="nav-item active">🏠 Home</button>\n    <button class="nav-item">🔍 Explore</button>\n    <button class="nav-item">👤 Profile</button>\n  </nav>\n</div>',
            starterCss: '.mobile-screen { position: relative; width: 320px; height: 500px; background: #18181b; border-radius: 24px; border: 8px solid #27272a; overflow: hidden; font-family: sans-serif; color: white; }\n.content { padding: 20px; }',
            starterJs: '',
            steps: [
              {
                id: 1,
                title: 'Style Fixed Bottom Nav',
                instruction: 'In `.bottom-nav`, set `position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; background: #09090b; padding: 12px;`.',
                target: 'css',
                expectedCode: '.bottom-nav {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: flex;\n  justify-content: space-around;\n  background: #09090b;\n  padding: 12px;\n}',
                hint: 'position: absolute; bottom: 0; display: flex;',
                validation: 'position: absolute',
                xp: 35,
                emoji: '📱',
              },
            ],
          },
          {
            title: 'Swipeable Product Card Carousel',
            description: 'Build a mobile horizontal scroll-snap card list for touch scrolling',
            instructions: 'Use CSS scroll-snap-type and overflow-x to create a native-feeling mobile card carousel!',
            order: 2,
            xpReward: 80,
            languages: ['html', 'css'],
            starterHtml: '<div class="carousel">\n  <div class="card">Deal 1</div>\n  <div class="card">Deal 2</div>\n  <div class="card">Deal 3</div>\n</div>',
            starterCss: '.carousel {\n  width: 320px;\n}\n.card {\n  min-width: 260px;\n  height: 160px;\n  background: #c2410c;\n  color: white;\n  border-radius: 16px;\n  padding: 20px;\n  font-family: sans-serif;\n  font-weight: bold;\n}',
            starterJs: '',
            steps: [
              {
                id: 1,
                title: 'Add Scroll Snap',
                instruction: 'In `.carousel`, set `display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 16px;`.',
                target: 'css',
                expectedCode: '.carousel {\n  width: 320px;\n  display: flex;\n  gap: 16px;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n  padding: 16px;\n}',
                hint: 'display: flex; overflow-x: auto; scroll-snap-type: x mandatory;',
                validation: 'scroll-snap-type',
                xp: 40,
                emoji: '💳',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Python & AI Logic',
    description: 'Master data structures, automated analytical algorithms, and LLM prompt engineering pipelines',
    icon: 'Sparkles',
    color: 'from-rose-500 to-red-600',
    courses: [
      {
        name: 'Data Analysis & AI Orchestration',
        description: 'Write algorithmic functions that parse data streams and process AI responses',
        order: 1,
        missions: [
          {
            title: 'JSON Data Analyzer & Summary Aggregator',
            description: 'Write a data processing function that calculates averages and filters metrics',
            instructions: 'Process an array of student scores to calculate the average score and count passing grades!',
            order: 1,
            xpReward: 80,
            languages: ['js'],
            starterHtml: '<div style="font-family: monospace; padding: 20px; color: #f43f5e; background: #4c0519; border-radius: 8px;">AI Data Processing Engine</div>',
            starterCss: '',
            starterJs: 'function analyzeScores(scores) {\n  // scores: array of numbers [85, 92, 78, 64, 95]\n  // Return { average: number, passingCount: number }\n}\n',
            steps: [
              {
                id: 1,
                title: 'Calculate Average & Passing',
                instruction: 'Calculate average with `scores.reduce((a, b) => a + b, 0) / scores.length` and filter passing grades (>= 70).',
                target: 'js',
                expectedCode: 'function analyzeScores(scores) {\n  const total = scores.reduce((sum, val) => sum + val, 0);\n  const average = total / scores.length;\n  const passingCount = scores.filter(s => s >= 70).length;\n  return { average, passingCount };\n}',
                hint: 'const average = scores.reduce((a, b) => a + b, 0) / scores.length;',
                validation: 'reduce',
                xp: 40,
                emoji: '📊',
              },
            ],
          },
          {
            title: 'LLM Prompt & Structured JSON Parser',
            description: 'Build a sanitizer that extracts and parses JSON out of markdown AI response strings',
            instructions: 'Extract JSON code blocks surrounded by ```json ... ``` and return the parsed JavaScript object!',
            order: 2,
            xpReward: 95,
            languages: ['js'],
            starterHtml: '<div style="font-family: monospace; padding: 20px; color: #fda4af; background: #881337; border-radius: 8px;">LLM Response Parser Simulator</div>',
            starterCss: '',
            starterJs: 'function parseAiResponse(rawText) {\n  // Extract JSON string from inside ```json ... ``` or directly parse\n}\n',
            steps: [
              {
                id: 1,
                title: 'Extract & Parse JSON',
                instruction: 'Extract the text between ```json and ``` using regex or string manipulation, and return `JSON.parse(jsonString)`.',
                target: 'js',
                expectedCode: 'function parseAiResponse(rawText) {\n  const match = rawText.match(/```json([\\s\\S]*?)```/) || rawText.match(/```([\\s\\S]*?)```/);\n  const jsonStr = match ? match[1].trim() : rawText.trim();\n  return JSON.parse(jsonStr);\n}',
                hint: 'const jsonStr = match ? match[1].trim() : rawText.trim(); return JSON.parse(jsonStr);',
                validation: 'JSON.parse',
                xp: 50,
                emoji: '🤖',
              },
            ],
          },
        ],
      },
    ],
  },
];
