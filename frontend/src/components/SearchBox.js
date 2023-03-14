const SearchBox = ({ currentRefinement, refine }) => (
  <form onSubmit={(e) => e.preventDefault()}>
    <label htmlFor="search">
      <span className="sr-only">Search</span>
      <input
        type="search"
        id="search"
        placeholder="Search..."
        value={currentRefinement}
        onChange={(e) => refine(e.target.value)}
        className="w-full md:w-96 px-4 py-2 border border-gray-400 rounded-full text-gray-800 text-base focus:outline-none focus:shadow-outline"
      />
    </label>
  </form>
);

export default SearchBox;
