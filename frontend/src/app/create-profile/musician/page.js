"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function CreateMusicianProfile() {
  const router = useRouter();
  // Register connects inputs to form, handleSubmit wrats submit function
  // formState.errors contains validation error messages
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange", // Validate as user types
    defaultValues: {
      // Default values
      available_for_gigs: true,
      looking_for_band: false,
    },
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Submit Handler
  const onSubmit = async (data) => {
    // Convert instruments string to array
    const formattedData = {
      ...data,
      instruments: data.instruments.split(",").map((item) => item.trim()),
    };

    // Debug:
    console.log("Sending to backend:", formattedData);
    console.log("Instruments type", typeof formattedData.instruments);
    console.log("Instruments Value:", formattedData.instruments);

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/profiles/musician", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        // Success! Redirect to dashboard
        router.push("/dashboard/musician");
      } else {
        console.error("Error:", result);
        // Handle errors
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Your Profile
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              id="name"
              type="text"
              {...register("name", {
                required: "Name is requied",
                maxLength: {
                  value: 100,
                  message: "Name can not be more than 100 characters",
                },
              })}
              placeholder="Full Name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              id="location"
              type="text"
              {...register("location", {
                required: "Location is requied",
              })}
              placeholder="Location"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="instruments"
              className="block text-sm font-medium text-gray-700"
            >
              Instruments
            </label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              id="instruments"
              type="text"
              {...register("instruments", {
                required: "Instruments required",
              })}
              placeholder="Instruments"
            />
            {errors.instruments && (
              <p className="mt-1 text-sm text-red-600">
                {errors.instruments.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="experience_level"
              className="block text-sm font-medium text-gray-700"
            >
              Experience Level
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="beginner"
                  type="radio"
                  value="beginner"
                  {...register("experience_level", {
                    required: "Experience Level Required",
                  })}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="beginner"
                  className="ml-2 text-sm text-gray-700"
                >
                  Beginner
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="intermediate"
                  type="radio"
                  value="intermediate"
                  {...register("experience_level", {
                    required: "Experience Level Required",
                  })}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="intermediate"
                  className="ml-2 text-sm text-gray-700"
                >
                  Intermediate
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="professional"
                  type="radio"
                  value="professional"
                  {...register("experience_level", {
                    required: "Experience Level Required",
                  })}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="professional"
                  className="ml-2 text-sm text-gray-700"
                >
                  Professional
                </label>
              </div>
            </div>
            {errors.experience_level && (
              <p className="mt-1 text-sm text-red-600">
                {errors.experience_level.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {isLoading ? "Creating..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
