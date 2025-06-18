
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-hero-gradient"></div>
      
      {/* Gradient dots overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient mb-6">
            AI-Driven Order Confirmation for Pakistan's COD Market
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Reduce return rates, optimize courier selection, and improve delivery success with 
            our WhatsApp verification system for Cash on Delivery orders.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="button-gradient text-lg px-8 py-6">Get Started</Button>
            </Link>
            <Link to="/#services">
              <Button variant="outline" className="text-lg px-8 py-6">
                Explore Services
              </Button>
            </Link>
          </div>
          
          <div className="mt-16">
            <div className="glass-morphism py-6 px-8 rounded-xl">
              <p className="font-medium text-white mb-4">Trusted by Pakistan's leading e-commerce brands</p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="h-8 w-24 bg-white/20 rounded animate-pulse-slow"></div>
                <div className="h-8 w-32 bg-white/20 rounded animate-pulse-slow"></div>
                <div className="h-8 w-28 bg-white/20 rounded animate-pulse-slow"></div>
                <div className="h-8 w-20 bg-white/20 rounded animate-pulse-slow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
