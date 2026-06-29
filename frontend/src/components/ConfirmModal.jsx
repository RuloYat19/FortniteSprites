// frontend/src/components/ConfirmModal.jsx
import React from 'react';
import './ConfirmModal.css';

function ConfirmModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'success',
  confirmText = 'Aceptar',
  showConfirmButton = true,
  showCancelButton = false,
  onConfirm = null
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch(type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  const getBorderColor = () => {
    switch(type) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      default:
        return '#4caf50';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-icon" style={{ borderColor: getBorderColor() }}>
          <span>{getIcon()}</span>
        </div>
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          {showCancelButton && (
            <button 
              className="confirm-modal-btn confirm-modal-btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
          )}
          {showConfirmButton && (
            <button 
              className="confirm-modal-btn confirm-modal-btn-primary"
              onClick={handleConfirm}
              style={{ backgroundColor: getBorderColor() }}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;