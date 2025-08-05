import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import UserPage from "./UserPage";
import { LanguageProvider } from "./LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/user-a" style={{ marginRight: 10 }}>
            User A
          </Link>
          <Link to="/user-b">User B</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/user-a" replace />} />
          <Route path="/user-a" element={<UserPage user="A" />} />
          <Route path="/user-b" element={<UserPage user="B" />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
