import { TopNav } from "./top-nav";
import { Footer } from "./footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopNav />
      <main className="px-4 md:px-6 flex-grow">
        <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
