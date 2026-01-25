import { Layout } from '@/components/layout/Layout';
import { VideoHero } from '@/components/home/VideoHero';
import { FeaturedEssay } from '@/components/home/FeaturedEssay';
import { BioSection } from '@/components/home/BioSection';
import { SubstackCTA } from '@/components/home/SubstackCTA';
import { PersonSchema } from '@/components/seo/SEOHead';

const Index = () => {
  return (
    <Layout>
      <PersonSchema />
      <VideoHero />
      <FeaturedEssay />
      <BioSection />
      <SubstackCTA />
    </Layout>
  );
};

export default Index;
