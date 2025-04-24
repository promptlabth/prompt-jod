const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Get the current directory (where the script is located)
const currentDir = __dirname;
// Go up one level to get to the project root
const projectRoot = path.resolve(currentDir, '..');
// Define paths relative to project root
const inputFile = path.join(projectRoot, 'public', 'icons', 'logo.webp');
const outputDir = path.join(projectRoot, 'public', 'icons');

// Add favicon sizes to the existing sizes
const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

async function generateIcons() {
  try {
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Created output directory: ${outputDir}`);
    }

    // Generate each size
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `logo-${size}x${size}.webp`);
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(outputFile);
      console.log(`Generated ${size}x${size} icon: ${outputFile}`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateIcons(); 