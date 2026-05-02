const AddSubscriptionModal = ({ onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>New Subscription</h2>

        <p>This is your modal (form comes next step)</p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;