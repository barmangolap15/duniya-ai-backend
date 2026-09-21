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
    "name": "Frontend Web Development",
    "description": "Master the building blocks of the web: HTML, CSS, and JavaScript.",
    "icon": "Layout",
    "color": "from-blue-500 to-indigo-600",
    "courses": [
      {
        "name": "HTML Fundamentals",
        "description": "Learn the structure of web pages.",
        "order": 1,
        "missions": [
          {
            "title": "Build Your First Webpage",
            "description": "Learn HTML structure",
            "instructions": "Create a basic web page",
            "xpReward": 100,
            "order": 1,
            "languages": [
              "html"
            ],
            "starterHtml": "",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "The DOCTYPE",
                "instruction": "Start by defining the document type.",
                "target": "html",
                "expectedCode": "<!DOCTYPE html>\n<html>\n</html>",
                "hint": "Add <!DOCTYPE html>",
                "validation": "doctype html",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Main Heading",
                "instruction": "Add an h1 heading inside the html.",
                "target": "html",
                "expectedCode": "<!DOCTYPE html>\n<html>\n  <h1>Welcome</h1>\n</html>",
                "hint": "Add <h1>Welcome</h1>",
                "validation": "<h1>welcome</h1>",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Paragraph",
                "instruction": "Add a paragraph.",
                "target": "html",
                "expectedCode": "<!DOCTYPE html>\n<html>\n  <h1>Welcome</h1>\n  <p>My first webpage</p>\n</html>",
                "hint": "Add <p>My first webpage</p>",
                "validation": "<p>my first",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Image",
                "instruction": "Add an image.",
                "target": "html",
                "expectedCode": "<!DOCTYPE html>\n<html>\n  <h1>Welcome</h1>\n  <p>My first webpage</p>\n  <img src=\"logo.png\" />\n</html>",
                "hint": "Add <img src=\"logo.png\" />",
                "validation": "img src=",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Link",
                "instruction": "Add a link.",
                "target": "html",
                "expectedCode": "<!DOCTYPE html>\n<html>\n  <h1>Welcome</h1>\n  <p>My first webpage</p>\n  <img src=\"logo.png\" />\n  <a href=\"#\">Click me</a>\n</html>",
                "hint": "Add <a href=\"#\">Click me</a>",
                "validation": "a href=",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "List",
                "instruction": "Add a list.",
                "target": "html",
                "expectedCode": "<!DOCTYPE html>\n<html>\n  <h1>Welcome</h1>\n  <p>My first webpage</p>\n  <img src=\"logo.png\" />\n  <a href=\"#\">Click me</a>\n  <ul><li>Item 1</li></ul>\n</html>",
                "hint": "Add <ul><li>Item 1</li></ul>",
                "validation": "<ul><li>",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "Build a Registration Form",
            "description": "Create user input forms",
            "instructions": "Use input fields and buttons",
            "xpReward": 150,
            "order": 2,
            "languages": [
              "html"
            ],
            "starterHtml": "",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Form Tag",
                "instruction": "Create a form element.",
                "target": "html",
                "expectedCode": "<form>\n</form>",
                "hint": "Add <form></form>",
                "validation": "<form>",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Text Input",
                "instruction": "Add a text input for name.",
                "target": "html",
                "expectedCode": "<form>\n  <input type=\"text\" placeholder=\"Name\" />\n</form>",
                "hint": "Add <input type=\"text\" />",
                "validation": "type=\"text\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Email Input",
                "instruction": "Add an email input.",
                "target": "html",
                "expectedCode": "<form>\n  <input type=\"text\" placeholder=\"Name\" />\n  <input type=\"email\" placeholder=\"Email\" />\n</form>",
                "hint": "Add <input type=\"email\" />",
                "validation": "type=\"email\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Password Input",
                "instruction": "Add a password input.",
                "target": "html",
                "expectedCode": "<form>\n  <input type=\"text\" placeholder=\"Name\" />\n  <input type=\"email\" placeholder=\"Email\" />\n  <input type=\"password\" placeholder=\"Password\" />\n</form>",
                "hint": "Add <input type=\"password\" />",
                "validation": "type=\"password\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Select Dropdown",
                "instruction": "Add a select dropdown.",
                "target": "html",
                "expectedCode": "<form>\n  <input type=\"text\" placeholder=\"Name\" />\n  <input type=\"email\" placeholder=\"Email\" />\n  <input type=\"password\" placeholder=\"Password\" />\n  <select><option>Admin</option></select>\n</form>",
                "hint": "Add <select><option>...</option></select>",
                "validation": "<select><option>",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Submit Button",
                "instruction": "Add a submit button.",
                "target": "html",
                "expectedCode": "<form>\n  <input type=\"text\" placeholder=\"Name\" />\n  <input type=\"email\" placeholder=\"Email\" />\n  <input type=\"password\" placeholder=\"Password\" />\n  <select><option>Admin</option></select>\n  <button type=\"submit\">Register</button>\n</form>",
                "hint": "Add <button type=\"submit\">",
                "validation": "type=\"submit\"",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "Semantic HTML & Structure",
            "description": "Organize content logically",
            "instructions": "Use semantic tags",
            "xpReward": 100,
            "order": 3,
            "languages": [
              "html"
            ],
            "starterHtml": "",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Header",
                "instruction": "Add a header element.",
                "target": "html",
                "expectedCode": "<header></header>",
                "hint": "Add <header></header>",
                "validation": "<header>",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Nav",
                "instruction": "Add a nav element.",
                "target": "html",
                "expectedCode": "<header>\n  <nav></nav>\n</header>",
                "hint": "Add <nav></nav>",
                "validation": "<nav>",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Main",
                "instruction": "Add a main element.",
                "target": "html",
                "expectedCode": "<header>\n  <nav></nav>\n</header>\n<main></main>",
                "hint": "Add <main></main>",
                "validation": "<main>",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Section",
                "instruction": "Add a section element.",
                "target": "html",
                "expectedCode": "<header>\n  <nav></nav>\n</header>\n<main>\n  <section></section>\n</main>",
                "hint": "Add <section></section>",
                "validation": "<section>",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Footer",
                "instruction": "Add a footer element.",
                "target": "html",
                "expectedCode": "<header>\n  <nav></nav>\n</header>\n<main>\n  <section></section>\n</main>\n<footer></footer>",
                "hint": "Add <footer></footer>",
                "validation": "<footer>",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      },
      {
        "name": "CSS Styling & Layouts",
        "description": "Style and position elements.",
        "order": 2,
        "missions": [
          {
            "title": "Style a Profile Card",
            "description": "Learn CSS basics",
            "instructions": "Style a profile card",
            "xpReward": 150,
            "order": 1,
            "languages": [
              "css"
            ],
            "starterHtml": "<div class=\"card\"><img class=\"avatar\" src=\"avatar.jpg\" /><h2 class=\"name\">John Doe</h2><p class=\"bio\">Developer</p></div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Background & Border Radius",
                "instruction": "Style the card.",
                "target": "css",
                "expectedCode": ".card { background: white; border-radius: 8px; }",
                "hint": "Add .card { ... }",
                "validation": "border-radius:",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Typography",
                "instruction": "Style the name.",
                "target": "css",
                "expectedCode": ".card { background: white; border-radius: 8px; }\n.name { font-size: 24px; font-weight: bold; }",
                "hint": "Add .name { font-size: 24px; }",
                "validation": "font-size: 24px",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Avatar Styling",
                "instruction": "Style the avatar.",
                "target": "css",
                "expectedCode": ".avatar { width: 100px; height: 100px; border-radius: 50%; }",
                "hint": "Add .avatar { ... }",
                "validation": "border-radius: 50%",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Flexbox Layout",
                "instruction": "Center card contents.",
                "target": "css",
                "expectedCode": ".card { display: flex; flex-direction: column; align-items: center; }",
                "hint": "Add display: flex;",
                "validation": "display: flex",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Hover Effects",
                "instruction": "Add card hover effect.",
                "target": "css",
                "expectedCode": ".card:hover { transform: translateY(-5px); }",
                "hint": "Add .card:hover { ... }",
                "validation": "transform: translatey",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Box Shadow",
                "instruction": "Add shadow to card.",
                "target": "css",
                "expectedCode": ".card { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }",
                "hint": "Add box-shadow",
                "validation": "box-shadow:",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "Build a Responsive Navigation Bar",
            "description": "Learn Flexbox",
            "instructions": "Style a navbar",
            "xpReward": 150,
            "order": 2,
            "languages": [
              "css"
            ],
            "starterHtml": "<nav class=\"navbar\"><div class=\"logo\">Logo</div><ul class=\"nav-links\"><li><a href=\"#\">Home</a></li></ul></nav>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Flex Container",
                "instruction": "Make navbar flex.",
                "target": "css",
                "expectedCode": ".navbar { display: flex; justify-content: space-between; }",
                "hint": "Add .navbar { ... }",
                "validation": "justify-content:",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Logo Styling",
                "instruction": "Style the logo.",
                "target": "css",
                "expectedCode": ".logo { font-size: 2rem; font-weight: bold; }",
                "hint": "Add .logo { ... }",
                "validation": "font-size: 2rem",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Nav Links",
                "instruction": "Style nav links list.",
                "target": "css",
                "expectedCode": ".nav-links { display: flex; list-style: none; gap: 20px; }",
                "hint": "Add gap: 20px;",
                "validation": "gap: 20px",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Active States",
                "instruction": "Style link hover state.",
                "target": "css",
                "expectedCode": ".nav-links a:hover { color: blue; }",
                "hint": "Add :hover",
                "validation": "a:hover",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Mobile Responsive",
                "instruction": "Add media query.",
                "target": "css",
                "expectedCode": "@media (max-width: 768px) { .nav-links { display: none; } }",
                "hint": "Add @media",
                "validation": "@media",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Hamburger Concept",
                "instruction": "Style a hamburger icon.",
                "target": "css",
                "expectedCode": ".hamburger { display: block; cursor: pointer; }",
                "hint": "Add .hamburger { ... }",
                "validation": "cursor: pointer",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "CSS Grid Photo Gallery",
            "description": "Learn CSS Grid",
            "instructions": "Style a gallery",
            "xpReward": 150,
            "order": 3,
            "languages": [
              "css"
            ],
            "starterHtml": "<div class=\"gallery\"><div class=\"item\">1</div><div class=\"item\">2</div></div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Grid Container",
                "instruction": "Make gallery grid.",
                "target": "css",
                "expectedCode": ".gallery { display: grid; }",
                "hint": "Add display: grid;",
                "validation": "display: grid",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Grid Template Columns",
                "instruction": "Set columns.",
                "target": "css",
                "expectedCode": ".gallery { display: grid; grid-template-columns: repeat(3, 1fr); }",
                "hint": "Add grid-template-columns",
                "validation": "repeat(3,",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Gap",
                "instruction": "Add grid gap.",
                "target": "css",
                "expectedCode": ".gallery { gap: 16px; }",
                "hint": "Add gap",
                "validation": "gap: 16px",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Hover Zoom Effect",
                "instruction": "Zoom on hover.",
                "target": "css",
                "expectedCode": ".item:hover { transform: scale(1.1); }",
                "hint": "Add scale(1.1)",
                "validation": "scale(1.1)",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Responsive Media Query",
                "instruction": "Make grid responsive.",
                "target": "css",
                "expectedCode": "@media (max-width: 600px) { .gallery { grid-template-columns: 1fr; } }",
                "hint": "Add responsive query",
                "validation": "1fr",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      },
      {
        "name": "Interactive JavaScript",
        "description": "Add logic to pages.",
        "order": 3,
        "missions": [
          {
            "title": "Build a Todo List App",
            "description": "Learn DOM manipulation",
            "instructions": "Create a functional todo list",
            "xpReward": 200,
            "order": 1,
            "languages": [
              "js"
            ],
            "starterHtml": "<input id=\"todo-input\" /><button id=\"add-btn\">Add</button><ul id=\"todo-list\"></ul><button id=\"clear-btn\">Clear</button>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Select Elements",
                "instruction": "Select the input and button.",
                "target": "js",
                "expectedCode": "const input = document.getElementById(\"todo-input\");\nconst btn = document.getElementById(\"add-btn\");",
                "hint": "Use getElementById",
                "validation": "getelementbyid",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Add Item Function",
                "instruction": "Create click handler.",
                "target": "js",
                "expectedCode": "btn.addEventListener(\"click\", () => { });",
                "hint": "Use addEventListener",
                "validation": "addeventlistener",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Create LI Element",
                "instruction": "Create a new li.",
                "target": "js",
                "expectedCode": "const li = document.createElement(\"li\");\nli.textContent = input.value;",
                "hint": "Use createElement",
                "validation": "createelement(\"li\")",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Append to List",
                "instruction": "Append li to list.",
                "target": "js",
                "expectedCode": "document.getElementById(\"todo-list\").appendChild(li);",
                "hint": "Use appendChild",
                "validation": "appendchild",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Delete Button",
                "instruction": "Add delete button to li.",
                "target": "js",
                "expectedCode": "const delBtn = document.createElement(\"button\");\ndelBtn.textContent = \"Delete\";\nli.appendChild(delBtn);",
                "hint": "Create delete button",
                "validation": "delbtn.textcontent",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Toggle Complete",
                "instruction": "Click li to toggle class.",
                "target": "js",
                "expectedCode": "li.addEventListener(\"click\", () => li.classList.toggle(\"completed\"));",
                "hint": "Use classList.toggle",
                "validation": "classlist.toggle",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 7,
                "title": "Clear All",
                "instruction": "Clear list on click.",
                "target": "js",
                "expectedCode": "document.getElementById(\"clear-btn\").addEventListener(\"click\", () => {\n  document.getElementById(\"todo-list\").innerHTML = \"\";\n});",
                "hint": "Set innerHTML to \"\"",
                "validation": "innerhtml = \"\"",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "Dynamic Counter with Color Themes",
            "description": "Learn state management",
            "instructions": "Create a counter app",
            "xpReward": 150,
            "order": 2,
            "languages": [
              "js"
            ],
            "starterHtml": "<h1 id=\"count\">0</h1><button id=\"inc\">Inc</button><button id=\"dec\">Dec</button><button id=\"reset\">Reset</button>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Select Elements",
                "instruction": "Select buttons and count.",
                "target": "js",
                "expectedCode": "const countEl = document.getElementById(\"count\");",
                "hint": "Select count element",
                "validation": "getelementbyid(\"count\")",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Increment",
                "instruction": "Handle increment.",
                "target": "js",
                "expectedCode": "let count = 0;\ndocument.getElementById(\"inc\").addEventListener(\"click\", () => {\n  count++;\n  countEl.textContent = count;\n});",
                "hint": "Increment count",
                "validation": "count++",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Decrement",
                "instruction": "Handle decrement.",
                "target": "js",
                "expectedCode": "document.getElementById(\"dec\").addEventListener(\"click\", () => {\n  count--;\n  countEl.textContent = count;\n});",
                "hint": "Decrement count",
                "validation": "count--",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Reset",
                "instruction": "Handle reset.",
                "target": "js",
                "expectedCode": "document.getElementById(\"reset\").addEventListener(\"click\", () => {\n  count = 0;\n  countEl.textContent = count;\n});",
                "hint": "Reset count",
                "validation": "count = 0",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Change Color",
                "instruction": "Update color based on value.",
                "target": "js",
                "expectedCode": "if(count > 0) countEl.style.color = \"green\";\nelse if(count < 0) countEl.style.color = \"red\";\nelse countEl.style.color = \"black\";",
                "hint": "Change style.color",
                "validation": "style.color",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Add Keyboard Support",
                "instruction": "Handle arrow keys.",
                "target": "js",
                "expectedCode": "document.addEventListener(\"keydown\", (e) => {\n  if(e.key === \"ArrowUp\") count++;\n  if(e.key === \"ArrowDown\") count--;\n});",
                "hint": "Listen for keydown",
                "validation": "keydown",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "Backend Development",
    "description": "Build robust server-side logic and databases.",
    "icon": "Server",
    "color": "from-emerald-500 to-teal-600",
    "courses": [
      {
        "name": "RESTful API Engineering",
        "description": "Create reliable APIs.",
        "order": 1,
        "missions": [
          {
            "title": "Build a REST API Router",
            "description": "Learn routing basics",
            "instructions": "Handle HTTP requests",
            "xpReward": 200,
            "order": 1,
            "languages": [
              "js"
            ],
            "starterHtml": "<div id=\"console\" style=\"background: #1e1e1e; color: #fff; padding: 15px; font-family: monospace; height: 100vh; overflow-y: auto;\">\n  <div>> Welcome to Backend CLI</div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Route Handler",
                "instruction": "Create a route function.",
                "target": "js",
                "expectedCode": "function handleRequest(method, path) {\n}",
                "hint": "Create a function handleRequest",
                "validation": "function handlerequest",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "GET Endpoint",
                "instruction": "Handle GET /users.",
                "target": "js",
                "expectedCode": "if (method === \"GET\" && path === \"/users\") {\n  return { users: [] };\n}",
                "hint": "Check method and path",
                "validation": "method === \"get\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "POST Endpoint",
                "instruction": "Handle POST /users.",
                "target": "js",
                "expectedCode": "if (method === \"POST\" && path === \"/users\") {\n  return { success: true };\n}",
                "hint": "Check for POST",
                "validation": "method === \"post\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Error Handling",
                "instruction": "Return 404 for unknown.",
                "target": "js",
                "expectedCode": "return { status: 404, message: \"Not found\" };",
                "hint": "Return 404",
                "validation": "status: 404",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Status Codes",
                "instruction": "Add 200 status code.",
                "target": "js",
                "expectedCode": "return { status: 200, users: [] };",
                "hint": "Return 200",
                "validation": "status: 200",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Response Formatting",
                "instruction": "Format response object.",
                "target": "js",
                "expectedCode": "return JSON.stringify({ status: 200, users: [] });",
                "hint": "Use JSON.stringify",
                "validation": "json.stringify",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "JWT Authentication System",
            "description": "Learn secure auth",
            "instructions": "Handle JWTs",
            "xpReward": 200,
            "order": 2,
            "languages": [
              "js"
            ],
            "starterHtml": "<div id=\"console\" style=\"background: #1e1e1e; color: #fff; padding: 15px; font-family: monospace; height: 100vh; overflow-y: auto;\">\n  <div>> Welcome to Backend CLI</div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Parse Headers",
                "instruction": "Extract auth header.",
                "target": "js",
                "expectedCode": "const authHeader = req.headers[\"authorization\"];",
                "hint": "Get authorization header",
                "validation": "headers[\"authorization\"]",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Validate Bearer",
                "instruction": "Check Bearer prefix.",
                "target": "js",
                "expectedCode": "if (!authHeader.startsWith(\"Bearer \")) return false;",
                "hint": "Use startsWith",
                "validation": "startswith(\"bearer",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Decode Token",
                "instruction": "Split to get token.",
                "target": "js",
                "expectedCode": "const token = authHeader.split(\" \")[1];",
                "hint": "Use split",
                "validation": "split(\" \")[1]",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Verify Expiry",
                "instruction": "Check if token expired.",
                "target": "js",
                "expectedCode": "if (token.exp < Date.now()) return false;",
                "hint": "Check expiration",
                "validation": "token.exp <",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Extract Payload",
                "instruction": "Return payload.",
                "target": "js",
                "expectedCode": "const payload = JSON.parse(atob(token.payload));",
                "hint": "Decode base64 payload",
                "validation": "atob",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Middleware Chain",
                "instruction": "Call next function.",
                "target": "js",
                "expectedCode": "if (valid) next(); else throw new Error(\"Unauthorized\");",
                "hint": "Call next()",
                "validation": "next()",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      },
      {
        "name": "Database & Query Logic",
        "description": "Interact with data.",
        "order": 2,
        "missions": [
          {
            "title": "SQL Query Builder",
            "description": "Construct SQL dynamically",
            "instructions": "Build SQL strings",
            "xpReward": 200,
            "order": 1,
            "languages": [
              "js"
            ],
            "starterHtml": "<div id=\"console\" style=\"background: #1e1e1e; color: #fff; padding: 15px; font-family: monospace; height: 100vh; overflow-y: auto;\">\n  <div>> Welcome to Backend CLI</div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "SELECT",
                "instruction": "Build select clause.",
                "target": "js",
                "expectedCode": "let query = `SELECT ${fields.join(\", \")} FROM ${table}`;",
                "hint": "Join fields",
                "validation": "select ${",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "WHERE",
                "instruction": "Add where clause.",
                "target": "js",
                "expectedCode": "if (conditions) query += ` WHERE ${conditions}`;",
                "hint": "Append WHERE",
                "validation": "where ${",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "JOIN",
                "instruction": "Add join clause.",
                "target": "js",
                "expectedCode": "query += ` JOIN ${joinTable} ON ${joinCondition}`;",
                "hint": "Append JOIN",
                "validation": "join ${",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "ORDER BY",
                "instruction": "Add order by.",
                "target": "js",
                "expectedCode": "query += ` ORDER BY ${sortColumn} ${sortOrder}`;",
                "hint": "Append ORDER BY",
                "validation": "order by ${",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "LIMIT",
                "instruction": "Add limit.",
                "target": "js",
                "expectedCode": "query += ` LIMIT ${limit}`;",
                "hint": "Append LIMIT",
                "validation": "limit ${",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Aggregate Functions",
                "instruction": "Use COUNT.",
                "target": "js",
                "expectedCode": "const countQuery = `SELECT COUNT(*) FROM ${table}`;",
                "hint": "SELECT COUNT(*)",
                "validation": "count(*)",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "Data Validation & Sanitization",
            "description": "Secure inputs",
            "instructions": "Validate data",
            "xpReward": 200,
            "order": 2,
            "languages": [
              "js"
            ],
            "starterHtml": "<div id=\"console\" style=\"background: #1e1e1e; color: #fff; padding: 15px; font-family: monospace; height: 100vh; overflow-y: auto;\">\n  <div>> Welcome to Backend CLI</div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Email Validation",
                "instruction": "Check email regex.",
                "target": "js",
                "expectedCode": "const isValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);",
                "hint": "Regex test",
                "validation": ".test(email)",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Password Strength",
                "instruction": "Check length.",
                "target": "js",
                "expectedCode": "if (password.length < 8) return false;",
                "hint": "Check length >= 8",
                "validation": "length < 8",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "XSS Sanitization",
                "instruction": "Replace angle brackets.",
                "target": "js",
                "expectedCode": "const safe = input.replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\");",
                "hint": "Replace < and >",
                "validation": "&lt;",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Input Trimming",
                "instruction": "Trim whitespace.",
                "target": "js",
                "expectedCode": "const trimmed = input.trim();",
                "hint": "Use trim()",
                "validation": ".trim()",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Error Messages",
                "instruction": "Return structured errors.",
                "target": "js",
                "expectedCode": "return { valid: false, errors: [\"Too short\"] };",
                "hint": "Return errors array",
                "validation": "errors: [",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "Full-Stack Development",
    "description": "Connect the frontend and backend.",
    "icon": "Layers",
    "color": "from-purple-500 to-pink-600",
    "courses": [
      {
        "name": "Full-Stack Architecture",
        "description": "Build complete features.",
        "order": 1,
        "missions": [
          {
            "title": "Build a Contact Form with Validation",
            "description": "Full-stack forms",
            "instructions": "Handle forms end-to-end",
            "xpReward": 200,
            "order": 1,
            "languages": [
              "html",
              "js"
            ],
            "starterHtml": "<form id=\"contact\"><input id=\"name\"/><input id=\"email\"/><textarea id=\"msg\"></textarea><button>Send</button></form><div id=\"error\"></div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "HTML Form",
                "instruction": "Verify form exists.",
                "target": "html",
                "expectedCode": "<form id=\"contact\">",
                "hint": "Check form tag",
                "validation": "id=\"contact\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "CSS Styling",
                "instruction": "Style the form.",
                "target": "css",
                "expectedCode": "form { display: flex; flex-direction: column; }",
                "hint": "Use flexbox",
                "validation": "flex-direction: column",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Name Validation",
                "instruction": "Check name JS.",
                "target": "js",
                "expectedCode": "const name = document.getElementById(\"name\").value;\nif (!name) showError(\"Name required\");",
                "hint": "Validate name",
                "validation": "!name",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Email Validation",
                "instruction": "Check email JS.",
                "target": "js",
                "expectedCode": "if (!email.includes(\"@\")) showError(\"Invalid email\");",
                "hint": "Validate email",
                "validation": "includes(\"@\")",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Message Validation",
                "instruction": "Check msg JS.",
                "target": "js",
                "expectedCode": "if (msg.length < 10) showError(\"Message too short\");",
                "hint": "Validate msg",
                "validation": "length < 10",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Error Display",
                "instruction": "Show error div.",
                "target": "js",
                "expectedCode": "document.getElementById(\"error\").textContent = errMsg;",
                "hint": "Set error text",
                "validation": "error\").textcontent",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 7,
                "title": "Success State",
                "instruction": "Show success.",
                "target": "js",
                "expectedCode": "document.getElementById(\"contact\").innerHTML = \"Thank you!\";",
                "hint": "Set success message",
                "validation": "thank you",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "Interactive Kanban Task Board",
            "description": "Drag and drop logic",
            "instructions": "Build a Kanban board",
            "xpReward": 200,
            "order": 2,
            "languages": [
              "html",
              "css",
              "js"
            ],
            "starterHtml": "<div id=\"board\"><div class=\"col\" id=\"todo\"></div><div class=\"col\" id=\"done\"></div></div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Board Layout HTML",
                "instruction": "Add a column.",
                "target": "html",
                "expectedCode": "<div class=\"col\" id=\"in-progress\"></div>",
                "hint": "Add in-progress col",
                "validation": "id=\"in-progress\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Column Styling CSS",
                "instruction": "Style columns.",
                "target": "css",
                "expectedCode": ".col { min-height: 200px; background: #eee; padding: 10px; }",
                "hint": "Style .col",
                "validation": "min-height:",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Add Task JS",
                "instruction": "Create task element.",
                "target": "js",
                "expectedCode": "const task = document.createElement(\"div\");\ntask.className = \"task\";",
                "hint": "Create div for task",
                "validation": "classname = \"task\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Move Task",
                "instruction": "Move between cols.",
                "target": "js",
                "expectedCode": "document.getElementById(\"done\").appendChild(task);",
                "hint": "Append to done",
                "validation": "appendchild(task)",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Delete Task",
                "instruction": "Remove a task.",
                "target": "js",
                "expectedCode": "task.remove();",
                "hint": "Call remove()",
                "validation": "task.remove()",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Task Counter",
                "instruction": "Update count.",
                "target": "js",
                "expectedCode": "let count = document.querySelectorAll(\".task\").length;",
                "hint": "Count .task elements",
                "validation": "queryselectorall(\".task\")",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      },
      {
        "name": "API Integration & State",
        "description": "Manage data flow.",
        "order": 2,
        "missions": [
          {
            "title": "Real-time Chat Interface",
            "description": "Handle real-time updates",
            "instructions": "Build a chat UI",
            "xpReward": 200,
            "order": 1,
            "languages": [
              "html",
              "js"
            ],
            "starterHtml": "<div id=\"chat\"></div><input id=\"msg-input\"/><button id=\"send\">Send</button>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Chat HTML",
                "instruction": "Structure chat.",
                "target": "html",
                "expectedCode": "<div id=\"chat-messages\"></div>",
                "hint": "Add messages container",
                "validation": "id=\"chat-messages\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Message Styling CSS",
                "instruction": "Style messages.",
                "target": "css",
                "expectedCode": ".msg { padding: 10px; border-radius: 10px; }",
                "hint": "Style .msg",
                "validation": "border-radius:",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Send Message JS",
                "instruction": "Append message.",
                "target": "js",
                "expectedCode": "chat.innerHTML += `<div class=\"msg\">${input.value}</div>`;",
                "hint": "Append to chat",
                "validation": "innerHTML += ",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Auto-scroll",
                "instruction": "Scroll to bottom.",
                "target": "js",
                "expectedCode": "chat.scrollTop = chat.scrollHeight;",
                "hint": "Update scrollTop",
                "validation": "scrolltop =",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Timestamps",
                "instruction": "Add time.",
                "target": "js",
                "expectedCode": "const time = new Date().toLocaleTimeString();",
                "hint": "Use Date()",
                "validation": "tolocaletimestring()",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Clear Chat",
                "instruction": "Clear all.",
                "target": "js",
                "expectedCode": "chat.innerHTML = \"\";",
                "hint": "Clear innerHTML",
                "validation": "innerHTML = \"\"",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "User Dashboard with Charts",
            "description": "Display complex data",
            "instructions": "Build a dashboard",
            "xpReward": 200,
            "order": 2,
            "languages": [
              "html",
              "css"
            ],
            "starterHtml": "<div class=\"dashboard\"></div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Dashboard Layout",
                "instruction": "Use grid layout.",
                "target": "css",
                "expectedCode": ".dashboard { display: grid; grid-template-columns: 1fr 1fr; }",
                "hint": "Grid layout",
                "validation": "display: grid",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Stat Cards",
                "instruction": "Style cards.",
                "target": "css",
                "expectedCode": ".card { padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }",
                "hint": "Style .card",
                "validation": "padding: 20px",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Progress Bar",
                "instruction": "Style progress.",
                "target": "css",
                "expectedCode": ".progress { width: 50%; background: blue; height: 10px; }",
                "hint": "Style .progress",
                "validation": "width: 50%",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Data Rendering",
                "instruction": "Set text.",
                "target": "js",
                "expectedCode": "document.getElementById(\"users\").textContent = \"1,024\";",
                "hint": "Update users count",
                "validation": "1,024",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Responsive Grid",
                "instruction": "Mobile query.",
                "target": "css",
                "expectedCode": "@media (max-width: 600px) { .dashboard { grid-template-columns: 1fr; } }",
                "hint": "Media query",
                "validation": "1fr",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "Mobile App Development",
    "description": "Create beautiful mobile experiences.",
    "icon": "Smartphone",
    "color": "from-amber-500 to-orange-600",
    "courses": [
      {
        "name": "Mobile-First UI Design",
        "description": "Design for small screens.",
        "order": 1,
        "missions": [
          {
            "title": "Mobile Bottom Tab Navigator",
            "description": "Build mobile nav",
            "instructions": "Create a tab bar",
            "xpReward": 200,
            "order": 1,
            "languages": [
              "html",
              "css"
            ],
            "starterHtml": "<div class=\"device\" style=\"width:375px; height:812px; border: 16px solid #333; border-radius: 36px; margin: 20px auto; overflow: hidden; background: #fff; position: relative;\">\n  <div class=\"screen\" style=\"height: 100%; width: 100%; display: flex; flex-direction: column;\">\n    <div id=\"app\"></div>\n  </div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Mobile Frame",
                "instruction": "Add frame CSS.",
                "target": "css",
                "expectedCode": ".device { width: 375px; height: 812px; }",
                "hint": "Set device size",
                "validation": "375px",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Bottom Nav Bar",
                "instruction": "Style tab bar.",
                "target": "css",
                "expectedCode": ".tab-bar { position: absolute; bottom: 0; width: 100%; display: flex; }",
                "hint": "Position bottom",
                "validation": "bottom: 0",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Tab Icons",
                "instruction": "Style icons.",
                "target": "css",
                "expectedCode": ".tab-icon { flex: 1; text-align: center; padding: 10px 0; }",
                "hint": "Flex 1 icons",
                "validation": "flex: 1",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Active State",
                "instruction": "Style active tab.",
                "target": "css",
                "expectedCode": ".tab-icon.active { color: blue; }",
                "hint": "Style .active",
                "validation": ".active {",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Badge Notification",
                "instruction": "Add badge.",
                "target": "css",
                "expectedCode": ".badge { background: red; border-radius: 50%; width: 10px; height: 10px; }",
                "hint": "Style .badge",
                "validation": "background: red",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Screen Content Areas",
                "instruction": "Style content.",
                "target": "css",
                "expectedCode": ".content { flex: 1; overflow-y: auto; }",
                "hint": "Flex 1 content",
                "validation": "overflow-y:",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "Swipeable Card Carousel",
            "description": "Touch gestures",
            "instructions": "Build a carousel",
            "xpReward": 200,
            "order": 2,
            "languages": [
              "css"
            ],
            "starterHtml": "<div class=\"device\" style=\"width:375px; height:812px; border: 16px solid #333; border-radius: 36px; margin: 20px auto; overflow: hidden; background: #fff; position: relative;\">\n  <div class=\"screen\" style=\"height: 100%; width: 100%; display: flex; flex-direction: column;\">\n    <div id=\"app\"></div>\n  </div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Carousel Container",
                "instruction": "Add flex overflow.",
                "target": "css",
                "expectedCode": ".carousel { display: flex; overflow-x: auto; }",
                "hint": "overflow-x: auto",
                "validation": "overflow-x: auto",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Card Styling",
                "instruction": "Style cards.",
                "target": "css",
                "expectedCode": ".card { min-width: 300px; margin-right: 16px; }",
                "hint": "Set min-width",
                "validation": "min-width:",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Scroll Snap",
                "instruction": "Add scroll snapping.",
                "target": "css",
                "expectedCode": ".carousel { scroll-snap-type: x mandatory; }\n.card { scroll-snap-align: center; }",
                "hint": "Use scroll-snap",
                "validation": "scroll-snap-type",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Dots Indicator",
                "instruction": "Style dots.",
                "target": "css",
                "expectedCode": ".dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; }",
                "hint": "Style .dot",
                "validation": "border-radius: 50%",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Auto-hide Scrollbar",
                "instruction": "Hide scrollbar.",
                "target": "css",
                "expectedCode": ".carousel::-webkit-scrollbar { display: none; }",
                "hint": "Hide scrollbar",
                "validation": "::-webkit-scrollbar",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      },
      {
        "name": "Mobile Interactions",
        "description": "Add touch logic.",
        "order": 2,
        "missions": [
          {
            "title": "Pull-to-Refresh Feed",
            "description": "Touch events",
            "instructions": "Implement PTR",
            "xpReward": 200,
            "order": 1,
            "languages": [
              "js"
            ],
            "starterHtml": "<div class=\"device\" style=\"width:375px; height:812px; border: 16px solid #333; border-radius: 36px; margin: 20px auto; overflow: hidden; background: #fff; position: relative;\">\n  <div class=\"screen\" style=\"height: 100%; width: 100%; display: flex; flex-direction: column;\">\n    <div id=\"app\"></div>\n  </div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Feed Layout",
                "instruction": "Structure feed.",
                "target": "html",
                "expectedCode": "<div id=\"feed\"></div>",
                "hint": "Add feed div",
                "validation": "id=\"feed\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Feed Item Styling",
                "instruction": "Style items.",
                "target": "css",
                "expectedCode": ".feed-item { padding: 15px; border-bottom: 1px solid #eee; }",
                "hint": "Style .feed-item",
                "validation": "border-bottom:",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Loading Spinner",
                "instruction": "Add spinner.",
                "target": "html",
                "expectedCode": "<div id=\"spinner\" style=\"display:none;\">Loading...</div>",
                "hint": "Add spinner div",
                "validation": "id=\"spinner\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Refresh Handler",
                "instruction": "Listen to touch.",
                "target": "js",
                "expectedCode": "document.addEventListener(\"touchstart\", (e) => { startY = e.touches[0].clientY; });",
                "hint": "Handle touchstart",
                "validation": "touchstart",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Dynamic Content",
                "instruction": "Add new items.",
                "target": "js",
                "expectedCode": "feed.insertAdjacentHTML(\"afterbegin\", \"<div class='feed-item'>New Post</div>\");",
                "hint": "Insert new item",
                "validation": "insertadjacenthtml",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Animation",
                "instruction": "Animate spinner.",
                "target": "css",
                "expectedCode": "@keyframes spin { 100% { transform: rotate(360deg); } }",
                "hint": "Add keyframes",
                "validation": "@keyframes",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "Mobile Settings Screen",
            "description": "Build settings UI",
            "instructions": "Create settings",
            "xpReward": 200,
            "order": 2,
            "languages": [
              "html",
              "css"
            ],
            "starterHtml": "<div class=\"device\" style=\"width:375px; height:812px; border: 16px solid #333; border-radius: 36px; margin: 20px auto; overflow: hidden; background: #fff; position: relative;\">\n  <div class=\"screen\" style=\"height: 100%; width: 100%; display: flex; flex-direction: column;\">\n    <div id=\"app\"></div>\n  </div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Settings Layout",
                "instruction": "List structure.",
                "target": "css",
                "expectedCode": ".settings-list { list-style: none; padding: 0; }",
                "hint": "Style list",
                "validation": "list-style: none",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Toggle Switches",
                "instruction": "Style switch.",
                "target": "css",
                "expectedCode": ".switch { width: 40px; height: 20px; background: #ccc; border-radius: 10px; }",
                "hint": "Style .switch",
                "validation": "width: 40px",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Grouped Sections",
                "instruction": "Style groups.",
                "target": "css",
                "expectedCode": ".section { margin-bottom: 20px; background: white; }",
                "hint": "Style .section",
                "validation": "margin-bottom: 20px",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Icons",
                "instruction": "Style left icon.",
                "target": "css",
                "expectedCode": ".icon { width: 24px; height: 24px; margin-right: 10px; }",
                "hint": "Style .icon",
                "validation": "width: 24px",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Dark Theme",
                "instruction": "Add dark mode.",
                "target": "css",
                "expectedCode": "body.dark { background: #000; color: #fff; }",
                "hint": "Style .dark",
                "validation": "body.dark",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "Python & AI Logic",
    "description": "Learn data processing and AI concepts.",
    "icon": "Sparkles",
    "color": "from-rose-500 to-red-600",
    "courses": [
      {
        "name": "Algorithms & Data Processing",
        "description": "Transform data.",
        "order": 1,
        "missions": [
          {
            "title": "Array Operations & Sorting",
            "description": "Functional programming",
            "instructions": "Process arrays",
            "xpReward": 200,
            "order": 1,
            "languages": [
              "js"
            ],
            "starterHtml": "<div id=\"console\" style=\"background: #1e1e1e; color: #fff; padding: 15px; font-family: monospace; height: 100vh; overflow-y: auto;\">\n  <div>> Welcome to Backend CLI</div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Filter",
                "instruction": "Filter even numbers.",
                "target": "js",
                "expectedCode": "const evens = arr.filter(n => n % 2 === 0);",
                "hint": "Use filter",
                "validation": ".filter(",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Map",
                "instruction": "Double numbers.",
                "target": "js",
                "expectedCode": "const doubled = arr.map(n => n * 2);",
                "hint": "Use map",
                "validation": ".map(",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Reduce",
                "instruction": "Sum numbers.",
                "target": "js",
                "expectedCode": "const sum = arr.reduce((acc, n) => acc + n, 0);",
                "hint": "Use reduce",
                "validation": ".reduce(",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Sort",
                "instruction": "Sort ascending.",
                "target": "js",
                "expectedCode": "const sorted = arr.sort((a, b) => a - b);",
                "hint": "Use sort",
                "validation": ".sort(",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Find",
                "instruction": "Find first > 10.",
                "target": "js",
                "expectedCode": "const big = arr.find(n => n > 10);",
                "hint": "Use find",
                "validation": ".find(",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Custom Comparator",
                "instruction": "Sort by length.",
                "target": "js",
                "expectedCode": "const sortedStrs = strs.sort((a, b) => a.length - b.length);",
                "hint": "Sort by length",
                "validation": "length -",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "Data Pipeline Builder",
            "description": "Chained operations",
            "instructions": "Build a pipeline",
            "xpReward": 200,
            "order": 2,
            "languages": [
              "js"
            ],
            "starterHtml": "<div id=\"console\" style=\"background: #1e1e1e; color: #fff; padding: 15px; font-family: monospace; height: 100vh; overflow-y: auto;\">\n  <div>> Welcome to Backend CLI</div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Parse CSV",
                "instruction": "Split string.",
                "target": "js",
                "expectedCode": "const rows = csv.split(\"\\n\").map(r => r.split(\",\"));",
                "hint": "Split by newline",
                "validation": "split(\"\\n\")",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Transform Data",
                "instruction": "Map objects.",
                "target": "js",
                "expectedCode": "const data = rows.map(r => ({ id: r[0], val: Number(r[1]) }));",
                "hint": "Map to objects",
                "validation": "number(",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Calculate Stats",
                "instruction": "Get average.",
                "target": "js",
                "expectedCode": "const avg = data.reduce((sum, d) => sum + d.val, 0) / data.length;",
                "hint": "Calculate average",
                "validation": "/ data.length",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Filter Outliers",
                "instruction": "Remove large vals.",
                "target": "js",
                "expectedCode": "const filtered = data.filter(d => d.val < 100);",
                "hint": "Filter < 100",
                "validation": "< 100",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Format Output",
                "instruction": "JSON output.",
                "target": "js",
                "expectedCode": "const out = JSON.stringify(filtered, null, 2);",
                "hint": "Stringify with spacing",
                "validation": "null, 2",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      },
      {
        "name": "AI & Prompt Engineering",
        "description": "Work with AI models.",
        "order": 2,
        "missions": [
          {
            "title": "JSON Response Parser",
            "description": "Handle AI outputs",
            "instructions": "Parse LLM JSON",
            "xpReward": 200,
            "order": 1,
            "languages": [
              "js"
            ],
            "starterHtml": "<div id=\"console\" style=\"background: #1e1e1e; color: #fff; padding: 15px; font-family: monospace; height: 100vh; overflow-y: auto;\">\n  <div>> Welcome to Backend CLI</div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Extract JSON from Markdown",
                "instruction": "Find backticks.",
                "target": "js",
                "expectedCode": "const jsonStr = md.match(/```json\\n([\\s\\S]*?)\\n```/)[1];",
                "hint": "Regex match ```json",
                "validation": "match(/```json",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Parse Safely",
                "instruction": "Try/catch JSON parse.",
                "target": "js",
                "expectedCode": "let data; try { data = JSON.parse(jsonStr); } catch(e) { data = null; }",
                "hint": "Try catch",
                "validation": "try {",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Validate Schema",
                "instruction": "Check keys.",
                "target": "js",
                "expectedCode": "if (!data || typeof data.answer !== \"string\") throw new Error(\"Invalid schema\");",
                "hint": "Check type",
                "validation": "typeof",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "Handle Errors",
                "instruction": "Fallback response.",
                "target": "js",
                "expectedCode": "return data || { answer: \"Error processing request\" };",
                "hint": "Fallback object",
                "validation": "error processing",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Format Output",
                "instruction": "Return text.",
                "target": "js",
                "expectedCode": "console.log(\"AI says:\", data.answer);",
                "hint": "Log answer",
                "validation": "console.log",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          },
          {
            "title": "Prompt Template Engine",
            "description": "Build prompts dynamically",
            "instructions": "Create a prompt engine",
            "xpReward": 200,
            "order": 2,
            "languages": [
              "js"
            ],
            "starterHtml": "<div id=\"console\" style=\"background: #1e1e1e; color: #fff; padding: 15px; font-family: monospace; height: 100vh; overflow-y: auto;\">\n  <div>> Welcome to Backend CLI</div>\n</div>",
            "starterCss": "",
            "starterJs": "",
            "steps": [
              {
                "id": 1,
                "title": "Template String",
                "instruction": "Create template.",
                "target": "js",
                "expectedCode": "const template = \"Summarize this: {{text}}\";",
                "hint": "Use {{text}}",
                "validation": "{{text}}",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 2,
                "title": "Variable Injection",
                "instruction": "Replace variables.",
                "target": "js",
                "expectedCode": "const prompt = template.replace(\"{{text}}\", userInput);",
                "hint": "Replace {{text}}",
                "validation": "replace(\"{{text}}\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 3,
                "title": "Context Builder",
                "instruction": "Append history.",
                "target": "js",
                "expectedCode": "const fullPrompt = history.join(\"\\n\") + \"\\n\" + prompt;",
                "hint": "Join history",
                "validation": "join(\"\\n\")",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 4,
                "title": "System Prompt",
                "instruction": "Add system role.",
                "target": "js",
                "expectedCode": "const messages = [{ role: \"system\", content: \"You are a helpful assistant\" }, { role: \"user\", content: fullPrompt }];",
                "hint": "Role system",
                "validation": "role: \"system\"",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 5,
                "title": "Response Formatter",
                "instruction": "Format AI response.",
                "target": "js",
                "expectedCode": "const reply = response.choices[0].message.content;",
                "hint": "Access choices",
                "validation": "choices[0]",
                "xp": 10,
                "emoji": "✨"
              },
              {
                "id": 6,
                "title": "Retry Logic",
                "instruction": "Retry on fail.",
                "target": "js",
                "expectedCode": "async function fetchWithRetry() {\n  for(let i=0; i<3; i++) {\n    try { return await fetchAI(); } catch(e) {}\n  }\n}",
                "hint": "Retry loop",
                "validation": "i<3",
                "xp": 10,
                "emoji": "✨"
              }
            ]
          }
        ]
      }
    ]
  }
];
