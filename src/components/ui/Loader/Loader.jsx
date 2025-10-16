import "./Loader.css";
export default function Loader() {
  return (
    <div className="flex flex-col gap-4 text-center justify-center items-center h-screen m-auto overflow-hidden">
      <div className="spinner"></div>
      <div>
        <p className="text-black text-lg font-semibold">
          Loading your workspace...
        </p>
        <p className="text-neutral-500">
          Hang tight, we're preparing your tasks
        </p>
      </div>
    </div>
  );
}
