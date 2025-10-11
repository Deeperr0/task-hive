import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import emailjs from "emailjs-com";
import { useState } from "react";
import Footer from "../../ui/Footer";
emailjs.init(import.meta.env.VITE_EMAIL_JS_USER_ID);
export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        import.meta.env.VITE_EMAIL_JS_FORM_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_FORM_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAIL_JS_USER_ID
      )
      .then((result) => {
        alert("Message sent successfully!");
      })
      .catch((error) => {
        alert("Failed to send message.");
      });
  };

  return (
    <div>
      <div className="text-black flex flex-col py-20 gap-16 lg:justify-between w-11/12 md:w-9/12 mx-auto">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold text-center mb-8">
            Contact Us
          </h1>
          <div>
            <p className="text-base text-center">
              You can email us, call, or use the form to reach out for any
              inquiries. We're here to provide the support you need.
            </p>
          </div>
          <div className="flex gap-20 my-16">
            <div className="w-9/12 bg-white p-8 rounded-xl shadow-lg text-primary-900">
              <h4 className="text-2xl font-semibold mb-6">Reach Out to Us</h4>
              <form
                className="space-y-6 [&_input]:bg-neutral-500/10 [&_textarea]:bg-neutral-500/10"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col space-y-2">
                  <label htmlFor="firstName" className="">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="border border-accent-50 p-3 rounded-md focus:outline-hidden focus:border-indigo-500"
                    placeholder=" Jin-Wu"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="lastName" className="">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="border border-accent-50 p-3 rounded-md focus:outline-hidden focus:border-indigo-500"
                    placeholder="Seong"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="border border-accent-50 p-3 rounded-md focus:outline-hidden focus:border-indigo-500"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="phone" className="">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="border border-accent-50 p-3 rounded-md focus:outline-hidden focus:border-accent-500"
                    placeholder="+1 (123) 456-7890"
                    value={formData.phone}
                    onChange={handleChange}
                    name="phone"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="message" className="">
                    How can we help?
                  </label>
                  <textarea
                    id="message"
                    className="border border-accent-50 p-3 rounded-md focus:outline-hidden focus:border-accent-500"
                    rows="4"
                    placeholder="Tell us more about how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    name="message"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent-500 text-white font-semibold py-3 rounded-md hover:bg-accent-450 transition-all"
                >
                  Submit
                </button>
              </form>
            </div>
            <div>
              <div className=" [&_svg]:text-accent-500 text-neutral-500 shadow-xl bg-white p-10 py-8 rounded-xl font-medium">
                <div className="flex flex-col gap-5 w-1/2 [&>div]:flex [&>div]:gap-2 [&>div]:items-center">
                  <h5 className="text-black font-semibold">
                    Contact Information
                  </h5>
                  <div>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <p className="font-helvetica!">info@taskhive.com</p>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faPhone} />
                    <p className="font-helvetica!">+1 (123) 456-7890</p>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <div>
                      <p className="font-helvetica!">123 Productivity Lane</p>
                      <p className="font-helvetica!">
                        Cityville, State, Country 00-000
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 rounded-xl overflow-hidden">
                <img
                  src="/home/hero-banner.webp"
                  alt="contact-us"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
