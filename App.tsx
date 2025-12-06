import React, { useState } from 'react';
import Landing from './components/Landing';
import IntakeForm from './components/IntakeForm';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import { Domain, AppState, FormData, GTMPlan } from './types';
import { generateGTMPlan } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [gtmPlan, setGtmPlan] = useState<GTMPlan | null>(null);

  const handleDomainSelect = (domain: Domain) => {
    setSelectedDomain(domain);
    setAppState(AppState.INTAKE);
  };

  const handleBackToLanding = () => {
    setAppState(AppState.LANDING);
    setSelectedDomain(null);
  };

  const handleIntakeSubmit = async (data: FormData) => {
    setFormData(data);
    setAppState(AppState.LOADING);
    
    try {
      if (selectedDomain) {
        const plan = await generateGTMPlan(selectedDomain, data);
        setGtmPlan(plan);
        setAppState(AppState.DASHBOARD);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please ensure you have a valid API Key and try again.");
      setAppState(AppState.INTAKE);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure? All current progress will be lost.")) {
      setAppState(AppState.LANDING);
      setGtmPlan(null);
      setFormData(null);
      setSelectedDomain(null);
    }
  };

  return (
    <main className="min-h-screen bg-background text-slate-50 font-sans selection:bg-indigo-500/30">
      {appState === AppState.LANDING && (
        <Landing onSelect={handleDomainSelect} />
      )}
      
      {appState === AppState.INTAKE && selectedDomain && (
        <IntakeForm 
          domain={selectedDomain} 
          onBack={handleBackToLanding} 
          onSubmit={handleIntakeSubmit}
        />
      )}
      
      {appState === AppState.LOADING && (
        <LoadingScreen />
      )}
      
      {appState === AppState.DASHBOARD && gtmPlan && formData && (
        <Dashboard 
          initialPlan={gtmPlan} 
          domainData={formData}
          onReset={handleReset}
        />
      )}
    </main>
  );
};

export default App;