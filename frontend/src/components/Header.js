import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-500 p-4 flex justify-between">
      <Link to="/" className="text-white font-bold text-xl">
        FaceMash
      </Link>
      <div className="flex">
      <Link to="/leaderboard" className="text-white hover:text-gray-300 ml-auto">
        Leaderboard
      </Link>
      <Link to="/inspiration" className="text-white hover:text-gray-300 ml-4">
        Inspiration
      </Link>
      <Link to="https://github.com/cmgchess/facemash-v2" target="_blank" className="text-white hover:text-gray-300 ml-4">
        Github
      </Link>
      </div>
    </header>
  );
};

export default Header;
