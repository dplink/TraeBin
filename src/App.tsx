import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReviewPage from "./pages/ReviewPage";
import AnimePage from "./pages/AnimePage";
import EmptyPage from "./pages/EmptyPage";
import UserPage from "./pages/UserPage";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<ReviewPage />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/empty" element={<EmptyPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
