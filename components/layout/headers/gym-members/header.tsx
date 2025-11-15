import { HeaderNav } from './header-nav';
import { HeaderOptions } from './header-options';

export default function Header() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <HeaderNav />
      <HeaderOptions />
    </div>
  );
}
