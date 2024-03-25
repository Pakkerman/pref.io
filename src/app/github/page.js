"use client";

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function GithubProfile() {
  const myGithubRepoProfile = "https://api.github.com/repos/pakkerman/pref.io";
  const { data, error, isLoading } = useSWR(myGithubRepoProfile, fetcher);

  if (error) return "error";
  if (isLoading) return "loading...";

  return (
    <div>
      <h1>{data.name}</h1>
      <span>{data.id}</span>
    </div>
  );
}
