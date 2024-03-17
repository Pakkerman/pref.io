"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  const retryRequestHandler = () => {
    reset();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <h2>Something is wrong...</h2>
      <botton onClick={retryRequestHandler}>Retry request</botton>
    </div>
  );
}
