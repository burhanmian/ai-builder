import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, message, model = "gpt-4" } = body;

    if (!projectId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Save user message
    await prisma.message.create({
      data: {
        role: "user",
        content: message,
        model,
        projectId,
        userId: session.user.id,
      },
    });

    // Generate AI response based on model
    let aiResponse: string;
    
    try {
      aiResponse = await generateAIResponse(message, model, project);
    } catch (error) {
      console.error("AI generation error:", error);
      aiResponse = "I apologize, but I encountered an error generating the code. Please try again or check your API key configuration.";
    }

    // Save AI response
    const assistantMessage = await prisma.message.create({
      data: {
        role: "assistant",
        content: aiResponse,
        model,
        projectId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: assistantMessage,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function generateAIResponse(
  userMessage: string,
  model: string,
  project: { type: string; framework: string; files: unknown }
): Promise<string> {
  const systemPrompt = `You are an expert code generator for ${project.framework} ${project.type} applications.
Your task is to help the user build their application by generating clean, production-ready code.
When generating code, always:
1. Use TypeScript with proper types
2. Follow best practices for ${project.framework}
3. Include helpful comments
4. Structure code for maintainability

Current project files: ${JSON.stringify(project.files)}

Respond with the code changes needed. Format file changes as:
\`\`\`filename.tsx
// code here
\`\`\``;

  // Check which API is available
  if (model.startsWith("gpt") && process.env.OPENAI_API_KEY) {
    return await callOpenAI(systemPrompt, userMessage, model);
  } else if (model.startsWith("claude") && process.env.ANTHROPIC_API_KEY) {
    return await callAnthropic(systemPrompt, userMessage, model);
  } else if (model.startsWith("gemini") && process.env.GOOGLE_API_KEY) {
    return await callGoogle(systemPrompt, userMessage, model);
  } else {
    // Return a demo response when no API keys are configured
    return generateDemoResponse(userMessage, project);
  }
}

async function callOpenAI(systemPrompt: string, userMessage: string, model: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model === "gpt-4" ? "gpt-4-turbo-preview" : "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "No response generated";
}

async function callAnthropic(systemPrompt: string, userMessage: string, model: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model === "claude-3" ? "claude-3-opus-20240229" : "claude-3-sonnet-20240229",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || "No response generated";
}

async function callGoogle(systemPrompt: string, userMessage: string, model: string): Promise<string> {
  const modelName = model === "gemini-pro" ? "gemini-pro" : "gemini-1.5-pro";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemPrompt}\n\nUser request: ${userMessage}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || "No response generated";
}

function generateDemoResponse(userMessage: string, project: { type: string; framework: string }): string {
  // Demo response when no API keys are configured
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("landing") || lowerMessage.includes("home")) {
    if (project.framework === "react" || project.framework === "nextjs") {
      return `I'll create a beautiful landing page for you! Here's the code:

\`\`\`src/components/LandingPage.tsx
import React from 'react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">My App</h1>
          <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition">
            Get Started
          </button>
        </nav>
      </header>
      
      <main className="container mx-auto px-6 py-20">
        <div className="text-center text-white">
          <h2 className="text-5xl font-bold mb-6">
            Welcome to the Future
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Build amazing applications with AI-powered code generation.
            Fast, reliable, and beautiful.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-purple-600 transition">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
\`\`\`

This creates a modern landing page with a gradient background, navigation, and a hero section. You can customize the colors and content as needed!`;
    }
  }
  
  if (lowerMessage.includes("button") || lowerMessage.includes("component")) {
    return `Here's a reusable button component:

\`\`\`src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200';
  
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
\`\`\`

This button component supports multiple variants and sizes!`;
  }

  return `I understand you want to: "${userMessage}"

To generate code with AI models (GPT-4, Claude, or Gemini), please configure the following environment variables:
- OPENAI_API_KEY for GPT models
- ANTHROPIC_API_KEY for Claude models
- GOOGLE_API_KEY for Gemini models

For now, here's a basic template to get you started with your ${project.framework} project!`;
}
