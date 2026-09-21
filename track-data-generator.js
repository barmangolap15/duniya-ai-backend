const fs = require('fs');

const step = (id, title, instruction, target, expectedCode, hint, validation, xp = 10, emoji = '✨') => ({
  id, title, instruction, target, expectedCode, hint, validation, xp, emoji
});

const mission = (title, description, instructions, xpReward, order, languages, starterHtml, starterCss, starterJs, steps) => ({
  title, description, instructions, xpReward, order, languages, starterHtml, starterCss, starterJs, steps
});

const course = (name, description, order, missions) => ({
  name, description, order, missions
});

const track = (name, description, icon, color, courses) => ({
  name, description, icon, color, courses
});

const htmlTerminal = `<div id="console" style="background: #1e1e1e; color: #fff; padding: 15px; font-family: monospace; height: 100vh; overflow-y: auto;">
  <div>> Welcome to Backend CLI</div>
</div>`;
const htmlMobile = `<div class="device" style="width:375px; height:812px; border: 16px solid #333; border-radius: 36px; margin: 20px auto; overflow: hidden; background: #fff; position: relative;">
  <div class="screen" style="height: 100%; width: 100%; display: flex; flex-direction: column;">
    <div id="app"></div>
  </div>
</div>`;

const track1 = track('Frontend Web Development', 'Master the building blocks of the web: HTML, CSS, and JavaScript.', 'Layout', 'from-blue-500 to-indigo-600', [
  course('HTML Fundamentals', 'Learn the structure of web pages.', 1, [
    mission('Build Your First Webpage', 'Learn HTML structure', 'Create a basic web page', 100, 1, ['html'], '', '', '', [
      step(1, 'The DOCTYPE', 'Start by defining the document type.', 'html', '<!DOCTYPE html>\n<html>\n</html>', 'Add <!DOCTYPE html>', 'doctype html'),
      step(2, 'Main Heading', 'Add an h1 heading inside the html.', 'html', '<!DOCTYPE html>\n<html>\n  <h1>Welcome</h1>\n</html>', 'Add <h1>Welcome</h1>', '<h1>welcome</h1>'),
      step(3, 'Paragraph', 'Add a paragraph.', 'html', '<!DOCTYPE html>\n<html>\n  <h1>Welcome</h1>\n  <p>My first webpage</p>\n</html>', 'Add <p>My first webpage</p>', '<p>my first'),
      step(4, 'Image', 'Add an image.', 'html', '<!DOCTYPE html>\n<html>\n  <h1>Welcome</h1>\n  <p>My first webpage</p>\n  <img src="logo.png" />\n</html>', 'Add <img src="logo.png" />', 'img src='),
      step(5, 'Link', 'Add a link.', 'html', '<!DOCTYPE html>\n<html>\n  <h1>Welcome</h1>\n  <p>My first webpage</p>\n  <img src="logo.png" />\n  <a href="#">Click me</a>\n</html>', 'Add <a href="#">Click me</a>', 'a href='),
      step(6, 'List', 'Add a list.', 'html', '<!DOCTYPE html>\n<html>\n  <h1>Welcome</h1>\n  <p>My first webpage</p>\n  <img src="logo.png" />\n  <a href="#">Click me</a>\n  <ul><li>Item 1</li></ul>\n</html>', 'Add <ul><li>Item 1</li></ul>', '<ul><li>')
    ]),
    mission('Build a Registration Form', 'Create user input forms', 'Use input fields and buttons', 150, 2, ['html'], '', '', '', [
      step(1, 'Form Tag', 'Create a form element.', 'html', '<form>\n</form>', 'Add <form></form>', '<form>'),
      step(2, 'Text Input', 'Add a text input for name.', 'html', '<form>\n  <input type="text" placeholder="Name" />\n</form>', 'Add <input type="text" />', 'type="text"'),
      step(3, 'Email Input', 'Add an email input.', 'html', '<form>\n  <input type="text" placeholder="Name" />\n  <input type="email" placeholder="Email" />\n</form>', 'Add <input type="email" />', 'type="email"'),
      step(4, 'Password Input', 'Add a password input.', 'html', '<form>\n  <input type="text" placeholder="Name" />\n  <input type="email" placeholder="Email" />\n  <input type="password" placeholder="Password" />\n</form>', 'Add <input type="password" />', 'type="password"'),
      step(5, 'Select Dropdown', 'Add a select dropdown.', 'html', '<form>\n  <input type="text" placeholder="Name" />\n  <input type="email" placeholder="Email" />\n  <input type="password" placeholder="Password" />\n  <select><option>Admin</option></select>\n</form>', 'Add <select><option>...</option></select>', '<select><option>'),
      step(6, 'Submit Button', 'Add a submit button.', 'html', '<form>\n  <input type="text" placeholder="Name" />\n  <input type="email" placeholder="Email" />\n  <input type="password" placeholder="Password" />\n  <select><option>Admin</option></select>\n  <button type="submit">Register</button>\n</form>', 'Add <button type="submit">', 'type="submit"')
    ]),
    mission('Semantic HTML & Structure', 'Organize content logically', 'Use semantic tags', 100, 3, ['html'], '', '', '', [
      step(1, 'Header', 'Add a header element.', 'html', '<header></header>', 'Add <header></header>', '<header>'),
      step(2, 'Nav', 'Add a nav element.', 'html', '<header>\n  <nav></nav>\n</header>', 'Add <nav></nav>', '<nav>'),
      step(3, 'Main', 'Add a main element.', 'html', '<header>\n  <nav></nav>\n</header>\n<main></main>', 'Add <main></main>', '<main>'),
      step(4, 'Section', 'Add a section element.', 'html', '<header>\n  <nav></nav>\n</header>\n<main>\n  <section></section>\n</main>', 'Add <section></section>', '<section>'),
      step(5, 'Footer', 'Add a footer element.', 'html', '<header>\n  <nav></nav>\n</header>\n<main>\n  <section></section>\n</main>\n<footer></footer>', 'Add <footer></footer>', '<footer>')
    ])
  ]),
  course('CSS Styling & Layouts', 'Style and position elements.', 2, [
    mission('Style a Profile Card', 'Learn CSS basics', 'Style a profile card', 150, 1, ['css'], '<div class="card"><img class="avatar" src="avatar.jpg" /><h2 class="name">John Doe</h2><p class="bio">Developer</p></div>', '', '', [
      step(1, 'Background & Border Radius', 'Style the card.', 'css', '.card { background: white; border-radius: 8px; }', 'Add .card { ... }', 'border-radius:'),
      step(2, 'Typography', 'Style the name.', 'css', '.card { background: white; border-radius: 8px; }\n.name { font-size: 24px; font-weight: bold; }', 'Add .name { font-size: 24px; }', 'font-size: 24px'),
      step(3, 'Avatar Styling', 'Style the avatar.', 'css', '.avatar { width: 100px; height: 100px; border-radius: 50%; }', 'Add .avatar { ... }', 'border-radius: 50%'),
      step(4, 'Flexbox Layout', 'Center card contents.', 'css', '.card { display: flex; flex-direction: column; align-items: center; }', 'Add display: flex;', 'display: flex'),
      step(5, 'Hover Effects', 'Add card hover effect.', 'css', '.card:hover { transform: translateY(-5px); }', 'Add .card:hover { ... }', 'transform: translatey'),
      step(6, 'Box Shadow', 'Add shadow to card.', 'css', '.card { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }', 'Add box-shadow', 'box-shadow:')
    ]),
    mission('Build a Responsive Navigation Bar', 'Learn Flexbox', 'Style a navbar', 150, 2, ['css'], '<nav class="navbar"><div class="logo">Logo</div><ul class="nav-links"><li><a href="#">Home</a></li></ul></nav>', '', '', [
      step(1, 'Flex Container', 'Make navbar flex.', 'css', '.navbar { display: flex; justify-content: space-between; }', 'Add .navbar { ... }', 'justify-content:'),
      step(2, 'Logo Styling', 'Style the logo.', 'css', '.logo { font-size: 2rem; font-weight: bold; }', 'Add .logo { ... }', 'font-size: 2rem'),
      step(3, 'Nav Links', 'Style nav links list.', 'css', '.nav-links { display: flex; list-style: none; gap: 20px; }', 'Add gap: 20px;', 'gap: 20px'),
      step(4, 'Active States', 'Style link hover state.', 'css', '.nav-links a:hover { color: blue; }', 'Add :hover', 'a:hover'),
      step(5, 'Mobile Responsive', 'Add media query.', 'css', '@media (max-width: 768px) { .nav-links { display: none; } }', 'Add @media', '@media'),
      step(6, 'Hamburger Concept', 'Style a hamburger icon.', 'css', '.hamburger { display: block; cursor: pointer; }', 'Add .hamburger { ... }', 'cursor: pointer')
    ]),
    mission('CSS Grid Photo Gallery', 'Learn CSS Grid', 'Style a gallery', 150, 3, ['css'], '<div class="gallery"><div class="item">1</div><div class="item">2</div></div>', '', '', [
      step(1, 'Grid Container', 'Make gallery grid.', 'css', '.gallery { display: grid; }', 'Add display: grid;', 'display: grid'),
      step(2, 'Grid Template Columns', 'Set columns.', 'css', '.gallery { display: grid; grid-template-columns: repeat(3, 1fr); }', 'Add grid-template-columns', 'repeat(3,'),
      step(3, 'Gap', 'Add grid gap.', 'css', '.gallery { gap: 16px; }', 'Add gap', 'gap: 16px'),
      step(4, 'Hover Zoom Effect', 'Zoom on hover.', 'css', '.item:hover { transform: scale(1.1); }', 'Add scale(1.1)', 'scale(1.1)'),
      step(5, 'Responsive Media Query', 'Make grid responsive.', 'css', '@media (max-width: 600px) { .gallery { grid-template-columns: 1fr; } }', 'Add responsive query', '1fr')
    ])
  ]),
  course('Interactive JavaScript', 'Add logic to pages.', 3, [
    mission('Build a Todo List App', 'Learn DOM manipulation', 'Create a functional todo list', 200, 1, ['js'], '<input id="todo-input" /><button id="add-btn">Add</button><ul id="todo-list"></ul><button id="clear-btn">Clear</button>', '', '', [
      step(1, 'Select Elements', 'Select the input and button.', 'js', 'const input = document.getElementById("todo-input");\nconst btn = document.getElementById("add-btn");', 'Use getElementById', 'getelementbyid'),
      step(2, 'Add Item Function', 'Create click handler.', 'js', 'btn.addEventListener("click", () => { });', 'Use addEventListener', 'addeventlistener'),
      step(3, 'Create LI Element', 'Create a new li.', 'js', 'const li = document.createElement("li");\nli.textContent = input.value;', 'Use createElement', 'createelement("li")'),
      step(4, 'Append to List', 'Append li to list.', 'js', 'document.getElementById("todo-list").appendChild(li);', 'Use appendChild', 'appendchild'),
      step(5, 'Delete Button', 'Add delete button to li.', 'js', 'const delBtn = document.createElement("button");\ndelBtn.textContent = "Delete";\nli.appendChild(delBtn);', 'Create delete button', 'delbtn.textcontent'),
      step(6, 'Toggle Complete', 'Click li to toggle class.', 'js', 'li.addEventListener("click", () => li.classList.toggle("completed"));', 'Use classList.toggle', 'classlist.toggle'),
      step(7, 'Clear All', 'Clear list on click.', 'js', 'document.getElementById("clear-btn").addEventListener("click", () => {\n  document.getElementById("todo-list").innerHTML = "";\n});', 'Set innerHTML to ""', 'innerhtml = ""')
    ]),
    mission('Dynamic Counter with Color Themes', 'Learn state management', 'Create a counter app', 150, 2, ['js'], '<h1 id="count">0</h1><button id="inc">Inc</button><button id="dec">Dec</button><button id="reset">Reset</button>', '', '', [
      step(1, 'Select Elements', 'Select buttons and count.', 'js', 'const countEl = document.getElementById("count");', 'Select count element', 'getelementbyid("count")'),
      step(2, 'Increment', 'Handle increment.', 'js', 'let count = 0;\ndocument.getElementById("inc").addEventListener("click", () => {\n  count++;\n  countEl.textContent = count;\n});', 'Increment count', 'count++'),
      step(3, 'Decrement', 'Handle decrement.', 'js', 'document.getElementById("dec").addEventListener("click", () => {\n  count--;\n  countEl.textContent = count;\n});', 'Decrement count', 'count--'),
      step(4, 'Reset', 'Handle reset.', 'js', 'document.getElementById("reset").addEventListener("click", () => {\n  count = 0;\n  countEl.textContent = count;\n});', 'Reset count', 'count = 0'),
      step(5, 'Change Color', 'Update color based on value.', 'js', 'if(count > 0) countEl.style.color = "green";\nelse if(count < 0) countEl.style.color = "red";\nelse countEl.style.color = "black";', 'Change style.color', 'style.color'),
      step(6, 'Add Keyboard Support', 'Handle arrow keys.', 'js', 'document.addEventListener("keydown", (e) => {\n  if(e.key === "ArrowUp") count++;\n  if(e.key === "ArrowDown") count--;\n});', 'Listen for keydown', 'keydown')
    ])
  ])
]);

