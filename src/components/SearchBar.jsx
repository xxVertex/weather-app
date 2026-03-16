import { useState, useRef, useEffect } from "react";
import { Search, X, Loader } from "lucide-react";
import { geocodeCity } from "../hooks/useWeather";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timerRef.current);
    if (val.trim().length < 2) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      setSearching(true);
      const r = await geocodeCity(val);
      setResults(r);
      setOpen(r.length > 0);
      setSearching(false);
    }, 400);
  }

  function handleSelect(result) {
    const name = `${result.name}${result.admin1 ? ", " + result.admin1 : ""}, ${result.country}`;
    onSelect(result.latitude, result.longitude, name);
    setQuery(name);
    setOpen(false);
    setResults([]);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="search-wrap" ref={wrapRef}>
      <div className="search-box">
        {searching ? <Loader size={16} className="search-icon spin" /> : <Search size={16} className="search-icon" />}
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="search-input"
        />
        {query && <button className="search-clear" onClick={handleClear}><X size={14} /></button>}
      </div>
      {open && (
        <div className="search-dropdown">
          {results.map((r, i) => (
            <button key={i} className="search-result" onClick={() => handleSelect(r)}>
              <span className="search-result__city">{r.name}</span>
              <span className="search-result__region">
                {[r.admin1, r.country].filter(Boolean).join(", ")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
