'use client';

import { GovControlData, generateInitialData } from './data-simulator';

const STORAGE_KEY = 'plaiis-govcontrol-data';

export class GovControlStorage {
  static getData(): GovControlData {
    if (typeof window === 'undefined') {
      return generateInitialData();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }

    const initialData = generateInitialData();
    this.saveData(initialData);
    return initialData;
  }

  static saveData(data: GovControlData): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Error writing to localStorage:', e);
    }
  }

  static resetData(): void {
    if (typeof window === 'undefined') return;
    const initialData = generateInitialData();
    this.saveData(initialData);
  }

  // Métodos específicos para cada sección
  static updateBiometricData(newData: any) {
    const current = this.getData();
    current.biometricData = newData;
    this.saveData(current);
  }

  static updateAIModels(newData: any) {
    const current = this.getData();
    current.aiModels = newData;
    this.saveData(current);
  }

  static updateDecisionSimulations(newData: any) {
    const current = this.getData();
    current.decisionSimulations = newData;
    this.saveData(current);
  }

  static updateConnectedEntities(newData: any) {
    const current = this.getData();
    current.connectedEntities = newData;
    this.saveData(current);
  }

  static addAppeal(appeal: any) {
    const current = this.getData();
    current.appeals.push(appeal);
    this.saveData(current);
  }

  static updateRisks(newData: any) {
    const current = this.getData();
    current.risks = newData;
    this.saveData(current);
  }

  static updateCostData(newData: any) {
    const current = this.getData();
    current.costData = newData;
    this.saveData(current);
  }

  static updateGovernanceDecisions(newData: any) {
    const current = this.getData();
    current.governanceDecisions = newData;
    this.saveData(current);
  }

  static updateApprovalChecklist(newData: any) {
    const current = this.getData();
    current.approvalChecklist = newData;
    this.saveData(current);
  }

  static updateProjectStatus(status: any) {
    const current = this.getData();
    current.projectStatus = status.projectStatus;
    current.recommendation = status.recommendation;
    this.saveData(current);
  }

  static toggleBlockLaunch() {
    const current = this.getData();
    current.isBlocked = !current.isBlocked;
    this.saveData(current);
  }
}

// Hook personalizado para usar en componentes
export function useGovControlData() {
  const [data, setData] = React.useState<GovControlData | null>(null);

  React.useEffect(() => {
    setData(GovControlStorage.getData());
  }, []);

  const updateData = (newData: GovControlData) => {
    setData(newData);
    GovControlStorage.saveData(newData);
  };

  return { data, updateData };
}

import React from 'react';
