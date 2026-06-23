import Hero from '../../components/tenant/home/Hero';
import CategoryChips from '../../components/tenant/home/CategoryChips';
import FeaturedProperties from '../../components/tenant/home/FeaturedProperties';
import InfoSections from '../../components/tenant/home/InfoSections';
import RightRail from '../../components/tenant/home/RightRail';

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
      <div className="min-w-0 space-y-8">
        <Hero />
        <CategoryChips />
        <FeaturedProperties />
        <InfoSections />
      </div>
      <aside className="min-w-0">
        <RightRail />
      </aside>
    </div>
  );
}
