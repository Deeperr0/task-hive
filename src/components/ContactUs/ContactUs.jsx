import emailjs from "emailjs-com";
import { useState } from "react";
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
				console.log("Email successfully sent!", result.text);
				alert("Message sent successfully!");
			})
			.catch((error) => {
				console.error("There was an error sending your message:", error);
				alert("Failed to send message.");
			});
	};

	return (
		<div className="flex flex-col lg:flex-row py-16 gap-16 lg:justify-between w-11/12 md:w-9/12 mx-auto">
			<div className="lg:w-1/3">
				<h1 className="text-4xl md:text-5xl font-semibold text-left text-accent-400 mb-8 !font-playfair">
					Contact Us
				</h1>
				<div>
					<p className="text-base text-accent-50">
						You can email us, call, or use the form to reach out for any
						inquiries. We're here to provide the support you need.
					</p>
				</div>
				<div className="flex flex-col gap-4 my-4">
					<p className="text-accent-300 font-medium !font-helvetica">
						info@taskhive.com
					</p>
					<p className="text-accent-300 font-medium !font-helvetica">
						+1 (123) 456-7890
					</p>
					<div>
						<a
							href="mailto:support@taskhive.com"
							className="text-accent-500 font-medium transition-colors underline hover:text-accent-300"
						>
							Customer Support
						</a>
					</div>
				</div>
				<div className="flex">
					<div className="space-y-8">
						<div className="space-y-4">
							<h2 className="text-2xl font-semibold text-accent-400 !font-playfair">
								Customer Support
							</h2>
							<p className="text-accent-50">
								Our support team is available 24/7 to address any concerns or
								queries you may have.
							</p>
						</div>

						<div className="space-y-4">
							<h2 className="text-2xl font-semibold text-accent-400 !font-playfair">
								Feedback & Suggestions
							</h2>
							<p className="text-accent-50">
								We value your feedback and are always looking to improve
								TaskHive. Your input is crucial in helping us grow.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-accent-50 p-8 rounded-lg shadow-lg lg:w-1/2 shrink-0 text-primary-900">
				<h2 className="text-2xl font-semibold text-accent-400 mb-6">
					Reach Out to Us
				</h2>
				<form
					className="space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col space-y-2">
						<label
							htmlFor="firstName"
							className="text-accent-50"
						>
							First Name
						</label>
						<input
							id="firstName"
							type="text"
							className="border border-accent-50 p-3 rounded-md focus:outline-none focus:border-indigo-500"
							placeholder=" Jin-Wu"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<label
							htmlFor="lastName"
							className="text-accent-50"
						>
							Last Name
						</label>
						<input
							id="lastName"
							type="text"
							className="border border-accent-50 p-3 rounded-md focus:outline-none focus:border-indigo-500"
							placeholder="Seong"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<label
							htmlFor="email"
							className="text-accent-50"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							className="border border-accent-50 p-3 rounded-md focus:outline-none focus:border-indigo-500"
							placeholder="you@example.com"
							value={formData.email}
							onChange={handleChange}
							name="email"
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<label
							htmlFor="phone"
							className="text-accent-50"
						>
							Phone Number
						</label>
						<input
							id="phone"
							type="tel"
							className="border border-accent-50 p-3 rounded-md focus:outline-none focus:border-accent-500"
							placeholder="+1 (123) 456-7890"
							value={formData.phone}
							onChange={handleChange}
							name="phone"
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<label
							htmlFor="message"
							className="text-accent-50"
						>
							How can we help?
						</label>
						<textarea
							id="message"
							className="border border-accent-50 p-3 rounded-md focus:outline-none focus:border-accent-500"
							rows="4"
							placeholder="Tell us more about how we can help you..."
							value={formData.message}
							onChange={handleChange}
							name="message"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-accent-600 text-white font-semibold py-3 rounded-md hover:bg-accent-500 transition-all"
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}
