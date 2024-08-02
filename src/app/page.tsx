import CookiesConsent from "@/components/cookies-consent";
import {Container, Main, Section} from "@/components/craft";
import CTA from "@/components/home-page/cta";
import FeatureLeft from "@/components/home-page/feature-left";
import FeatureRight from "@/components/home-page/feature-right";
import FeatureSet from "@/components/home-page/feature-set";
import Footer from "@/components/home-page/footer";
import Hero from "@/components/home-page/hero";
import Pricing from "@/components/home-page/pricing";
import {NavBar} from "@/components/navbar";
import {Suspense} from "react";

export default function Home() {
  return (
    <>
      <Suspense>
        <NavBar />
      </Suspense>

      <Main>
        <Section>
          <Container>
            <Hero />
            <FeatureLeft />
            <FeatureRight />
            <FeatureSet />
            <CTA />
            <Pricing />
            <Footer />
          </Container>
        </Section>
      </Main>

      <CookiesConsent />
    </>
  );
}
