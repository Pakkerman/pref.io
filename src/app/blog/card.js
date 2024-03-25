"use client";

import { useState } from "react";

export default function Card({ title }) {
  const [count, setCount] = useState(1);
  const handleClick = (e) => {
    e.preventDefault();
    setCount(count + 1);
  };
  if (!title) return <div>empty</div>;
  return (
    <div>
      <h1 onClick={handleClick}>
        {title}
        {count}
      </h1>
    </div>
  );
}
