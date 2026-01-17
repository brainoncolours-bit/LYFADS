import Footer from "./Footer";
import Navbar from "./Navbar";
import OverlayComponent from "./OverLayComponent";

export default function Layout({ children }) {
    return (
      <div className="flex flex-col min-h-screen">
              <OverlayComponent/>
        
        <main className="flex-grow">
        <Navbar/>
          
          {children}</main>
        <Footer/>
      </div>
    );
  }