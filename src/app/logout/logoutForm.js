"use client";

import Link from "next/link";

export default function LogoutForm() {
  const handleForm = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const jsonData = JSON.stringify(data);
    const endpoint = "api/auth/logout";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    };

    const response = await fetch(endpoint, options);
    if (response.status === 200) {
      window.location.href = "/";
    }
  };

  return (
    <>
      <form className="flex flex-col gap-2 items-center" onSubmit={handleForm}>
        <h1>Are you sure you want to logout?</h1>
        <button
          className="border-[0.5px] p-2 rounded-xl hover:bg-orange-900"
          type="submit"
        >
          Logout
        </button>
        <Link href="/">Home</Link>
      </form>
    </>
  );
}
