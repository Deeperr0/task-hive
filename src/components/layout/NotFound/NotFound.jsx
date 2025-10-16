import Footer from "../../ui/Footer";
import Navbar from "../Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <h1>404 - Page Not Found</h1>
      <p>
        Oops! It looks like the page you're looking for doesn't exist or has
        been moved
      </p>
      <Footer />
    </>
  );
}
