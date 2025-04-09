
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Profile from "./screens/Profile";
import Feedback from "./screens/Feedback";
import LearningMaterials from "./screens/LearningMaterials";
import { FeedbackForm } from "./screens/CreateFeedbackForm";
import { AssignLearningMaterialForm } from "./screens/AssignLearningMaterialForm";

function Home() {
  const token = localStorage.getItem("token");
  return token ? <Dashboard /> : <AuthHome />;
}

function AuthHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome</h1>
      <div className="space-y-4">
        <Button asChild className="w-40">
          <Link to="/login">Log In</Link>
        </Button>
        <Button asChild variant="outline" className="w-40">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <nav className="flex space-x-4 mb-6">
        <Button asChild>
          <Link to="/profile">Profile</Link>
        </Button>
        <Button asChild>
          <Link to="/feedback">Feedback</Link>
        </Button>
        <Button asChild>
          <Link to="/learning">Learning Materials</Link>
        </Button>
      </nav>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/learning" element={<LearningMaterials />} />
        <Route path="/create_feedback" element={<FeedbackForm />} />
        <Route path="/assign_learningmaterial" element={<AssignLearningMaterialForm />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
