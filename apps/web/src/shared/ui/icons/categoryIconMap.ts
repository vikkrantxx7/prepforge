import { BookOpenCheck } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { JavascriptIcon } from './JavascriptIcon';
import { NodejsIconAltIcon } from './NodeIcon';
import { ReactIcon } from './ReactIcon';
import { AmazonChimeIcon } from './SystemDesignIcon';

export type CategoryIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const categoryIconMap: Record<string, CategoryIconComponent> = {
  javascript: JavascriptIcon,
  react: ReactIcon,
  nodejs: NodejsIconAltIcon,
  'node.js': NodejsIconAltIcon,
  'system-design': AmazonChimeIcon,
};

export const resolveCategoryIcon = (
  categorySlug: string | null | undefined,
): CategoryIconComponent => {
  if (!categorySlug) {
    return BookOpenCheck;
  }

  return categoryIconMap[categorySlug.toLowerCase()] ?? BookOpenCheck;
};
