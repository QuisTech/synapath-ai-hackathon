import Link from 'next/link';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card text-foreground p-6 text-center mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} SynaPath AI. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="https://github.com/your-org/synapath-ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <Github className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
