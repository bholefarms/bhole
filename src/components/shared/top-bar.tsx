"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";

const trustBadges = [
  { label: "100% Organic", icon: "🌱" },
  { label: "Chemical Free", icon: "🧪" },
  { label: "Farm Fresh", icon: "🌿" },
];

export function TopBar() {
  return (
    <div className="bg-primary text-white text-xs py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              📍 Proudly Grown in Maharashtra, India
            </span>
            <div className="hidden md:flex items-center gap-3">
              {trustBadges.map((badge) => (
                <span key={badge.label} className="flex items-center gap-1">
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://facebook.com" target="_blank" className="hover:text-accent transition-colors">
              <FaFacebook size={16} />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-accent transition-colors">
              <FaInstagram size={16} />
            </Link>
            <Link href="https://youtube.com" target="_blank" className="hover:text-accent transition-colors">
              <FaYoutube size={16} />
            </Link>
            <Link href="https://wa.me/9881732998" target="_blank" className="hover:text-accent transition-colors">
              <FaWhatsapp size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}