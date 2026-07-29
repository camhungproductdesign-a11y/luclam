const fs = require('fs');

const appFile = '/app/applet/src/App.tsx';
let content = fs.readFileSync(appFile, 'utf8');

// A super robust way to find the replacement boundaries is to search for the unique comments:
// 1. "Bottom row advice tips"
// 2. "</nav>" which is the first closing nav tag after that.
const targetStartIndex = content.indexOf('{/* Bottom row advice tips */}');
if (targetStartIndex === -1) {
  console.error("Could not find start index of target!");
  process.exit(1);
}

// Find the "</nav>" closing tag after targetStartIndex
const navCloseTag = '</nav>';
const targetEndIndex = content.indexOf(navCloseTag, targetStartIndex);
if (targetEndIndex === -1) {
  console.error("Could not find end index of target (nav close tag)!");
  process.exit(1);
}

const fullEndIndex = targetEndIndex + navCloseTag.length;

// Read new sections raw text file
const newSections = fs.readFileSync('/app/applet/new_sections.txt', 'utf8');

// Combine!
const updatedContent = content.slice(0, targetStartIndex) + newSections + content.slice(fullEndIndex);

fs.writeFileSync(appFile, updatedContent, 'utf8');
console.log("SUCCESSFULLY COMPLETED INJECTION!");
