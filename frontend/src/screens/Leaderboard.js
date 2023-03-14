import algoliasearch from 'algoliasearch/lite';
import Pagination from '../components/Pagination';
import SearchBox from '../components/SearchBox';
import Hits from '../components/Hits';
import {
  InstantSearch,
  connectHits,
  connectSearchBox,
  connectPagination,
} from 'react-instantsearch-dom';

const ALGOLIA_APP = process.env.REACT_APP_ALGOLIA_APP;
const ALGOLIA_KEY = process.env.REACT_APP_ALGOLIA_KEY;
const ALGOLIA_INDEX = process.env.REACT_APP_ALGOLIA_INDEX;

const searchClient = algoliasearch(ALGOLIA_APP, ALGOLIA_KEY);

const CustomPagination = connectPagination(Pagination);
const CustomSearchBox = connectSearchBox(SearchBox);
const CustomHits = connectHits(Hits);

const Leaderboard = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX}>
      <div className="flex justify-center my-4">
        <CustomSearchBox />
      </div>
      <CustomHits />
      <div className="flex justify-center my-4">
        <CustomPagination />
      </div>
    </InstantSearch>
  );
};

export default Leaderboard;
