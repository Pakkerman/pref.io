"use client";

import { useState } from "react";

export default function LoginForm({ didSubmit }) {
  const [results, setResults] = useState(null);
  const handleForm = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const jsonData = JSON.stringify(data);
    const endpoint = "api/auth/register";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();
    console.log(result);
    setResults(result);
    didSubmit();
  };

  return (
    <>
      <form className="flex flex-col gap-2 items-center" onSubmit={handleForm}>
        <input
          className="text-black w-full"
          type="text"
          name="username"
          placeholder="Username"
        />
        <input
          className="text-black w-full"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button
          className="border-[0.5px] p-2 rounded-xl hover:bg-orange-900"
          type="submit"
        >
          Login
        </button>
        <pre>{JSON.stringify(results, null, 4)}</pre>
      </form>
    </>
  );
}
