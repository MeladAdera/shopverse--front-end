// App.tsx
import { Routes, Route } from 'react-router-dom'; // بدون BrowserRouter
import Header from "./components/ui/header/Header";
import Homepage from "./routes/Homepage";
import ProductPage from "./routes/producDatails";
import Page from "./routes/Page";
import CartPage from "./routes/Cartpage";


function App() {
  return (
    <div className="min-h-screen"> {/* بدون <Router> هنا */}
      
      
      <Header />
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/product/:id" element={<ProductPage />} />
         <Route path="/category/:id" element={<Page />} />

        <Route path="/cart" element={<CartPage />} />
      </Routes>
      
    </div>
  );
}

export default App;