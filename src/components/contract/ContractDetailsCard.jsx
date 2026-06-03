import React from 'react';
import { Card } from '../shared/Card';
import { DetailsField } from '../shared/DetailsField';
import { StatusBadge } from '../shared/StatusBadge';

export function ContractDetailsCard({ fields, onFieldSave }) {
  return (
    <Card className="details-card" aria-label="Contract Details">
      <div className="card-grid">
        {/* Column 1 */}
        <div className="grid-column">
          <DetailsField
            id="agreement_type"
            label="Agreement type"
            value={fields.agreement_type}
            fieldType="select"
            options="Framework agreement,Single Hotel agreement,Chain agreement"
            onSave={onFieldSave}
          />
          <DetailsField
            id="contract_type"
            label="Contract type"
            value={fields.contract_type}
            fieldType="text"
            onSave={onFieldSave}
          />
          <DetailsField
            id="contract_number"
            label="Number"
            value={fields.contract_number}
            fieldType="text"
            onSave={onFieldSave}
          />
        </div>

        {/* Column 2 */}
        <div className="grid-column">
          <DetailsField
            id="duration"
            label="Duration"
            value={fields.duration}
            fieldType="text"
            onSave={onFieldSave}
          />
          <DetailsField
            id="cancellation_policy"
            label="Cancellation policy"
            value={fields.cancellation_policy}
            fieldType="text"
            onSave={onFieldSave}
          />
        </div>

        {/* Column 3 */}
        <div className="grid-column">
          <div className="details-field no-direct-edit" data-field-id="status">
            <span className="field-label">Status</span>
            <div className="field-value-container">
              <StatusBadge status={fields.status} />
            </div>
          </div>
          <DetailsField
            id="loyalty_eligible"
            label="Loyalty points eligible"
            value={fields.loyalty_eligible}
            fieldType="select"
            options="Yes,No"
            onSave={onFieldSave}
          />
          <DetailsField
            id="loyalty_benefit_eligible"
            label="Loyalty points benefit eligible"
            value={fields.loyalty_benefit_eligible}
            fieldType="select"
            options="Yes,No"
            onSave={onFieldSave}
          />
        </div>

        {/* Column 4 */}
        <div className="grid-column">
          <DetailsField
            id="owner"
            label="Owner"
            value={fields.owner}
            fieldType="text"
            onSave={onFieldSave}
          />
          <DetailsField
            id="commission"
            label="Commission"
            value={fields.commission}
            fieldType="text"
            onSave={onFieldSave}
          />
          <DetailsField
            id="account_owner"
            label="Account contract owner"
            value={fields.account_owner}
            fieldType="link"
            linkUrl="#contract-owner"
            onSave={onFieldSave}
          />
        </div>
      </div>

      <hr className="card-divider" />

      <div className="card-footer-fields">
        <DetailsField
          id="special_terms"
          label="Special terms"
          value={fields.special_terms}
          fieldType="textarea"
          className="details-field full-width"
          onSave={onFieldSave}
        />
        <DetailsField
          id="description"
          label="Description"
          value={fields.description}
          fieldType="textarea"
          className="details-field full-width"
          onSave={onFieldSave}
        />
      </div>
    </Card>
  );
}
