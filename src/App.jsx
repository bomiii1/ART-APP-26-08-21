import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/Header";
import Curation from "./pages/curation/Curation";
import Search from "./pages/search/Search";
import ViewingMode from "./pages/viewingMode/ViewingMode";
import MyExhibition from "./pages/myExhibition/MyExhibition";
import CurationDetail from "./pages/curation/CurationDetail";

export default function App() {
  return (
    <HashRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/curation" element={<Curation />} />
        <Route path="/curation/:category/:id" element={<CurationDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/my_exhibition" element={<MyExhibition />} />
        <Route path="/viewing" element={<ViewingMode />} />
      </Routes>
    </HashRouter>
  );
}
