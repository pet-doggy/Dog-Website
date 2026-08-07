import fs from 'fs';
import path from 'path';

const src = 'C:\\Users\\User\\OneDrive\\Documents\\Ancestral-Essence\\Mini Logos\\Tricolor heart.png';
const dest = 'C:\\Users\\User\\OneDrive\\Documents\\Ancestral-Essence\\artifacts\\pet-wellness\\public\\tricolor-heart.png';

fs.copyFileSync(src, dest);
console.log('Copied successfully!');
