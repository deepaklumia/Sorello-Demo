import React from 'react';
import { Header } from '../components/Header';
import { Monitor, Cpu, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen select-none bg-space-bg text-left">
      <Header title="Terminal Settings" />

      <div className="flex-1 p-4 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="pb-2 border-b border-space-border">
            <h3 className="text-base font-extrabold text-gray-900 font-heading">
              Hardware & Cache Profile
            </h3>
            <p className="text-xs text-space-muted mt-1 font-semibold">
              Inspect regional terminal clusters, socket connections, and printer queues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Terminal Parameters */}
            <div className="bg-white border border-space-border rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Monitor className="w-4.5 h-4.5 text-primary" />
                Terminal Properties
              </h4>
              <div className="border-t border-space-border/60"></div>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-space-muted">Terminal ID</span>
                  <span className="text-gray-900">#01-Sorella</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-space-muted">Station Role</span>
                  <span className="text-gray-900">Ordering + KDS</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-space-muted">Socket Status</span>
                  <span className="text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online / Connected
                  </span>
                </div>
              </div>
            </div>

            {/* Platform cluster node status */}
            <div className="bg-white border border-space-border rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-primary" />
                Network Nodes
              </h4>
              <div className="border-t border-space-border/60"></div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-space-muted">Platform Server</span>
                  <span className="text-gray-900">localhost:5002</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-space-muted">Database Engine</span>
                  <span className="text-gray-900">PostgreSQL (CMS Pool)</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-space-muted">API Client Latency</span>
                  <span className="text-gray-900">0.05ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Admin Mode Button */}
          <div className="lg:hidden mt-6 bg-white border border-space-border rounded-2xl p-6 flex flex-col items-center">
            <p className="text-xs text-space-muted mb-4 font-semibold text-center">
              Administrative settings require manager key access.
            </p>
            <button 
              onClick={() => alert('Access locked. Enter manager terminal key.')}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-space-border hover:border-gray-900 hover:bg-gray-50 text-xs font-bold text-gray-600 hover:text-gray-900 transition-all uppercase tracking-wider bg-white"
            >
              <Shield className="w-4 h-4 text-gray-400" />
              Admin Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