const track2 = track('Backend Development', 'Build robust server-side logic and databases.', 'Server', 'from-emerald-500 to-teal-600', [
  course('RESTful API Engineering', 'Create reliable APIs.', 1, [
    mission('Build a REST API Router', 'Learn routing basics', 'Handle HTTP requests', 200, 1, ['js'], htmlTerminal, '', '', [
      step(1, 'Route Handler', 'Create a route function.', 'js', 'function handleRequest(method, path) {\n}', 'Create a function handleRequest', 'function handlerequest'),
      step(2, 'GET Endpoint', 'Handle GET /users.', 'js', 'if (method === "GET" && path === "/users") {\n  return { users: [] };\n}', 'Check method and path', 'method === "get"'),
      step(3, 'POST Endpoint', 'Handle POST /users.', 'js', 'if (method === "POST" && path === "/users") {\n  return { success: true };\n}', 'Check for POST', 'method === "post"'),
      step(4, 'Error Handling', 'Return 404 for unknown.', 'js', 'return { status: 404, message: "Not found" };', 'Return 404', 'status: 404'),
      step(5, 'Status Codes', 'Add 200 status code.', 'js', 'return { status: 200, users: [] };', 'Return 200', 'status: 200'),
      step(6, 'Response Formatting', 'Format response object.', 'js', 'return JSON.stringify({ status: 200, users: [] });', 'Use JSON.stringify', 'json.stringify')
    ]),
    mission('JWT Authentication System', 'Learn secure auth', 'Handle JWTs', 200, 2, ['js'], htmlTerminal, '', '', [
      step(1, 'Parse Headers', 'Extract auth header.', 'js', 'const authHeader = req.headers["authorization"];', 'Get authorization header', 'headers["authorization"]'),
      step(2, 'Validate Bearer', 'Check Bearer prefix.', 'js', 'if (!authHeader.startsWith("Bearer ")) return false;', 'Use startsWith', 'startswith("bearer'),
      step(3, 'Decode Token', 'Split to get token.', 'js', 'const token = authHeader.split(" ")[1];', 'Use split', 'split(" ")[1]'),
      step(4, 'Verify Expiry', 'Check if token expired.', 'js', 'if (token.exp < Date.now()) return false;', 'Check expiration', 'token.exp <'),
      step(5, 'Extract Payload', 'Return payload.', 'js', 'const payload = JSON.parse(atob(token.payload));', 'Decode base64 payload', 'atob'),
      step(6, 'Middleware Chain', 'Call next function.', 'js', 'if (valid) next(); else throw new Error("Unauthorized");', 'Call next()', 'next()')
    ])
  ]),
  course('Database & Query Logic', 'Interact with data.', 2, [
    mission('SQL Query Builder', 'Construct SQL dynamically', 'Build SQL strings', 200, 1, ['js'], htmlTerminal, '', '', [
      step(1, 'SELECT', 'Build select clause.', 'js', 'let query = `SELECT ${fields.join(", ")} FROM ${table}`;', 'Join fields', 'select ${'),
      step(2, 'WHERE', 'Add where clause.', 'js', 'if (conditions) query += ` WHERE ${conditions}`;', 'Append WHERE', 'where ${'),
      step(3, 'JOIN', 'Add join clause.', 'js', 'query += ` JOIN ${joinTable} ON ${joinCondition}`;', 'Append JOIN', 'join ${'),
      step(4, 'ORDER BY', 'Add order by.', 'js', 'query += ` ORDER BY ${sortColumn} ${sortOrder}`;', 'Append ORDER BY', 'order by ${'),
      step(5, 'LIMIT', 'Add limit.', 'js', 'query += ` LIMIT ${limit}`;', 'Append LIMIT', 'limit ${'),
      step(6, 'Aggregate Functions', 'Use COUNT.', 'js', 'const countQuery = `SELECT COUNT(*) FROM ${table}`;', 'SELECT COUNT(*)', 'count(*)')
    ]),
    mission('Data Validation & Sanitization', 'Secure inputs', 'Validate data', 200, 2, ['js'], htmlTerminal, '', '', [
      step(1, 'Email Validation', 'Check email regex.', 'js', 'const isValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);', 'Regex test', '.test(email)'),
      step(2, 'Password Strength', 'Check length.', 'js', 'if (password.length < 8) return false;', 'Check length >= 8', 'length < 8'),
      step(3, 'XSS Sanitization', 'Replace angle brackets.', 'js', 'const safe = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");', 'Replace < and >', '&lt;'),
      step(4, 'Input Trimming', 'Trim whitespace.', 'js', 'const trimmed = input.trim();', 'Use trim()', '.trim()'),
      step(5, 'Error Messages', 'Return structured errors.', 'js', 'return { valid: false, errors: ["Too short"] };', 'Return errors array', 'errors: [')
    ])
  ])
]);

