import JSZip from "jszip";
import type { ProjectFile } from "@/types";

export async function exportProjectAsZip(
  projectName: string,
  files: ProjectFile[]
): Promise<void> {
  const zip = new JSZip();

  // Add each file to the ZIP
  for (const file of files) {
    zip.file(file.path, file.content);
  }

  // Add package.json
  zip.file(
    "package.json",
    JSON.stringify(
      {
        name: projectName.toLowerCase().replace(/\s+/g, "-"),
        version: "1.0.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
        },
        dependencies: {
          react: "^18",
          "react-dom": "^18",
          next: "14",
        },
        devDependencies: {
          typescript: "^5",
          "@types/node": "^20",
          "@types/react": "^18",
          "@types/react-dom": "^18",
          tailwindcss: "^3",
          autoprefixer: "^10",
          postcss: "^8",
        },
      },
      null,
      2
    )
  );

  // Add README
  zip.file(
    "README.md",
    `# ${projectName}

This project was generated with [CodeMe](https://codeme.app).

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

This project uses:
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://typescriptlang.org) - Type safety
`
  );

  // Generate and download the ZIP file
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
