import { html, useState } from './lib.js';
import { MainLayout } from './layout/MainLayout.js';
import { BackLink } from './shared/BackLink.js';
import { ContractDetailsCard } from './contract/ContractDetailsCard.js';
import { PaymentInfoCard } from './contract/PaymentInfoCard.js';
import { RatesSection } from './contract/RatesSection.js';

export function App() {
  const [selectedHotel, setSelectedHotel] = useState('Clarion Hotel Sign');

  const [contractFields, setContractFields] = useState({
    agreement_type: 'Framework agreement',
    contract_type: 'Framework agreement',
    contract_number: '00018589',
    duration: '01.01.2024 - 31.12.2024',
    cancellation_policy: '16.00',
    status: 'Active',
    loyalty_eligible: 'Yes',
    loyalty_benefit_eligible: 'Yes',
    owner: 'Stig Sjøhagen',
    commission: 'Net non commissionable',
    account_owner: 'Strawberry Holding AS',
    special_terms: 'Accommodation charges must be settled via credit card payment with the traveller on departure! Cxl.18.00.',
    description: 'RFP hotels SE143, SE065, SE115, SE099, SE125, SE154, SE032, SE074, SE028, SE113, SE081, HOBO, Avalon ( Other hotels= chain discount in addition ) Close out dates in the RFP at: Clarion Hotel Odin 14,15, 18, 21 Maj /25,26 Sep / 8,9+22,23 Okt /// Clarion Hotel Post 14,15, 18, 21 Maj //25,26 Sep // 8,9+22,23 Okt/// Quality Hotel 11 14,15, 18,21 Maj //25,26 Sep // 8,9+22,23 Okt /// Clarion Hotel Amaranten 23,24,25/4 23.24/5 /// Quality Hotel Prisma 9/5, 10/5, 11/5, /// Hobo 22-27/5 - Congress, 24-26/9 - Congress ///'
  });

  const paymentFields = {
    payment_type: 'Invoice',
    other_payment_details: '–',
    inherit_options: '–',
    invoice_conditions: 'Continuous invoicing allowed',
    contracted_invoice_fee: 'true',
    contracted_payment_terms: '30',
    invoice_frequency: 'Continuously',
    invoice_reference: '–',
    to_be_invoiced: 'Specific Account Detail',
    account_detail_to_invoice: 'AB Volvo Penta'
  };

  const handleFieldSave = (fieldId, newValue) => {
    setContractFields(prev => ({
      ...prev,
      [fieldId]: newValue
    }));
  };

  return html`
    <${MainLayout} 
      selectedHotel=${selectedHotel} 
      onHotelChange=${setSelectedHotel}
      basePath="."
    >
      <${BackLink} 
        href="./company/index.html" 
        text="Back to Hotelldrift Quadrum AS" 
      />

      <div className="main-content-stack">
        <div className="title-section-group">
          <div className="page-title-row">
            <h1 className="page-title">1102585 ${contractFields.account_owner}</h1>
          </div>
          <${ContractDetailsCard} 
            fields=${contractFields} 
            onFieldSave=${handleFieldSave} 
          />
        </div>

        <${PaymentInfoCard} fields=${paymentFields} />

        <${RatesSection} />
      </div>
    </${MainLayout}>
  `;
}
