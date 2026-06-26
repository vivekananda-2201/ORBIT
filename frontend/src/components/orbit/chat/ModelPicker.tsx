import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Box } from 'lucide-react';
import type { ModelItem } from '../../../types/models_meta_data';
import styles from './ModelPicker.module.css';

const ACCENTS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

function getModelDisplayName(model: string): string {
  const [name] = model.split(':');
  return name.replace(/[-_.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ModelPicker({
  models,
  value,
  onChange,
}: {
  models: ModelItem[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = models.find((m) => m.model === value) ?? models[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button type="button" className={styles.trigger} onClick={() => setOpen((o) => !o)}>
        <span className={styles.dot} />
        <span className={styles.name}>
          {selected ? getModelDisplayName(selected.model) : 'Select model'}
        </span>
        {selected && (
          <span className={styles.params}>{selected.details.parameter_size}</span>
        )}
        <ChevronDown size={16} className={styles.params} />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <p className={styles.dropdownTitle}>Installed models</p>
          </div>
          <div className={styles.dropdownList}>
            {models.length === 0 ? (
              <p className={styles.empty}>No models available</p>
            ) : (
              models.map((m, index) => (
                <button
                  key={m.model}
                  type="button"
                  className={`${styles.row} ${m.model === value ? styles.rowActive : ''}`}
                  onClick={() => {
                    onChange(m.model);
                    setOpen(false);
                  }}
                >
                  <div
                    className={styles.iconBox}
                    style={{ color: ACCENTS[index % ACCENTS.length] }}
                  >
                    <Box size={16} strokeWidth={1.75} />
                  </div>
                  <div className={styles.rowBody}>
                    <div className={styles.rowTitle}>
                      <span className={styles.rowName}>{getModelDisplayName(m.model)}</span>
                      <span className={styles.rowMeta}>{m.details.parameter_size}</span>
                    </div>
                    <div className={styles.rowMeta}>
                      <span>{m.details.family}</span>
                      <span>·</span>
                      <span>{m.details.quantization_level}</span>
                      <span>·</span>
                      <span>{(m.size / 1e9).toFixed(1)} GB</span>
                    </div>
                  </div>
                  {m.model === value ? (
                    <Check size={16} className={styles.check} />
                  ) : (
                    <span className={styles.rowMeta}>{m.model.split(':')[1] ?? 'latest'}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
