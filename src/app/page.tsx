import { Header } from '@/components/header';
import { MainVisualizer } from '@/components/shunting-yard/main-visualizer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <MainVisualizer />
      </main>
    </div>
  );
}