const track3 = track('Full-Stack Development', 'Connect the frontend and backend.', 'Layers', 'from-purple-500 to-pink-600', [
  course('Full-Stack Architecture', 'Build complete features.', 1, [
    mission('Build a Contact Form with Validation', 'Full-stack forms', 'Handle forms end-to-end', 200, 1, ['html', 'js'], '<form id="contact"><input id="name"/><input id="email"/><textarea id="msg"></textarea><button>Send</button></form><div id="error"></div>', '', '', [
      step(1, 'HTML Form', 'Verify form exists.', 'html', '<form id="contact">', 'Check form tag', 'id="contact"'),
      step(2, 'CSS Styling', 'Style the form.', 'css', 'form { display: flex; flex-direction: column; }', 'Use flexbox', 'flex-direction: column'),
      step(3, 'Name Validation', 'Check name JS.', 'js', 'const name = document.getElementById("name").value;\nif (!name) showError("Name required");', 'Validate name', '!name'),
      step(4, 'Email Validation', 'Check email JS.', 'js', 'if (!email.includes("@")) showError("Invalid email");', 'Validate email', 'includes("@")'),
      step(5, 'Message Validation', 'Check msg JS.', 'js', 'if (msg.length < 10) showError("Message too short");', 'Validate msg', 'length < 10'),
      step(6, 'Error Display', 'Show error div.', 'js', 'document.getElementById("error").textContent = errMsg;', 'Set error text', 'error").textcontent'),
      step(7, 'Success State', 'Show success.', 'js', 'document.getElementById("contact").innerHTML = "Thank you!";', 'Set success message', 'thank you')
    ]),
    mission('Interactive Kanban Task Board', 'Drag and drop logic', 'Build a Kanban board', 200, 2, ['html', 'css', 'js'], '<div id="board"><div class="col" id="todo"></div><div class="col" id="done"></div></div>', '', '', [
      step(1, 'Board Layout HTML', 'Add a column.', 'html', '<div class="col" id="in-progress"></div>', 'Add in-progress col', 'id="in-progress"'),
      step(2, 'Column Styling CSS', 'Style columns.', 'css', '.col { min-height: 200px; background: #eee; padding: 10px; }', 'Style .col', 'min-height:'),
      step(3, 'Add Task JS', 'Create task element.', 'js', 'const task = document.createElement("div");\ntask.className = "task";', 'Create div for task', 'classname = "task"'),
      step(4, 'Move Task', 'Move between cols.', 'js', 'document.getElementById("done").appendChild(task);', 'Append to done', 'appendchild(task)'),
      step(5, 'Delete Task', 'Remove a task.', 'js', 'task.remove();', 'Call remove()', 'task.remove()'),
      step(6, 'Task Counter', 'Update count.', 'js', 'let count = document.querySelectorAll(".task").length;', 'Count .task elements', 'queryselectorall(".task")')
    ])
  ]),
  course('API Integration & State', 'Manage data flow.', 2, [
    mission('Real-time Chat Interface', 'Handle real-time updates', 'Build a chat UI', 200, 1, ['html', 'js'], '<div id="chat"></div><input id="msg-input"/><button id="send">Send</button>', '', '', [
      step(1, 'Chat HTML', 'Structure chat.', 'html', '<div id="chat-messages"></div>', 'Add messages container', 'id="chat-messages"'),
      step(2, 'Message Styling CSS', 'Style messages.', 'css', '.msg { padding: 10px; border-radius: 10px; }', 'Style .msg', 'border-radius:'),
      step(3, 'Send Message JS', 'Append message.', 'js', 'chat.innerHTML += `<div class="msg">${input.value}</div>`;', 'Append to chat', 'innerHTML += '),
      step(4, 'Auto-scroll', 'Scroll to bottom.', 'js', 'chat.scrollTop = chat.scrollHeight;', 'Update scrollTop', 'scrolltop ='),
      step(5, 'Timestamps', 'Add time.', 'js', 'const time = new Date().toLocaleTimeString();', 'Use Date()', 'tolocaletimestring()'),
      step(6, 'Clear Chat', 'Clear all.', 'js', 'chat.innerHTML = "";', 'Clear innerHTML', 'innerHTML = ""')
    ]),
    mission('User Dashboard with Charts', 'Display complex data', 'Build a dashboard', 200, 2, ['html', 'css'], '<div class="dashboard"></div>', '', '', [
      step(1, 'Dashboard Layout', 'Use grid layout.', 'css', '.dashboard { display: grid; grid-template-columns: 1fr 1fr; }', 'Grid layout', 'display: grid'),
      step(2, 'Stat Cards', 'Style cards.', 'css', '.card { padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }', 'Style .card', 'padding: 20px'),
      step(3, 'Progress Bar', 'Style progress.', 'css', '.progress { width: 50%; background: blue; height: 10px; }', 'Style .progress', 'width: 50%'),
      step(4, 'Data Rendering', 'Set text.', 'js', 'document.getElementById("users").textContent = "1,024";', 'Update users count', '1,024'),
      step(5, 'Responsive Grid', 'Mobile query.', 'css', '@media (max-width: 600px) { .dashboard { grid-template-columns: 1fr; } }', 'Media query', '1fr')
    ])
  ])
]);

