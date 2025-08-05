export default function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-gray-500 bg-white border-t">
      &copy; {new Date().getFullYear()} DocApp. All rights reserved.
    </footer>
  );
}
