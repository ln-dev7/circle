import { CycleView } from '@/components/common/issues/cycle-issues';
import HeaderNav from './header-nav';
import HeaderOptions from './header-options';

export default function Header({ cycleView }: { cycleView: CycleView }) {
   return (
      <>
         <HeaderNav cycleView={cycleView} />
         <HeaderOptions cycleView={cycleView} />
      </>
   );
}
