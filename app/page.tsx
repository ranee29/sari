import Link from 'next/link'
import { ArrowRight, Package, Clock, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-300 via-bg-50 to-bg-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-bg-200 sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-text-primary">Sari</span>
            </Link>

            <div className="hidden sm:flex items-center space-x-6">
              <Link href="/products" className="text-text-secondary hover:text-text-primary transition-colors">
                Products
              </Link>
              <Link href="/about" className="text-text-secondary hover:text-text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-text-secondary hover:text-text-primary transition-colors">
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="btn-secondary text-sm">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="heading-1 mb-6">
            Order Groceries Online,
            <span className="text-gradient"> Pick Up In-Store</span>
          </h1>
          <p className="text-body text-lg md:text-xl mb-8 text-text-secondary">
            Browse our fresh selection, reserve your items, and pick them up at your convenience.
            No queues, no hassle - just quality groceries ready when you are.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center group">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="btn-secondary text-lg px-8 py-4">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Why Choose Sari?</h2>
            <p className="text-body text-lg max-w-2xl mx-auto">
              We make grocery shopping convenient, fresh, and affordable for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <Package className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="heading-4 mb-4">Fresh Products</h3>
              <p className="text-body text-text-secondary">
                Quality groceries sourced locally and updated daily. From fresh produce to household essentials.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-200 transition-colors">
                <Clock className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="heading-4 mb-4">Quick Pickup</h3>
              <p className="text-body text-text-secondary">
                Reserve online and pick up at your convenience. No waiting, no crowds - just fast service.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-success-200 transition-colors">
                <Shield className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="heading-4 mb-4">Safe & Secure</h3>
              <p className="text-body text-text-secondary">
                Contact-free pickup and secure online ordering. Your safety is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="container text-center">
          <h2 className="heading-2 text-white mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of customers who enjoy convenient grocery shopping with Sari.
          </p>
          <Link
            href="/auth/register"
            className="btn-secondary bg-white text-primary-600 hover:bg-bg-50 px-8 py-4 text-lg font-semibold inline-flex items-center"
          >
            Create Your Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-100 border-t border-bg-200 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-text-primary">Sari</span>
              </div>
              <p className="text-text-secondary">
                Your local grocery reservation system. Fresh, fast, and convenient.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-4">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="text-text-secondary hover:text-primary-500 transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-text-secondary hover:text-primary-500 transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="text-text-secondary hover:text-primary-500 transition-colors">
                    Special Offers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-text-secondary hover:text-primary-500 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-text-secondary hover:text-primary-500 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-text-secondary hover:text-primary-500 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-text-secondary hover:text-primary-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-text-secondary hover:text-primary-500 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-text-secondary hover:text-primary-500 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-bg-200 pt-8 text-center text-text-secondary">
            <p>&copy; 2024 Sari Grocery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}