const track4 = track('Mobile App Development', 'Create beautiful mobile experiences.', 'Smartphone', 'from-amber-500 to-orange-600', [
  course('Mobile-First UI Design', 'Design for small screens.', 1, [
    mission('Mobile Bottom Tab Navigator', 'Build mobile nav', 'Create a tab bar', 200, 1, ['html', 'css'], htmlMobile, '', '', [
      step(1, 'Mobile Frame', 'Add frame CSS.', 'css', '.device { width: 375px; height: 812px; }', 'Set device size', '375px'),
      step(2, 'Bottom Nav Bar', 'Style tab bar.', 'css', '.tab-bar { position: absolute; bottom: 0; width: 100%; display: flex; }', 'Position bottom', 'bottom: 0'),
      step(3, 'Tab Icons', 'Style icons.', 'css', '.tab-icon { flex: 1; text-align: center; padding: 10px 0; }', 'Flex 1 icons', 'flex: 1'),
      step(4, 'Active State', 'Style active tab.', 'css', '.tab-icon.active { color: blue; }', 'Style .active', '.active {'),
      step(5, 'Badge Notification', 'Add badge.', 'css', '.badge { background: red; border-radius: 50%; width: 10px; height: 10px; }', 'Style .badge', 'background: red'),
      step(6, 'Screen Content Areas', 'Style content.', 'css', '.content { flex: 1; overflow-y: auto; }', 'Flex 1 content', 'overflow-y:')
    ]),
    mission('Swipeable Card Carousel', 'Touch gestures', 'Build a carousel', 200, 2, ['css'], htmlMobile, '', '', [
      step(1, 'Carousel Container', 'Add flex overflow.', 'css', '.carousel { display: flex; overflow-x: auto; }', 'overflow-x: auto', 'overflow-x: auto'),
      step(2, 'Card Styling', 'Style cards.', 'css', '.card { min-width: 300px; margin-right: 16px; }', 'Set min-width', 'min-width:'),
      step(3, 'Scroll Snap', 'Add scroll snapping.', 'css', '.carousel { scroll-snap-type: x mandatory; }\n.card { scroll-snap-align: center; }', 'Use scroll-snap', 'scroll-snap-type'),
      step(4, 'Dots Indicator', 'Style dots.', 'css', '.dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; }', 'Style .dot', 'border-radius: 50%'),
      step(5, 'Auto-hide Scrollbar', 'Hide scrollbar.', 'css', '.carousel::-webkit-scrollbar { display: none; }', 'Hide scrollbar', '::-webkit-scrollbar')
    ])
  ]),
  course('Mobile Interactions', 'Add touch logic.', 2, [
    mission('Pull-to-Refresh Feed', 'Touch events', 'Implement PTR', 200, 1, ['js'], htmlMobile, '', '', [
      step(1, 'Feed Layout', 'Structure feed.', 'html', '<div id="feed"></div>', 'Add feed div', 'id="feed"'),
      step(2, 'Feed Item Styling', 'Style items.', 'css', '.feed-item { padding: 15px; border-bottom: 1px solid #eee; }', 'Style .feed-item', 'border-bottom:'),
      step(3, 'Loading Spinner', 'Add spinner.', 'html', '<div id="spinner" style="display:none;">Loading...</div>', 'Add spinner div', 'id="spinner"'),
      step(4, 'Refresh Handler', 'Listen to touch.', 'js', 'document.addEventListener("touchstart", (e) => { startY = e.touches[0].clientY; });', 'Handle touchstart', 'touchstart'),
      step(5, 'Dynamic Content', 'Add new items.', 'js', 'feed.insertAdjacentHTML("afterbegin", "<div class=\'feed-item\'>New Post</div>");', 'Insert new item', 'insertadjacenthtml'),
      step(6, 'Animation', 'Animate spinner.', 'css', '@keyframes spin { 100% { transform: rotate(360deg); } }', 'Add keyframes', '@keyframes')
    ]),
    mission('Mobile Settings Screen', 'Build settings UI', 'Create settings', 200, 2, ['html', 'css'], htmlMobile, '', '', [
      step(1, 'Settings Layout', 'List structure.', 'css', '.settings-list { list-style: none; padding: 0; }', 'Style list', 'list-style: none'),
      step(2, 'Toggle Switches', 'Style switch.', 'css', '.switch { width: 40px; height: 20px; background: #ccc; border-radius: 10px; }', 'Style .switch', 'width: 40px'),
      step(3, 'Grouped Sections', 'Style groups.', 'css', '.section { margin-bottom: 20px; background: white; }', 'Style .section', 'margin-bottom: 20px'),
      step(4, 'Icons', 'Style left icon.', 'css', '.icon { width: 24px; height: 24px; margin-right: 10px; }', 'Style .icon', 'width: 24px'),
      step(5, 'Dark Theme', 'Add dark mode.', 'css', 'body.dark { background: #000; color: #fff; }', 'Style .dark', 'body.dark')
    ])
  ])
]);

