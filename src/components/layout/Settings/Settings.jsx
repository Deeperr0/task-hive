import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../../App";
export default function Settings() {
  const { userData } = useContext(UserDataContext);
  const [updatedUserData, setUpdatedUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  useEffect(() => {
    if (!userData) return;

    setUpdatedUserData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    });
  }, [userData]);

  function updateField(e) {
    setUpdatedUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div className="text-black py-10 flex flex-col gap-4 [&_h5]:mb-4">
      <h4>Settings</h4>
      <div>
        <h5>Profile</h5>
        <div className="bg-white p-8 rounded-xl [&_input]:outline-none [&_input]:border [&_input]:border-neutral-500/10">
          <div className="flex justify-between items-center border-b border-neutral-300/50 py-4">
            <div className="flex gap-4 items-center">
              <div className="w-30 h-30 rounded-full overflow-hidden">
                <img
                  src="/home/hero-banner.webp"
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <p className="font-semibold text-lg">Profile photo</p>
                <p className="text-sm text-neutral-500">Update your photo</p>
              </div>
            </div>
            <div className="flex gap-2 h-fit font-medium">
              <button className="bg-neutral-500/10 px-4 py-2 border border-neutral-500/20">
                Remove
              </button>
              <button className="bg-accent-500 text-accent-50 px-4 py-2 border border-neutral-500">
                Change
              </button>
            </div>
          </div>
          <form className="border-b border-neutral-300/50 pt-8 pb-4 [&_input]:px-4 [&_input]:py-2 w-full flex flex-col gap-4">
            <div className="flex [&>div]:flex [&>div]:flex-col w-full gap-8">
              <div className="w-full">
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={updatedUserData.firstName ?? ""}
                  onChange={updateField}
                />
              </div>
              <div className="w-full">
                <label htmlFor="lastName">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={updatedUserData.lastName ?? ""}
                  onChange={updateField}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={updatedUserData.email ?? ""}
                onChange={updateField}
              />
            </div>
          </form>
          <div className="flex w-full justify-end">
            <button className="px-4 py-2 bg-accent-500 text-accent-50 mt-6">
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <div>
        <h5>Security</h5>
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
          <button>Save Changes</button>
        </div>
      </div>
      <div>
        <h5>Notifications</h5>
        <div></div>
      </div>
    </div>
  );
}
