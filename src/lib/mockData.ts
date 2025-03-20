// Team Data
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  matches: number;
  won: number;
  lost: number;
  nrr: number;
  points: number;
}

export const teams: Team[] = [
  {
    id: "csk",
    name: "Chennai Super Kings",
    shortName: "CSK",
    logo: "/teams/csk.png",
    primaryColor: "#F7D133",
    matches: 14,
    won: 10,
    lost: 4,
    nrr: 0.652,
    points: 20
  },
  {
    id: "mi",
    name: "Mumbai Indians",
    shortName: "MI",
    logo: "/teams/mi.png",
    primaryColor: "#0078BC",
    matches: 14,
    won: 8,
    lost: 6,
    nrr: 0.231,
    points: 16
  },
  {
    id: "rcb",
    name: "Royal Challengers Bangalore",
    shortName: "RCB",
    logo: "/teams/rcb.png",
    primaryColor: "#D71920",
    matches: 14,
    won: 7,
    lost: 7,
    nrr: -0.108,
    points: 14
  },
  {
    id: "gt",
    name: "Gujarat Titans",
    shortName: "GT",
    logo: "/teams/gt.png",
    primaryColor: "#1A1F2C",
    matches: 14,
    won: 9,
    lost: 5,
    nrr: 0.379,
    points: 18
  },
  {
    id: "lsg",
    name: "Lucknow Super Giants",
    shortName: "LSG",
    logo: "/teams/lsg.png",
    primaryColor: "#4BA9E1",
    matches: 14,
    won: 8,
    lost: 6,
    nrr: 0.284,
    points: 16
  },
  {
    id: "dc",
    name: "Delhi Capitals",
    shortName: "DC",
    logo: "/teams/dc.png",
    primaryColor: "#0078BC",
    matches: 14,
    won: 6,
    lost: 8,
    nrr: -0.191,
    points: 12
  },
  {
    id: "kkr",
    name: "Kolkata Knight Riders",
    shortName: "KKR",
    logo: "/teams/kkr.png",
    primaryColor: "#3A225D",
    matches: 14,
    won: 8,
    lost: 6,
    nrr: 0.316,
    points: 16
  },
  {
    id: "rr",
    name: "Rajasthan Royals",
    shortName: "RR",
    logo: "/teams/rr.png",
    primaryColor: "#FF69B4",
    matches: 14,
    won: 8,
    lost: 6,
    nrr: 0.121,
    points: 16
  },
  {
    id: "pbks",
    name: "Punjab Kings",
    shortName: "PBKS",
    logo: "/teams/pbks.png",
    primaryColor: "#D71920",
    matches: 14,
    won: 6,
    lost: 8,
    nrr: -0.304,
    points: 12
  },
  {
    id: "srh",
    name: "Sunrisers Hyderabad",
    shortName: "SRH",
    logo: "/teams/srh.png",
    primaryColor: "#F7A721",
    matches: 14,
    won: 6,
    lost: 8,
    nrr: -0.215,
    points: 12
  }
];

// Player Data
export interface Player {
  id: string;
  name: string;
  teamId: string;
  image: string;
  role: "Batsman" | "Bowler" | "All-rounder" | "Wicket-keeper";
  nationality: string;
  matches: number;
  runs?: number;
  strikeRate?: number;
  average?: number;
  wickets?: number;
  economy?: number;
  oversBowled?: number;
}

