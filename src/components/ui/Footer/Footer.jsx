export default function Footer() {
  return (
    <footer className="text-lg font-medium border-t border-t-gray-800/20 py-8 text-neutral-600">
      <div className="flex justify-between mx-auto text-center w-9/12">
        <div>
          <ul className="flex gap-5">
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
          </ul>
        </div>
        <p className="">&copy; 2025 TaskHive. All rights reserved.</p>
      </div>
    </footer>
  );
}
