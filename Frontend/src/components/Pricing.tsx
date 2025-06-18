
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small businesses",
    price: "₨5,000",
    billing: "/month",
    features: [
      "200 Monthly Order Confirmations",
      "WhatsApp Integration",
      "Basic Analytics",
      "Email Support"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Growth",
    description: "For growing e-commerce stores",
    price: "₨12,000",
    billing: "/month",
    features: [
      "500 Monthly Order Confirmations",
      "WhatsApp + SMS Fallback",
      "Advanced Analytics",
      "Shopify Integration",
      "Priority Support"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Enterprise",
    description: "For large-scale operations",
    price: "Custom",
    billing: "",
    features: [
      "Unlimited Order Confirmations",
      "All Integrations",
      "Dedicated Account Manager",
      "Custom Workflows",
      "API Access",
      "24/7 Support"
    ],
    cta: "Contact Us",
    popular: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cod-dark/50 to-transparent"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`glass-morphism border ${plan.popular ? 'border-cod-purple' : 'border-white/10'} relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-3 -mr-3">
                  <span className="bg-cod-purple text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 flex items-end">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.billing}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className={`h-4 w-4 ${plan.popular ? 'text-cod-purple' : 'text-cod-blue'}`} />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Link to="/signup" className="w-full">
                  <Button 
                    className={`w-full ${plan.popular ? 'button-gradient' : 'bg-white/10 hover:bg-white/20'}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
