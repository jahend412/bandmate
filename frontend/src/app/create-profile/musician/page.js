"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function CreateMusicianProfile() {
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
  const onSubmit = (data) => {
    console.log("Form data:", data);
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
              Name *
            </label>
            <input
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
              Location *
            </label>
            <input
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
