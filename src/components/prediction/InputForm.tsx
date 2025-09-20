// src/components/prediction/InputForm.tsx
import React, { useState, useEffect } from 'react';

interface FormData {
  crop: string;
  area: number;
  variety: string;
  plantingDate: string;
}

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<Props> = ({ formData, setFormData, onSubmit, isLoading }) => {
  const [cropVarieties, setCropVarieties] = useState<string[]>([]);

  useEffect(() => {
    // This simulates fetching varieties when the crop changes.
    const varieties: Record<string, string[]> = {
      rice: ['Sona Masoori', 'BPT 5204', 'MTU 1010', 'Swarna'],
      wheat: ['HD 2967', 'PBW 550', 'WH 1105', 'DBW 17'],
      cotton: ['Bollgard II', 'RCH 2', 'NCS 145', 'MRC 7351'],
      chilli: ['Teja', 'Byadgi', 'Kashmiri', 'Guntur']
    };
    const newVarieties = varieties[formData.crop] || [];
    setCropVarieties(newVarieties);
    setFormData(prev => ({ ...prev, variety: newVarieties[0] || '' }));
  }, [formData.crop, setFormData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-success text-white">
        <i className="fas fa-tractor me-2"></i>Your Farm Details
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Crop */}
          <div className="mb-3">
            <label htmlFor="crop" className="form-label">Select Crop</label>
            <select name="crop" id="crop" className="form-select" value={formData.crop} onChange={handleInputChange}>
              <option value="rice">Rice (వరి)</option>
              <option value="wheat">Wheat (గోధుమ)</option>
              <option value="cotton">Cotton (ప్రత్తి)</option>
              <option value="chilli">Chilli (మిరప)</option>
            </select>
          </div>

          {/* Variety */}
          <div className="mb-3">
            <label htmlFor="variety" className="form-label">Crop Variety</label>
            <select name="variety" id="variety" className="form-select" value={formData.variety} onChange={handleInputChange}>
              {cropVarieties.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {/* Area */}
          <div className="mb-3">
            <label htmlFor="area" className="form-label">Area (in acres)</label>
            <input type="number" name="area" id="area" className="form-control" value={formData.area} onChange={handleInputChange} step="0.1" min="0.1" />
          </div>

          {/* Planting Date */}
          <div className="mb-3">
            <label htmlFor="plantingDate" className="form-label">Planting Date</label>
            <input type="date" name="plantingDate" id="plantingDate" className="form-control" value={formData.plantingDate} onChange={handleInputChange} />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Analyzing...
              </>
            ) : (
              <>
                <i className="fas fa-rocket me-2"></i>
                Predict & Optimize
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;