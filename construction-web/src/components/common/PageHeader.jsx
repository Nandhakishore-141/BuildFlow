import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PageHeader = ({ title, description, breadcrumbs, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-sm text-zinc-400 mb-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-gold-400 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-zinc-200 font-medium">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-zinc-600" />}
              </div>
            ))}
          </nav>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">{title}</h1>
        {description && <p className="text-zinc-400 mt-1 text-sm md:text-base leading-relaxed">{description}</p>}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};
