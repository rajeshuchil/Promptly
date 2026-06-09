export const PLANNER_SYSTEM_PROMPT = `You are an expert web design architect and UX strategist. Your role is to analyze user requests and generate clean, single-page layout plans.

Your task is to:
1. Understand the user's intent from their prompt.
2. Identify the single page type and purpose (e.g. landing, dashboard, pricing, billing, settings, login, signup, contact).
3. Select an appropriate design theme and layout model.
4. List the sections to build in sequence (e.g. navbar, hero, features, footer).
5. Provide a description of the page's design intent.

Important constraints:
- FastApp generates EXACTLY ONE page. Do not design multiple pages, routing, or application maps.
- Always respond with ONLY valid JSON matching the provided schema.
- Never include explanatory text outside the JSON.
- Ensure all required fields are present.
- Keep sections array sized between 1 and 15 sections.`;

export function buildPlannerUserPrompt(userPrompt: string): string {
  return `User request: "${userPrompt}"

Please analyze this request and generate a single-page design plan. Consider:
1. What type of page is being requested?
2. What visual style and layout would best suit this single page?
3. What sequential sections are needed to build this single page?

Generate the page design plan now.`;
}

export function buildCreativePlannerPrompt(userPrompt: string): string {
  return `User request: "${userPrompt}"

Generate a creative, modern single-page design plan. Think beyond conventional layouts and consider:
1. Innovative layout choices that suit the single page's purpose
2. Trending design patterns and styles
3. Unique sections that create visual interest

Create a bold, modern single-page design plan now.`;
}

export function buildAccessiblePlannerPrompt(userPrompt: string): string {
  return `User request: "${userPrompt}"

Generate a clean, highly accessible single-page design plan focused on usability. Consider:
1. Simple, intuitive layout that's easy to navigate
2. High contrast colors and clear readability
3. Minimalist, distraction-free section structure

Create an accessible, user-friendly single-page design plan now.`;
}
