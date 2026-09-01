import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { cn } from '@/utils/cn';

export function FormHeader({
  title,
  description,
  showBackButton = false,
  onBackClick,
  align = 'center',
  className,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={cn(
        'relative mb-6',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {showBackButton && (
        <button
          type="button"
          onClick={handleBack}
          className="absolute -top-1.5 left-0 p-2 -ml-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all focus:outline-none flex items-center justify-center cursor-pointer"
          aria-label="Go back"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
      )}

      <div className={cn(showBackButton && 'pt-8 sm:pt-0')}>
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100 leading-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
