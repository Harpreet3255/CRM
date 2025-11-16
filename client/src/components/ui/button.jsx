export function Button({ children, onClick, className = "", variant = "default", size = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500";
  const variants = {
    default: "bg-purple-600 hover:bg-purple-700 text-white",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
  };
  const sizes = {
    default: "px-4 py-2 rounded-lg text-sm",
    icon: "p-2 rounded-lg",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
