import { html, useState } from '../lib.js';
import { Card } from '../shared/Card.js';
import { CustomSelect } from '../shared/CustomSelect.js';
import { SectionHeader } from '../shared/SectionHeader.js';

export function RatesSection() {
  const [property, setProperty] = useState('Clarion Hotel Sign');
  const [season, setSeason] = useState('Low Season');

  const properties = {
    'Clarion Hotel Sign': { id: 'SE199', start: '1/1/2026', end: '1/4/2026', adjustment: '200,-' },
    'Clarion Hotel Post': { id: 'SE065', start: '1/5/2026', end: '30/9/2026', adjustment: '300,-' },
    'Quality Hotel 11': { id: 'SE115', start: '1/10/2026', end: '31/12/2026', adjustment: '150,-' }
  };

  const seasons = {
    'Low Season': { suffix: 'LOW', deluxePrice: '1,200', stdDblPrice: '950', stdSglPrice: '800', supSglPrice: '1,050' },
    'Mid Season': { suffix: 'MID', deluxePrice: '1,500', stdDblPrice: '1,150', stdSglPrice: '950', supSglPrice: '1,250' },
    'High Season': { suffix: 'HIGH', deluxePrice: '1,800', stdDblPrice: '1,350', stdSglPrice: '1,100', supSglPrice: '1,450' }
  };

  const currentProp = properties[property] || properties['Clarion Hotel Sign'];
  const currentSeason = seasons[season] || seasons['Low Season'];

  const ratesData = [
    { product: 'Deluxe', code: `DELUXE_${currentSeason.suffix}`, price: `${currentSeason.deluxePrice} NOK`, discount: '10%' },
    { product: 'Standard Double', code: `STD_DBL_${currentSeason.suffix}`, price: `${currentSeason.stdDblPrice} NOK`, discount: '5%' },
    { product: 'Standard Single', code: `STD_SGL_${currentSeason.suffix}`, price: `${currentSeason.stdSglPrice} NOK`, discount: '—' },
    { product: 'Superior Single', code: `SUP_SGL_${currentSeason.suffix}`, price: `${currentSeason.supSglPrice} NOK`, discount: '10%' }
  ];

  return html`
    <section className="rates-section" aria-labelledby="rates-heading">
      <${SectionHeader} id="rates-heading" title="Rates" />
      
      <${Card} className="rates-filters-card">
        <div className="filter-inputs">
          <!-- Property Selector -->
          <div className="filter-group">
            <label className="filter-label">Property</label>
            <${CustomSelect}
              selectedLabel=${property}
              items=${Object.keys(properties)}
              onSelect=${setProperty}
              id="filter-property-select"
            />
          </div>

          <!-- Property ID -->
          <div className="filter-group static-display">
            <span className="filter-label">Property ID</span>
            <span className="filter-static-value">${currentProp.id}</span>
          </div>

          <!-- Season Selector -->
          <div className="filter-group">
            <label className="filter-label">Season</label>
            <${CustomSelect}
              selectedLabel=${season}
              items=${Object.keys(seasons)}
              onSelect=${setSeason}
              id="filter-season-select"
            />
          </div>

          <!-- Start Date -->
          <div className="filter-group static-display">
            <span className="filter-label">Start date</span>
            <span className="filter-static-value">${currentProp.start}</span>
          </div>

          <!-- End Date -->
          <div className="filter-group static-display">
            <span className="filter-label">End date</span>
            <span className="filter-static-value">${currentProp.end}</span>
          </div>
        </div>

        <div className="filter-bottom-row">
          <div className="filter-group static-display">
            <span className="filter-label">Two person adjustment</span>
            <span className="filter-static-value">${currentProp.adjustment}</span>
          </div>
          <div className="filter-group static-display">
            <span className="filter-label">Comment</span>
            <span className="filter-static-value">—</span>
          </div>
        </div>
      </${Card}>

      <!-- Rates Table Card -->
      <${Card} className="table-card">
        <table className="rates-table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Rate code</th>
              <th scope="col">Price</th>
              <th scope="col">Discount</th>
            </tr>
          </thead>
          <tbody>
            ${ratesData.map(rate => html`
              <tr key=${rate.product}>
                <td>${rate.product}</td>
                <td className="code-font">${rate.code}</td>
                <td className="price-val">${rate.price}</td>
                <td className="discount-val">${rate.discount}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </${Card}>
    </section>
  `;
}
