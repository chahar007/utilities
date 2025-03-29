// export const BLOGS_DATA = [
//   {
//     id: 1,
//     title: "Mastering React Hooks: A Comprehensive Guide",
//     description: "A deep dive into React Hooks and how to use them efficiently in modern applications.",
//     content: `React Hooks allow you to use state and other React features without writing a class. 
//     With Hooks like useState and useEffect, you can manage state and lifecycle events inside functional components, making code more readable and reusable. 
//     This guide covers the essential Hooks, how to use them effectively, and common pitfalls to avoid. 
//     Learn how Hooks have revolutionized React development and how they can enhance your applications.
    
//     ## Topics Covered:
//     - **Introduction to Hooks**: Understand the philosophy behind Hooks
//     - **useState**: Managing State in Functional Components
//     - **useEffect**: Handling Side Effects like API calls and subscriptions
//     - **Custom Hooks**: Building your own reusable Hooks
//     - **Performance Optimization** with useMemo and useCallback
//     - **Advanced Patterns**: Using useContext and useReducer for complex state
    
//     ### Real-world Example:
//     We'll build a custom useFetch hook that handles API requests with loading and error states, demonstrating how Hooks can simplify data fetching in your applications.
    
//     ### Common Pitfalls:
//     1. Calling Hooks conditionally
//     2. Forgetting dependencies in useEffect
//     3. Overusing useMemo/useCallback
    
//     By the end of this guide, you'll be able to refactor class components to functional components with confidence.`,
//     author: "Krapal Chahar",
//     date: "March 29, 2025",
//     image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
//     tags: ["React", "Frontend", "JavaScript", "Web Development", "Hooks"],
//     category: "Development",
//     readTime: "8 min",
//     featured: true
//   },
//   {
//     id: 2,
//     title: "Understanding Redux Toolkit: Simplifying State Management",
//     description: "Learn how Redux Toolkit simplifies state management in large-scale React applications.",
//     content: `Redux Toolkit provides a better developer experience by reducing boilerplate and enforcing best practices. 
//     This article explores the key features of Redux Toolkit, including createSlice, createAsyncThunk, and configureStore. 
    
//     ## Why Redux Toolkit?
//     - 75% less boilerplate code compared to traditional Redux
//     - Built-in Immer for immutable state updates
//     - Opinionated defaults for store setup
//     - RTK Query for data fetching
    
//     ## Key Features:
//     1. **createSlice**: Automatically generates action creators and action types
//     2. **createAsyncThunk**: Handles async logic with ease
//     3. **configureStore**: Simplified store setup with good defaults
//     4. **RTK Query**: Powerful data fetching and caching
    
//     ### Migration Guide:
//     We'll walk through converting a traditional Redux setup to Redux Toolkit, showing the dramatic reduction in code complexity.
    
//     ### Performance Tips:
//     - Normalizing state shape
//     - Using memoized selectors
//     - Avoiding unnecessary re-renders
    
//     By the end of this guide, you will have a solid understanding of how to structure a Redux application efficiently in 2025.`,
//     author: "John Doe",
//     date: "March 25, 2025",
//     image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
//     tags: ["Redux", "State Management", "React", "Frontend"],
//     category: "Development",
//     readTime: "10 min",
//     featured: true
//   },
//   {
//     id: 3,
//     title: "Building Scalable Web Applications with Next.js",
//     description: "Explore the power of Next.js for server-side rendering, static site generation, and API routes.",
//     content: `Next.js is a powerful React framework that enables hybrid static & server rendering, making it an ideal choice for modern web applications. 
    
//     ## Why Next.js in 2025?
//     - Improved SEO with server-side rendering
//     - Blazing fast performance with static generation
//     - Built-in API routes
//     - Image optimization out of the box
//     - Incremental Static Regeneration (ISR)
    
//     ## Core Features:
//     1. **Pre-rendering**: SSR vs. SSG vs. ISR
//     2. **File-system based routing**
//     3. **API Routes**: Build your backend within your frontend project
//     4. **next/image**: Automatic image optimization
//     5. **Middleware**: Advanced routing logic
    
//     ### Case Study:
//     We'll examine how major companies like Netflix and Twitch use Next.js to deliver exceptional user experiences at scale.
    
