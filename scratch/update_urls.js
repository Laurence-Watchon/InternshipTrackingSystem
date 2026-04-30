import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src');

function walk(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('http://localhost:3001')) {
                console.log(`Updating ${fullPath}`);
                // Replace 'http://localhost:3001/...' with `${import.meta.env.VITE_API_URL}/...`
                // and handle the quotes (converting ' to `)
                let newContent = content.replace(/'http:\/\/localhost:3001([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
                fs.writeFileSync(fullPath, newContent);
            }
        }
    });
}

walk(srcDir);
console.log('Done!');
