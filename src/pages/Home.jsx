import React from 'react';
import Hero from '../components/Home/Hero';
import ComplianceBar from '../components/Home/ComplianceBar';
import CategoryShowcase from '../components/Home/CategoryShowcase';
import FeaturedDatasets from '../components/Home/FeaturedDatasets';
import HowItWorks from '../components/Home/HowItWorks';
import LatestAINews from '../components/Home/LatestAINews';
import Team from '../components/Home/Team';
import Contact from '../components/Home/Contact';
import FAQ from '../components/Home/FAQ';

const Home = () => {
    return (
        <div className="home-container">
            <Hero />
            <ComplianceBar />
            <CategoryShowcase />
            <FeaturedDatasets />
            <HowItWorks />
            <Team />
            <LatestAINews />
            <FAQ />
            <Contact />
        </div>
    );
};

export default Home;