//     ### Migration Guide:
//     Step-by-step instructions for migrating from Create React App to Next.js, including handling routing differences and implementing SSR.
    
//     ## Advanced Patterns:
//     - Dynamic imports for code splitting
//     - Custom server configuration
//     - Internationalization (i18n) support
//     - Authentication strategies
    
//     By the end of this article, you'll understand why Next.js is becoming the default choice for production React applications.`,
//     author: "Alice Johnson",
//     date: "March 20, 2025",
//     image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
//     tags: ["Next.js", "React", "SSR", "Performance"],
//     category: "Development",
//     readTime: "12 min",
//     featured: true
//   },
//   {
//     id: 4,
//     title: "CSS-in-JS: Styled Components vs. Emotion in 2025",
//     description: "Comparing the leading CSS-in-JS solutions for modern React applications.",
//     content: `CSS-in-JS has become the dominant styling approach for React applications, but which library should you choose in 2025?
    
//     ## The Contenders:
//     1. **Styled Components**
//     2. **Emotion**
//     3. **Vanilla Extract** (new contender)
    
//     ## Comparison Criteria:
//     - Performance
//     - Developer experience
//     - Server-side rendering support
//     - Theming capabilities
//     - TypeScript support
    
//     ### Benchmark Results:
//     We ran extensive tests on bundle size, render performance, and SSR hydration times to determine the optimal choice for different use cases.
    
//     ## Migration Guide:
//     How to switch between these libraries with minimal disruption to your existing codebase.
    
//     ## Future Trends:
//     - The rise of zero-runtime CSS-in-JS
//     - CSS Hooks proposal
//     - Utility-first integration
    
//     This comprehensive guide will help you make an informed decision about styling in your next project.`,
//     author: "Sarah Williams",
//     date: "March 15, 2025",
//     image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
//     tags: ["CSS", "Styled Components", "Emotion", "Frontend"],
//     category: "Design",
//     readTime: "6 min",
//     featured: false
//   },
//   {
//     id: 5,
//     title: "The Complete Guide to TypeScript for React Developers",
//     description: "Level up your React skills with TypeScript's powerful type system.",
//     content: `TypeScript has become the standard for large-scale React applications. This guide covers everything you need to know.
    
//     ## Why TypeScript?
//     - Catch errors during development
//     - Better code documentation
//     - Improved developer experience
//     - Easier refactoring
    
//     ## Core Concepts:
//     1. Type inference
//     2. Interfaces vs Types
//     3. Generics
//     4. Utility Types
    
//     ### React-Specific Patterns:
//     - Typing component props
//     - Handling events
//     - Context API with TypeScript
//     - Redux with TypeScript
    
//     ## Advanced Techniques:
//     - Conditional types
//     - Template literal types
//     - Type guards
//     - Declaration merging
    
//     ## Migration Guide:
//     Step-by-step process for converting a JavaScript React project to TypeScript, including common pitfalls and solutions.
    
//     By the end of this guide, you'll be able to leverage TypeScript to build more robust React applications.`,
//     author: "Michael Brown",
//     date: "March 10, 2025",
//     image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
//     tags: ["TypeScript", "React", "Frontend", "JavaScript"],
//     category: "Development",
//     readTime: "15 min",
//     featured: true
//   },
//   {
//     id: 6,
//     title: "Web Accessibility: Building Inclusive Frontend Applications",
//     description: "Practical techniques to make your web applications accessible to all users.",
//     content: `Accessibility isn't just a legal requirement - it's good business and the right thing to do.
    
//     ## Why Accessibility Matters:
//     - 15% of the world's population experiences some form of disability
//     - Better accessibility often means better SEO
//     - Legal compliance (WCAG, ADA, Section 508)
    
//     ## Practical Techniques:
//     1. Semantic HTML
//     2. ARIA attributes
//     3. Keyboard navigation
//     4. Color contrast
//     5. Screen reader testing
    
//     ### React-Specific Considerations:
//     - Managing focus
//     - Accessible forms
//     - Dynamic content updates
//     - Modal dialogs
    
//     ## Testing Tools:
//     - axe DevTools
//     - WAVE Evaluation Tool
//     - Screen readers (NVDA, VoiceOver)
//     - Keyboard navigation testing
    
