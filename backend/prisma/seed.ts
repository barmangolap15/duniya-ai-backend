import { PrismaClient, Role, SubmissionStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // Clean existing data
  await prisma.mentorshipMessage.deleteMany();
  await prisma.mentorshipThread.deleteMany();
  await prisma.parentCheer.deleteMany();
  await prisma.review.deleteMany();
  await prisma.savedCandidate.deleteMany();
  await prisma.parentStudent.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.userMissionProgress.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.course.deleteMany();
  await prisma.quizResponse.deleteMany();
  await prisma.userRoadmap.deleteMany();
  await prisma.user.deleteMany();
  await prisma.careerTrack.deleteMany();

  const hashedPassword = await bcrypt.hash('12345678', 10);

  // 1. Create Tracks
  const tracks = [
    { name: 'Frontend Web Development', description: 'Build beautiful, interactive user interfaces with HTML, CSS, and JavaScript' },
    { name: 'Backend Development', description: 'Build robust APIs and scalable cloud server applications' },
    { name: 'Full-Stack Development', description: 'Master both frontend and backend modern web technologies' },
    { name: 'Mobile App Development', description: 'Create responsive native iOS and Android mobile apps' },
    { name: 'UX/UI Design', description: 'Design intuitive wireframes, interfaces, and user workflows' },
  ];

  const createdTracks: Record<string, any> = {};
  for (const t of tracks) {
    const track = await prisma.careerTrack.create({
      data: { name: t.name, description: t.description },
    });
    createdTracks[t.name] = track;
  }

  const frontendTrack = createdTracks['Frontend Web Development'];

  // 2. Create Courses & Missions for Frontend Track
  const course1 = await prisma.course.create({
    data: {
      careerTrackId: frontendTrack.id,
      name: 'HTML Fundamentals',
      description: 'Learn the building blocks of every webpage',
      order: 1,
      missions: {
        create: [
          {
            title: 'Build Your First Webpage',
            description: 'Create a basic HTML page with a heading, paragraph, and image',
            instructions: 'Follow the steps to build your very first webpage from scratch!',
            order: 1,
            xpReward: 50,
            languages: ['html'],
            starterHtml: '',
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
                instruction: 'Let\'s add a fun image! Use the `<img>` tag with `src` set to **"https://picsum.photos/300/200"** and `alt` set to **"Random image"**.',
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
    },
  });

  const course2 = await prisma.course.create({
    data: {
      careerTrackId: frontendTrack.id,
      name: 'CSS Styling',
      description: 'Make your webpages visually captivating with modern CSS',
      order: 2,
      missions: {
        create: [
          {
            title: 'Style Your First Element',
            description: 'Learn CSS fundamentals by styling a heading and subtitle',
            instructions: 'Apply CSS styles to transform plain HTML into styled design!',
            order: 1,
            xpReward: 60,
            languages: ['html', 'css'],
            starterHtml: '<h1 class="title">Welcome to CSS!</h1>\n<p class="subtitle">Let\'s style this!</p>',
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
        ],
      },
    },
  });

  const course3 = await prisma.course.create({
    data: {
      careerTrackId: frontendTrack.id,
      name: 'JavaScript Basics',
      description: 'Make your webpages interactive with real JavaScript logic',
      order: 3,
      missions: {
        create: [
          {
            title: 'Interactive Color Button',
            description: 'Make a button that changes colors when clicked',
            instructions: 'Add JavaScript event listeners to create an interactive button!',
            order: 1,
            xpReward: 70,
            languages: ['html', 'css', 'js'],
            starterHtml: '<button id="colorBtn">Click Me!</button>\n<p id="message">Waiting for click...</p>',
            starterCss: '#colorBtn { padding: 12px 24px; background: #3b82f6; color: white; border-radius: 8px; border: 0; cursor: pointer; }',
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
        ],
      },
    },
  });

  // Collect missions
  const allMissions = await prisma.mission.findMany();
  const m1 = allMissions.find((m) => m.title === 'Build Your First Webpage')!;
  const m2 = allMissions.find((m) => m.title === 'Build a Profile Card')!;
  const m3 = allMissions.find((m) => m.title === 'Style Your First Element')!;
  const m4 = allMissions.find((m) => m.title === 'Interactive Color Button')!;

  // 3. Create DEMO USERS

  // --- Student 1: Alex Rivera (Primary demo student) ---
  const studentAlex = await prisma.user.create({
    data: {
      email: 'student@levelup.com',
      name: 'Alex Rivera',
      passwordHash: hashedPassword,
      role: Role.STUDENT,
      headline: 'Aspiring Frontend Web Developer | UI Crafting Enthusiast',
      bio: 'High school graduate transitioning into tech through hands-on project-based missions. Passionate about clean semantic HTML, Tailwind CSS, and accessible web standards.',
      githubUrl: 'https://github.com/alexrivera-dev',
      linkedinUrl: 'https://linkedin.com/in/alex-rivera-tech',
      xp: 340,
      level: 3,
      streak: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      quizCompleted: true,
      roadmap: {
        create: {
          careerTrackId: frontendTrack.id,
        },
      },
    },
  });

  // --- Student 2: Sarah Chen (Top performing candidate) ---
  const studentSarah = await prisma.user.create({
    data: {
      email: 'sarah@levelup.com',
      name: 'Sarah Chen',
      passwordHash: hashedPassword,
      role: Role.STUDENT,
      headline: 'Junior Web & Interactive Applications Engineer',
      bio: 'Self-directed learner with a 14-day daily build streak. Completed HTML/CSS courses and currently building interactive JS web tools.',
      githubUrl: 'https://github.com/sarahchen-dev',
      linkedinUrl: 'https://linkedin.com/in/sarah-chen-dev',
      xp: 580,
      level: 5,
      streak: 14,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
      quizCompleted: true,
      roadmap: {
        create: {
          careerTrackId: frontendTrack.id,
        },
      },
    },
  });

  // --- Student 3: Marcus Vance (Recent joiner with pending review) ---
  const studentMarcus = await prisma.user.create({
    data: {
      email: 'marcus@levelup.com',
      name: 'Marcus Vance',
      passwordHash: hashedPassword,
      role: Role.STUDENT,
      headline: 'Creative Coder & Frontend Explorer',
      bio: 'Switching careers from hospitality into technology. Love turning design ideas into functional browser experiences.',
      githubUrl: 'https://github.com/marcusvance',
      linkedinUrl: 'https://linkedin.com/in/marcus-vance',
      xp: 185,
      level: 2,
      streak: 3,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      quizCompleted: true,
      roadmap: {
        create: {
          careerTrackId: frontendTrack.id,
        },
      },
    },
  });

  // --- Parent: David Rivera ---
  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@levelup.com',
      name: 'David Rivera',
      passwordHash: hashedPassword,
      role: Role.PARENT,
      headline: 'Parent of Alex Rivera',
      bio: 'Supporting my child through their technology and coding journey.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    },
  });

  // Link Parent to Student Alex
  await prisma.parentStudent.create({
    data: {
      parentId: parentUser.id,
      studentId: studentAlex.id,
    },
  });

  // --- Mentor: Elena Rostova ---
  const mentorUser = await prisma.user.create({
    data: {
      email: 'mentor@levelup.com',
      name: 'Elena Rostova',
      passwordHash: hashedPassword,
      role: Role.MENTOR,
      headline: 'Staff Frontend Engineer @ TechCorp | 8+ yrs Industry Mentor',
      bio: 'Dedicated to helping the next generation build rock-solid foundational web engineering skills. Code reviews with empathy and rigor.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    },
  });

  // --- Recruiter: Rachel Adams ---
  const recruiterUser = await prisma.user.create({
    data: {
      email: 'recruiter@levelup.com',
      name: 'Rachel Adams',
      passwordHash: hashedPassword,
      role: Role.RECRUITER,
      headline: 'Head of Emerging Talent @ NextGen Tech & Partners',
      bio: 'Scouting verified, high-velocity junior engineers who have proven their capabilities through real, runnable code submissions.',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    },
  });

  // 4. Create SUBMISSIONS & REVIEWS

  // Alex's Submission 1: First Webpage (Approved)
  const alexSub1 = await prisma.submission.create({
    data: {
      userId: studentAlex.id,
      missionId: m1.id,
      htmlCode: '<div class="container">\n  <h1>Hello World</h1>\n  <p>Welcome to my first webpage!</p>\n  <img src="https://picsum.photos/400/250" alt="Random image">\n  <br>\n  <a href="#" class="btn">Learn More</a>\n</div>',
      cssCode: '.container { max-width: 600px; margin: 2rem auto; font-family: sans-serif; text-align: center; }\nh1 { color: #2563eb; }\np { color: #475569; line-height: 1.6; }\nimg { border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }\n.btn { display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border-radius: 6px; text-decoration: none; }',
      jsCode: 'console.log("Webpage loaded successfully!");',
      status: SubmissionStatus.APPROVED,
      xpEarned: 50,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    },
  });

  // Review from Elena for Alex
  await prisma.review.create({
    data: {
      submissionId: alexSub1.id,
      mentorId: mentorUser.id,
      feedback: 'Excellent work Alex! Clean semantic markup with properly structured container and tasteful CSS styles. Ready for responsive layout challenges next.',
      rating: 5,
    },
  });

  // Alex's Submission 2: Profile Card (Approved)
  const alexSub2 = await prisma.submission.create({
    data: {
      userId: studentAlex.id,
      missionId: m2.id,
      htmlCode: '<div class="card">\n  <img class="avatar" src="https://picsum.photos/100/100" alt="Profile">\n  <h2>Jane Doe</h2>\n  <p class="role">Frontend Specialist</p>\n  <button class="btn">Connect</button>\n</div>',
      cssCode: '.card { width: 280px; padding: 24px; border-radius: 16px; background: #1e293b; color: white; text-align: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); }\n.avatar { width: 80px; height: 80px; border-radius: 50%; border: 3px solid #3b82f6; margin-bottom: 12px; }\nh2 { margin: 0; font-size: 1.25rem; }\n.role { color: #94a3b8; font-size: 0.875rem; margin: 4px 0 16px; }\n.btn { width: 100%; padding: 8px 16px; background: #3b82f6; color: white; border: 0; border-radius: 8px; font-weight: 600; cursor: pointer; }',
      jsCode: '',
      status: SubmissionStatus.APPROVED,
      xpEarned: 75,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  });

  // Alex's Submission 3: Style Element (Submitted, waiting for mentor review)
  await prisma.submission.create({
    data: {
      userId: studentAlex.id,
      missionId: m3.id,
      htmlCode: '<h1 class="title">Welcome to CSS!</h1>\n<p class="subtitle">Designed with modern aesthetics</p>',
      cssCode: '.title {\n  color: #3b82f6;\n  font-size: 40px;\n  text-align: center;\n  letter-spacing: -0.5px;\n}\n.subtitle {\n  color: #94a3b8;\n  text-align: center;\n}',
      jsCode: '',
      status: SubmissionStatus.SUBMITTED,
      xpEarned: 60,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    },
  });

  // Sarah's Submissions (All top-notch)
  const sarahSub1 = await prisma.submission.create({
    data: {
      userId: studentSarah.id,
      missionId: m1.id,
      htmlCode: '<header class="hero">\n  <h1>Hello World</h1>\n  <p>Welcome to my first webpage!</p>\n  <img src="https://picsum.photos/450/300" alt="Showcase">\n  <a href="#">Explore Work</a>\n</header>',
      cssCode: 'body { background: #0f172a; color: white; font-family: system-ui; }\n.hero { max-width: 700px; margin: 40px auto; text-align: center; }\nh1 { font-size: 48px; background: linear-gradient(90deg, #38bdf8, #818cf8); -webkit-background-clip: text; color: transparent; }\np { color: #cbd5e1; font-size: 18px; }\nimg { border-radius: 16px; margin: 20px 0; width: 100%; max-width: 500px; }\na { display: inline-block; padding: 12px 24px; background: #38bdf8; color: #0f172a; font-weight: 700; border-radius: 9999px; text-decoration: none; }',
      jsCode: '',
      status: SubmissionStatus.APPROVED,
      xpEarned: 50,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    },
  });

  await prisma.review.create({
    data: {
      submissionId: sarahSub1.id,
      mentorId: mentorUser.id,
      feedback: 'Outstanding eye for modern aesthetics and typography. The gradient headline and border radius work seamlessly together.',
      rating: 5,
    },
  });

  const sarahSub4 = await prisma.submission.create({
    data: {
      userId: studentSarah.id,
      missionId: m4.id,
      htmlCode: '<div class="app">\n  <button id="colorBtn">Click Me!</button>\n  <p id="message">Click to activate neon mode</p>\n</div>',
      cssCode: 'body { display: flex; justify-content: center; align-items: center; min-height: 80vh; background: #090d16; color: white; font-family: sans-serif; }\n.app { text-align: center; }\n#colorBtn { padding: 16px 32px; font-size: 18px; font-weight: bold; background: #06b6d4; color: black; border: none; border-radius: 12px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }\n#colorBtn:hover { transform: scale(1.05); box-shadow: 0 0 25px #06b6d4; }',
      jsCode: 'const btn = document.getElementById("colorBtn");\nconst msg = document.getElementById("message");\nconst colors = ["#ec4899", "#8b5cf6", "#10b981", "#f59e0b", "#06b6d4"];\nlet idx = 0;\nbtn.addEventListener("click", () => {\n  idx = (idx + 1) % colors.length;\n  btn.style.background = colors[idx];\n  btn.style.boxShadow = `0 0 30px ${colors[idx]}`;\n  msg.textContent = `Theme updated: ${colors[idx]}`;\n});',
      status: SubmissionStatus.APPROVED,
      xpEarned: 70,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
  });

  await prisma.review.create({
    data: {
      submissionId: sarahSub4.id,
      mentorId: mentorUser.id,
      feedback: 'Flawless execution of state tracking, array indexing, and DOM styling with dynamic glow effect. High industry standard quality.',
      rating: 5,
    },
  });

  // Marcus's Submission: Waiting in Mentor review queue
  await prisma.submission.create({
    data: {
      userId: studentMarcus.id,
      missionId: m2.id,
      htmlCode: '<div class="card">\n  <img class="avatar" src="https://picsum.photos/100/100" alt="Profile">\n  <h2>Jane Doe</h2>\n  <p>Frontend Apprentice</p>\n  <button class="btn">Reach Out</button>\n</div>',
      cssCode: '.card { border: 1px solid #334155; padding: 20px; text-align: center; border-radius: 8px; background: #0f172a; color: white; }\n.avatar { border-radius: 50%; width: 70px; height: 70px; }\n.btn { background: #10b981; color: white; border: 0; padding: 8px 16px; border-radius: 4px; margin-top: 10px; cursor: pointer; }',
      jsCode: '',
      status: SubmissionStatus.SUBMITTED,
      xpEarned: 75,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    },
  });

  // 5. Recruiter bookmark Sarah Chen
  await prisma.savedCandidate.create({
    data: {
      recruiterId: recruiterUser.id,
      studentId: studentSarah.id,
      notes: 'Strong candidate for Junior Frontend Engineer internship. Excellent code quality and 14-day streak.',
    },
  });

  // 6. Parent Cheers for Alex
  await prisma.parentCheer.create({
    data: {
      parentId: parentUser.id,
      studentId: studentAlex.id,
      message: 'Super proud of your 5-day streak! Keep pushing, Alex! 🚀',
      xpAwarded: 15,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    },
  });

  await prisma.parentCheer.create({
    data: {
      parentId: parentUser.id,
      studentId: studentAlex.id,
      message: "Loved seeing Elena's feedback on your profile card. Keep it up! 👏",
      xpAwarded: 15,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    },
  });

  // 7. Mentorship Communications & Threads
  // Thread 1: Alex Rivera asking Elena about CSS units in Mission 3
  const thread1 = await prisma.mentorshipThread.create({
    data: {
      studentId: studentAlex.id,
      mentorId: mentorUser.id,
      missionId: m3.id,
      subject: 'Question regarding REM units vs Pixels in CSS',
      status: 'OPEN' as any,
      priority: 'NORMAL' as any,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      messages: {
        create: [
          {
            senderId: studentAlex.id,
            senderRole: Role.STUDENT,
            content: "Hi Elena! I'm trying to style the subtitle font size with REM units instead of pixels. Does that scale better on mobile screens and responsive viewports?",
            codeSnippet: ".subtitle {\n  color: #94a3b8;\n  font-size: 1.125rem;\n  text-align: center;\n}",
            stepNumber: 2,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          },
          {
            senderId: mentorUser.id,
            senderRole: Role.MENTOR,
            content: "Spot on question, Alex! Yes, REM units reference the root document font-size (typically 16px). When users adjust their browser accessibility zoom or preferences, REM scales harmoniously whereas pixels stay locked. 1.125rem (18px) is a fantastic choice here!",
            codeSnippet: "/* Recommended practice: */\n.subtitle {\n  font-size: clamp(1rem, 2.5vw, 1.125rem);\n}",
            createdAt: new Date(Date.now() - 1000 * 60 * 50),
          },
          {
            senderId: studentAlex.id,
            senderRole: Role.STUDENT,
            content: "That makes complete sense! Thank you so much for explaining the accessibility aspect. Applying it right now!",
            createdAt: new Date(Date.now() - 1000 * 60 * 25),
          },
        ],
      },
    },
  });

  // Thread 2: Marcus Vance asking Elena about centering avatar in Mission 2
  await prisma.mentorshipThread.create({
    data: {
      studentId: studentMarcus.id,
      mentorId: mentorUser.id,
      missionId: m2.id,
      subject: 'Centering Avatar inside Profile Card container',
      status: 'WAITING_ON_MENTOR' as any,
      priority: 'NORMAL' as any,
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
      messages: {
        create: [
          {
            senderId: studentMarcus.id,
            senderRole: Role.STUDENT,
            content: "Hey Elena, my avatar image isn't perfectly centered inside the card. Should I use flexbox on the parent card or margin auto on the image itself?",
            codeSnippet: ".avatar {\n  border-radius: 50%;\n  width: 70px;\n  height: 70px;\n  margin: 0 auto;\n}",
            stepNumber: 1,
            createdAt: new Date(Date.now() - 1000 * 60 * 45),
          },
        ],
      },
    },
  });

  console.log('✅ Comprehensive seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('DEMO ACCOUNTS (Password for all: 12345678):');
  console.log('👨‍🎓 Student 1:   student@levelup.com   (Alex Rivera)');
  console.log('👩‍🎓 Student 2:   sarah@levelup.com     (Sarah Chen)');
  console.log('👨‍🎓 Student 3:   marcus@levelup.com    (Marcus Vance)');
  console.log('👨‍👩‍👧 Parent:      parent@levelup.com    (David Rivera, linked to Alex)');
  console.log('👩‍🏫 Mentor:      mentor@levelup.com    (Elena Rostova)');
  console.log('💼 Recruiter:   recruiter@levelup.com (Rachel Adams)');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });