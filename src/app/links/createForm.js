"use client";

import { useState } from "react";

export default function LinksCreateForm() {
  const [results, setResults] = useState(null);
  const handleForm = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const jsonData = JSON.stringify(data);
    const endpoint = "api/links/";

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
  };

  return (
    <>
      <form
        className="flex flex-col justify-between items-center h-full"
        onSubmit={handleForm}
      >
        <input
          className="text-black"
          type="text"
          name="url"
          defaultValue="https://github.com/pakkerman/pref.io"
          placeholder="Enter you url to be shorten"
        />
        <button type="submit">Shorten</button>
        <pre>{JSON.stringify(results, null, 4)}</pre>
      </form>
    </>
  );
}