//     ## Case Study:
//     How implementing accessibility improvements increased conversion rates by 23% for a major e-commerce site.
    
//     This guide provides actionable steps you can take today to improve your application's accessibility.`,
//     author: "Emma Davis",
//     date: "March 5, 2025",
//     image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
//     tags: ["Accessibility", "a11y", "Frontend", "Inclusive Design"],
//     category: "Design",
//     readTime: "9 min",
//     featured: false
//   }
// ];

// export const BLOGS_DATA = [
//   {
//     id: 1,
//     title: "Cyberpunk 2077: Phantom Liberty - The Complete Review",
//     description: "Our in-depth analysis of CD Projekt Red's massive expansion that redeems Night City",
//     content: `Night City has never looked better than in this definitive version of Cyberpunk 2077. After years of updates and improvements, Phantom Liberty delivers on the original promise with:

//     ## A Gripping Spy Thriller Story
//     - 15+ hour main campaign with Keanu Reeves returning as Johnny Silverhand
//     - New district: The Combat Zone with dynamic faction wars
//     - Multiple endings that radically change the game world

//     ## Gameplay Revolution
//     - Completely redesigned skill trees with 3 new skill categories
//     - Vehicle combat and car chases finally implemented
//     - New cyberware system with visual body modifications

//     ### Technical Improvements
//     - Ray Tracing Overdrive mode sets new visual benchmark
//     - AI overhaul makes NPCs feel truly alive
//     - Performance optimizations for all platforms

//     ## Verdict
//     Phantom Liberty isn't just an expansion - it's the game Cyberpunk should have been at launch. With its incredible storytelling, vastly improved gameplay, and technical polish, this is a must-play for any RPG fan.`,
//     author: "Krapal Chahar",
//     date: "March 29, 2025",
//     image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
//     tags: ["RPG", "Open World", "Cyberpunk", "Action"],
//     category: "PC",
//     readTime: "12 min",
//     featured: true,
//     developer: "CD Projekt Red",
//     publisher: "CD Projekt",
//     releaseDate: "March 25, 2025",
//     genre: "Action RPG",
//     platforms: ["PC", "PS5", "Xbox Series X"],
//     rating: 9.5,
//     pros: [
//       "Incredible story with meaningful choices",
//       "Best-in-class visuals",
//       "Combat finally feels polished"
//     ],
//     cons: [
//       "Still some minor bugs",
//       "High system requirements"
//     ],
//     requirements: {
//       minimum: [
//         "OS: Windows 10 64-bit",
//         "CPU: Intel Core i7-6700 or AMD Ryzen 5 1600",
//         "RAM: 16GB",
//         "GPU: NVIDIA GTX 1080 or AMD RX 5700",
//         "Storage: 120GB SSD"
//       ],
//       recommended: [
//         "OS: Windows 11 64-bit",
//         "CPU: Intel Core i7-12700K or AMD Ryzen 7 5800X3D",
//         "RAM: 32GB",
//         "GPU: NVIDIA RTX 4080 or AMD RX 7900 XT",
//         "Storage: 120GB NVMe SSD"
//       ]
//     },
//     features: [
//       "Brand new district with unique missions",
//       "Revamped police system",
//       "Vehicle-to-vehicle combat",
//       "New romance options",
//       "Dynamic world events"
//     ],
//     gallery: [
//       "https://images.unsplash.com/photo-1608889825103-eb5a6f5adf58",
//       "https://images.unsplash.com/photo-1608889825271-9696289a94a4",
//       "https://images.unsplash.com/photo-1608889825103-eb5a6f5adf58"
//     ],
//     purchaseLinks: [
//       {
//         store: "Steam",
//         price: 49.99,
//         url: "#"
//       },
//       {
//         store: "GOG",
//         price: 44.99,
//         url: "#"
//       }
//     ]
//   },
// ];



