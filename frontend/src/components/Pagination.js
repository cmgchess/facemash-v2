const Pagination = ({ currentRefinement, nbPages, refine }) => {
  const prevDisabled = currentRefinement === 1;
  const nextDisabled = currentRefinement === nbPages || nbPages === 0;

  return (
    <div className="flex items-center justify-center mt-8 w-64">
      <button
        className={`w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-l-full ${
          prevDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
        }`}
        onClick={() => refine(currentRefinement - 1)}
        disabled={prevDisabled}
      >
        Previous
      </button>
      <span className="mx-4 text-gray-700 font-bold">{currentRefinement}</span>
      <button
        className={`w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-r-full ${
          nextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
        }`}
        onClick={() => refine(currentRefinement + 1)}
        disabled={nextDisabled}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
