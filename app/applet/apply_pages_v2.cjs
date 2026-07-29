const fs = require('fs');

const appFile = '/app/applet/src/App.tsx';
let content = fs.readFileSync(appFile, 'utf8');

const targetStartIndex = content.indexOf('{/* Bottom row advice tips */}');
if (targetStartIndex === -1) {
  console.error("Could not find start index of target!");
  process.exit(1);
}

const navCloseTag = '</nav>';
const targetEndIndex = content.indexOf(navCloseTag, targetStartIndex);
if (targetEndIndex === -1) {
  console.error("Could not find end index of target (nav close tag)!");
  process.exit(1);
}

const fullEndIndex = targetEndIndex + navCloseTag.length;

const newSections = fs.readFileSync('/app/applet/new_sections.txt', 'utf8');

const updatedContent = content.slice(0, targetStartIndex) + newSections + content.slice(fullEndIndex);

fs.writeFileSync(appFile, updatedContent, 'utf8');
console.log("SUCCESSFULLY COMPLETED INJECTION!");
process.exit(0);
