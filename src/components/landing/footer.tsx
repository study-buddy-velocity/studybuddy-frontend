"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              study<span className="text-[#309CEC]">buddy</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Features
            </button>

            {/* Privacy Policy Modal Trigger */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                  Privacy Policy
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-gray-600 max-h-[60vh] overflow-y-auto">
                  <p>
                    At <strong>studybuddy</strong>, we value your privacy. This
                    Privacy Policy explains how we collect, use, and safeguard
                    your information when you use our platform.
                  </p>
                  <p>
                    <strong>1. Information We Collect:</strong> We may collect
                    personal details such as your name, email address, and
                    usage data to improve our services.
                  </p>
                  <p>
                    <strong>2. How We Use Your Information:</strong> To provide,
                    maintain, and improve our services, personalize user
                    experience, and send important updates.
                  </p>
                  <p>
                    <strong>3. Sharing of Information:</strong> We do not sell
                    your personal data. Information may be shared with trusted
                    third-party service providers only when necessary.
                  </p>
                  <p>
                    <strong>4. Security:</strong> We use industry-standard
                    security measures to protect your data.
                  </p>
                  <p>
                    <strong>5. Your Rights:</strong> You can request access,
                    update, or deletion of your personal data at any time.
                  </p>
                  <p>
                    For questions, contact us at{" "}
                    <a
                      href="mailto:support@studybuddy.com"
                      className="text-[#309CEC] underline"
                    >
                      support@studybuddy.com
                    </a>
                    .
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Start Learning Button */}
          <Link href="/intro">
            <Button className="bg-[#309CEC] hover:bg-[#2589d4] text-white px-6 py-2 text-sm font-medium rounded-full">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation - Stacked Layout */}
        <div className="sm:hidden mt-6 pt-6 border-t border-gray-100">

        </div>
      </div>
    </footer>
  );
}
