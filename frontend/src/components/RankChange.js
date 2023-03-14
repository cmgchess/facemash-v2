const RankUp = () => {
  return (
    <svg
      className="w-6 h-6 text-green-50 transform rotate-270"
      viewBox="0 0 24 24"
      fill="green"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 22.5h21L12 3z"></path>
    </svg>
  );
};

const RankDown = () => {
  return (
    <svg
      className="w-6 h-6 text-red-50 transform rotate-180"
      viewBox="0 0 24 24"
      fill="red"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 22.5h21L12 3z"></path>
    </svg>
  );
};

const NoChange = () => {
  return (
    <svg
      className="w-6 h-6 text-gray-500"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h12"></path>
    </svg>
  );
};

const RankChange = ({ prevRank, currRank }) => {
  if (prevRank > currRank) {
    return <RankUp />;
  } else if (prevRank < currRank) {
    return <RankDown />;
  } else {
    return <NoChange />;
  }
};

export default RankChange;
