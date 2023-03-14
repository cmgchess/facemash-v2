import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import useKeyUp from '../hooks/useKeyUp';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Match = () => {
  const [match, setMatch] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/facemash/pairing`)
      .then((response) => {
        setMatch(response.data);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const centeredSpinner = (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  );

  const handleImageClick = (winner) => {
    const objectToSend = {
      match: match?.match,
      p1: match?.p1?.id,
      p2: match?.p2?.id,
      winner,
    };
    axios
      .post(`${BASE_URL}/facemash/match`, objectToSend)
      .catch((error) => {
        alert(error);
      });
    setLoading(true);
    axios
      .get(`${BASE_URL}/facemash/pairing`)
      .then((response) => {
        setMatch(response.data);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
  };

  useKeyUp('ArrowLeft', () => {handleImageClick('p1')});
  useKeyUp('ArrowRight', () => {handleImageClick('p2')});

  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="font-bold text-xl">Choose from either left or right</h1>
      </div>
      {loading && centeredSpinner}
      {!loading && match?.match && (
        <div className="flex justify-center flex-wrap items-center">
          <div className="w-full md:w-1/2 p-4 flex flex-col items-center">
            <img
              src={match?.p1?.img}
              alt="p1"
              className="max-w-xs max-h-xs hover:cursor-pointer"
              onClick={() => handleImageClick('p1')}
            />
            <div className="text-xl font-bold mt-2">{match?.p1?.name}</div>
          </div>
          <div className="w-full md:w-1/2 p-4 flex flex-col items-center">
            <img
              src={match?.p2?.img}
              alt="p2"
              className="max-w-xs max-h-xs hover:cursor-pointer"
              onClick={() => handleImageClick('p2')}
            />
            <div className="text-xl font-bold mt-2">{match?.p2?.name}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Match;
