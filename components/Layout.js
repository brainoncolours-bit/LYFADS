import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
        <Navbar/>

          {children}</main>
        <Footer/>
      </div>
    );
  }