
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Order Confirmation",
    description: "Automated WhatsApp verification for all COD orders",
    features: [
      "Reduces return rates by 35%", 
      "Pre-delivery confirmation", 
      "Customer verification"
    ]
  },
  {
    id: 2,
    title: "Courier Optimization",
    description: "Smart courier selection based on delivery success rates",
    features: [
      "Route optimization", 
      "Performance tracking", 
      "Cost reduction"
    ]
  },
  {
    id: 3,
    title: "Fraud Prevention",
    description: "ML-driven customer authentication system",
    features: [
      "Pattern recognition", 
      "Risk scoring", 
      "Reduce fraud losses"
    ]
  },
  {
    id: 4,
    title: "Return Management",
    description: "Track and analyze return reasons and patterns",
    features: [
      "Return analytics", 
      "Automated processing", 
      "Customer feedback loop"
    ]
  },
  {
    id: 5,
    title: "Unresponsive Customers",
    description: "Advanced workflows for handling unresponsive customers",
    features: [
      "Automated follow-up", 
      "Alternative contact methods", 
      "Increased response rates"
    ]
  },
];

export function Services() {
  return (
    <section id="services" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful services to optimize your COD operations and improve delivery success
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="glass-morphism border border-white/10 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cod-purple" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
