"use client";

import { useState, useEffect } from "react";

export default function MusiciansPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/profiles/me", {
          credentials: "include",
        });
        const data = await response.json();
        setUser(data.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Welcome Back ${user} </h1>
    </div>
  );
}
