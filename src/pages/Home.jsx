import React from 'react';
import Hero from '../components/Home/Hero';
import ComplianceBar from '../components/Home/ComplianceBar';
import CategoryShowcase from '../components/Home/CategoryShowcase';
import FeaturedDatasets from '../components/Home/FeaturedDatasets';
import HowItWorks from '../components/Home/HowItWorks';
import LatestAINews from '../components/Home/LatestAINews';
import Team from '../components/Home/Team';

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
        </div>
    );
};

export default Home;
