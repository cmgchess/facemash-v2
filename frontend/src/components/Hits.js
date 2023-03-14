import { Link } from 'react-router-dom';
import RankChange from './RankChange';

const rankChangeValue = (prevRank, currRank) => {
  let color = '';
  let value = '';
  if (prevRank > currRank) {
    color = 'text-green-700';
    value = `+${prevRank - currRank}`;
  } else if (prevRank < currRank) {
    color = 'text-red-600';
    value = `-${currRank - prevRank}`;
  }

  return <span className={`font-bold ml-1 ${color}`}>{value}</span>;
};

const Hits = ({ hits }) => (
  <div className="flex justify-center">
    <table className="table-auto border-collapse border border-gray-400 w-11/12">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 w-1/5 text-center"></th>
          <th className="p-2 w-1/5 text-center">Name</th>
          <th className="p-2 w-1/5 text-center">Rating</th>
          <th className="p-2 w-1/5 text-center">Rank</th>
          <th className="p-2 w-1/5 text-center"></th>
        </tr>
      </thead>
      <tbody>
        {hits &&
          hits.map((hit) => (
            <tr key={hit.objectID} className="border border-gray-400">
              <td className="p-2">
                <Link to={`/player/${hit.objectID}`}>
                  <img
                    src={hit.img}
                    alt={hit.objectID}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </Link>
              </td>
              <td className="p-2 w-1/5 text-center">
                <Link to={`/player/${hit.objectID}`}>{hit.name}</Link>
              </td>
              <td className="p-2 w-1/5 text-center">
                {Math.round(hit.rating)}
              </td>
              <td className="p-2 w-1/5 text-center">
                {Math.round(hit.currRank)}
              </td>
              <td className="p-2 w-1/5 text-center">
                <div className="flex items-center">
                  <RankChange prevRank={hit.prevRank} currRank={hit.currRank} />
                  {rankChangeValue(hit.prevRank, hit.currRank)}
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

export default Hits;
