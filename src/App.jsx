import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout/mainLayout.jsx";
import Home from "./pages/Home.jsx";
import { Map } from "./pages/Map.jsx";
import { Gryffindor } from "./pages/Gryffindor.jsx";
import { GreatHall } from "./pages/GreatHall.jsx";
import { GryffindorHat } from "./pages/GryffindorHat.jsx";
import { AudioLayout } from "./layout/AudioLayout.jsx";
import Intro from "./pages/Intro.jsx";
import { SlytherinHat } from "./pages/SlytherinHat.jsx";
import { Slytherin } from "./pages/Slytherin.jsx";
import {
  SOUND_HALL,
  SOUND_GRYFFINDOR,
  SOUND_HUFFLEPUFF,
  SOUND_SLYTHERIN,
  SOUND_RAVENCLAW,
} from "./layout/AudioAssets";
import { Ravenclaw } from "./pages/Ravenclaw.jsx";
import { Hufflepuff } from "./pages/Hufflepuff.jsx";
import { HufflepuffHat } from "./pages/HufflepuffHat.jsx";
import { RavenclawHat } from "./pages/RavenclawHat.jsx";
import { getMe } from "./utils/api";
import { ProtectedRoute } from "./components/protectedRoute.jsx";
import Forbidden from "./pages/Forbidden.jsx";
import { Loader } from "./components/Loader.jsx";
import { AudioProvider } from "./components/AudioContext.jsx";
import { HatFinal } from "./pages/HatFinal.jsx";
import { HouseQuiz } from "./pages/HouseQuiz.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setAuthChecked(false);
      try {
        const res = await getMe();
        setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    fetchUser();
  }, []);

  if (!authChecked) return <Loader />;

  return (
    <AudioProvider>
      <Routes>
        <Route path="/" element={<MainLayout user={user} />}>
          <Route index element={<Intro onAuth={setUser} />} />
          <Route
            element={
              <ProtectedRoute user={user}>
                <AudioLayout soundtrackUrl={SOUND_HALL} />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/greathall" element={<GreatHall />} />
          </Route>
          <Route
            element={
              <ProtectedRoute user={user}>
                <AudioLayout soundtrackUrl={SOUND_GRYFFINDOR} />
              </ProtectedRoute>
            }
          >
            <Route path="/gryffindorhat" element={<GryffindorHat />} />
            <Route path="/gryffindor" element={<Gryffindor />} />
          </Route>
          <Route
            element={
              <ProtectedRoute user={user}>
                <AudioLayout soundtrackUrl={SOUND_SLYTHERIN} />
              </ProtectedRoute>
            }
          >
            <Route path="/slytherinhat" element={<SlytherinHat />} />
            <Route path="/slytherin" element={<Slytherin />} />
          </Route>
          <Route
            element={
              <ProtectedRoute user={user}>
                <AudioLayout soundtrackUrl={SOUND_HUFFLEPUFF} />
              </ProtectedRoute>
            }
          >
            <Route path="/hufflepuffhat" element={<HufflepuffHat />} />
            <Route path="/hufflepuff" element={<Hufflepuff />} />
          </Route>
          <Route
            element={
              <ProtectedRoute user={user}>
                <AudioLayout soundtrackUrl={SOUND_RAVENCLAW} />
              </ProtectedRoute>
            }
          >
            <Route path="/ravenclawhat" element={<RavenclawHat />} />
            <Route path="/ravenclaw" element={<Ravenclaw />} />
          </Route>
          <Route
            path="/map"
            element={
              <ProtectedRoute user={user}>
                <Map user={user} onLogout={() => setUser(null)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hatfinal"
            element={
              <ProtectedRoute user={user}>
                <HatFinal user={user} onLogout={() => setUser(null)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/housequiz"
            element={
              <ProtectedRoute user={user}>
                <HouseQuiz user={user} onLogout={() => setUser(null)} />
              </ProtectedRoute>
            }
          />
          <Route path="/forbidden" element={<Forbidden />} />
        </Route>
      </Routes>
    </AudioProvider>
  );
};

export default App;
