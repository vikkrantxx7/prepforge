import { landingPageApi } from '@/shared/lib/api/landingPageApi';
import { CategoriesSection } from '@/widgets/categoriesSection/CategoriesSection';
import { HeroSection } from '@/widgets/heroSection/HeroSection';
import { MobileBottomNav } from '@/widgets/mobileBottomNav/MobileBottomNav';
import { RecentlyAddedSection } from '@/widgets/recentlyAddedSection/RecentlyAddedSection';

export default async function HomePage() {
  const { categories, questions } = await landingPageApi.data();

  return (
    <main className="min-h-screen bg-background pb-22 md:pb-0">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <RecentlyAddedSection questions={questions} />
      <MobileBottomNav />
    </main>
  );
}
