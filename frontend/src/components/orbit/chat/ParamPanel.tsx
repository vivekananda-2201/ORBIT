import { useState } from 'react';
import { Thermometer, Hash, Layers, Sparkles } from 'lucide-react';
import type { ModelItem } from '../../../types/models_meta_data';
import styles from './ParamPanel.module.css';

function Slider({
  icon: Icon,
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  icon: typeof Thermometer;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div className={styles.sliderGroup}>
      <div className={styles.sliderHeader}>
        <div className={styles.sliderLabel}>
          <Icon size={14} strokeWidth={1.75} />
          {label}
        </div>
        <span className={styles.sliderValue}>{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.range}
      />
    </div>
  );
}

function getModelDisplayName(model: string): string {
  const [name] = model.split(':');
  return name.replace(/[-_.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ParamPanel({
  modelId,
  models,
}: {
  modelId: string;
  models: ModelItem[];
}) {
  const model = models.find((m) => m.model === modelId) ?? models[0];
  const [temp, setTemp] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [ctx, setCtx] = useState(8192);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Inference config</h2>
      </div>

      <div className={styles.body}>
        {model && (
          <div className={styles.modelCard}>
            <div className={styles.modelHeader}>
              <span className={styles.dot} />
              <span className={styles.modelName}>{getModelDisplayName(model.model)}</span>
            </div>
            <dl className={styles.specGrid}>
              <dt className={styles.specLabel}>Params</dt>
              <dd className={styles.specValue}>{model.details.parameter_size}</dd>
              <dt className={styles.specLabel}>Quant</dt>
              <dd className={styles.specValue}>{model.details.quantization_level}</dd>
              <dt className={styles.specLabel}>Family</dt>
              <dd className={styles.specValue}>{model.details.family}</dd>
              <dt className={styles.specLabel}>Size</dt>
              <dd className={styles.specValue}>{(model.size / 1e9).toFixed(1)} GB</dd>
            </dl>
          </div>
        )}

        <div className={styles.sliders}>
          <Slider
            icon={Thermometer}
            label="Temperature"
            value={temp}
            min={0}
            max={2}
            step={0.1}
            onChange={setTemp}
            format={(v) => v.toFixed(1)}
          />
          <Slider
            icon={Sparkles}
            label="Top P"
            value={topP}
            min={0}
            max={1}
            step={0.05}
            onChange={setTopP}
            format={(v) => v.toFixed(2)}
          />
          <Slider
            icon={Hash}
            label="Max tokens"
            value={maxTokens}
            min={256}
            max={8192}
            step={256}
            onChange={setMaxTokens}
          />
          <Slider
            icon={Layers}
            label="Context window"
            value={ctx}
            min={2048}
            max={32768}
            step={2048}
            onChange={setCtx}
          />
        </div>

        <div className={styles.systemPrompt}>
          <label htmlFor="system-prompt">System prompt</label>
          <textarea
            id="system-prompt"
            defaultValue="You are ORBIT, a precise local research assistant. Be concise and technically accurate."
            rows={4}
            className={styles.textarea}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.presetBtn}>
          Save as preset
        </button>
      </div>
    </div>
  );
}
