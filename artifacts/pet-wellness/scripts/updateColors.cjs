const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const replacements = [
  // Backgrounds
  { regex: /#F5F5F0/gi, replacement: '#F7F5F2' },
  { regex: /#F7F3EC/gi, replacement: '#F7F5F2' },
  
  // Dark Sections
  { regex: /#111111/gi, replacement: '#12333B' },
  { regex: /#1C5B64/gi, replacement: '#12333B' },
  { regex: /#283120/gi, replacement: '#12333B' },
  { regex: /#1a1a1a/gi, replacement: '#12333B' },

  // CTAs (Citrine Orange)
  { regex: /bg-\[#C69C45\](?!\/)/g, replacement: 'bg-[#E38B2C]' }, // bg without opacity
  { regex: /hover:bg-\[#C69C45\]/g, replacement: 'hover:bg-[#E38B2C]' },
  { regex: /hover:text-\[#C69C45\]/g, replacement: 'hover:text-[#E38B2C]' },
  { regex: /hover:border-\[#C69C45\]/g, replacement: 'hover:border-[#E38B2C]' },
  { regex: /focus:ring-\[#C69C45\]/g, replacement: 'focus:ring-[#E38B2C]' },
  { regex: /bg-\[#b0883b\]/g, replacement: 'bg-[#C77722]' }, // hover state for gold, replace with darker orange
  { regex: /hover:bg-\[#b0883b\]/g, replacement: 'hover:bg-[#C77722]' },

  // Accents / Borders / Icons (Matte Gold)
  // Replaces remaining #C69C45
  { regex: /#C69C45/gi, replacement: '#B89D5D' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Color update complete.');
