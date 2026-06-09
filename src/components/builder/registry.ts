import React from 'react';

// Temporary Mock/Placeholder components for resolving
const PlaceholderComponent = (name: string): React.FC<any> => {
  const Comp: React.FC<any> = (props) => {
    return React.createElement(
      'div',
      { className: 'p-8 border-2 border-dashed border-slate-700 rounded-lg text-center bg-slate-900/50' },
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
    saas: PlaceholderComponent('SaasNavbar'),
    minimal: PlaceholderComponent('MinimalNavbar'),
    dashboard: PlaceholderComponent('DashboardNavbar'),
  },
  hero: {
    split: PlaceholderComponent('SplitHero'),
    centered: PlaceholderComponent('CenteredHero'),
    gradient: PlaceholderComponent('GradientHero'),
    minimal: PlaceholderComponent('MinimalHero'),
  },
  features: {
    'three-column': PlaceholderComponent('ThreeColumnFeatures'),
  },
  pricing: {
    simple: PlaceholderComponent('SimplePricing'),
    'three-tier': PlaceholderComponent('ThreeTierPricing'),
  },
  footer: {
    minimal: PlaceholderComponent('MinimalFooter'),
  }
};

export function resolveComponent(type: string, variant: string): ComponentResolver {
  const variants = ComponentRegistry[type];
  if (!variants) {
    return PlaceholderComponent(`Unknown Section type: ${type}`);
  }
  return variants[variant] || variants[Object.keys(variants)[0]] || PlaceholderComponent(`Unknown Variant for ${type}: ${variant}`);
}
