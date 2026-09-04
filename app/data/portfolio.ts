export const profile = {
  codename: "koktegesih",
  name: "Risky Akbar",
  role: "Informatics Student, Cyber Security Concentration",
  clearance: "JUNIOR",
  uid: "0xA1F4-CYB3R",
  location: "Makassar, ID",
  status: "SECURE",
  summary:
    "Networking and cyber security student with a red-team mindset. My roots are in computer networks, and my focus now leans offensive: web application pentesting, network enumeration, and Active Directory basics, all practiced in the lab and documented as clear, reproducible writeups. Active in the security community through COCONUT Computer Club.",
};

export type SocialIcon = "email" | "github" | "linkedin" | "instagram";

export type Social = {
  label: string;
  value: string;
  href: string;
  icon: SocialIcon;
};

export const socials: Social[] = [
  {
    label: "Email",
    value: "riskyakbar690@gmail.com",
    href: "mailto:riskyakbar690@gmail.com",
    icon: "email",
  },
  {
    label: "GitHub",
    value: "github.com/riskyakbar15",
    href: "https://github.com/riskyakbar15",
    icon: "github",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/riskyakbar15",
    href: "https://linkedin.com/in/riskyakbar15",
    icon: "linkedin",
  },
  {
    label: "Instagram",
    value: "instagram.com/koktegesih",
    href: "https://instagram.com/koktegesih",
    icon: "instagram",
  },
];

export type SkillGroup = {
  category: string;
  code: string;
  level: 1 | 2 | 3 | 4 | 5;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "Fundamentals",
    code: "FND",
    level: 3,
    items: [
      "Linux & Command Line",
      "Networking (TCP/IP, DNS, HTTP)",
      "Web Security Concepts (OWASP Top 10)",
      "Active Directory Basics",
    ],
  },
  {
    category: "Offensive Security",
    code: "OFF",
    level: 2,
    items: [
      "Web Application Pentesting (OWASP Top 10)",
      "Network Scanning & Enumeration",
      "Active Directory Attacks (basic)",
      "Exploit Development (learning)",
    ],
  },
  {
    category: "Tools",
    code: "TLS",
    level: 3,
    items: ["Burp Suite", "Nmap", "Metasploit", "Git", "Docker"],
  },
  {
    category: "Languages & Scripting",
    code: "LNG",
    level: 2,
    items: ["Bash", "Python", "JavaScript / TypeScript", "Go", "SQL"],
  },
];

export type Project = {
  id: string;
  title: string;
  category: string;
  summary: string;
  stack: string[];
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  href?: string;
};

export const projects: Project[] = [
  {
    id: "CASE-001",
    title: "OverTheWire: Bandit",
    category: "Wargame / Linux",
    summary:
      "Worked through the Bandit wargame to build Linux command-line and SSH fundamentals: file manipulation, permissions, data encoding, and basic networking.",
    stack: ["Linux", "SSH", "Bash"],
    severity: "INFO",
    href: "/blog/overthewire-bandit",
  },
  {
    id: "CASE-002",
    title: "PortSwigger Web Security Academy: XSS",
    category: "Web Exploitation",
    summary:
      "Completed the Cross-Site Scripting (XSS) labs on PortSwigger Web Security Academy, covering reflected, stored, and DOM-based XSS along with filter-bypass techniques.",
    stack: ["Burp Suite", "JavaScript"],
    severity: "HIGH",
    href: "/blog/portswigger-xss-labs",
  },
  {
    id: "CASE-003",
    title: "Vulnerable Machine Exploitation Lab",
    category: "Network Pentest",
    summary:
      "Practiced network penetration on intentionally vulnerable machines (Metasploitable, VulnHub). Host discovery and service enumeration with Nmap, followed by exploiting identified services.",
    stack: ["Nmap", "Metasploit", "Linux"],
    severity: "HIGH",
  },
  {
    id: "CASE-004",
    title: "AgroAdvisor: Smart Agriculture Platform",
    category: "Web Development",
    summary:
      "Organization team project for a precision-agriculture platform (AI-driven recommendations, IoT sensor monitoring, weather forecasting). Contributed to the frontend in the early phase; later completed by a teammate.",
    stack: ["Next.js", "TypeScript", "FastAPI", "MySQL", "Docker", "Gemini AI"],
    severity: "INFO",
    href: "https://github.com/IndalAwalaikal/INESA-AGROADVISOR",
  },
  {
    id: "CASE-005",
    title: "Ilmu Falak: Transparent Qibla Direction PWA",
    category: "Web Development",
    summary:
      "Client-side PWA for Qibla direction and prayer times that shows the math behind every value: great-circle azimuth with WMM 2025 magnetic declination correction, and NOAA solar position for the sun-based and Rashdul Qibla methods. Runs fully offline and in-browser, so location never leaves the device.",
    stack: ["Next.js", "React", "TypeScript", "PWA", "Docker"],
    severity: "INFO",
    href: "https://github.com/riskyakbar15/ilmu-falak",
  },
  {
    id: "CASE-006",
    title: "SRTP VoIP Security: RTP vs SRTP + TLS",
    category: "VoIP Security",
    summary:
      "Proof of concept comparing VoIP security with and without encryption on Asterisk and PJSIP. Unencrypted RTP audio could be reconstructed and replayed in Wireshark, while SRTP-SDES for media and TLS for signaling left captured media unintelligible without the crypto keys.",
    stack: ["Asterisk", "SRTP", "TLS", "Wireshark", "OpenSSL"],
    severity: "HIGH",
    href: "https://github.com/riskyakbar15/SRTP-VoIP-Security-Implementation",
  },
];

