/* ======================================================================
   config.js  —  YOUR CONTENT LIVES HERE  (this is the file you'll edit most)
   ----------------------------------------------------------------------
   Change the text between the quotes "like this". Don't delete the
   commas, quotes or brackets — they are part of how the code is written.
   Save the file (Ctrl+S / Cmd+S) and refresh the browser to see changes.
   ====================================================================== */

const SITE = {
  /* ---------- BASIC INFO ---------- */
  name: "Abenezer Ashenafi",                         // appears in the menu, intro and footer
  initials: "",                            // shown in the little logo box
  role: "Video Editor",
  location: "Adiss Ababa, Ethiopia",
  availability: "Available for new projects", // the pulsing green line at the top
  email: "abenezerashenafi50@gmail.com",               // used for the "mailto" links and the form

  /* ---------- SOCIAL LINKS ----------
     Paste the full link to each profile.
     Leave a link as "" (empty quotes) and that button is hidden automatically. */
  socials: {
    youtube: "",
    instagram: "https://www.instagram.com/abenezerab9638",
    tiktok: "",
   // linkedin: "", 
   //  telegram: "https://www.telegram.com/Abeniii2i"
    //x: "",
  },

  /* ---------- SHOWREEL (the big video at the top) ----------
     1. Put your video file in the folder  assets/videos/
     2. Write its path here, e.g.  "assets/videos/showreel.mp4"
     (Optional) showreelPoster = a picture shown before playing, e.g.
        "assets/images/showreel.jpg". If left empty, the first frame is used. */
  //showreel: "assets/videos/finalll.mp4",
  showreel: "https://res.cloudinary.com/yjion4xk/video/upload/v1794318242/videos/finalll.mp4",
  showreelPoster: "",

  /* ---------- NUMBERS in the About section ----------
     value = the number that counts up, suffix = what comes after it (+, %, k…) */
  stats: [
   // { value: 90, suffix: "+", label: "Videos edited" },
    { value: 2,   suffix: "",  label: "Years of experience" },
   // { value: 40,  suffix: "+", label: "Happy clients" },
    //{ value: 2,   suffix: "M+", label: "Views generated" },
  ],

  /* ---------- SOFTWARE ----------
     Used in the scrolling strip under the intro AND the "Tools I work with" chips. */
  tools: [
    "Premiere Pro",
    "After Effects",
   // "DaVinci Resolve",
    //"cupcut",
    //"Photoshop",
   // "Audition",
  ],

  /* ---------- YOUR VIDEOS ----------
     Every { ... } block below is ONE video card on the site.

       title       the name shown under the video
       category    used for the filter buttons (Promo, Shorts, Cinematic…).
                   Use the same spelling for videos that belong together.
       video       the path to your video file inside the assets/videos/ folder,
                   e.g. "assets/videos/my-promo.mp4"
                   (A YouTube link or a full https://….mp4 link also works.)
       poster      (optional) a picture shown on the card, e.g.
                   "assets/images/my-promo.jpg". Leave "" to use the video's first frame.
       description one short sentence about the video
       length      (optional) shown on the card, like "0:45"
       vertical    (optional) true for tall 9:16 videos. Detected automatically
                   for files, so you can usually skip it.

     TO ADD A VIDEO:    copy one whole { ... }, block, paste it below the last one.
     TO REMOVE A VIDEO: delete its whole { ... }, block.
     TO REORDER:        cut and paste blocks — the first one is shown first.
     If the file is missing or the name is spelled wrong, the card shows a
     "placeholder" look instead — a sign to check the file name!
     File names are case-sensitive and should have no spaces:  my-promo.mp4  ✓   My Promo.MP4  ✗ */
  videos: [
    {
      // title: "Documentary-style edit",
      // category: "Documentary",
       //video: "assets/videos/my ethio.mp4",
       video: "https://res.cloudinary.com/yjion4xk/video/upload/v1794318239/videos/my_ethio.mp4",
      // poster: "",
      // description: "Story-driven edit with interviews, B-roll and sound design.",
      // length: "1:20",
    },
    {
      // title: "Product launch promo",
      // category: "Commercial",
      // video: "assets/videos/Realestate.mp4",
      video: "https://res.cloudinary.com/yjion4xk/video/upload/v1794318253/videos/Realestate.mp4",
      // poster: "",
      // description: "A launch video with kinetic titles and punchy cuts.",
      // length: "1:00",
    },
    {
      // title: "Vertical short with a strong hook",
      // category: "Shorts",
       //video: "assets/videos/promo.mp4",
        video: "https://res.cloudinary.com/yjion4xk/video/upload/v1794318182/videos/promo.mp4",
      // poster: "",
      // description: "Fast-paced vertical edit with captions made for retention.",
      // length: "0:45",
    },
    {
      // title: "Cinematic travel film",
      // category: "Cinematic",
       //video: "assets/videos/motio.mp4",
       video: "https://res.cloudinary.com/yjion4xk/video/upload/v1794318269/videos/motio.mp4",
      // poster: "",
      // description: "Colour-graded travel story set to a custom-timed soundtrack.",
      // length: "1:15",
    },
    {
      // title: "Podcast highlight reel",
      // category: "Documentary",
      // video: "assets/videos/mhreth.mp4",
        video: "https://res.cloudinary.com/yjion4xk/video/upload/v1794319824/mhreth.mp4",
      // poster: "",
      // description: "The best moments of a long conversation, cut for social.",
      // length: "0:50",
    },
    {
      // title: "Brand story ad",
      // category: "Commercial",
       //video: "assets/videos/my.mp4",
       video: "https://res.cloudinary.com/yjion4xk/video/upload/v1794318246/videos/my.mp4",
      // poster: "",
      // description: "Emotional brand film mixing live action and motion graphics.",
      // length: "1:30",
    },
  ],
};
