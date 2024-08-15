import { useState } from "react";
import Navbar from "../Navbar";
import PricingCard from "../PricingCard";
export default function Pricing() {
	const [pricingType, setPricingType] = useState(0); // 0 for monthly, 1 for annually
	const pricesYearly = [199.99, 249.99, 399.99];
	const pricesMonthly = [19.99, 24.99, 39.99];
	return (
		<div>
			<Navbar
				user={null}
				setToggleMenu={null}
			/>
			<div className="flex flex-col items-center mt-16">
				<h2 className="text-5xl text-customText">
					Flexible Plans for Every Team
				</h2>
				<p className="text-base text-customText text-center mt-4">
					{`This is just a placeholder for the pricing page. These prices are purely fictional`}
				</p>
				<div className="text-customBackground flex gap-4 items-center mt-4 bg-accentShade2 p-1 rounded-lg">
					<button
						className={
							pricingType == 0
								? "bg-accent rounded-md px-6 py-1"
								: "border-0  rounded-md px-6 py-1"
						}
						onClick={() => setPricingType(0)}
					>
						Monthly
					</button>
					<button
						className={
							pricingType == 1
								? "bg-accent rounded-md px-6 py-1"
								: "border-0  rounded-md px-6 py-1"
						}
						onClick={() => setPricingType(1)}
					>
						Annually
					</button>
				</div>
				<div className="flex mt-10">
					<PricingCard
						packageName={"Basic"}
						price={pricingType == 0 ? pricesMonthly[0] : pricesYearly[0]}
						features={[
							"500 GB of storage",
							"2 Users Allowed",
							"Send Up to 3 GB",
						]}
						buttonText={"LEARN MORE"}
						mostPopular={false}
						priceType={pricingType}
					/>
					<PricingCard
						packageName={"Professional"}
						price={pricingType == 0 ? pricesMonthly[1] : pricesYearly[1]}
						features={[
							"1 TB of storage",
							"5 Users Allowed",
							"Help center access",
						]}
						buttonText={"LEARN MORE"}
						mostPopular={true}
						priceType={pricingType}
					/>
					<PricingCard
						packageName={"Master"}
						price={pricingType == 0 ? pricesMonthly[2] : pricesYearly[2]}
						features={[
							"2 TB of storage",
							"10 Users Allowed",
							"Send up to 20 GB",
						]}
						buttonText={"LEARN MORE"}
						mostPopular={false}
						priceType={pricingType}
					/>
				</div>
			</div>
		</div>
	);
}
