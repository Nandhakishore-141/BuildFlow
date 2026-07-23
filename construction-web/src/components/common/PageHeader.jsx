import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PageHeader = ({ title, description, breadcrumbs, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-sm text-neutral-500 mb-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-gold-600 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-neutral-700 font-medium">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4" />}
              </div>
            ))}
          </nav>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">{title}</h1>
        {description && <p className="text-neutral-500 mt-1">{description}</p>}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};
