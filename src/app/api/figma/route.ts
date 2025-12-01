import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { figmaUrl, framework = "react" } = body;

    if (!figmaUrl) {
      return NextResponse.json(
        { error: "Figma URL is required" },
        { status: 400 }
      );
    }

    // Parse Figma URL to extract file key and node ID
    const urlPattern = /figma\.com\/(file|design)\/([a-zA-Z0-9]+)/;
    const match = figmaUrl.match(urlPattern);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid Figma URL format" },
        { status: 400 }
      );
    }

    const fileKey = match[2];

    // Check if Figma API token is configured
    if (!process.env.FIGMA_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          code: generateDemoFigmaCode(framework),
          message: "Figma API token not configured. Returning demo component.",
        },
        { status: 200 }
      );
    }

    // Fetch Figma file data
    const figmaResponse = await fetch(
      `https://api.figma.com/v1/files/${fileKey}`,
      {
        headers: {
          "X-Figma-Token": process.env.FIGMA_ACCESS_TOKEN,
        },
      }
    );

    if (!figmaResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Figma file" },
        { status: 400 }
      );
    }

    const figmaData = await figmaResponse.json();
    const code = convertFigmaToCode(figmaData, framework);

    return NextResponse.json({ code });
  } catch (error) {
    console.error("Error processing Figma design:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function convertFigmaToCode(figmaData: FigmaFile, framework: string): string {
  const document = figmaData.document;
  const componentName = sanitizeComponentName(document.name);

  if (framework === "react-native") {
    return generateReactNativeCode(componentName, document);
  }

  return generateReactCode(componentName, document);
}

function sanitizeComponentName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, "")
    .replace(/^[0-9]/, "_$&")
    || "Component";
}

interface FigmaNode {
  name: string;
  type: string;
  children?: FigmaNode[];
  fills?: Array<{ type: string; color?: { r: number; g: number; b: number; a: number } }>;
  absoluteBoundingBox?: { width: number; height: number };
  style?: {
    fontSize?: number;
    fontWeight?: number;
    lineHeightPx?: number;
  };
  characters?: string;
}

interface FigmaFile {
  document: FigmaNode;
}

function generateReactCode(componentName: string, document: FigmaNode): string {
  const styles = extractStyles(document);
  
  return `import React from 'react';

interface ${componentName}Props {
  className?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ className }) => {
  return (
    <div className={\`${styles.containerClass} \${className || ''}\`}>
      ${generateChildren(document.children || [])}
    </div>
  );
};

export default ${componentName};
`;
}

function generateReactNativeCode(componentName: string, document: FigmaNode): string {
  return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ${componentName}Props {
  style?: object;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      ${generateReactNativeChildren(document.children || [])}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default ${componentName};
`;
}

function extractStyles(node: FigmaNode): { containerClass: string } {
  const classes: string[] = [];
  
  if (node.absoluteBoundingBox) {
    const { width } = node.absoluteBoundingBox;
    if (width > 600) classes.push("w-full max-w-4xl");
    else if (width > 400) classes.push("w-full max-w-2xl");
  }
  
  if (node.fills && node.fills[0]?.color) {
    const { r, g, b } = node.fills[0].color;
    if (r > 0.9 && g > 0.9 && b > 0.9) classes.push("bg-white");
    else if (r < 0.1 && g < 0.1 && b < 0.1) classes.push("bg-gray-900");
  }
  
  classes.push("p-4 rounded-lg");
  
  return { containerClass: classes.join(" ") };
}

function generateChildren(children: FigmaNode[]): string {
  return children.map((child) => {
    if (child.type === "TEXT") {
      const textClass = child.style?.fontSize && child.style.fontSize > 24 
        ? "text-2xl font-bold"
        : "text-base";
      return `<p className="${textClass}">${child.characters || "Text"}</p>`;
    }
    if (child.type === "RECTANGLE" || child.type === "FRAME") {
      return `<div className="p-4 bg-gray-100 rounded">
        ${child.children ? generateChildren(child.children) : ""}
      </div>`;
    }
    return "";
  }).filter(Boolean).join("\n      ");
}

function generateReactNativeChildren(children: FigmaNode[]): string {
  return children.map((child) => {
    if (child.type === "TEXT") {
      return `<Text style={styles.text}>${child.characters || "Text"}</Text>`;
    }
    if (child.type === "RECTANGLE" || child.type === "FRAME") {
      return `<View style={{ padding: 16 }}>
        ${child.children ? generateReactNativeChildren(child.children) : ""}
      </View>`;
    }
    return "";
  }).filter(Boolean).join("\n      ");
}

function generateDemoFigmaCode(framework: string): string {
  if (framework === "react-native") {
    return `import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Converted from Figma Design
export const FigmaComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Converted from Figma</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Feature 1</Text>
          <Text style={styles.cardDescription}>
            This component was generated from your Figma design.
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Feature 2</Text>
          <Text style={styles.cardDescription}>
            Customize it to match your needs.
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FigmaComponent;`;
  }

  return `import React from 'react';

// Converted from Figma Design
export const FigmaComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome</h1>
          <p className="text-gray-600 mt-2">Converted from Figma</p>
        </header>
        
        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Feature 1</h2>
            <p className="text-gray-600">
              This component was generated from your Figma design.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Feature 2</h2>
            <p className="text-gray-600">
              Customize it to match your needs.
            </p>
          </div>
        </div>
        
        {/* CTA Button */}
        <button className="w-full md:w-auto bg-violet-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-violet-700 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default FigmaComponent;`;
}
