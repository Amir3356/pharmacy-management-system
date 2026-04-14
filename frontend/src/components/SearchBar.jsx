export default function SearchBar({ value, onChange, onSubmit, onClear }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <input
        className="input"
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Search medicine by name or category"
      />
      <button className="button" type="submit">Search</button>
      <button className="button-ghost" type="button" onClick={onClear} disabled={!value}>
        Clear
      </button>
    </form>
  )
}