export default function LinksCreateHtmlForm() {
  return (
    <>
      <form className="flex flex-col " action="/api/links" method="POST">
        <input
          className="text-black"
          type="text"
          name="url"
          defaultValue="https://github.com/pakkerman/pref.io"
          placeholder="Enter you url to be shorten"
        />
        <button type="submit">Shorten</button>
      </form>
    </>
  );
}
