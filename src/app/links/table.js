"use client";

import LinksCreateForm from "./createForm";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LinksHTMLTable() {
  const endpoint = "/api/links";
  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher);

  if (error) return "something is wrong";
  if (isLoading) return "Loading...";

  return (
    <>
      <LinksCreateForm didSubmit={mutate} />
      <ul>
        {data &&
          data.map((item) => {
            return (
              <li key={item.id}>
                <p>{item.id}</p>
                <p>{item.url}</p>
                <p>{item.short}</p>
              </li>
            );
          })}
      </ul>
    </>
  );
}
