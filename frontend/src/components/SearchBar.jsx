import { Button } from './ui/button'
import { Input } from './ui/input'

export default function SearchBar({ value, onChange, onSubmit, onClear }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <Input
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Search medicine by name or category"
      />
      <Button type="submit">Search</Button>
      <Button variant="ghost" type="button" onClick={onClear} disabled={!value}>
        Clear
      </Button>
    </form>
  )
}