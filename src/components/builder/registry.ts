import React from 'react';
import { SaasNavbar } from '../library/navbar/SaasNavbar';
import { MinimalNavbar } from '../library/navbar/MinimalNavbar';
import { SplitHero } from '../library/hero/SplitHero';
import { CenteredHero } from '../library/hero/CenteredHero';
import { ThreeColumnFeatures } from '../library/features/ThreeColumnFeatures';
import { ThreeTierPricing } from '../library/pricing/ThreeTierPricing';
import { MinimalFooter } from '../library/footer/MinimalFooter';
import { BentoFeatureGrid } from '../library/features/BentoFeatureGrid';
import { TestimonialsCarousel } from '../library/testimonials/TestimonialsCarousel';
import { NewsletterCTA } from '../library/cta/NewsletterCTA';

// Fallback Mock Component for missing types/variants
const PlaceholderComponent = (name: string): React.FC<any> => {
  const Comp: React.FC<any> = (props) => {
    return React.createElement(
      'div',
      { className: 'p-8 border-2 border-dashed border-slate-750 rounded-lg text-center bg-slate-900/50' },
      React.createElement('h3', { className: 'text-lg font-bold text-slate-100' }, `${name} Section (${props.variant || 'default'})`),
      React.createElement('pre', { className: 'mt-2 text-xs text-slate-400 overflow-x-auto text-left' }, JSON.stringify(props, null, 2))
    );
  };
  Comp.displayName = name;
  return Comp;
};

export type ComponentResolver = React.ComponentType<any>;

export const ComponentRegistry: Record<string, Record<string, ComponentResolver>> = {
  navbar: {
    saas: SaasNavbar,
    minimal: MinimalNavbar,
    dashboard: SaasNavbar, // fallback
  },
  hero: {
    split: SplitHero,
    centered: CenteredHero,
    gradient: CenteredHero, // fallback
    minimal: CenteredHero, // fallback
  },
  features: {
    'three-column': ThreeColumnFeatures,
  },
  'feature-grid': {
    'three-column-v1': BentoFeatureGrid,
    'bento-v1': BentoFeatureGrid,
  },
  testimonials: {
    'grid-v1': TestimonialsCarousel,
    'carousel-v1': TestimonialsCarousel,
  },
  pricing: {
    simple: ThreeTierPricing, // fallback
    'three-tier': ThreeTierPricing,
  },
  'call-to-action': {
    'newsletter-v1': NewsletterCTA,
  },
  footer: {
    minimal: MinimalFooter,
  }
};

export function resolveComponent(type: string, variant: string): ComponentResolver {
  const variants = ComponentRegistry[type];
  if (!variants) {
    return PlaceholderComponent(`Unknown Section type: ${type}`);
  }
  return variants[variant] || variants[Object.keys(variants)[0]] || PlaceholderComponent(`Unknown Variant for ${type}: ${variant}`);
}
