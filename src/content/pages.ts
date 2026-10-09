// Prose for the text pages. The HTML pages, the Markdown renderings and llms.txt all read from here.

export type Segment = string | { text: string; href: string };
export type Paragraph = Segment[];

/** The first paragraph is the lead. */
export const aboutParagraphs: Paragraph[] = [
  [
    "I’m super interested in inference engineering. I like figuring out how to make models run well when the hardware is limited, the network is unpredictable and someone has to operate the thing once it is deployed.",
  ],
  [
    "At Meta, I worked on the disaster recovery drain tests. I built an agent that automated planning six weeks of upcoming simulations, including which regions to drain. I also built a system that shared high-risk services with the team before each test.",
  ],
  [
    "I then built an eval framework around those predictions. It compared them with the SEVs that actually came out of a drain, helped separate prediction misses from service onboarding gaps and gave the team a dashboard to look through past tests and individual incidents.",
  ],
  [
    "Before Meta, I worked on AWS deployment infrastructure and CI/CD, built an LLM pipeline for inventory automation and contributed Kotlin and Android functionality to Pocket Paint through Google Summer of Code.",
  ],
  [
    "Outside work, I maintain ",
    { text: "Dictate", href: "/projects/dictate" },
    ", a native Android text-to-speech app with 90K+ installs.",
  ],
  [
    "Right now I am building ",
    { text: "EveryGPU", href: "/projects/everygpu" },
    ", a distributed inference experiment across remote GPUs.",
  ],
];

/** Shown on /contact under the email address and links. */
export const contactParagraphs: Paragraph[] = [
  [
    "Email is the best way to reach me. I’m glad to talk about roles in infrastructure, reliability and inference engineering, about how I approached the projects on this site, or about problems where the systems underneath a product matter as much as the product.",
  ],
  [
    "LinkedIn works too. For anything tied to code, open an issue or discussion on the relevant repository on GitHub so the context stays with the project. My resume is available to download from the link above.",
  ],
  [
    "I’m based in Los Angeles, California, where I’m studying for a Master of Science in Computer Science at the University of Southern California. Say what you are working on, what you would like from me, and any timing that matters, and I’ll reply from there.",
  ],
];

export const privacyUpdated = "2026-10-09";

/** Plain statements of what this site does with visitor data. */
export const privacyParagraphs: Paragraph[] = [
  [
    "This is a personal portfolio site. It has no accounts, no sign-up, no comment forms and no advertising, and it does not set cookies of its own.",
  ],
  [
    "The site uses Vercel Web Analytics to count visits. It records the page that was viewed, the referring site, the country the request came from, and the browser, operating system and device type. It does not use cookies and does not follow you across other sites. I use the counts to see which pages get read and for nothing else.",
  ],
  [
    "The hosting provider, Vercel, also processes standard request data such as your IP address and user agent in order to serve the pages and keep the service secure. That processing is governed by Vercel’s own privacy policy.",
  ],
  [
    "If you email me, I receive your address and whatever you write. I use it to reply and keep the conversation as long as it is useful, and I do not share it or add it to a mailing list. You can ask me to delete it at any time.",
  ],
  [
    "Links on this site lead to services I do not control, including LinkedIn, GitHub and Google Drive, where the resume is hosted. Those services have their own privacy practices once you follow a link.",
  ],
  [
    "The public JSON API and the Markdown versions of these pages serve the same public content as the website. They do not require authentication and do not collect anything beyond the standard request data described above.",
  ],
  [
    "Questions about this policy, or requests about data you have sent me, go to the email address on the contact page. If the policy changes, this page is updated and the date above changes with it.",
  ],
];
