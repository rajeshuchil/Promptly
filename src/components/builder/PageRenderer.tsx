import React from 'react';
import { PageSpec } from '@/lib/types/page-spec';
import { resolveComponent } from './registry';

interface PageRendererProps {
  spec: PageSpec;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ spec }) => {
  if (!spec || !spec.sections) {
    return (
      <div className="p-8 text-center text-slate-400">
        No page specification found.
      </div>
    );
  }

  // Fallback design tokens if undefined
  const tokens = spec.designTokens || {
    primaryColor: 'indigo-600',
    secondaryColor: 'violet-500',
    backgroundColor: 'slate-950',
    textColor: 'slate-50',
    borderRadius: 'lg',
    fontFamily: 'Inter',
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        fontFamily: tokens.fontFamily,
      }}
    >
      {spec.sections.map((section) => {
        const Component = resolveComponent(section.type, section.variant);
        return (
          <div key={section.id} id={section.id}>
            <Component {...section.props} variant={section.variant} tokens={tokens} />
          </div>
        );
      })}
    </div>
  );
};
