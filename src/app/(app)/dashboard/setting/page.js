"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState({
    email: "",
    username: "",
    role: "",
    status: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return; // Don't run if email isn't ready

    let isMounted = true;
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/admin/users", {
          params: { email: session.user.email },
        });
        if (isMounted) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [session?.user?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage("Failed to update profile: " + data.error);
      }
    } catch (error) {
      setMessage("Failed to update profile: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  if (loading || status === "loading") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="animate-pulse bg-zinc-900 h-64 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-xl space-y-4"
      >
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div className="w-full">
          <label htmlFor="role" className="block text-sm font-medium mb-2">
            Role
          </label>
          <span className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
            {user.role}
          </span>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={user.status}
            onChange={handleChange}
            className=" px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2  bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition"
          >
            Save Changes
          </button>
          <button
            onClick={() => signOut()}
            className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
          >
            Sign out
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 ${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
