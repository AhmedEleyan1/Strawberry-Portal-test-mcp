import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { InfoBubble } from './InfoBubble';

export function DetailsField({
  id,
  label,
  value,
  fieldType = 'text',
  options = '',
  editable = true,
  onSave,
  linkUrl = '#',
  hasInfo = false,
  infoText = '',
  className = 'details-field',
  ...props
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef(null);

  // Convert options string to array if needed
  const optionsList = typeof options === 'string' 
    ? options.split(',').map(o => o.trim()).filter(Boolean)
    : options;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.select && fieldType !== 'number') {
        inputRef.current.select();
      }
    }
  }, [isEditing, fieldType]);

  const handleStartEdit = (e) => {
    if (e) e.stopPropagation();
    if (!editable || isEditing) return;
    setTempValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave && tempValue !== value) {
      onSave(id, tempValue);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (fieldType === 'textarea' && !e.shiftKey) {
        return; // Allow standard line breaks on Enter in textarea
      }
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = (e) => {
    // Check if the focus is moving to something inside our editing container
    // Using setTimeout to let focus move before checking
    setTimeout(() => {
      handleSave();
    }, 150);
  };

  const renderEditControl = () => {
    if (fieldType === 'select') {
      return (
        <select
          ref={inputRef}
          className="inline-edit-select"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        >
          {optionsList.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (fieldType === 'textarea') {
      return (
        <textarea
          ref={inputRef}
          className="inline-edit-textarea"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      );
    }

    if (fieldType === 'checkbox') {
      const isChecked = tempValue === 'true' || tempValue === true;
      return (
        <label className="inline-checkbox-label" onBlur={handleBlur}>
          <input
            ref={inputRef}
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setTempValue(e.target.checked ? 'true' : 'false')}
            onKeyDown={handleKeyDown}
          />
          {' '}Active
        </label>
      );
    }

    return (
      <input
        ref={inputRef}
        type={fieldType === 'number' ? 'number' : 'text'}
        className="inline-edit-input"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    );
  };

  const renderValueDisplay = () => {
    if (fieldType === 'checkbox') {
      const isChecked = value === 'true' || value === true;
      return isChecked 
        ? (
            <span className="field-value" data-checked="true">
              <svg className="check-icon" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '16px', height: '16px', fill: 'currentColor' }}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span>
          )
        : <span className="field-value" data-checked="false">–</span>;
    }

    if (fieldType === 'link') {
      const displayValue = value || '–';
      return (
        <span className="field-value">
          <a href={linkUrl} className="brand-link">{displayValue}</a>
        </span>
      );
    }

    return (
      <span className="field-value">{value || '–'}</span>
    );
  };

  return (
    <div 
      className={`${className} ${editable ? '' : 'no-direct-edit'} ${isEditing ? 'is-editing' : ''}`} 
      data-field-id={id}
      data-field-type={fieldType}
      {...props}
    >
      <span className="field-label">
        {label}
        {hasInfo && <InfoBubble text={infoText} />}
      </span>
      
      {isEditing 
        ? renderEditControl()
        : (
            <div className="field-value-container" onDoubleClick={handleStartEdit}>
              {renderValueDisplay()}
              {editable && (
                <button 
                  className="inline-edit-btn" 
                  aria-label={`Edit ${label}`}
                  onClick={handleStartEdit}
                />
              )}
            </div>
          )
      }
    </div>
  );
}
