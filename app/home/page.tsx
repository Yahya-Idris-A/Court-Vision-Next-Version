import React from "react";
import Carousel from "@/components/partials/carousel";
import FeatureCard from "@/components/cards/featureCard";
import ClientsCard from "@/components/cards/clientsCard";
import FaqList from "@/components/cards/faqsCard";

const slides = [
  { src: "/carousel/Content-1.png", alt: "Slide 1" },
  { src: "/carousel/Content-2.png", alt: "Slide 2" },
  { src: "/carousel/Content.png", alt: "Slide 3" },
];

const page = () => {
  return (
    <div>
      {/* Hero Section */}
      <Carousel slides={slides} />
      {/* Content */}
      <div className="mx-[100px] mb-[100px] max-sm:mx-[20px]">
        {/* Feature Section */}
        <h1 className="text-black text-[48px] font-semibold text-center my-[32px] max-sm:my-[8px] max-sm:text-[24px]">
          How It Works
        </h1>
        <div className="flex flex-row justify-between items-center gap-[100px] max-sm:gap-2.5 max-xl:gap-4">
          <FeatureCard
            cover="/features/ToddBoehly.png"
            heading="Upload"
            description="Your Existing Video."
          />
          <FeatureCard
            cover="/features/ToddBoehly.png"
            heading="Analyse"
            description="With Tools and Data."
          />
          <FeatureCard
            cover="/features/ToddBoehly.png"
            heading="Improve"
            description="Your Team."
          />
        </div>
        {/* Client Section */}
        <h1 className="text-black text-[48px] font-semibold text-center my-[32px] max-sm:my-[8px] max-sm:text-[24px]">
          Our Clients
        </h1>
        <ClientsCard />
        {/* FAQ Section */}
        <h1 className="text-black text-[48px] font-semibold text-center my-[32px] max-sm:my-[8px] max-sm:text-[24px]">
          Frequently Asked Question
        </h1>
        <FaqList />
      </div>
    </div>
  );
};

export default page;
