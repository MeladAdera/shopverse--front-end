import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/ui/header/Header";
import Homepage from "./routes/Homepage";
import ProductPage from "./routes/producDatails";
import Page from "./routes/Page";
import CartPage from "./routes/Cartpage";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Header will be visible on all pages */}
        <Header />
        
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/category/:category" element={<Page />} />
          <Route path="/cart" element={<CartPage />} />
          
          {/* You can add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;