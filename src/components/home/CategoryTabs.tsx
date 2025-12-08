import { cn } from '@/lib/utils';
import { categories } from '@/data/products';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="relative px-4 py-5">
      {/* Section Label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Browse</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      
      {/* Category Pills */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
            className={cn(
              "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-500 opacity-0 animate-slide-up",
              activeCategory === category.id
                ? "bg-foreground text-background shadow-elevated"
                : "bg-card text-foreground border border-border hover:border-foreground/30 hover:shadow-soft"
            )}
          >
            <span className="text-base">{category.icon}</span>
            <span className="font-body">{category.label}</span>
            {activeCategory === category.id && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
