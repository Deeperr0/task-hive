export default function Tabs({ tabs, activeTab, setActiveTab }) {
	return (
		<div className="flex justify-between border-b-2 border-gray-200">
			{tabs.map((tab) => (
				<button
					key={tab}
					onClick={() => setActiveTab(tab)}
					className={`${
						activeTab === tab
							? "border-b-2 border-accent-500"
							: "border-b-2 border-transparent"
					} px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700`}>
					{tab}
				</button>
			))}
		</div>
	);
}
