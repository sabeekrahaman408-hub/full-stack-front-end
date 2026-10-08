// Keeps this page inside the standard centered container (same width/padding as before the redesign).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="container">{children}</div>
}
