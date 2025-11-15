'use client';

import { membershipPlans } from '@/mock-data/gym-memberships';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function GymMemberships() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {membershipPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  {plan.name === 'VIP' && (
                    <Badge className="bg-amber-500">Popular</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${plan.monthlyPrice}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  {plan.yearlyPrice > 0 && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      ${plan.yearlyPrice}/year (save{' '}
                      {Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100)}
                      %)
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs text-muted-foreground border-t pt-4">
                  <div className="flex justify-between">
                    <span>Classes:</span>
                    <span className="font-medium">
                      {plan.classCredits === -1 ? 'Unlimited' : `${plan.classCredits}/month`}
                    </span>
                  </div>
                  {plan.personalTrainingSessions > 0 && (
                    <div className="flex justify-between">
                      <span>PT Sessions:</span>
                      <span className="font-medium">{plan.personalTrainingSessions}/month</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Guest Passes:</span>
                    <span className="font-medium">{plan.guestPasses}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access:</span>
                    <span className="font-medium">{plan.accessHours}</span>
                  </div>
                </div>

                <Button className="w-full mt-4" variant={plan.name === 'VIP' ? 'default' : 'outline'}>
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
