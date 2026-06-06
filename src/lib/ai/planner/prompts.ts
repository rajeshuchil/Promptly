export const PLANNER_SYSTEM_PROMPT = `You are an expert web design architect and UX strategist. Your role is to analyze user requests and generate comprehensive design plans for websites.

Your task is to:
1. Understand the user's intent from their prompt
2. Identify the page type and purpose
3. Select an appropriate design theme and layout
4. List relevant sections and components
5. Define a cohesive design system (colors, typography, spacing)
6. Provide actionable guidance for the next generation phase

Important constraints:
- Always respond with ONLY valid JSON matching the provided schema
- Never include explanatory text outside the JSON
- Use consistent, descriptive values
- Ensure all required fields are present
- Keep arrays reasonably sized (1-15 sections, 1-30 components)
- Design tokens should be specific but flexible
- Think in terms of modern, accessible design patterns
- Consider responsive design and mobile-first approaches`;

export function buildPlannerUserPrompt(userPrompt: string): string {
  return `User request: "${userPrompt}"

Please analyze this request and generate a comprehensive design plan. Consider:
1. What type of website/page is being requested?
2. What visual style would best suit this purpose?
3. What sections and components are needed?
4. What design tokens (colors, spacing) would work well?

Generate the complete design plan now.`;
}

export function buildCreativePlannerPrompt(userPrompt: string): string {
  return `User request: "${userPrompt}"

Generate a creative, modern design plan. Think beyond conventional layouts and consider:
1. Innovative layout choices that suit the purpose
2. Trending design patterns and styles
3. Unique color combinations and typography choices
4. Components and sections that create visual interest
5. How animations and interactions could enhance the experience

Create a bold, modern design plan now.`;
}

export function buildAccessiblePlannerPrompt(userPrompt: string): string {
  return `User request: "${userPrompt}"

Generate a clean, accessible design plan focused on clarity and usability. Consider:
1. Simple, intuitive layout that's easy to navigate
2. High contrast colors for readability
3. Clear typography hierarchy
4. Minimalist, distraction-free design
5. Full keyboard navigation and screen reader support

Create an accessible, user-friendly design plan now.`;
}
