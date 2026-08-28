import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Save, Star } from 'lucide-react';
import api from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';

const names = {
  leadership: 'Leadership / Social Activities',
  sports: 'Sports',
  language: 'Language Ability',
  ict: 'Computer / ICT',
  interview: 'Interview Performance',
};

export default function Marks() {
  const [limits, setLimits] = useState({});
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const loadMarks = useCallback(async () => {
    setLoading(true);
    setLoadError('');

    try {
      const { data } = await api.get('/marks');

      const receivedLimits = data?.limits || {};
      const receivedScores = data?.scores || {};

      const normalizedScores = {};

      Object.keys(receivedLimits).forEach((key) => {
        normalizedScores[key] = {
          score: Number(receivedScores?.[key]?.score) || 0,
          confirmed: Boolean(receivedScores?.[key]?.confirmed),
          note: receivedScores?.[key]?.note || '',
        };
      });

      setLimits(receivedLimits);
      setScores(normalizedScores);
    } catch (error) {
      console.error('Marks load error:', error);

      setLoadError(
        error?.response?.data?.message ||
          'Marks load panna mudiyala. Backend wake up aagittu irukkalaam. Retry pannunga.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarks();
  }, [loadMarks]);

  const update = (key, field, value) => {
    setScores((previous) => ({
      ...previous,
      [key]: {
        ...(previous[key] || {
          score: 0,
          confirmed: false,
          note: '',
        }),
        [field]: value,
      },
    }));
  };

  const total = Object.values(scores).reduce(
    (sum, item) => sum + (Number(item?.score) || 0),
    0
  );

  const max = Object.values(limits).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );

  const save = async () => {
    setBusy(true);
    setMsg('');

    try {
      const { data } = await api.put('/marks', scores);

      const newScores = {};

      Object.keys(data?.limits || limits).forEach((key) => {
        newScores[key] = {
          score: Number(data?.scores?.[key]?.score) || 0,
          confirmed: Boolean(data?.scores?.[key]?.confirmed),
          note: data?.scores?.[key]?.note || '',
        };
      });

      setScores(newScores);
      setMsg('Estimated marks saved ✅');
    } catch (error) {
      console.error('Marks save error:', error);

      setMsg(
        error?.response?.data?.message ||
          'Could not save marks. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Estimated Marks"
        subtitle="Official marking scheme categories அடிப்படையில் evidence score record pannunga."
      />

      <div className="alert info">
        ⚠️ இது preparation estimate மட்டும். Final marks official interview
        board தான் decide pannuvanga.
      </div>

      {loading && (
        <div className="card empty">
          <RefreshCw size={30} />
          <strong>Loading marks...</strong>
          <span>
            Render free server wake up aagurathukku konjam time edukkaலாம்.
          </span>
        </div>
      )}

      {!loading && loadError && (
        <div className="card">
          <div className="alert error">{loadError}</div>

          <button
            type="button"
            className="btn primary"
            onClick={loadMarks}
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="marks-total">
            <Star />

            <div>
              <span>Current Estimated Total</span>
              <strong>
                {total} / {max}
              </strong>
            </div>
          </div>

          <div className="marks-grid">
            {Object.keys(limits).map((key) => (
              <section className="card mark-card" key={key}>
                <div className="mark-head">
                  <div>
                    <h2>{names[key] || key}</h2>
                    <small>Maximum {limits[key]} marks</small>
                  </div>

                  <div className="score-input">
                    <input
                      type="number"
                      min="0"
                      max={limits[key]}
                      step="1"
                      value={scores[key]?.score ?? 0}
                      onChange={(event) => {
                        const number = Number(event.target.value);

                        update(
                          key,
                          'score',
                          Math.min(
                            Number(limits[key]),
                            Math.max(0, number)
                          )
                        );
                      }}
                    />

                    <span>/{limits[key]}</span>
                  </div>
                </div>

                <label className="check confirm">
                  <input
                    type="checkbox"
                    checked={scores[key]?.confirmed || false}
                    onChange={(event) =>
                      update(
                        key,
                        'confirmed',
                        event.target.checked
                      )
                    }
                  />

                  Evidence checked / qualification confirmed
                </label>

                <label>
                  Evidence / note

                  <textarea
                    rows="2"
                    placeholder="e.g. Diploma in ICT, original available"
                    value={scores[key]?.note || ''}
                    onChange={(event) =>
                      update(key, 'note', event.target.value)
                    }
                  />
                </label>
              </section>
            ))}
          </div>

          {msg && (
            <div
              className={
                msg.includes('✅')
                  ? 'alert success'
                  : 'alert error'
              }
            >
              {msg}
            </div>
          )}

          <button
            className="btn primary"
            type="button"
            onClick={save}
            disabled={busy}
          >
            <Save size={17} />

            {busy ? 'Saving…' : 'Save Estimated Marks'}
          </button>
        </>
      )}
    </div>
  );
}