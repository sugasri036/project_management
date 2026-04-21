import { Link } from "react-router-dom";

const Logo = (props: { url?: string }) => {
  const { url = "/" } = props;
  return (
    <div className="flex items-center justify-center sm:justify-start">
      <Link to={url} className="flex items-center gap-2 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg text-white transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-cyan-500/25 ring-1 ring-white/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            <path d="M12 22v-5" />
            <path d="M12 12v5" />
            <circle cx="12" cy="12" r="2" className="fill-white/30 stroke-none animate-pulse" />
          </svg>
        </div>
        <div className="hidden md:flex flex-col">
          <span className="font-bold text-xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Aura
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors">
            Workspace
          </span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
