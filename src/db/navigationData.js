export const navigationData = [
  {
    label: "Home",
    href: "/", // Directly go to main homepage
    hasDropdown: false, // Remove dropdown
  },
  {
    label: "About Us",
    href: "/about",
    hasDropdown: false,
  },
  {
    label: "pricing",
    href: "/pricing",
    hasDropdown: false,
  },
  {
    label: "Services",
    href: "/services",
    hasDropdown: false,
  },
  // {
  //   label: "Our Team",
  //   href: "/team",
  //   hasDropdown: false,
  //   dropdownItems: [
  //     // { label: "About Us", href: "/about" },
  //     { label: "Our Team", href: "/team" },
  //     { label: "FAQ", href: "/faq" },

  //     { label: "Gallery", href: "/gallery" },
  //     { label: "Pricing", href: "/pricing" },
  //     {
  //       label: "Tools",
  //       href: "#",
  //       hasDropdown: true,
  //       nestedDropdown: [
  //         { label: "404 Error Page", href: "/not-found" },
  //         { label: "Term & Condition", href: "/term-condition" },
  //         { label: "Privacy Policy", href: "/privacy-policy" },
  //         { label: "Cookie Policy", href: "/cookie-policy" },
  //       ],
  //     },
  //   ],
  // },
  {
    label: "Contact",
    href: "/contact",
    hasDropdown: false,
  },
  // Display only if NOT logged in
  { label: "Login/Sign Up", href: "/login", hasDropdown: false },

  // Display only if logged in
  { label: "Dashboard", href: "/dashboard", hasDropdown: false },
];
