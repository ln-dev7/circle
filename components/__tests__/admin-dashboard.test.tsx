import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminDashboard } from '../dashboards/admin-dashboard';

describe('AdminDashboard', () => {
   const mockOrgId = 'test-org-123';

   it('renders the dashboard title', () => {
      render(<AdminDashboard orgId={mockOrgId} />);
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
   });

   it('renders organization statistics', () => {
      render(<AdminDashboard orgId={mockOrgId} />);

      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument(); // totalUsers
      expect(screen.getByText('38 active')).toBeInTheDocument(); // activeUsers

      expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument(); // activeCampaigns
      expect(screen.getByText('of 12 total')).toBeInTheDocument(); // totalCampaigns

      expect(screen.getByText('Content Pieces')).toBeInTheDocument();
      expect(screen.getByText('156')).toBeInTheDocument(); // totalContent

      expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
      expect(screen.getByText('23')).toBeInTheDocument(); // pendingApprovals
   });

   it('renders tabs', () => {
      render(<AdminDashboard orgId={mockOrgId} />);

      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Organization')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
   });

   it('renders system settings button', () => {
      render(<AdminDashboard orgId={mockOrgId} />);

      expect(screen.getByText('System Settings')).toBeInTheDocument();
   });
});
