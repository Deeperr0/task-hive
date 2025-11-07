export default function Settings() {
	return (
		<div className="text-black">
			<h2>Settings</h2>
			<div>
				<h3>Profile</h3>
				<div className="bg-white p-8 rounded-xl">
					<div className="flex justify-between border-b border-neutral-300/50">
						<div className="flex gap-2">
							<div>
								<img src="" alt="" />
							</div>
							<p>Profile photo</p>
							<p>Update your photo</p>
						</div>
						<div>
							<button>Remove</button>
							<button>Change</button>
						</div>
					</div>
					<form className="flex justify-between border-b border-neutral-300/50">
						<div>
							<label htmlFor="firstName">
								<span>First name</span>
								<input type="text" name="firstName" id="firstName" />
							</label>
							<label htmlFor="lastName">
								<span>Last name</span>
								<input type="text" name="lastName" id="lastName" />
							</label>
						</div>
						<label htmlFor="email">
							<span>Email Address</span>
							<input type="email" name="email" id="email" />
						</label>
					</form>
					<button>Save Changes</button>
				</div>
			</div>
			<div>
				<h3>Security</h3>
				<div className="bg-white p-8 rounded-xl">
					<div className="border-b border-neutral-300/50">
						<p>Change password</p>
						<p>Update your password for enhanced security</p>
						<form>
							<div>
								<label htmlFor="currentPassword">Current Password</label>
								<input
									type="password"
									name="currentPassword"
									id="currentPassword"
								/>
							</div>
							<div>
								<label htmlFor="newPassword">New Password</label>
								<input type="password" name="newPassword" id="newPassword" />
							</div>
						</form>
						<div>
							<div>
								<p>Two-Factor Authentication</p>
								<p>Enable two-factor authentication for added security</p>
							</div>
							<input type="checkbox" />
						</div>
					</div>
					<form className="flex justify-between border-b border-neutral-300/50">
						<div>
							<label htmlFor="firstName">
								<span>First name</span>
								<input type="text" name="firstName" id="firstName" />
							</label>
							<label htmlFor="lastName">
								<span>Last name</span>
								<input type="text" name="lastName" id="lastName" />
							</label>
						</div>
						<label htmlFor="email">
							<span>Email Address</span>
							<input type="email" name="email" id="email" />
						</label>
					</form>
					<button>Save Changes</button>
				</div>
			</div>
			<div>
				<h3>Notifications</h3>
				<div></div>
			</div>
		</div>
	);
}
