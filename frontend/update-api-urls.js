// This script will update all hardcoded API URLs in the frontend code
// Run this with Node.js after setting up the api.js file

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The old API URL pattern to search for
const OLD_API_URL = "https://mern-blog-ha28.onrender.com/api/v1";

// The new API pattern that uses our api.js config
const NEW_API_IMPORT = "import api from '../lib/api';";
const AXIOS_IMPORT = "import axios from 'axios';";

async function processFile(filePath) {
  try {
    // Read the file content
    let content = await fs.promises.readFile(filePath, "utf8");

    // Check if the file imports axios but not our api
    if (
      content.includes(AXIOS_IMPORT) &&
      !content.includes("import api from")
    ) {
      // Add the api import after axios import
      content = content.replace(
        AXIOS_IMPORT,
        `${AXIOS_IMPORT}\nimport api from '../lib/api';`
      );
    }

    // Replace axios calls with hardcoded URLs to use our api instance
    content = content.replace(
      new RegExp(`axios\\.get\\(\`${OLD_API_URL}(.+?)\\)`, "g"),
      "api.get(`/api/v1$1)"
    );

    content = content.replace(
      new RegExp(`axios\\.post\\(\`${OLD_API_URL}(.+?)\\)`, "g"),
      "api.post(`/api/v1$1)"
    );

    content = content.replace(
      new RegExp(`axios\\.put\\(\`${OLD_API_URL}(.+?)\\)`, "g"),
      "api.put(`/api/v1$1)"
    );

    content = content.replace(
      new RegExp(`axios\\.delete\\(\`${OLD_API_URL}(.+?)\\)`, "g"),
      "api.delete(`/api/v1$1)"
    );

    // Remove the withCredentials option where it appears with our api instance
    content = content.replace(
      /api\.(get|post|put|delete)\((.+?),\s*{\s*withCredentials:\s*true\s*}\)/g,
      "api.$1($2)"
    );

    // Save the file
    await fs.promises.writeFile(filePath, content, "utf8");
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

async function traverseDirectory(dir) {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (file !== "node_modules" && file !== "dist" && file !== "build") {
        await traverseDirectory(filePath);
      }
    } else if (
      stat.isFile() &&
      (file.endsWith(".js") || file.endsWith(".jsx"))
    ) {
      await processFile(filePath);
    }
  }
}

// Start the process from the src directory
const srcDir = path.join(__dirname, "src");
traverseDirectory(srcDir)
  .then(() => console.log("All files updated successfully"))
  .catch((err) => console.error("Error:", err));
