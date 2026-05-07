'use client';

import { useState, useEffect } from 'react';
import { GovControlStorage } from '@/lib/plaiis/storage-handler';
import { GovControlData } from '@/lib/plaiis/data-simulator';
import SidebarNav from '@/components/plaiis/sidebar-nav';
import DashboardHeader from '@/components/plaiis/dashboard-header';
import DecisionDashboard from '@/components/plaiis/sections/decision-dashboard';
import BiometricRisk from '@/components/plaiis/sections/biometric-risk';
import AIValidation from '@/components/plaiis/sections/ai-validation';
import Interoperability from '@/components/plaiis/sections/interoperability';
import CitizenAppeals from '@/components/plaiis/sections/citizen-appeals';
import RiskMatrix from '@/components/plaiis/sections/risk-matrix';
import Sustainability from '@/components/plaiis/sections/sustainability';
import GovernanceCommittee from '@/components/plaiis/sections/governance-committee';

type Section = 
  | 'decision' 
  | 'biometric' 
  | 'ai-validation' 
  | 'interoperability' 
  | 'appeals' 
  | 'risk-matrix' 
  | 'sustainability' 
  | 'governance';

export default function DashboardPage() {
  const [data, setData] = useState<GovControlData | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('decision');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const govData = GovControlStorage.getData();
    setData(govData);
    setIsLoading(false);
  }, []);

  const updateData = (newData: GovControlData) => {
    setData(newData);
    GovControlStorage.saveData(newData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Cargando PLAIIS GovControl...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <SidebarNav 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          projectStatus={data.projectStatus}
          recommendation={data.recommendation}
          isBlocked={data.isBlocked}
          data={data}
          onToggleBlock={() => {
            GovControlStorage.toggleBlockLaunch();
            setData(GovControlStorage.getData());
          }}
          onResetData={() => {
            GovControlStorage.resetData();
            setData(GovControlStorage.getData());
          }}
        />

        {/* Sections Container */}
        <div className="flex-1 overflow-auto">
          {activeSection === 'decision' && (
            <DecisionDashboard data={data} onUpdate={updateData} />
          )}
          {activeSection === 'biometric' && (
            <BiometricRisk data={data} onUpdate={updateData} />
          )}
          {activeSection === 'ai-validation' && (
            <AIValidation data={data} onUpdate={updateData} />
          )}
          {activeSection === 'interoperability' && (
            <Interoperability data={data} onUpdate={updateData} />
          )}
          {activeSection === 'appeals' && (
            <CitizenAppeals data={data} onUpdate={updateData} />
          )}
          {activeSection === 'risk-matrix' && (
            <RiskMatrix data={data} onUpdate={updateData} />
          )}
          {activeSection === 'sustainability' && (
            <Sustainability data={data} onUpdate={updateData} />
          )}
          {activeSection === 'governance' && (
            <GovernanceCommittee data={data} onUpdate={updateData} />
          )}
        </div>
      </main>
    </div>
  );
}
