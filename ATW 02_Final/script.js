let Library = [
  "Time teaches softly what desire refuses to understand still.",
  "Every clock is a wound that pretends to be a promise indeed.",
  "We age not by years alone, but by what we fail to notice now",
  "The future arrives wearing the clothes of our habits indeed.",
  "Memory is time folded into the shape of a human soul indeed.",
  "Each moment dies so the next inherits unfinished work for us",
  "Time is the price consciousness pays for being awake indeed.",
  "What passes is never lost; it changes the way we remain now.",
  "We call it waiting when life advances without asking first..",
  "Regret is the echo of time heard too late within us at last.",
  "The hour hand moves like fate: slowly, then all at once now.",
  "Time does not heal; it rearranges the room around pain anew.",
  "To live is to borrow seconds from an unknown lender at last.",
  "Yesterday survives as architecture inside the present minds.",
  "The present is brief because awareness cannot remain at rest",
  "Time humbles empires and ripens the smallest kindness today.",
  "We measure time to avoid admitting that we fear change anew.",
  "Delay is often the soul negotiating with mortality each day.",
  "The future is shaped by what today refuses to postpone anew.",
  "Some moments are vast enough to make years feel small today.",
  "Time reveals character by subtracting what can be faked now.",
  "Patience is the art of trusting unseen movement in the dark.",
  "The soul feels oldest when the day feels most familiar anew.",
  "Time is unseen, yet all things wear its fingerprints for all",
  "We lose ourselves whenever we mistake motion for meaning now",
  "Every ending teaches beginnings how to speak honestly for us",
  "The clock counts evenly, but suffering does not at all here.",
  "Time is mercy for wounds and cruelty for illusions each day.",
  "To remember is to let the past breathe through the now anew.",
  "Hours are simple; a life is not, and never was at all, ever.",
  "The future tests the sincerity of every intention with care.",
  "What we repeat becomes the biography of our days with grace.",
  "Time asks one question in many forms: what matters now anew?",
  "A season changes first in the heart, then in the world anew.",
  "The past is heavy because it travels without a body at last.",
  "Time keeps no favorites, only consequences for all deeds now",
  "We grow wise when urgency no longer pretends to be truth now",
  "Silence lets time reveal what noise tries to conceal indeed.",
  "Each dawn is old light discovering a younger name with care.",
  "Time is not empty; it is crowded with becoming each day. now",
  "The deadline and the deathbed ask similar questions at last.",
  "We fear wasted time because it resembles wasted spirit now..",
  "Love alters time by thickening the meaning of minutes today.",
  "Time turns certainty into costume and doubt into skin today.",
  "An hour well seen is richer than a year half-lived each day.",
  "The present disappears while we attempt to possess it today.",
  "Time leaves gently, but absence announces it loudly at last.",
  "Mortality gives the morning its sharp and tender edge today.",
  "The longest journey is from someday to today, at long last..",
  "Time is a mirror that reflects no face the same twice, ever."
];

let lastSecond, lastMinute, lastHour;
let hist, currentSentence, currentLine;
let clockDiv;
let index;
let sentIndex = 0;
let bar = "";
let waiting = false;

function setup() {
  lastSecond = second();
  lastMinute = minute();
  lastHour = hour();

  hist = "";
  currentSentence = Library[sentIndex];
  currentLine = "";

  clockDiv = createDiv("");
  clockDiv.style("font-family", "monospace");
  clockDiv.style("font-size", "14px");
  clockDiv.style("white-space", "pre-wrap");

  index = 0;

  if (second() !== 0) {
    waiting = true;
  }
}

function draw() {
  let h = hour();
  let m = minute();
  let s = second();

  // blinking cursor
  if (frameCount % 60 < 25) {
    bar = "█";
  } else {
    bar = "";
  }

  // loads until s = 0, does not show incomplete sentences
  if (waiting) {
    if (m !== lastMinute) {
      waiting = false;
      lastSecond = s;
      lastMinute = m;
      lastHour = h;
      currentLine = "";
      index = 0;
    } else {
      clockDiv.html("Loading..." + bar);
      return;
    }
  }

  //second
  if (s !== lastSecond) {
    if (index < currentSentence.length) {
      index++;
    }
    currentLine = currentSentence.substring(0, index);
    lastSecond = s;
  }

  //minute
  if (m !== lastMinute) {
    // save finished line
    hist += currentLine + "\n\n";

    //hour
    if (m === 0) {
    }
    else if (m % 10 === 0) {
      hist += "----- " + h + ":" + nf(m, 2) + " -----\n";
    }

    sentIndex = (sentIndex + 1) % Library.length;
    currentSentence = Library[sentIndex];

    currentLine = "";
    index = 0;

    lastMinute = m;
  }

  if (h !== lastHour) {
    hist += "------- " + h + ":00 -------\n";
    lastHour = h;
  }
  clockDiv.html(hist + currentLine + bar);
}



