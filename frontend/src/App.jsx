import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import TicketForm from './components/TicketForm';
import PredictionResult from './components/PredictionResult';
import Dashboard from './components/Dashboard';
import ReportingPage from './components/ReportingPage';
import DataTableView from './components/DataTableView';
import { predictTicket, updateTicket } from './services/api';
import { ArrowLeft, Wifi } from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentResult, setCurrentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedAction, setAppliedAction] = useState('');

  const initialText = location.state?.ticket?.description || '';

  const handleAnalyze = async (description) => {
    if (!description?.trim()) return;
    setIsLoading(true);
    setCurrentResult(null);
    try {
      const data = await predictTicket(description);
      setCurrentResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialText) {
      handleAnalyze(initialText);
    }
  }, [initialText]);

  const handleSubmitTicket = async (text) => {
    setIsLoading(true);
    try {
      await updateTicket(id, { status: "Solved", description: text });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("❌ Critical System Error: Unable to persist state.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout rightPanel={
      <PredictionResult
        result={currentResult}
        onApply={(action) => setAppliedAction(action)}
      />
    }>
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={14} /> Global Stream
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 rounded-full border border-indigo-100">
              <Wifi size={12} className="text-indigo-500 animate-pulse" />
              <span className="text-[9px] font-black text-indigo-700 uppercase tracking-tighter">Secure Neural Link</span>
            </div>
          </div>

          <TicketForm
            onAnalyze={handleAnalyze}
            onSubmit={handleSubmitTicket}
            isLoading={isLoading}
            suggestedAction={appliedAction || currentResult?.suggested_action}
            initialText={initialText}
          />
        </div>
      </div>
    </Layout>
  );
};

const DashboardView = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <Dashboard onSelectTicket={(ticket) => navigate(`/ticket/${ticket.id}`, { state: { ticket } })} />
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />
        <Route path="/reporting" element={<ReportingPage />} />
        <Route path="/data" element={<DataTableView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