export type Badge = {
  name: string;
  issuer: string;
  image: string;
  verifyHref?: string;
};

export const badges: Badge[] = [
  {
    name: "Introduction to Networks",
    issuer: "Cisco Networking Academy",
    image: "/badges/ccna-introduction-to-networks.png",
    verifyHref:
      "https://www.credly.com/badges/4ca14769-1b14-4c52-a696-bec9c8684a9f/public_url",
  },
  {
    name: "Ethical Hacker",
    issuer: "Cisco Networking Academy",
    image: "/badges/ethical-hacker.png",
    verifyHref:
      "https://www.credly.com/badges/b3e51bd9-2425-40e4-8dec-67cc4578a7e6/public_url",
  },
];

export type Certificate = {
  name: string;
  issuer: string;
  year: string;
  image: string;
};

export const certificates: Certificate[] = [
  {
    name: "Build Your Own AI Sidekick",
    issuer: "Indigo AI Connect",
    year: "2025",
    image: "/certificates/build-your-own-ai-sidekick.png",
  },
  {
    name: "Making Your Own 2G Network Private",
    issuer: "IDSECCONF × COCONUT (Makassar)",
    year: "2025",
    image: "/certificates/making-your-own-2G-network-private.png",
  },
  {
    name: "Cyber Security Penetration Testing",
    issuer: "ID-Networkers",
    year: "2026",
    image: "/certificates/cyber-security-penetration-testing.png",
  },
];

export type TimelineEntry = {
  period: string;
  title: string;
  org: string;
  detail: string;
};

export const timeline: TimelineEntry[] = [
  {
    period: "2020 to 2023",
    title: "SMK Teknik Komputer dan Jaringan",
    org: "SMKS Amamapare Energi Dan Pertambangan Mimika",
    detail:
      "Vocational program in Computer & Network Engineering, covering network installation and configuration, hardware assembly, and troubleshooting.",
  },
  {
    period: "2023 to Present",
    title: "S1 Teknik Informatika",
    org: "Universitas Muhammadiyah Makassar",
    detail: "Concentration in Computer Networks and Cyber Security.",
  },
  {
    period: "2024 to Present",
    title: "Executive Board (BPH)",
    org: "COCONUT Computer Club",
    detail:
      "Active member and executive board of a research-oriented computer club focused on cyber security, machine learning, and computer vision. Involved in community activities and collaborative research.",
  },
  {
    period: "2025",
    title: "Local Committee, IDSECCONF 2025",
    org: "IDSECCONF × COCONUT (Makassar)",
    detail:
      "Served on the local organizing committee for IDSECCONF 2025 in Makassar, Indonesia's largest hacker and cyber security conference, as part of COCONUT Computer Club.",
  },
];
