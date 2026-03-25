import React from 'react';
import {Navbar} from "../../components/home/sections/navbar.tsx";
import {HeroSection} from "../../components/home/sections/heroSection.tsx";
import {FeatureSection} from "../../components/home/sections/featureSection.tsx";
import {FooterSection} from "../../components/home/sections/footerSection.tsx";

export const Home = () => {
    return (
        <div className="w-full relative overflow-hidden">
            {/*<div className="block w-px h-full border-l border-border fixed top-0 left-6 z-10"></div>*/}
            {/*<div className="block w-px h-full border-r border-border fixed top-0 right-6 z-10"></div>*/}
            <Navbar />
            <main>
                <HeroSection/>
                <FeatureSection/>
            </main>
            <FooterSection />
        </div>
    )
}
