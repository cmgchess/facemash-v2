import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { BASE_URL } from '../config';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const centeredSpinner = (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  );
  useEffect(() => {
    axios
      .get(`${BASE_URL}/player/${id}`)
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
  }, [id]);

  const gridData = (label, value, withoutMt = true) => {
    const parentDivClass = `grid grid-cols-3 gap-4 ${withoutMt ? '' : 'mt-4'}`;
    return (
      <div className={parentDivClass}>
        <div className="col-start-1 col-end-3">
          <p className="font-bold">{label}</p>
        </div>
        <div>
          <p>{value}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      {loading && centeredSpinner}
      {!loading && profile && (
        <div className="flex justify-center mt-2">
          <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-8 flex flex-col sm:flex-row">
            <div className="flex items-center">
              <img className="w-56 mr-10" src={profile.img} alt="Profile" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              {gridData('Rating', Math.round(profile.rating), false)}
              {gridData('Rank', profile.currRank, false)}
              {gridData('Total matches', profile.winCount + profile.lossCount)}
              {gridData('Wins', profile.winCount)}
              {gridData('Losses', profile.lossCount)}
              {profile.bestWin && (
                <div className="grid grid-cols-3 mt-4 gap-4">
                  <div className="col-start-1 col-end-3">
                    <p className="font-bold">Favorite opponent</p>
                  </div>
                  <div>
                    <Link to={`/player/${profile.bestWin?.id}`}>
                      <p className="text-blue-500 underline">
                        {profile.bestWin?.name}
                      </p>
                    </Link>
                    <p>
                      {profile.bestWin?.wins}{' '}
                      {`Win${profile.bestWin?.wins > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
              )}
              {profile.worstLoss && (
                <div className="grid grid-cols-3 mt-4 gap-4">
                  <div className="col-start-1 col-end-3">
                    <p className="font-bold">Least Favorite opponent</p>
                  </div>
                  <div>
                    <Link to={`/player/${profile.worstLoss?.id}`}>
                      <p className="text-blue-500 underline">
                        {profile.worstLoss?.name}
                      </p>
                    </Link>
                    <p>
                      {profile.worstLoss?.losses}{' '}
                      {`Loss${profile.worstLoss?.losses > 1 ? 'es' : ''}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
