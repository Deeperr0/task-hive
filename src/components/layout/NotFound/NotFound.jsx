import Footer from "../../ui/Footer";
import Navbar from "../Navbar";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-between h-full">
      <Navbar />
      <div className="text-2xl text-black text-center flex flex-col gap-4 h-full md:py-50">
        <div className="text-danger flex justify-center w-full">
          <svg
            width={"5em"}
            height={"5em"}
            fill="currentColor"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-4"
          >
            <path
              fill="currentColor"
              d="M64 32.2c-4.4 0-8 3.3-8 7.3v24.8c0 4.1 3.6 7.3 8 7.3s8-3.3 8-7.3V39.5c0-4.1-3.6-7.3-8-7.3zM64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7s57.6 25.7 57.6 57.3c0 31.7-25.8 57.3-57.6 57.3zm0-40.1c-4.4 0-8 3.3-8 7.3s3.6 7.3 8 7.3 8-3.3 8-7.3-3.6-7.3-8-7.3z"
            />
          </svg>
        </div>
        <h1 className="font-semibold">404 - Page Not Found</h1>
        <p className="text-neutral-400">
          Oops! It looks like the page you're looking for doesn't exist or has
          been moved
        </p>
      </div>
      <Footer />
    </div>
  );
}
