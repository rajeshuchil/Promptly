import type { Plan } from "../planner/schemas";

export interface QualityScores {
  layoutCompleteness: number; // 0-100
  responsiveness: number;     // 0-100
  accessibility: number;      // 0-100
  visualHierarchy: number;    // 0-100
  sectionConsistency: number; // 0-100
  overallScore: number;       // 0-100
}

export interface QualityReport {
  scores: QualityScores;
  feedback: {
    layoutCompleteness: string[];
    responsiveness: string[];
    accessibility: string[];
    visualHierarchy: string[];
    sectionConsistency: string[];
  };
  passed: boolean;
}

export class QualityEvaluator {
  private static instance: QualityEvaluator;

  private constructor() {}

  public static getInstance(): QualityEvaluator {
    if (!QualityEvaluator.instance) {
      QualityEvaluator.instance = new QualityEvaluator();
    }
    return QualityEvaluator.instance;
  }

  /**
   * Evaluate HTML quality against the generated plan and design catalog rules.
   */
  public evaluate(html: string, plan?: Plan): QualityReport {
    const feedback = {
      layoutCompleteness: [] as string[],
      responsiveness: [] as string[],
      accessibility: [] as string[],
      visualHierarchy: [] as string[],
      sectionConsistency: [] as string[],
    };

    // 1. Layout Completeness Score
    let layoutScore = 70; // baseline
    if (plan?.sections && plan.sections.length > 0) {
      let matchedSectionsCount = 0;
      for (const section of plan.sections) {
        const regex = new RegExp(`id=["']${section}["']|class=["'][^"']*(?:${section}|section)[^"']*["']|<${section}\\b`, "i");
        if (regex.test(html)) {
          matchedSectionsCount++;
        }
      }
      const matchPercentage = (matchedSectionsCount / plan.sections.length) * 100;
      layoutScore = Math.round(50 + (matchPercentage / 2)); // map to 50-100
      feedback.layoutCompleteness.push(
        `Matched ${matchedSectionsCount} out of ${plan.sections.length} planned sections (${Math.round(matchPercentage)}% match).`
      );
    } else {
      // General layout check
      const pageSections = (html.match(/<section/g) || []).length;
      if (pageSections >= 4) {
        layoutScore = 90;
        feedback.layoutCompleteness.push(`Found ${pageSections} sections, indicating good content coverage.`);
      } else {
        layoutScore = 65;
        feedback.layoutCompleteness.push(`Found only ${pageSections} sections. Suggest adding more section elements.`);
      }
    }

    // 2. Responsiveness Score
    let responseScore = 50;
    const viewportMeta = /<meta[^>]*name=["']viewport["']/i.test(html);
    const hasResponsiveTailwind = /sm:|md:|lg:|xl:|2xl:/i.test(html);
    const hasFlexOrGrid = /class=["'][^"']*(?:flex|grid)[^"']*["']/i.test(html);

    if (viewportMeta) responseScore += 15;
    if (hasResponsiveTailwind) responseScore += 25;
    if (hasFlexOrGrid) responseScore += 10;

    if (!viewportMeta) {
      feedback.responsiveness.push("Missing viewport meta tag for device scaling.");
    }
    if (!hasResponsiveTailwind) {
      feedback.responsiveness.push("Missing responsive class modifiers (e.g. md:, lg:). Layout might be static.");
    } else {
      feedback.responsiveness.push("Responsive breakpoints detected in class names.");
    }
    if (hasFlexOrGrid) {
      feedback.responsiveness.push("Using CSS flexbox or grid container models.");
    }

    // 3. Accessibility Score
    let accessScore = 50;
    const altTagsCount = (html.match(/<img[^>]*\balt=/gi) || []).length;
    const totalImgs = (html.match(/<img\b/gi) || []).length;
    const hasAria = /aria-label|aria-expanded|aria-hidden|role=/i.test(html);
    const landmarkTags = /<header|<nav|<main|<footer|<aside/gi.test(html);

    const imgMatchOk = totalImgs === 0 || altTagsCount === totalImgs;
    if (imgMatchOk) accessScore += 15;
    if (hasAria) accessScore += 15;
    if (landmarkTags) accessScore += 20;

    if (totalImgs > 0 && altTagsCount < totalImgs) {
      feedback.accessibility.push(`Missing alt description attributes on ${totalImgs - altTagsCount} image tags.`);
    } else if (totalImgs > 0) {
      feedback.accessibility.push("All images include descriptive alt tags.");
    }
    if (!hasAria) {
      feedback.accessibility.push("Consider using ARIA attributes (e.g. aria-label) on interactive toggle buttons.");
    } else {
      feedback.accessibility.push("Aria descriptors or roles are declared on elements.");
    }
    if (!landmarkTags) {
      feedback.accessibility.push("Missing landmark tags (<header>, <nav>, <main>, <footer>).");
    } else {
      feedback.accessibility.push("Correctly uses semantic landmark tags.");
    }

    // 4. Visual Hierarchy Score
    let hierarchyScore = 60;
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    const hasH2 = /<h2\b/i.test(html);
    const hasH3 = /<h3\b/i.test(html);
    const fontSizesScale = /text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)/.test(html);

    if (h1Count === 1) hierarchyScore += 15;
    if (h1Count > 1) {
      feedback.visualHierarchy.push(`Found ${h1Count} <h1> headings. Multiple <h1> tags violate hierarchy.`);
    }
    if (hasH2 && hasH3) hierarchyScore += 15;
    if (fontSizesScale) hierarchyScore += 10;

    if (h1Count === 0) {
      feedback.visualHierarchy.push("Missing page h1 heading.");
    }
    if (!hasH2) {
      feedback.visualHierarchy.push("No h2 sub-headings found to divide layout zones.");
    }
    if (fontSizesScale) {
      feedback.visualHierarchy.push("Typographic scale size modifiers successfully used.");
    }

    // 5. Section Consistency Score
    let consistencyScore = 70;
    if (plan?.theme) {
      const lowerTheme = plan.theme.toLowerCase();
      // Check if theme matches some patterns
      if (lowerTheme === "dark" || lowerTheme === "glassmorphism") {
        const hasDarkColors = /bg-(?:black|gray-950|slate-950|zinc-950|#0|#11)/i.test(html);
        if (hasDarkColors) {
          consistencyScore += 20;
          feedback.sectionConsistency.push(`Styling colors correspond appropriately to "${plan.theme}" mode.`);
        } else {
          consistencyScore -= 10;
          feedback.sectionConsistency.push(`Dark theme specified, but light background color triggers detected.`);
        }
      } else if (lowerTheme === "minimal") {
        const hasMinimalClasses = /bg-white|text-zinc|border-zinc-200/i.test(html);
        if (hasMinimalClasses) {
          consistencyScore += 20;
          feedback.sectionConsistency.push("Styling elements match the Minimalist profile.");
        }
      } else {
        consistencyScore += 15;
      }
    } else {
      feedback.sectionConsistency.push("Theme details not supplied; styling consistency baseline applied.");
    }

    // Cap scores
    const cap = (score: number) => Math.min(100, Math.max(0, score));
    const scores = {
      layoutCompleteness: cap(layoutScore),
      responsiveness: cap(responseScore),
      accessibility: cap(accessScore),
      visualHierarchy: cap(hierarchyScore),
      sectionConsistency: cap(consistencyScore),
      overallScore: 0,
    };

    scores.overallScore = Math.round(
      (scores.layoutCompleteness +
        scores.responsiveness +
        scores.accessibility +
        scores.visualHierarchy +
        scores.sectionConsistency) /
        5
    );

    return {
      scores,
      feedback,
      passed: scores.overallScore >= 80,
    };
  }
}
