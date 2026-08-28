import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CheckCircle2,
  Plus,
  RefreshCw,
} from 'lucide-react';

import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

export default function Checklist() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/checklist');

      setItems(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        'Checklist load error:',
        err
      );

      setItems([]);

      setError(
        err?.response?.data?.message ||
          'Checklist load panna mudiyala.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
    IMPORTANT FIX:

    useEffect(load, []) use panna koodathu
    because load() Promise return pannum.

    Effect callback braces use pannumbodhu
    return value undefined-a irukkum.
  */
  useEffect(() => {
    load();
  }, [load]);

  const groups = useMemo(() => {
    const grouped = items.reduce(
      (result, item) => {
        const category =
          item?.category || 'Other';

        if (!result[category]) {
          result[category] = [];
        }

        result[category].push(item);

        return result;
      },
      {}
    );

    return Object.entries(grouped);
  }, [items]);

  const toggle = async (item) => {
    try {
      setError('');

      const { data } = await api.patch(
        `/checklist/${item._id}`,
        {
          completed: !item.completed,
        }
      );

      setItems((current) =>
        current.map((currentItem) =>
          currentItem._id === data._id
            ? data
            : currentItem
        )
      );
    } catch (err) {
      console.error(
        'Checklist update error:',
        err
      );

      setError(
        err?.response?.data?.message ||
          'Checklist update panna mudiyala.'
      );
    }
  };

  const add = async (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    try {
      setError('');

      await api.post('/checklist', {
        title: cleanTitle,
        category: 'Other',
        required: false,
      });

      setTitle('');

      await load();
    } catch (err) {
      console.error(
        'Checklist add error:',
        err
      );

      setError(
        err?.response?.data?.message ||
          'Reminder add panna mudiyala.'
      );
    }
  };

  const required = items.filter(
    (item) => item?.required
  );

  const done = required.filter(
    (item) => item?.completed
  ).length;

  const percentage = required.length
    ? Math.round(
        (done / required.length) * 100
      )
    : 0;

  return (
    <div className="page">
      <PageHeader
        title="Interview Checklist"
        subtitle="Required originals/copies ready-a இருக்கிறதா என்று mark pannunga."
      />

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card empty">
          <RefreshCw
            className="spin"
            size={30}
          />

          <strong>
            Loading checklist...
          </strong>
        </div>
      ) : (
        <>
          <div className="card checklist-score">
            <div>
              <strong>
                {done}/{required.length}
              </strong>

              <span>
                Required items ready
              </span>
            </div>

            <div className="bar big">
              <i
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <b>{percentage}%</b>
          </div>

          <div className="check-groups">
            {groups.map(
              ([group, list]) => (
                <section
                  className="card"
                  key={group}
                >
                  <div className="card-title">
                    <h2>{group}</h2>
                  </div>

                  {list.map((item) => (
                    <label
                      className={`check-item ${
                        item.completed
                          ? 'done'
                          : ''
                      }`}
                      key={item._id}
                    >
                      <input
                        type="checkbox"
                        checked={
                          Boolean(
                            item.completed
                          )
                        }
                        onChange={() =>
                          toggle(item)
                        }
                      />

                      <span className="check-box">
                        <CheckCircle2 />
                      </span>

                      <div>
                        <b>{item.title}</b>

                        <small>
                          {item.required
                            ? 'Required'
                            : 'Optional / if applicable'}
                        </small>
                      </div>
                    </label>
                  ))}
                </section>
              )
            )}
          </div>

          <form
            className="card add-inline"
            onSubmit={add}
          >
            <div>
              <h3>
                Add custom reminder
              </h3>

              <p>
                உங்களுக்கு extra document
                இருந்தால் add pannalaam.
              </p>
            </div>

            <div>
              <input
                placeholder="e.g. Passport copy"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
              />

              <button
                className="btn secondary"
                type="submit"
              >
                <Plus size={17} />
                Add
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}