const track5 = track('Python & AI Logic', 'Learn data processing and AI concepts.', 'Sparkles', 'from-rose-500 to-red-600', [
  course('Algorithms & Data Processing', 'Transform data.', 1, [
    mission('Array Operations & Sorting', 'Functional programming', 'Process arrays', 200, 1, ['js'], htmlTerminal, '', '', [
      step(1, 'Filter', 'Filter even numbers.', 'js', 'const evens = arr.filter(n => n % 2 === 0);', 'Use filter', '.filter('),
      step(2, 'Map', 'Double numbers.', 'js', 'const doubled = arr.map(n => n * 2);', 'Use map', '.map('),
      step(3, 'Reduce', 'Sum numbers.', 'js', 'const sum = arr.reduce((acc, n) => acc + n, 0);', 'Use reduce', '.reduce('),
      step(4, 'Sort', 'Sort ascending.', 'js', 'const sorted = arr.sort((a, b) => a - b);', 'Use sort', '.sort('),
      step(5, 'Find', 'Find first > 10.', 'js', 'const big = arr.find(n => n > 10);', 'Use find', '.find('),
      step(6, 'Custom Comparator', 'Sort by length.', 'js', 'const sortedStrs = strs.sort((a, b) => a.length - b.length);', 'Sort by length', 'length -')
    ]),
    mission('Data Pipeline Builder', 'Chained operations', 'Build a pipeline', 200, 2, ['js'], htmlTerminal, '', '', [
      step(1, 'Parse CSV', 'Split string.', 'js', 'const rows = csv.split("\\n").map(r => r.split(","));', 'Split by newline', 'split("\\n")'),
      step(2, 'Transform Data', 'Map objects.', 'js', 'const data = rows.map(r => ({ id: r[0], val: Number(r[1]) }));', 'Map to objects', 'number('),
      step(3, 'Calculate Stats', 'Get average.', 'js', 'const avg = data.reduce((sum, d) => sum + d.val, 0) / data.length;', 'Calculate average', '/ data.length'),
      step(4, 'Filter Outliers', 'Remove large vals.', 'js', 'const filtered = data.filter(d => d.val < 100);', 'Filter < 100', '< 100'),
      step(5, 'Format Output', 'JSON output.', 'js', 'const out = JSON.stringify(filtered, null, 2);', 'Stringify with spacing', 'null, 2')
    ])
  ]),
  course('AI & Prompt Engineering', 'Work with AI models.', 2, [
    mission('JSON Response Parser', 'Handle AI outputs', 'Parse LLM JSON', 200, 1, ['js'], htmlTerminal, '', '', [
      step(1, 'Extract JSON from Markdown', 'Find backticks.', 'js', 'const jsonStr = md.match(/```json\\n([\\s\\S]*?)\\n```/)[1];', 'Regex match ```json', 'match(/```json'),
      step(2, 'Parse Safely', 'Try/catch JSON parse.', 'js', 'let data; try { data = JSON.parse(jsonStr); } catch(e) { data = null; }', 'Try catch', 'try {'),
      step(3, 'Validate Schema', 'Check keys.', 'js', 'if (!data || typeof data.answer !== "string") throw new Error("Invalid schema");', 'Check type', 'typeof'),
      step(4, 'Handle Errors', 'Fallback response.', 'js', 'return data || { answer: "Error processing request" };', 'Fallback object', 'error processing'),
      step(5, 'Format Output', 'Return text.', 'js', 'console.log("AI says:", data.answer);', 'Log answer', 'console.log')
    ]),
    mission('Prompt Template Engine', 'Build prompts dynamically', 'Create a prompt engine', 200, 2, ['js'], htmlTerminal, '', '', [
      step(1, 'Template String', 'Create template.', 'js', 'const template = "Summarize this: {{text}}";', 'Use {{text}}', '{{text}}'),
      step(2, 'Variable Injection', 'Replace variables.', 'js', 'const prompt = template.replace("{{text}}", userInput);', 'Replace {{text}}', 'replace("{{text}}"'),
      step(3, 'Context Builder', 'Append history.', 'js', 'const fullPrompt = history.join("\\n") + "\\n" + prompt;', 'Join history', 'join("\\n")'),
      step(4, 'System Prompt', 'Add system role.', 'js', 'const messages = [{ role: "system", content: "You are a helpful assistant" }, { role: "user", content: fullPrompt }];', 'Role system', 'role: "system"'),
      step(5, 'Response Formatter', 'Format AI response.', 'js', 'const reply = response.choices[0].message.content;', 'Access choices', 'choices[0]'),
      step(6, 'Retry Logic', 'Retry on fail.', 'js', 'async function fetchWithRetry() {\n  for(let i=0; i<3; i++) {\n    try { return await fetchAI(); } catch(e) {}\n  }\n}', 'Retry loop', 'i<3')
    ])
  ])
]);

const ALL_TRACKS = [track1, track2, track3, track4, track5];

const output = `export interface StepData {
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

export const ALL_TRACKS: TrackData[] = ${JSON.stringify(ALL_TRACKS, null, 2)};
`;

fs.writeFileSync('/Users/golapbarman/duniya_ai/backend/src/missions/track-data.ts', output);
console.log('File written successfully.');
