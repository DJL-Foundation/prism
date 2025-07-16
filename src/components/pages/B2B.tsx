"use client";

import { motion } from "motion/react";
import { Shield, Users, Zap, CheckCircle } from "react-feather";
import { Building2, BarChart3 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";

const MotionCard = motion.create(Card);

export default function B2BHeroPage() {
  return (
    <main className="container mx-auto px-4 pt-10 pb-20">
      <section className="py-12 md:py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Enterprise <span className="text-primary">Presentation</span>{" "}
            Platform
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Streamline your organization&apos;s presentation workflow with
            secure, instant access and seamless sharing across all teams.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button size="lg" asChild>
              <Link href="/contact">Request Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for Enterprise Needs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, scalable, and designed to integrate with your existing
            workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="h-8 w-8 text-primary" />,
              title: "Enterprise Security",
              description:
                "SOC 2 compliant with advanced access controls, audit logs, and data encryption.",
            },
            {
              icon: <Users className="h-8 w-8 text-primary" />,
              title: "Team Management",
              description:
                "Centralized user management with role-based permissions and department organization.",
            },
            {
              icon: <BarChart3 className="h-8 w-8 text-primary" />,
              title: "Analytics & Insights",
              description:
                "Track presentation usage, engagement metrics, and team productivity across your organization.",
            },
            {
              icon: <Building2 className="h-8 w-8 text-primary" />,
              title: "White Label Options",
              description:
                "Custom branding and domain integration to match your organization's identity.",
            },
            {
              icon: <Zap className="h-8 w-8 text-primary" />,
              title: "API Integration",
              description:
                "Seamlessly integrate with your existing tools and workflows through our comprehensive API.",
            },
            {
              icon: <CheckCircle className="h-8 w-8 text-primary" />,
              title: "24/7 Support",
              description:
                "Dedicated support team with guaranteed response times and priority assistance.",
            },
          ].map((feature, index) => (
            <MotionCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardContent className="p-6">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </section>

      <section className="py-16">
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Organization?
            </CardTitle>
            <CardDescription className="text-xl max-w-2xl mx-auto">
              Join hundreds of organizations already using The Presentation
              Foundation to streamline their workflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">Enterprise Pricing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
