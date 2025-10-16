export default function Tab({ tab, activeTab, setActiveTab, tabText }) {
  return (
    <>
      <div
        onClick={() => setActiveTab(tab)}
        className={`py-2 px-5 ${
          tab === activeTab
            ? "text-accent-500 border-b-2 border-b-accent-500 transition-all duration-300 font-semibold"
            : "border-b-2 border-transparent text-neutral-500"
        }`}
      >
        {tabText}
      </div>
    </>
  );
}
