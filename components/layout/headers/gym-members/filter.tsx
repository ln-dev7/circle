'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGymMembersFilterStore } from '@/store/gym-members-filter-store';
import { MembershipTier, MembershipStatus } from '@/mock-data/gym-members';

interface FilterPopoverProps {
  children: React.ReactNode;
}

const membershipTiers: MembershipTier[] = ['Trial', 'Basic', 'Premium', 'VIP'];
const membershipStatuses: MembershipStatus[] = ['Active', 'Expired', 'Suspended', 'Pending'];

export function FilterPopover({ children }: FilterPopoverProps) {
  const { selectedTiers, selectedStatuses, setSelectedTiers, setSelectedStatuses, resetFilters } =
    useGymMembersFilterStore();

  const handleTierToggle = (tier: MembershipTier) => {
    if (selectedTiers.includes(tier)) {
      setSelectedTiers(selectedTiers.filter((t) => t !== tier));
    } else {
      setSelectedTiers([...selectedTiers, tier]);
    }
  };

  const handleStatusToggle = (status: MembershipStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Members</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-auto p-0 text-xs"
            >
              Reset
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Membership Tier</Label>
            <div className="space-y-2">
              {membershipTiers.map((tier) => (
                <div key={tier} className="flex items-center gap-2">
                  <Checkbox
                    id={`tier-${tier}`}
                    checked={selectedTiers.includes(tier)}
                    onCheckedChange={() => handleTierToggle(tier)}
                  />
                  <Label
                    htmlFor={`tier-${tier}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {tier}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Membership Status</Label>
            <div className="space-y-2">
              {membershipStatuses.map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
