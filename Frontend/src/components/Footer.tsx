
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link to="/">
              <h3 className="text-xl font-bold text-gradient-primary mb-4">CODVerify</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-driven order verification for Pakistan's COD e-commerce market
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/#about" className="text-sm text-muted-foreground hover:text-white">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-white">Contact</Link></li>
              <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-white">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/#services" className="text-sm text-muted-foreground hover:text-white">Order Confirmation</Link></li>
              <li><Link to="/#services" className="text-sm text-muted-foreground hover:text-white">Fraud Prevention</Link></li>
              <li><Link to="/#services" className="text-sm text-muted-foreground hover:text-white">Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CODVerify. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-white">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-white">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-white">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
