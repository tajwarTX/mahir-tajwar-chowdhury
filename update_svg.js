const fs = require('fs');
let content = fs.readFileSync('src/components/CuttingMatLayer.jsx', 'utf8');

// Update absolute positioning to be much larger
content = content.replace(
  /top: '-100vh',[\s\S]*height: 'calc\(100% \+ 200vh\)',/,
  `top: '-300vh',\n        left: '-300vw',\n        width: '800vw',\n        height: 'calc(100% + 800vh)',`
);
content = content.replace(
  /top: '-50vh',[\s\S]*height: 'calc\(100% \+ 100vh\)',/, // in case it failed previous replace
  `top: '-300vh',\n        left: '-300vw',\n        width: '800vw',\n        height: 'calc(100% + 800vh)',`
);

// Update Number arrays to cover the huge size
content = content.replace(/length: 41/g, 'length: 200');
content = content.replace(/length: 90/g, 'length: 300');

// Update Angle lines to extend endlessly
content = content.replace(/x2="3000" y2="3000"/g, 'x2="25000" y2="25000"');
content = content.replace(/x2="3000" y2="1732"/g, 'x2="25000" y2="14433"');
content = content.replace(/x2="1732" y2="3000"/g, 'x2="14433" y2="25000"');

fs.writeFileSync('src/components/CuttingMatLayer.jsx', content);
