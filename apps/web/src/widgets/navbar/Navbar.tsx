import { NavbarActions } from './NavbarActions';
import { NavbarLinks } from './NavbarLinks';
import { NavbarLogo } from './NavbarLogo';
import { NavbarProfile } from './NavbarProfile';

export const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="sticky top-0 z-50 hidden w-full border-b border-border bg-background/80 backdrop-blur-sm md:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {children}
      </div>
    </header>
  );
};

Navbar.Actions = NavbarActions;
Navbar.Links = NavbarLinks;
Navbar.Logo = NavbarLogo;
Navbar.Profile = NavbarProfile;
