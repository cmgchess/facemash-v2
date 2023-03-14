import Match from './screens/Match';
import Leaderboard from './screens/Leaderboard';
import Header from './components/Header';
import Profile from './screens/Profile';
import Inspiration from './screens/Inspiration';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/leaderboard" exact element={<Leaderboard />} />
        <Route path="/inspiration" exact element={<Inspiration />} />
        <Route path="/player/:id" element={<Profile />} />
        <Route path="/" exact element={<Match />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
