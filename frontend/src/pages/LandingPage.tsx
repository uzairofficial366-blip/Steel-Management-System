import { Link } from "react-router-dom";
import { BarChart3, Bell, Boxes, FileText, ShieldCheck, Users, WalletCards, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: Array<[string, LucideIcon]> = [
  ["Stock management", Boxes],
  ["Sales and invoices", FileText],
  ["Customer khata", WalletCards],
  ["Supplier management", Users],
  ["Reports", BarChart3],
  ["Multi-role access", ShieldCheck],
  ["WhatsApp invoice sharing", MessageCircle],
  ["Low stock alerts", Bell],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-primary text-textPrimary">
      <nav className="sticky top-0 z-20 border-b border-borderColor bg-primary/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-extrabold tracking-wide">
            Smart <span className="text-accent">Shop</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-textMuted md:flex">
            <a href="#features" className="hover:text-textPrimary">Features</a>
            <a href="#modules" className="hover:text-textPrimary">Modules</a>
            <a href="#benefits" className="hover:text-textPrimary">Benefits</a>
            <a href="#contact" className="hover:text-textPrimary">Contact</a>
          </div>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </nav>

      <main>
        <section className="border-b border-borderColor">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-24 lg:px-8">
            <div className="flex flex-col justify-center">
              <p className="mb-4 text-sm font-semibold uppercase text-accent">Retail control center</p>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Smart Shop Management Platform
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-textMuted sm:text-lg">
                Manage stock, invoices, khata, suppliers, payments, and role-based shop operations from one fast
                dashboard built for busy retail teams.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login" className="btn-primary">Open login</Link>
                <a href="#features" className="btn-muted">Explore features</a>
              </div>
            </div>
            <div className="rounded-lg border border-borderColor bg-card p-5 shadow-2xl">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Today sales", "PKR 128,400", "text-success"],
                  ["Low stock", "7 items", "text-warning"],
                  ["Customer dues", "PKR 42,900", "text-danger"],
                  ["Invoices", "316", "text-accent"],
                ].map(([label, value, color]) => (
                  <div key={label} className="rounded-md border border-borderColor bg-secondary p-4">
                    <p className="text-sm text-textMuted">{label}</p>
                    <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-md border border-borderColor bg-primary p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold">Recent invoice</span>
                  <span className="rounded bg-accent/15 px-2 py-1 text-xs text-accent">WhatsApp ready</span>
                </div>
                <div className="space-y-3 text-sm text-textMuted">
                  <div className="flex justify-between"><span>INV-2048</span><span>PKR 12,800</span></div>
                  <div className="flex justify-between"><span>Ali Khan</span><span className="text-success">Paid</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold">Everything your shop team needs</h2>
            <p className="mt-3 text-textMuted">Clean workflows for stock, sales, accounts, and customer visibility.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([label, Icon]) => (
              <div key={label} className="card p-5">
                <Icon className="mb-4 h-8 w-8 text-accent" />
                <h3 className="font-semibold">{label}</h3>
              </div>
            ))}
          </div>
        </section>

        <section id="modules" className="border-y border-borderColor bg-secondary/60">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            {["Admin", "Manager", "Salesman", "Accountant", "Customer", "Reports"].map((module) => (
              <div key={module} className="card p-6">
                <h3 className="text-xl font-bold">{module}</h3>
                <p className="mt-3 text-sm leading-7 text-textMuted">
                  Role-aware access for daily work, restricted views, and focused tools.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="benefits" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {["Fewer stock surprises", "Faster checkout", "Clear receivables"].map((benefit) => (
              <div key={benefit}>
                <h3 className="text-2xl font-bold text-accent">{benefit}</h3>
                <p className="mt-3 text-textMuted">Real-time records help the right person act before work piles up.</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="border-t border-borderColor bg-secondary/60">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <h2 className="text-2xl font-bold">Ready for smarter shop operations?</h2>
              <p className="mt-2 text-textMuted">Contact your shop administrator to enable your account.</p>
            </div>
            <Link to="/login" className="btn-primary w-full md:w-auto">Login to dashboard</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
