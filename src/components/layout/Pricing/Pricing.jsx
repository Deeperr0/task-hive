import { useState } from "react";
import PricingCard from "../../ui/PricingCard";
import Footer from "../../ui/Footer";
export default function Pricing() {
  const [pricingType, setPricingType] = useState(0); // 0 for monthly, 1 for annually
  const pricesYearly = [199.99, 249.99, 399.99];
  const pricesMonthly = [19.99, 24.99, 39.99];
  return (
    <div>
      <div className="flex flex-col items-center my-16 pb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl text-black text-center">
          Flexible Plans for Every Team
        </h2>
        <p className="text-base  text-center mt-4">
          {`This is just a placeholder for the pricing page. These prices are purely fictional`}
        </p>
        <div className="text-accent-50 flex gap-4 items-center mt-4 bg-accent-900 p-1 rounded-xl relative">
          <div
            className={`w-[45.5%] h-5/6 absolute bg-accent-500 rounded-lg z-0 transition-all duration-300 ${
              pricingType == 0
                ? "top-1 left-1"
                : "transform translate-x-full ml-4"
            }`}
          ></div>
          <button
            className={
              pricingType == 0
                ? "rounded-md px-6 py-1 z-10 text-center"
                : "border-0 rounded-md px-6 py-1 text-center"
            }
            onClick={() => setPricingType(0)}
          >
            Monthly
          </button>
          <button
            className={
              pricingType == 1
                ? "rounded-md px-6 py-1 z-10 text-center"
                : "border-0 rounded-md px-6 py-1 text-center"
            }
            onClick={() => setPricingType(1)}
          >
            Annually
          </button>
        </div>
        <div className="flex flex-col lg:flex-row mt-10 gap-12">
          <PricingCard
            packageName={"Basic"}
            price={"Free"}
            features={[
              "Basic Task Management",
              "Single Project Workspace",
              "Community Support",
            ]}
            buttonText={"Get Started"}
            mostPopular={false}
            priceType={null}
            description="Free plan for all users, no credit card required"
          />
          <PricingCard
            packageName={"Professional"}
            price={pricingType == 0 ? pricesMonthly[1] : pricesYearly[1]}
            features={[
              "Advanced Task Management",
              "Multiple Project Workspaces",
              "Priority Support",
              "Team Collaboration Tools",
            ]}
            buttonText={"LEARN MORE"}
            mostPopular={true}
            priceType={pricingType}
            description="Free plan for all users, no credit card required"
          />
          <PricingCard
            packageName={"Master"}
            price={pricingType == 0 ? pricesMonthly[2] : pricesYearly[2]}
            features={[
              "Custom Workspaces",
              "Unlimited Users & Projects",
              "Dedicated Account Manager",
              "Advanced Analytics & Reporting",
            ]}
            buttonText={"LEARN MORE"}
            mostPopular={false}
            priceType={pricingType}
            description="Free plan for all users, no credit card required"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
