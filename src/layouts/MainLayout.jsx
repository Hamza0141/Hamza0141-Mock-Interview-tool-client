export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-blue-600">
            Mock Interview
          </a>
          <nav className="space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </a>
            <a href="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto px-6 py-10">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-10">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Mock Interview — All rights reserved.
        </div>
      </footer>
    </div>
  );
}
