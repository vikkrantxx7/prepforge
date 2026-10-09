import { Bell, Search } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const NavbarActions = () => {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" aria-label="Search">
        <Search className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-5 w-5" />
      </Button>
    </div>
  );
};
