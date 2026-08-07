const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\User\\OneDrive\\Documents\\Ancestral-Essence\\The Last Session\\Small Banner';
const destDir = 'C:\\Users\\User\\OneDrive\\Documents\\Ancestral-Essence\\artifacts\\pet-wellness\\public\\small-banner';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
    if (file.endsWith('.png')) {
        const srcFile = path.join(srcDir, file);
        const destFile = path.join(destDir, file);
        fs.copyFileSync(srcFile, destFile);
        console.log(`Copied ${file}`);
    }
});
