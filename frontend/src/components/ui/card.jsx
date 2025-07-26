export function Card({ children }) {
  return <div className="border rounded-lg shadow p-4 bg-white">{children}</div>;
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
