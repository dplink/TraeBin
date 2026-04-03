import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReviewPage from "./pages/ReviewPage";
import AnimePage from "./pages/AnimePage";
import EmptyPage from "./pages/EmptyPage";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<ReviewPage />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/empty" element={<EmptyPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
