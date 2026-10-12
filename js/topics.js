/* Speeka - Topics & Configuration Data */

const SLIDER_STOPS = [
  { label: '30s', val: 0.5 },
  { label: '45s', val: 0.75 },
  { label: '1 min', val: 1 },
  { label: '2 min', val: 2 },
  { label: '3 min', val: 3 },
  { label: '4 min', val: 4 },
  { label: '5 min', val: 5 },
  { label: '6 min', val: 6 },
  { label: '7 min', val: 7 },
  { label: '8 min', val: 8 },
  { label: '9 min', val: 9 },
  { label: '10 min', val: 10 },
];

const OPTIONS = [
  { label: '30s', val: 0.5 },
  { label: '45s', val: 0.75 },
];

const LV = {
  Beginner: {
    d: "Simple and super easy stories about you. No special prep needed.",
    w: [
      ["A time you failed and what you learned"], ["If you could tell your younger self one thing"],
      ["Something you changed your mind about"], ["A moment that shaped who you are"],
      ["A mistake you're glad you made"], ["Something you used to worry about but don't anymore"],
      ["A compliment you'll never forget"], ["The best decision you ever made"],
      ["A lesson you learned the hard way"], ["Something you wish you'd started earlier"],
      ["A goal you're working toward"], ["Something on your bucket list"],
      ["Where you want to be in five years"], ["A fear you'd like to overcome"],
      ["A risk you'd like to take"], ["What success means to you"],
      ["A project you'd start with unlimited time"], ["A place you'd love to live"],
      ["A skill you'd love to learn"], ["A habit you want to build"],
      ["Your ideal day"], ["Your favorite way to recharge"],
      ["A small thing that makes your day better"], ["A routine you can't live without"],
      ["Something you do to stay motivated"], ["How you handle a bad day"],
      ["A bad habit you're trying to break"], ["Your go-to way to relax"],
      ["What your perfect weekend looks like"], ["The best advice you ever got"],
      ["Someone who inspired you"], ["A teacher who made a difference"],
      ["The best advice you'd give a friend"], ["Someone you admire and why"],
      ["A person you're grateful for"], ["A time someone helped you when you needed it"],
      ["A time you helped someone else"], ["What you look for in a good friend"],
      ["A family tradition you love"], ["Something you're proud of"],
      ["Something you're still learning"], ["A challenge you overcame"],
      ["A time you stepped out of your comfort zone"], ["The hardest thing you've ever done"],
      ["A skill you're surprisingly good at"], ["Something you taught yourself"],
      ["A book, show, or video that changed your thinking"], ["A time you felt really proud of yourself"],
      ["A talent nobody knows you have"], ["The best day of your life so far"],
      ["A hobby you could talk about forever"], ["Something you're weirdly passionate about"],
      ["If you could have dinner with anyone"], ["Your dream job as a kid"],
      ["A superpower you'd choose and why"], ["Something that always makes you laugh"]
    ]
  },
  Intermediate: {
    d: "Take a stance, explain an idea, or make a case. Practice structure: point, reason, example.",
    w: [
      ["Is social media good for friendships?"], ["Why do people procrastinate?"],
      ["Is failure necessary for success?"], ["Should everyone learn to cook?"],
      ["Is luck more important than hard work?"], ["The value of silence"],
      ["Why first impressions matter"], ["Is multitasking a myth?"],
      ["Should school start later?"], ["What makes a good leader?"],
      ["Is money the key to happiness?"], ["The power of saying no"],
      ["Why we fear public speaking"], ["Is nostalgia helpful or harmful?"],
      ["Working from home vs. the office"], ["Should you follow your passion?"],
      ["Why people compare themselves to others"], ["Is it better to be liked or respected?"],
      ["How technology changes the way we think"], ["What makes a good listener?"],
      ["Is being busy a badge of honor?"], ["Why habits are hard to change"],
      ["Should you forgive and forget?"], ["The role of luck in careers"],
      ["Is travel worth the money?"], ["What makes a place feel like home?"],
      ["Why we love stories"], ["Is competition healthy?"],
      ["Should everyone have a mentor?"], ["How to make a good decision"],
      ["Is it ever okay to give up?"], ["The hidden cost of convenience"],
      ["Why friendships fade"], ["Does age matter for wisdom?"],
      ["How to handle criticism"], ["Is boredom good for you?"],
      ["Why we trust strangers online"], ["Should you tell the truth even when it hurts?"],
      ["What would you change about education?"], ["How algorithms shape our choices"],
      ["The difference between confidence and arrogance"], ["Is jealousy ever useful?"],
      ["What makes a good friend?"], ["Why waiting feels so hard"],
      ["Rules you would break and rules you wouldn't"], ["An invention the world could do without"],
      ["Libraries in the age of the internet"], ["Why we love maps and travel"]
    ]
  },
  Advanced: {
    d: "Explain a concept, argue a position, or persuade. Some topics are real ideas worth a quick look-up beforehand.",
    w: [
      ["The halo effect"], ["Growth mindset vs. fixed mindset"],
      ["The Dunning-Kruger effect"], ["Imposter syndrome"],
      ["The comfort zone and the growth zone"], ["Confirmation bias"],
      ["The sunk cost fallacy"], ["Parkinson's law"],
      ["The Pareto principle (80/20 rule)"], ["Flow state"],
      ["Deliberate practice"], ["Stoicism"],
      ["Ikigai"], ["Kaizen: continuous improvement"],
      ["The spotlight effect"], ["The hedonic treadmill"],
      ["Self-fulfilling prophecy"], ["The Zeigarnik effect"],
      ["The Pygmalion effect"], ["Delayed gratification"],
      ["Learned helplessness"], ["Cognitive dissonance"],
      ["Anchoring bias"], ["Survivorship bias"],
      ["Maslow's hierarchy of needs"], ["Locus of control"],
      ["Opportunity cost"], ["Antifragility"],
      ["The Peter principle"], ["The Eisenhower matrix"],
      ["Occam's razor"], ["The compound effect of small habits"],
      ["Is free will an illusion?"], ["Can a person truly change?"],
      ["Defend an opinion you disagree with"], ["Is privacy dead?"],
      ["Does success require sacrifice?"], ["What do we owe strangers?"],
      ["Is it more important to be right or to be kind?"], ["How does language shape thought?"],
      ["Is perfection the enemy of progress?"], ["Is happiness a goal or a byproduct?"],
      ["Is it ethical to lie for a good cause?"], ["Sell a product that doesn't exist yet"],
      ["Should AI make important decisions for us?"], ["Is originality still possible?"],
      ["Is ambition a virtue or a trap?"], ["What separates wisdom from intelligence?"],
      ["Are we defined by our choices or our circumstances?"], ["Is comfort making us weaker?"],
      ["Argue that the most boring job is the most important"], ["Persuade a skeptic to take a big risk"],
      ["Is it better to be a specialist or a generalist?"], ["Is time the most valuable resource we have?"]
    ]
  },
};

const BRIDGE = [
  "so basically",
  "the reason is",
  "what I mean is",
  "for example",
  "on top of that",
  "the thing is",
  "to be honest",
  "let me put it this way",
  "as far as I know",
  "another point is"
];
