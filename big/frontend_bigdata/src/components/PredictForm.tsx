import React from 'react';

interface FormState {
  machineId: string;
  temperature: number | string;
  humidity: number | string;
}

interface Props {
  formState: FormState;
  setFormState: (s: FormState) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
}

const PredictForm: React.FC<Props> = ({ formState, setFormState, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
          Machine ID:
          <input
            type="text"
            value={formState.machineId}
            onChange={(e) => setFormState({ ...formState, machineId: e.target.value })}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Temperature:
          <input
            type="number"
            value={formState.temperature}
            onChange={(e) => setFormState({ ...formState, temperature: e.target.value })}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Humidity:
          <input
            type="number"
            value={formState.humidity}
            onChange={(e) => setFormState({ ...formState, humidity: e.target.value })}
            required
          />
        </label>
      </div>
      <button type="submit">Predict</button>
    </form>
  );
};

export default PredictForm;