export const BLOGS_DATA = [
  // ========== GAME UPDATES (2 entries) ==========
  {
    id: 101,
    title: "Cyberpunk 2077 2.1 Patch: Metro System & New Vehicles",
    description: "CD Projekt Red unveils surprise free update with fully functional metro and 5 new vehicles",
    content: `The unexpected 2.1 patch for Cyberpunk 2077 delivers one of the most requested features - a functional metro system across Night City. Players can now:
    
    - Ride all 19 metro stations with first-person animations
    - Discover hidden quests triggered during rides
    - Enjoy 5 new vehicles including the Porsche 911 Cabriolet
    - Experience improved vehicle combat mechanics
    
    The update also fixes over 200 minor bugs and introduces new radio stations. Our tests show significant performance improvements, especially on last-gen consoles where FPS drops have been reduced by 30%.
    
    "This is our love letter to fans who stuck with us," said game director Gabe Amatangelo. The update is available now for all platforms.`,
    author: "Alex Techton",
    date: "December 5, 2023",
    image: "https://images.unsplash.com/photo-1633366122544-f134324a6cee",
    tags: ["Cyberpunk 2077", "Update", "Free DLC"],
    category: "updates",
    readTime: "6 min",
    featured: true,
    meta: {
      game: "Cyberpunk 2077",
      platforms: ["PC", "PS5", "Xbox Series X/S"],
      version: "2.1",
      size: "23.4GB"
    }
  },
  {
    id: 102,
    title: "Fortnite Chapter 5: Underground Map & Weapon Mods",
    description: "Epic Games reveals massive underground areas and customizable weapons in new season",
    content: `Fortnite Chapter 5 introduces revolutionary changes:
    
    ## Underground Map Areas
    - 40% of the map now has subterranean levels
    - New tunneling mechanics with destructible terrain
    - Secret bunkers with rare loot
    
    ## Weapon Mod System
    - Attach scopes, magazines, and barrels
    - 120+ mods to discover
    - Custom weapon skins based on mod combinations
    
    Early player stats show:
    - 78% increase in close-quarters combat
    - Average match time extended by 3.2 minutes
    - 42% of players prioritizing mod hunting over victories
    
    The update also brings a new TMNT collaboration with Leonardo and Michelangelo as playable characters.`,
    author: "Battle Royale Insider",
    date: "December 3, 2023",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    tags: ["Fortnite", "Battle Royale", "Season Update"],
    category: "updates",
    readTime: "5 min",
    featured: false,
    meta: {
      game: "Fortnite",
      platforms: ["All"],
      season: "Chapter 5",
      battlePassPrice: '950 V-Bucks'
    }
  },

  // ========== GAME REVIEWS (2 entries) ==========
  {
    id: 201,
    title: "Baldur's Gate 3 Review: The New Gold Standard for RPGs",
    description: "Larian's masterpiece delivers 200+ hours of unparalleled freedom and storytelling",
    content: `After 217 hours across 3 playthroughs, we can confidently declare Baldur's Gate 3 as the new benchmark for CRPGs.

    ## Unmatched Player Freedom
    - Every quest has 6+ solutions we've discovered
    - Physics system allows for absurd creativity (barrelmancy works!)
    - NPCs remember your actions 50+ hours later
    
    ## Technical Breakdown
    - Performance: Stable 60FPS on RTX 3060 at Ultra
    - Bugs: Only 2 game-breaking issues in 200+ hours
    - Loading: Under 3 seconds on SSD
    
    ## Verdict (5/5)
    Pros:
    - Best-in-class writing
    - Revolutionary NPC AI
    - Perfect D&D adaptation
    
    Cons:
    - Overwhelming for newcomers
    - Third act pacing issues
    
    Must-play for any RPG fan. The 97 Metacritic score is justified.`,
    author: "RPG Veteran",
    date: "November 28, 2023",
    image: "https://images.unsplash.com/photo-1693933865260-6a0aef84c1c3",
    tags: ["RPG", "GOTY", "Larian"],
    category: "reviews",
    readTime: "8 min",
    featured: true,
    meta: {
      score: 10,
      platforms: ["PC", "PS5"],
      playtime: "80-200 hours",
      price: "$59.99"
    }
  },
  {
    id: 202,
    title: "Call of Duty: Modern Warfare III - A Step Backwards",
    description: "Rushed campaign and recycled content plague this year's installment",
    content: `Modern Warfare III represents the franchise's lowest point in years:

    ## Campaign Issues
    - 4.5 hour runtime (shortest in series history)
    - 3 missions are literally Warzone maps
    - Plot contradicts previous MW lore
    
    ## Multiplayer Analysis
    - All 16 launch maps are MW2 (2009) remakes
    - New movement system breaks balance
    - SBMM more aggressive than ever
    
    ## Zombies Mode
    - Only positive aspect
    - Open-world DMZ with zombies works surprisingly well
    - 45 minute matches feel fresh
    
    Final Score: 6/10
    Wait for a 50% sale unless you're a diehard fan. The $70 price tag is unjustified.`,
    author: "FPS Analyst",
    date: "November 10, 2023",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e",
    tags: ["FPS", "Activision", "Disappointment"],
    category: "reviews",
    readTime: "7 min",
    featured: false,
    meta: {
      score: 6,
      platforms: ["All"],
      campaignLength: "4.5 hours",
      price: "$69.99"
    }
  },

  // ========== INDUSTRY NEWS (2 entries) ==========
  {
    id: 301,
    title: "Microsoft Completes Activision Blizzard Acquisition for $68.7B",
    description: "The biggest deal in gaming history finally closes after 20 months",
    content: `Microsoft has officially acquired Activision Blizzard King for $68.7 billion, creating the third-largest gaming company by revenue.

    Key Implications:
    - Call of Duty will remain on PlayStation for 10 years
    - All ABK games coming to Game Pass in 2024
    - Bobby Kotick stepping down December 29
    
    Employee Impact:
    - 1,900 layoffs expected (8% of ABK workforce)
    - Raven Software union recognized
    - $25/hr minimum wage for QA testers
    
    What's Next:
    - Diablo 4 Game Pass release expected Q1 2024
    - First new IP from merged studios in development
    - Xbox mobile store launching 2024 with Candy Crush as flagship`,
    author: "Business Insider",
    date: "October 13, 2023",
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff",
    tags: ["Microsoft", "Acquisition", "Call of Duty"],
    category: "industry",
    readTime: "5 min",
    featured: true,
    meta: {
      dealValue: "$68.7B",
      employees: "23,000+",
      franchises: ["COD", "WoW", "Candy Crush"]
    }
  },
  {
    id: 302,
    title: "Unity Announces New Runtime Fee Policy, Then Partially Walks It Back",
    description: "Engine company faces developer revolt after controversial monetization changes",
    content: `Unity's proposed Runtime Fee sparked industry-wide backlash:

    Original Policy (Sept 12):
    - $0.20 per install after 200K downloads
    - Applied retroactively
    - Even reinstalls counted
    
    Developer Reactions:
    - Among Us dev threatened to switch engines
    - Several studios disabled Unity ads
    - #BoycottUnity trended for 72 hours
    
    Revised Policy (Sept 22):
    - Only applies to Unity 2024 LTS+
    - Cap at 4% of revenue
    - Personal/charity exemptions
    
    Fallout:
    - Unity stock dropped 8%
    - CEO John Riccitiello retired
    - 300+ devs signed open letter
    
    The trust is broken. Many indies are now exploring Godot and Unreal.`,
    author: "Dev Watch",
    date: "September 22, 2023",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
    tags: ["Unity", "Game Dev", "Controversy"],
    category: "industry",
    readTime: "6 min",
    featured: false,
    meta: {
      affectedVersions: "2024 LTS+",
      threshold: "200K installs + $200K revenue",
      alternatives: ["Unreal", "Godot"]
    }
  },

  // ========== HARDWARE (2 entries) ==========
  {
    id: 401,
    title: "NVIDIA RTX 4090 Review: 4K Gaming at 120FPS",
    description: "We benchmark the $1,599 beast with 15 AAA titles",
    content: `The RTX 4090 redefines high-end PC gaming:

    ## Performance Benchmarks (4K Ultra)
    - Cyberpunk 2077 (RT Overdrive): 78 → 112 FPS (DLSS 3)
    - Microsoft Flight Sim: 64 → 143 FPS
    - Starfield: 51 → 89 FPS
    
    ## Thermal Analysis
    - Idle: 34°C (25dB)
    - Load: 68°C (42dB)
    - 33% cooler than 3090 Ti
    
    ## Real-World Usage
    - 8K video editing with zero lag
    - AI image generation in seconds
    - Can power three 4K displays simultaneously
    
    Verdict:
    Only for enthusiasts with deep pockets. The 4080 offers better value for most.`,
    author: "Hardware Pro",
    date: "October 12, 2023",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620",
    tags: ["GPU", "NVIDIA", "Benchmark"],
    category: "hardware",
    readTime: "7 min",
    featured: true,
    meta: {
      price: "$1,599",
      cores: "16,384",
      memory: "24GB GDDR6X"
    }
  },
  {
    id: 402,
    title: "PlayStation Portal Review: A Niche But Polished Remote Player",
    description: "Sony's $200 handheld has one job - and does it well",
    content: `The PlayStation Portal delivers exactly what it promises:

    ## The Good
    - 1080p/60FPS when network conditions allow
    - DualSense features fully supported
    - Excellent 8-inch LCD screen
    - Lightweight (529g)
    
    ## The Bad
    - No Bluetooth (Sony's proprietary audio only)
    - Requires strong WiFi (5GHz recommended)
    - Useless without PS5
    
    ## Performance Metrics
    - Latency: 45ms (local network), 120ms (remote)
    - Battery: 6-8 hours
    - Range: 30ft line-of-sight
    
    Ideal For:
    - Households with TV conflicts
    - Bedroom gaming
    - PS5 owners with great WiFi
    
    Everyone else should skip.`,
    author: "Console Expert",
    date: "November 15, 2023",
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e",
    tags: ["PlayStation", "Handheld", "Streaming"],
    category: "hardware",
    readTime: "5 min",
    featured: false,
    meta: {
      price: "$199.99",
      resolution: "1080p",
      battery: "6-8 hours"
    }
  },

  // ========== ESPORTS (2 entries) ==========
  {
    id: 501,
    title: "T1 Wins LoL Worlds 2023 in Historic Undefeated Run",
    description: "Faker secures 4th championship as T1 goes 15-0 against LPL teams",
    content: `T1 has claimed the 2023 League of Legends World Championship:

    ## Tournament Stats
    - 15-0 record vs LPL teams
    - Fastest finals in history (88:23 total game time)
    - 4.8M peak viewers (2nd most watched esports event ever)
    
    ## Faker's Legacy
    - First player to win Worlds in 3 different decades
    - Now tied for most championships (4)
    - KDA of 12.7 throughout tournament
    
    ## Meta Analysis
    - 100% pick/ban rate on Rumble
    - Bot lane dominated by Xayah/Kai'Sa
    - Western teams went 2-18 vs Eastern
    
    This cements T1 as the most successful org in LoL history.`,
    author: "Esports Insider",
    date: "November 19, 2023",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    tags: ["League of Legends", "T1", "Worlds"],
    category: "esports",
    readTime: "6 min",
    featured: true,
    meta: {
      prize: "$445,000",
      location: "Seoul",
      MVP: "Zeus (Top)"
    }
  },
  {
    id: 502,
    title: "CS2's First Major Announced for Copenhagen in March 2024",
    description: "$1.25M tournament will introduce new MR12 format and coaching rules",
    content: `Valve reveals details for CS2's inaugural Major:

    ## Tournament Format
    - MR12 (First to 13 rounds)
    - 3 timeouts per match
    - Coaches can speak during tactical pauses
    
    ## Qualified Teams
    - 16 EU, 8 Americas, 8 Asia-Pacific
    - No direct invites - all through RMRs
    - First open qualifier starts January 1
    
    ## Viewer Rewards
    - New "Drops 2.0" system
    - Souvenir packages contain CS2 skins
    - Twitch co-streaming allowed
    
    Ticket sales begin December 15 at $50/day or $250 for full event.`,
    author: "CS:GO Historian",
    date: "November 21, 2023",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    tags: ["CS2", "Major", "Valve"],
    category: "esports",
    readTime: "4 min",
    featured: false,
    meta: {
      prizePool: "$1,250,000",
      dates: "March 17-31",
      venue: "Royal Arena"
    }
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Content", icon: "🌐" },
  { id: "updates", name: "Game Updates", icon: "🔄" },
  { id: "reviews", name: "Reviews", icon: "⭐" },
  { id: "industry", name: "Industry News", icon: "💼" },
  { id: "hardware", name: "Hardware", icon: "💻" },
  { id: "esports", name: "Esports", icon: "🏆" }
];