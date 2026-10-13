import { CategoriesSection } from '@/widgets/categoriesSection/CategoriesSection';
import { HeroSection } from '@/widgets/heroSection/HeroSection';
import { MobileBottomNav } from '@/widgets/mobileBottomNav/MobileBottomNav';
import { RecentlyAddedSection } from '@/widgets/recentlyAddedSection/RecentlyAddedSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background pb-22 md:pb-0">
      <HeroSection />
      <CategoriesSection />
      <RecentlyAddedSection />
      <MobileBottomNav />
    </main>
  );
}