export const players: Player[] = [
  {
    id: "kohli",
    name: "Virat Kohli",
    teamId: "rcb",
    image: "/players/kohli.png",
    role: "Batsman",
    nationality: "India",
    matches: 14,
    runs: 682,
    strikeRate: 151.56,
    average: 56.83
  },
  {
    id: "rahul",
    name: "KL Rahul",
    teamId: "lsg",
    image: "/players/rahul.png",
    role: "Batsman",
    nationality: "India",
    matches: 14,
    runs: 593,
    strikeRate: 135.82,
    average: 49.41
  },
  {
    id: "dhoni",
    name: "MS Dhoni",
    teamId: "csk",
    image: "/players/dhoni.png",
    role: "Wicket-keeper",
    nationality: "India",
    matches: 14,
    runs: 314,
    strikeRate: 182.55,
    average: 34.88
  },
  {
    id: "jadeja",
    name: "Ravindra Jadeja",
    teamId: "csk",
    image: "/players/jadeja.png",
    role: "All-rounder",
    nationality: "India",
    matches: 14,
    runs: 278,
    wickets: 15,
    economy: 7.64,
    strikeRate: 142.56,
    average: 30.88,
    oversBowled: 51.2
  },
  {
    id: "bumrah",
    name: "Jasprit Bumrah",
    teamId: "mi",
    image: "/players/bumrah.png",
    role: "Bowler",
    nationality: "India",
    matches: 14,
    wickets: 24,
    economy: 6.32,
    oversBowled: 56.0
  },
  {
    id: "chahal",
    name: "Yuzvendra Chahal",
    teamId: "rr",
    image: "/players/chahal.png",
    role: "Bowler",
    nationality: "India",
    matches: 14,
    wickets: 21,
    economy: 7.11,
    oversBowled: 56.0
  },
  {
    id: "rohit",
    name: "Rohit Sharma",
    teamId: "mi",
    image: "/players/rohit.png",
    role: "Batsman",
    nationality: "India",
    matches: 14,
    runs: 419,
    strikeRate: 142.37,
    average: 32.23
  },
  {
    id: "russell",
    name: "Andre Russell",
    teamId: "kkr",
    image: "/players/russell.png",
    role: "All-rounder",
    nationality: "West Indies",
    matches: 14,
    runs: 356,
    wickets: 19,
    economy: 8.97,
    strikeRate: 184.45,
    average: 27.38,
    oversBowled: 40.0
  },
  {
    id: "shami",
    name: "Mohammed Shami",
    teamId: "gt",
    image: "/players/shami.png",
    role: "Bowler",
    nationality: "India",
    matches: 14,
    wickets: 27,
    economy: 7.82,
    oversBowled: 56.0
  },
  {
    id: "pant",
    name: "Rishabh Pant",
    teamId: "dc",
    image: "/players/pant.png",
    role: "Wicket-keeper",
    nationality: "India",
    matches: 14,
    runs: 442,
    strikeRate: 157.86,
    average: 36.83
  }
];

// Match Data
export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  date: string;
  venue: string;
  result: string;
  team1Score?: string;
  team2Score?: string;
  status: "Upcoming" | "Live" | "Completed";
}

export const matches: Match[] = [
  {
    id: "match1",
    team1Id: "csk",
    team2Id: "mi",
    date: "2023-04-08T19:30:00+05:30",
    venue: "M.A. Chidambaram Stadium, Chennai",
    result: "CSK won by 23 runs",
    team1Score: "202/4",
    team2Score: "179/9",
    status: "Completed"
  },
  {
    id: "match2",
    team1Id: "rcb",
    team2Id: "kkr",
    date: "2023-04-09T19:30:00+05:30",
    venue: "M. Chinnaswamy Stadium, Bangalore",
    result: "KKR won by 7 wickets",
    team1Score: "158/6",
    team2Score: "162/3",
    status: "Completed"
  },
  {
    id: "match3",
    team1Id: "gt",
    team2Id: "dc",
    date: "2023-04-11T19:30:00+05:30",
    venue: "Narendra Modi Stadium, Ahmedabad",
    result: "GT won by 14 runs",
    team1Score: "192/7",
    team2Score: "178/8",
    status: "Completed"
  },
  {
    id: "match4",
    team1Id: "lsg",
    team2Id: "pbks",
    date: "2023-04-15T15:30:00+05:30",
    venue: "Ekana Cricket Stadium, Lucknow",
    result: "LSG won by 5 wickets",
    team1Score: "165/9",
    team2Score: "167/5",
    status: "Completed"
  },
  {
    id: "match5",
    team1Id: "rr",
    team2Id: "srh",
    date: "2024-05-18T19:30:00+05:30",
    venue: "Sawai Mansingh Stadium, Jaipur",
    result: "Upcoming match",
    status: "Upcoming"
  }
];

// Top Performers
export interface TopPerformers {
  batsmen: Player[];
  bowlers: Player[];
  economyBowlers: Player[];
}

export const topPerformers: TopPerformers = {
  batsmen: [
    players.find(p => p.id === "kohli")!,
    players.find(p => p.id === "rahul")!,
    players.find(p => p.id === "pant")!,
    players.find(p => p.id === "rohit")!,
    players.find(p => p.id === "dhoni")!,
  ],
  bowlers: [
    players.find(p => p.id === "shami")!,
    players.find(p => p.id === "bumrah")!,
    players.find(p => p.id === "chahal")!,
    players.find(p => p.id === "russell")!,
    players.find(p => p.id === "jadeja")!,
  ],
  economyBowlers: [
    players.find(p => p.id === "bumrah")!,
    players.find(p => p.id === "chahal")!,
    players.find(p => p.id === "jadeja")!,
    players.find(p => p.id === "shami")!,
    players.find(p => p.id === "russell")!,
  ]
};
