import { useEffect, useMemo, useState } from "react";
import { deleteSubscription, getSubscriptions } from "../services/api";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Home.css";
import AddSubscriptionModal from "../component/AddSubscriptionModal";

const iconMap = {
  play: "play_circle",
  music: "music_note",
  cloud: "cloud",
  card: "credit_card",
  game: "sports_esports",
  tv: "tv",
  wifi: "wifi",
  phone: "smartphone",
};

const valueLabels = {
  great: { icon: "\u2B50", label: "Great Value" },
  fair: { icon: "\uD83D\uDC4D", label: "Fair Value" },
  poor: { icon: "\u26A0", label: "Poor Value" },
};

const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const formatCurrency = (amount) => {
  return `RM ${Number(amount || 0).toFixed(2)}`;
};

const addMonths = (date, months) => {
  const nextDate = new Date(date);
  const originalDay = nextDate.getDate();

  nextDate.setDate(1);
  nextDate.setMonth(nextDate.getMonth() + months);

  const lastDayOfTargetMonth = new Date(
    nextDate.getFullYear(),
    nextDate.getMonth() + 1,
    0
  ).getDate();

  nextDate.setDate(Math.min(originalDay, lastDayOfTargetMonth));
  return nextDate;
};

const addYears = (date, years) => {
  const nextDate = new Date(date);
  nextDate.setFullYear(nextDate.getFullYear() + years);
  return nextDate;
};

const getNextBillingDate = (billingDate, cycle = "monthly") => {
  const today = normalizeDate(new Date());
  let nextDate = normalizeDate(billingDate);

  if (Number.isNaN(nextDate.getTime())) return today;

  while (nextDate < today) {
    nextDate = cycle === "yearly" ? addYears(nextDate, 1) : addMonths(nextDate, 1);
  }

  return nextDate;
};

const getBillingInfo = (sub) => {
  const nextBillingDate = getNextBillingDate(sub.billingDate, sub.cycle);
  const today = normalizeDate(new Date());
  const diffDays = Math.ceil((nextBillingDate - today) / (1000 * 60 * 60 * 24));

  let label = `In ${diffDays} days`;
  if (diffDays === 0) label = "Today";
  if (diffDays === 1) label = "Tomorrow";

  return {
    date: nextBillingDate,
    days: diffDays,
    label,
    isDueSoon: diffDays <= 7,
  };
};

const Home = ({ onLogout }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchSubscriptions = async (user) => {
    try {
      const data = await getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const totals = useMemo(() => {
    return subscriptions.reduce(
      (summary, sub) => {
        const price = Number(sub.price || 0);
        const isYearly = sub.cycle === "yearly";

        summary.monthly += isYearly ? price / 12 : price;
        summary.yearly += isYearly ? price : price * 12;

        return summary;
      },
      { monthly: 0, yearly: 0 }
    );
  }, [subscriptions]);

  const openAddModal = () => {
    setEditingSubscription(null);
    setShowModal(true);
  };

  const openEditModal = (subscription) => {
    setEditingSubscription(subscription);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSubscription(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteSubscription(pendingDelete._id);
      setSubscriptions((prev) =>
        prev.filter((sub) => sub._id !== pendingDelete._id)
      );
      setPendingDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete subscription. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      await fetchSubscriptions(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="homePage">
      <header className="header">
        <h1>Your Subscriptions</h1>

        <button onClick={onLogout} className="logoutBtn">
          Logout
        </button>
      </header>

      <section className="summaryGrid" aria-label="Subscription spending summary">
        <div className="summaryPanel">
          <span>Total Monthly</span>
          <strong>{formatCurrency(totals.monthly)}</strong>
        </div>

        <div className="summaryPanel">
          <span>Total Yearly</span>
          <strong>{formatCurrency(totals.yearly)}</strong>
        </div>
      </section>

      {loading ? (
        <p className="statusText">Loading subscriptions...</p>
      ) : subscriptions.length === 0 ? (
        <p className="statusText">No subscriptions yet</p>
      ) : (
        <section className="cardGrid" aria-label="Subscriptions">
          {subscriptions.map((sub) => {
            const billing = getBillingInfo(sub);
            const value = valueLabels[sub.value] || valueLabels.fair;

            return (
              <article
                key={sub._id}
                className={`card ${billing.isDueSoon ? "urgent" : ""} ${sub.color || "blue"}`}
              >
                <div className="cardActions">
                  <button
                    className="cardActionBtn"
                    type="button"
                    aria-label={`Edit ${sub.name}`}
                    title="Edit subscription"
                    onClick={() => openEditModal(sub)}
                  >
                    <span className="material-symbols-rounded">edit</span>
                  </button>

                  <button
                    className="cardActionBtn danger"
                    type="button"
                    aria-label={`Delete ${sub.name}`}
                    title="Delete subscription"
                    onClick={() => setPendingDelete(sub)}
                  >
                    <span className="material-symbols-rounded">delete</span>
                  </button>
                </div>

                <div className="cardTop">
                  <div className="subscriptionIcon">
                    <span className="material-symbols-rounded">
                      {iconMap[sub.icon] || iconMap.tv}
                    </span>
                  </div>

                  <div>
                    <h2>{sub.name}</h2>
                    <p>
                      Price: {formatCurrency(sub.price)} /{" "}
                      {sub.cycle === "yearly" ? "yr" : "mo"}
                    </p>
                  </div>
                </div>

                <div className="cardMeta">
                  <span className={`valueBadge ${sub.value || "fair"}`}>
                    <span>{value.icon}</span>
                    {value.label}
                  </span>

                  <span className={`daysBadge ${billing.isDueSoon ? "dueSoon" : ""}`}>
                    {billing.label}
                  </span>
                </div>

                <p className={`billingText ${billing.isDueSoon ? "dueSoon" : ""}`}>
                  Billing: {billing.date.toDateString()}
                </p>
              </article>
            );
          })}
        </section>
      )}

      <button
        className="floatingAddBtn"
        type="button"
        aria-label="Add subscription"
        onClick={openAddModal}
      >
        +
      </button>

      {showModal && (
        <AddSubscriptionModal
          subscription={editingSubscription}
          onClose={closeModal}
          onSuccess={() => fetchSubscriptions(auth.currentUser)}
        />
      )}

      {pendingDelete && (
        <div className="confirmOverlay" role="dialog" aria-modal="true">
          <div className="confirmDialog">
            <div className="confirmIcon">
              <span className="material-symbols-rounded">delete</span>
            </div>

            <h2>Delete subscription?</h2>
            <p>
              This will permanently remove {pendingDelete.name} from your
              subscription list.
            </p>

            <div className="confirmActions">
              <button type="button" onClick={() => setPendingDelete(null)}>
                Cancel
              </button>
              <button type="button" className="danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
