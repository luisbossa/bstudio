// Default page content. The dashboard saves edited copies of this object
// (data/content.json locally, MongoDB in production); anything missing from a
// saved copy falls back to these values.
//
// Text fields marked "rich" accept *asterisks* to highlight words.

module.exports = {
  site: {
    title: "BStudio — Luis Bossa",
    description:
      "Luis Bossa — Web Programmer and Digital Designer. Portfolio of web apps, APIs and interface design.",
    // Empty: the header shows a text wordmark built from footer.brand.
    logo: "",
    favicon: "/images/favicon.webp",
    cv: "/luis_bossa_CV.pdf",
  },

  theme: {
    orange: "#ff9f51",
    cream: "#fbf1eb",
    blue: "#e0ebfb",
    mate: "#272727",
    light: "#fbfaf9",
  },

  nav: [
    { href: "#about", label: "About", cta: false },
    { href: "#projects", label: "Projects", cta: false },
    { href: "#process", label: "Process", cta: false },
    { href: "#contact", label: "Contact", cta: true },
  ],

  intro: {
    eyebrow: "Web Programmer & Digital Designer",
    title: "Designing *Interfaces*",
    headline: "Transforming *Ideas* into Seamless *Digital Experiences*",
    paragraphs: [
      "I’m Luis Bossa, a Web Programmer and Digital Designer.",
      "Committed to Developing Creative Solutions and Engaging Interfaces.",
    ],
    primaryButton: "See projects",
    cvButton: "Download CV",
    ctaText: "Inspired to innovate? Let’s start the conversation!",
    ctaButton: "Get in touch",
    statValue: "3+",
    statLabel: "Years of design experience",
    photo: "/images/photo.webp",
    photoAlt: "Portrait of Luis Bossa",
    bubble: "Hi, I’m Luis! 👋",
    badgeText: "WEB DEVELOPER • DIGITAL DESIGNER •",
    followLabel: "Follow me on",
  },

  marquee: {
    text: "Custom designs",
  },

  about: {
    title: "About me",
    paragraphs: [
      "With over *3 years* of experience in web development and *digital design*, I have a proven history of building *high-performing websites* and applications.",
      "I believe in keeping things simple and effective. *My goal* is to deliver *clean designs* and reliable solutions that meet your needs.",
    ],
    signature: "/images/signature.webp",
  },

  experienceSection: {
    title: "Job experience and freelance",
    nextLabel: "Next: your project?",
  },

  experience: [
    {
      role: "Front-End Developer",
      year: "2022",
      company: "EJE Digital",
      focus: "Responsive Applications",
      text: "A key part of my role involved creating responsive applications. I made sure that all the web applications I worked on were fully optimized for different devices and screen sizes, ensuring a smooth user experience on smartphones, tablets, and desktops.",
    },
    {
      role: "Back-End Developer",
      year: "2023",
      company: "Servicios Integrales JV & JA",
      focus: "Database Design and Management",
      text: "I was instrumental in designing and managing databases using Laravel and PHP for efficient data storage and retrieval. This included creating database schemas, writing optimized SQL queries, and implementing strategies for data migration.",
    },
    {
      role: "Full-Stack Developer",
      year: "2024",
      company: "BStudio",
      focus: "API Development and Integration",
      text: "I develop RESTful APIs to enable communication between frontend and backend components. My focus is on creating robust, well-documented APIs that follow industry standards and ensure reliable data exchange.",
    },
  ],

  projectsSection: {
    title: "The main projects",
    previewLabel: "Live preview",
  },

  // videoCrop: "none" | "mockup-500" | "mockup-1080" (see utils/viewHelpers.js)
  projects: [
    {
      title: "Bus Ticket Booking",
      label: "Ticket Booking",
      url: "https://busena.vercel.app/",
      repo: "https://github.com/luisbossa/Bus-tickets-website",
      video: "/videos/video4.mp4",
      videoCrop: "mockup-500",
      mobileImage: "",
      points: [
        "A web app for booking bus tickets with an intuitive interface, real-time schedules, and a mobile-friendly design.",
      ],
    },
    {
      title: "RESTful API",
      label: "Point Of Sell",
      url: "https://point-of-sell.onrender.com",
      repo: "https://github.com/luisbossa/Point-of-sell",
      video: "/videos/video3.mp4",
      videoCrop: "mockup-1080",
      mobileImage: "/images/res3.webp",
      points: [
        "Point of sell application, you can manage multiple products.",
        "Store data in database.",
      ],
    },
    {
      title: "Visual Design",
      label: "E-Commerce",
      url: "https://ecom-nine-alpha.vercel.app/",
      repo: "https://github.com/luiscode9/Ecommerce-Node.js",
      video: "/videos/video1.mp4",
      videoCrop: "mockup-1080",
      mobileImage: "/images/res1.webp",
      points: [
        "Clothing eCommerce Application with Shopping Cart.",
        "High-quality images of the products.",
        "Modern and responsive design.",
      ],
    },
    {
      title: "Data consumption with API",
      label: "News Website",
      url: "https://newspaper-seven.vercel.app/",
      repo: "https://github.com/luiscode9/newspaper",
      video: "/videos/video2.mp4",
      videoCrop: "mockup-1080",
      mobileImage: "/images/res2.webp",
      points: [
        "News application covering the most current events around the world.",
        "Responsive design.",
      ],
    },
  ],

  technologiesSection: {
    title: "Technologies",
  },

  technologies: [
    { name: "HTML", image: "/technologies/html.webp" },
    { name: "CSS", image: "/technologies/css.webp" },
    { name: "JavaScript", image: "/technologies/js.webp" },
    { name: "jQuery", image: "/technologies/jquery.webp" },
    { name: "TypeScript", image: "/technologies/ts.webp" },
    { name: "Node.js", image: "/technologies/node.webp" },
    { name: "PHP", image: "/technologies/php.webp" },
    { name: "Git", image: "/technologies/git.webp" },
    { name: "GitHub", image: "/technologies/github.webp" },
    { name: "Bootstrap", image: "/technologies/bootstrap.webp" },
    { name: "Tailwind CSS", image: "/technologies/tail.webp" },
    { name: "Java", image: "/technologies/java.webp" },
    { name: "C#", image: "/technologies/csharp.webp" },
    { name: ".NET Core", image: "/technologies/netcore.webp" },
    { name: "React", image: "/technologies/reactjs.webp" },
    { name: "Vue", image: "/technologies/vue.webp" },
    { name: "PostgreSQL", image: "/technologies/postgresql.webp" },
    { name: "SQL Server", image: "/technologies/sqlserver.webp" },
    { name: "VS Code", image: "/technologies/vscode.webp" },
    { name: "Visual Studio", image: "/technologies/visual.webp" },
    { name: "Sublime Text", image: "/technologies/sublimetext.webp" },
  ],

  processSection: {
    title: "The secret to my design process",
  },

  processSteps: [
    {
      title: "Understand",
      text: "The first step to any successful project is getting to know the people we’re designing for.",
    },
    {
      title: "Explore",
      text: "With my research boundaries set, I explore limitless possibilities for the project’s look, feel, and function.",
    },
    {
      title: "Create",
      text: "Finally, I develop my initial design, consulting external collaborators to ensure efficiency and user focus.",
    },
    {
      title: "Improve",
      text: "After completing the initial design, I keep assessing and refining the product as needs and goals evolve.",
    },
  ],

  contactSection: {
    title: "Contact me",
    lead: "Got a project or question? I’d like to hear from you!",
    sticker: "Let’s talk! ✦",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    messageLabel: "Message",
    messagePlaceholder: "Tell me about your project...",
    submitLabel: "Submit",
  },

  contact: {
    email: "lebossamedina@gmail.com",
    phone: "(506) 6414-5674",
    phoneHref: "tel:+50664145674",
    address: "San José, Costa Rica",
    mapsUrl: "https://maps.google.com/?q=San+José,+Costa+Rica",
  },

  // icon: github | linkedin | dribbble | whatsapp | mail
  social: [
    { name: "GitHub", icon: "github", url: "https://github.com/luisbossa/", hero: true, footer: true, menu: true },
    { name: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/feed/", hero: true, footer: true, menu: true },
    { name: "Dribbble", icon: "dribbble", url: "https://dribbble.com/luisbossa9", hero: true, footer: false, menu: false },
    { name: "WhatsApp", icon: "whatsapp", url: "https://wa.me/50664145674", hero: false, footer: true, menu: false },
  ],

  footer: {
    brand: "BStudio",
    backToTop: "Back to top",
  },
};
