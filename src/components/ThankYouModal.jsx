import React from 'react';
import ReactModal from 'react-modal';
import '../style.css';
ReactModal.setAppElement('#root');

function ThankYouModal({ isOpen, onClose, isRTL }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={{
        base: 'modal-content',
        afterOpen: 'modal-content-after-open',
        beforeClose: 'modal-content-before-close'
      }}
      overlayClassName={{
        base: 'modal-overlay',
        afterOpen: 'modal-overlay-after-open',
        beforeClose: 'modal-overlay-before-close'
      }}
      contentLabel="Thank You Modal"
      ariaHideApp={true}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      preventScroll={true}
    >
      <div className={`p-6 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          {isRTL ? 'شكرًا لك!' : 'Thank You!'}
        </h2>
        <p className="mb-6">
          {isRTL ? 'نقدر وقتك في ملء هذا الاستبيان. سيتم استخدام بياناتك لتحسين خدماتنا.' : 'We appreciate your time filling out this survey. Your data will be used to improve our services.'}
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
        >
          {isRTL ? 'إغلاق' : 'Close'}
        </button>
      </div>
    </ReactModal>
  );
}

export default ThankYouModal;