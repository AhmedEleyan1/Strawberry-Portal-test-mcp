import { html, useState } from './lib.js';
import { MainLayout } from './layout/MainLayout.js';
import { BackLink } from './shared/BackLink.js';
import { CompanyDetailsCard } from './company/CompanyDetailsCard.js';
import { ContractsSection } from './company/ContractsSection.js';
import { PaymentTermsModal } from './company/PaymentTermsModal.js';
import { DemoPanel } from './company/DemoPanel.js';

export function CompanyApp() {
  const [selectedHotel, setSelectedHotel] = useState('Clarion Hotel Sign');

  const [state, setState] = useState({
    companyName: 'Hotelldrift Quadrum AS',
    coveredByCentralAgreement: 'Yes',
    creditRating: 'Credit OK',
    creditRatingLastChecked: '10.04.2026',
    paymentTerms: '30',
    estimatedInvoiceDate: '–',
    nextCreditOutcome: 'Credit OK'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleAgreement = (newValue) => {
    setState(prev => ({
      ...prev,
      coveredByCentralAgreement: newValue
    }));
  };

  const handleChangeNextCreditOutcome = (newValue) => {
    setState(prev => ({
      ...prev,
      nextCreditOutcome: newValue
    }));
  };

  const handleInvoiceProcessed = () => {
    alert("Invoice Processed successfully!\n\nSystem Event Triggered: Automatic reset of temporary Payment Terms and Credit Rating back to 'None' for this standalone account.");
    setState(prev => ({
      ...prev,
      paymentTerms: 'None',
      creditRating: 'None',
      creditRatingLastChecked: 'Today',
      estimatedInvoiceDate: '–',
      nextCreditOutcome: 'Credit OK'
    }));
  };

  const handleTimeoutSimulated = () => {
    if (state.estimatedInvoiceDate === '–') {
      alert("No Estimated Invoice Date set.\n\nPlease configure payment terms and set an estimated invoice date first using the modal.");
      return;
    }
    
    alert(`Simulation Event: 14 days have passed since the estimated invoice date (${state.estimatedInvoiceDate}).\n\nResult: Payment terms have expired and reverted to 'None'. Credit rating has been reset to 'None'.`);
    
    setState(prev => ({
      ...prev,
      paymentTerms: 'None',
      creditRating: 'None',
      estimatedInvoiceDate: '–'
    }));
  };

  const handleModalSave = (updates) => {
    setState(prev => ({
      ...prev,
      ...updates
    }));
  };

  const contracts = [
    {
      href: '../index.html',
      title: '1102585 Strawberry Holding AS',
      agreementType: 'Framework agreement',
      duration: '01.01.2024 - 31.12.2024',
      contractedBy: 'Strawberry Holding AS',
      status: 'Active'
    }
  ];

  return html`
    <${MainLayout} 
      selectedHotel=${selectedHotel} 
      onHotelChange=${setSelectedHotel}
      basePath=".."
    >
      <${BackLink} 
        href="../index.html" 
        text="Back to Companies & Rates" 
      />

      <div className="main-content-stack">
        <div className="title-section-group">
          <div className="page-title-row" style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="page-title">${state.companyName}</h1>
          </div>

          <${CompanyDetailsCard} 
            state=${state} 
            onUpdateCreditClick=${() => setIsModalOpen(true)}
            onChangePaymentTermsClick=${() => setIsModalOpen(true)}
          />
        </div>

        <${ContractsSection} contracts=${contracts} />
      </div>

      <${PaymentTermsModal} 
        isOpen=${isModalOpen}
        onClose=${() => setIsModalOpen(false)}
        state=${state}
        onSave=${handleModalSave}
      />

      <${DemoPanel} 
        coveredByCentralAgreement=${state.coveredByCentralAgreement}
        onToggleAgreement=${handleToggleAgreement}
        nextCreditOutcome=${state.nextCreditOutcome}
        onChangeNextCreditOutcome=${handleChangeNextCreditOutcome}
        onInvoiceProcessed=${handleInvoiceProcessed}
        onTimeoutSimulated=${handleTimeoutSimulated}
      />
    </${MainLayout}>
  `;
}
